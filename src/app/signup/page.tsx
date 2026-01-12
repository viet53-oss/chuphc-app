'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import Link from 'next/link';

export default function SignupPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        // Validate password length
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            await auth.signUp(email, password, fullName);
            setSuccess(true);
            // Redirect after 2 seconds
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-tint to-white p-4">
                <div className="w-full max-w-md text-center">
                    <div className="app-section !p-8">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="title-lg mb-2">Account Created!</h2>
                        <p className="text-body opacity-60">
                            Please check your email to verify your account.
                        </p>
                        <p className="text-small opacity-40 mt-4">
                            Redirecting to login...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-tint to-white p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <img
                        src="/logo.png"
                        alt="Chu Precision Health Center"
                        className="w-32 h-32 mx-auto mb-4"
                    />
                    <h1 className="title-xl mb-2">Create Account</h1>
                    <p className="text-body opacity-60">Start your precision health journey</p>
                </div>

                {/* Signup Form */}
                <div className="app-section !p-6">
                    <form onSubmit={handleSignup} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 border-2 border-red-500 rounded-lg">
                                <p className="text-small text-red-600">{error}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="fullName" className="block text-body font-bold mb-2">
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-body font-bold mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-body font-bold mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="••••••••"
                            />
                            <p className="text-small opacity-40 mt-1">At least 6 characters</p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-body font-bold mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-3 rounded-lg font-bold text-body hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 pt-4 border-t-2 border-black/10 text-center">
                        <p className="text-body">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="text-primary font-bold hover:underline"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
