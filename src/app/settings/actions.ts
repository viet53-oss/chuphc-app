'use server';

import { createClient } from '@supabase/supabase-js';

export async function adminUpdateUserPassword(userId: string, password: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        return { error: 'Server configuration error: Missing Service Role Key' };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    const { error } = await supabase.auth.admin.updateUserById(userId, {
        password: password
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}

export async function adminCreateUser(email: string, password: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        return { error: 'Server configuration error: Missing Service Role Key' };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { email_verified: true }
    });

    if (error) {
        return { error: error.message };
    }

    // Force update to ensure confirmed_at is set if the above didn't stick
    if (data.user && !data.user.email_confirmed_at) {
        await supabase.auth.admin.updateUserById(data.user.id, {
            email_confirm: true
        });
    }

    return { user: data.user };
}

export async function adminDeleteUser(userId: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        return { error: 'Server configuration error: Missing Service Role Key' };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}
