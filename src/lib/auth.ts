import { supabase } from './supabase';

/**
 * Authentication helper functions for Chu Precision Health Center
 */

export const auth = {
    /**
     * Sign up a new user
     */
    signUp: async (email: string, password: string, fullName?: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) throw error;
        return data;
    },

    /**
     * Sign in with email and password
     */
    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data;
    },

    /**
     * Sign out the current user
     */
    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    /**
     * Get the current user
     */
    getCurrentUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    },

    /**
     * Get the current session
     */
    getSession: async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    },

    /**
     * Reset password via email
     */
    resetPassword: async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;
    },

    /**
     * Update user password
     */
    updatePassword: async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) throw error;
    },

    /**
     * Listen to auth state changes
     */
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
        return supabase.auth.onAuthStateChange(callback);
    },
};
