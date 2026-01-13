'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    isAdmin: boolean;
    setIsAdmin: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => { },
    isAdmin: false,
    setIsAdmin: () => { },
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

    return (
        <AuthContext.Provider value={{ user, loading, signOut: handleSignOut, isAdmin, setIsAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}
