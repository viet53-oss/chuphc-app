'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    isAdmin: boolean;
    setIsAdmin: (value: boolean) => void;
    loginTestUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => { },
    isAdmin: false,
    setIsAdmin: () => { },
    loginTestUser: () => { },
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        let mounted = true;

        // Check active session on mount
        const initSession = async () => {
            try {
                const session = await auth.getSession();
                if (mounted) {
                    setUser(session?.user ?? null);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error checking session:', error);
                if (mounted) setLoading(false);
            }
        };

        initSession();

        // Listen for auth changes
        const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
            if (!mounted) return;

            console.log(`Auth Event: ${event}`); // Debug logging

            if (event === 'SIGNED_OUT') {
                setUser(null);
                setLoading(false);
            } else if (session?.user) {
                setUser(session.user);
                setLoading(false);
            } else if (event === 'TOKEN_REFRESHED' && !session) {
                // Handle rare case where refresh fails but doesn't trigger sign out
                // We kept the previous user state mostly, or verify again? 
                // Usually session is present on refresh.
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const handleSignOut = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error('Error signing out:', error);
            // We continue to force logout client-side even if server fails
        } finally {
            setIsAdmin(false); // Reset admin mode on logout
            router.push('/login');
            router.refresh(); // Ensure strict refresh to clear any cached auth state
        }
    };

    const loginTestUser = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({
                email: 'uyen_chu@hotmail.com',
                password: '123456'
            });

            if (error) {
                console.error('Login failed:', error);
                alert('Login failed: ' + error.message);

                // If login fails (e.g. user not found), we could try to sign up or just fall back to fake? 
                // For now, let's stick to real auth as requested.
                // If user doesn't exist, we might need to create them.
                if (error.message.includes('Invalid login credentials')) {
                    // Optionally try to sign up if we think they might not exist, 
                    // but "uyen's password" implies they exist.
                }
            } else {
                console.log('Logged in as:', data.user);
                // The onAuthStateChange listener in useEffect should handle setting the user state
                router.push('/');
            }
        } catch (e: any) {
            console.error('Login error:', e);
            alert('An unexpected error occurred: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut: handleSignOut, isAdmin, setIsAdmin, loginTestUser }}>
            {children}
        </AuthContext.Provider>
    );
}
