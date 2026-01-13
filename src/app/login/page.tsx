'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { colors, spacing, fontSize } from '@/lib/design-system';
import { Dna, CheckCircle, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (isSignUp) {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            });

            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                setMessage({ type: 'success', text: 'Sign up successful! Please check your email to confirm your account.' });
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                router.push('/');
            }
        }
        setLoading(false);
    };

    const handleForgotPassword = () => {
        setMessage({ type: 'error', text: 'Please contact your administrator to reset your password.' });
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: spacing.md,
            paddingTop: '64px',
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                backgroundColor: colors.white,
                padding: spacing.xl,
                borderRadius: '16px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                width: '100%',
                maxWidth: '400px',
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.lg,
                position: 'relative',
                animation: 'fadeIn 0.3s ease-out'
            }}>
                {/* Header Section inside Card */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.xs }}>
                    <h1 style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#1a5d1a',
                        textAlign: 'center',
                        margin: 0
                    }}>
                        Chu Precision Health Center
                    </h1>
                </div>

                {message?.type === 'success' ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: spacing.md,
                        padding: spacing.md,
                        textAlign: 'center',
                        animation: 'fadeIn 0.3s ease-out'
                    }}>
                        <h2 style={{ fontSize: fontSize.xl, fontWeight: 'bold', color: '#1a5d1a', margin: 0 }}>Success!</h2>
                        <p style={{ color: '#4b5563', fontSize: fontSize.base }}>{message.text}</p>
                        <button
                            onClick={() => { setMessage(null); setIsSignUp(false); }}
                            style={{
                                backgroundColor: '#000000',
                                color: colors.white,
                                padding: '10px',
                                borderRadius: '9999px',
                                border: 'none',
                                fontSize: '14pt',
                                fontWeight: '700',
                                cursor: 'pointer',
                                marginTop: spacing.md
                            }}
                        >
                            Back to Sign In
                        </button>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.xs }}>
                            <span style={{ fontSize: fontSize.lg, fontWeight: 'bold', color: colors.black }}>
                                {isSignUp ? 'Sign Up' : 'Sign In'}
                            </span>
                        </div>

                        {/* Logo */}
                        <div style={{ display: 'flex', justifyContent: 'center', margin: `${spacing.sm} 0` }}>
                            <div style={{
                                position: 'relative',
                                width: '80px',
                                height: '80px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Dna size={64} color="#d4a017" strokeWidth={2.5} />
                                <div style={{
                                    position: 'absolute',
                                    color: '#1a5d1a',
                                    fontWeight: 'bold',
                                    fontSize: '24px',
                                    textShadow: '0 2px 4px rgba(255,255,255,0.8)'
                                }}>+</div>
                            </div>
                        </div>

                        {/* Welcome Text */}
                        <div style={{ textAlign: 'left' }}>
                            <h2 style={{ fontSize: fontSize.lg, fontWeight: 'bold', margin: 0, color: '#1f2937' }}>
                                {isSignUp ? 'Create Account' : 'Welcome Back'}
                            </h2>
                            <p style={{ color: '#4b5563', margin: '4px 0 0 0', fontSize: fontSize.sm }}>
                                {isSignUp ? 'Join our health platform' : 'Sign in to your health dashboard'}
                            </p>
                        </div>

                        {/* Error Message Display */}
                        {message?.type === 'error' && (
                            <div style={{
                                backgroundColor: '#fee2e2',
                                color: '#b91c1c',
                                padding: '12px',
                                borderRadius: '8px',
                                fontSize: fontSize.sm,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <AlertCircle size={16} />
                                {message.text}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>

                            {/* Input Group */}
                            <div style={{
                                border: '1px solid #9ca3af',
                                borderRadius: '8px',
                                overflow: 'hidden'
                            }}>
                                {isSignUp && (
                                    <div style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb' }}>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#4b5563', marginBottom: '2px' }}>Full Name</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required={isSignUp}
                                            placeholder="John Doe"
                                            style={{
                                                width: '100%',
                                                border: 'none',
                                                outline: 'none',
                                                fontSize: fontSize.base,
                                                color: '#111827'
                                            }}
                                        />
                                    </div>
                                )}
                                <div style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb' }}>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#4b5563', marginBottom: '2px' }}>Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="your@email.com"
                                        style={{
                                            width: '100%',
                                            border: 'none',
                                            outline: 'none',
                                            fontSize: fontSize.base,
                                            color: '#111827'
                                        }}
                                    />
                                </div>
                                <div style={{ padding: '8px 12px' }}>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#4b5563', marginBottom: '2px' }}>Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="........"
                                        style={{
                                            width: '100%',
                                            border: 'none',
                                            outline: 'none',
                                            fontSize: fontSize.base,
                                            color: '#111827'
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    backgroundColor: '#000000',
                                    color: colors.white,
                                    padding: '10px',
                                    borderRadius: '9999px',
                                    border: 'none',
                                    fontSize: '14pt',
                                    fontWeight: '700',
                                    cursor: loading ? 'wait' : 'pointer',
                                    opacity: loading ? 0.7 : 1,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                            </button>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                {!isSignUp && (
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#1a5d1a',
                                            fontWeight: 'bold',
                                            fontSize: fontSize.sm,
                                            cursor: 'pointer',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        FORGOT PASSWORD?
                                    </button>
                                )}

                                <p style={{ fontSize: fontSize.sm, color: '#4b5563', margin: 0 }}>
                                    {isSignUp ? "Already have an account? " : "Don't have an account? "}
                                    <span
                                        style={{ color: '#1a5d1a', cursor: 'pointer', fontWeight: 'bold' }}
                                        onClick={() => {
                                            setIsSignUp(!isSignUp);
                                            setEmail('');
                                            setPassword('');
                                            setFullName('');
                                            setMessage(null);
                                        }}
                                    >
                                        {isSignUp ? 'Sign In' : 'Sign Up'}
                                    </span>
                                </p>
                            </div>

                        </form>
                    </>
                )}
            </div>
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
