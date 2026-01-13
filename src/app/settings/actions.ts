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
        email_confirm: true // Auto-confirm email
    });

    if (error) {
        return { error: error.message };
    }

    return { user: data.user };
}
