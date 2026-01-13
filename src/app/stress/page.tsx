'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Zap, Home } from 'lucide-react';
import Link from 'next/link';
import { colors, spacing, fontSize } from '@/lib/design-system';

export default function StressPage() {
    const [stressLevel, setStressLevel] = useState(5);
    const [relaxationMinutes, setRelaxationMinutes] = useState(0);

    return (
        <ProtectedRoute>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxl, width: '100%', padding: spacing.xs }}>



                {/* Stats Section */}
                <section style={{
                    border: '2px solid black',
                    borderRadius: '12px',
                    backgroundColor: colors.white,
                    padding: spacing.lg,
                    margin: spacing.xs
                }}>
                    <h2 style={{ fontSize: fontSize.lg, fontWeight: 'bold', marginBottom: spacing.md }}>Current Status</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                        <div style={{
                            padding: spacing.md,
                            backgroundColor: colors.primaryTint,
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: fontSize.xs, color: colors.gray, margin: 0 }}>Stress Level</p>
                            <p style={{ fontSize: fontSize.xxl, fontWeight: 'bold', margin: 0 }}>{stressLevel}/10</p>
                        </div>
                        <div style={{
                            padding: spacing.md,
                            backgroundColor: colors.primaryTint,
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: fontSize.xs, color: colors.gray, margin: 0 }}>Relaxation</p>
                            <p style={{ fontSize: fontSize.xxl, fontWeight: 'bold', margin: 0 }}>{relaxationMinutes}m</p>
                        </div>
                    </div>
                </section>

                {/* Quick Actions */}
                <section style={{
                    border: '2px solid black',
                    borderRadius: '12px',
                    backgroundColor: colors.white,
                    padding: spacing.lg,
                    margin: spacing.xs
                }}>
                    <h2 style={{ fontSize: fontSize.lg, fontWeight: 'bold', marginBottom: spacing.md }}>Quick Actions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                        <button
                            onClick={() => setStressLevel(prev => Math.max(prev - 1, 0))}
                            style={{
                                padding: spacing.lg,
                                backgroundColor: colors.teal,
                                color: colors.white,
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: fontSize.base,
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Reduce Stress
                        </button>
                        <button
                            onClick={() => setRelaxationMinutes(prev => prev + 10)}
                            style={{
                                padding: spacing.lg,
                                backgroundColor: colors.green,
                                color: colors.white,
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: fontSize.base,
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Log Relaxation (10 min)
                        </button>
                    </div>
                </section>

                {/* Home Button */}
                <div style={{ display: 'flex', justifyContent: 'center', margin: '2px' }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <button style={{
                            padding: '8px 20px',
                            backgroundColor: colors.black,
                            color: colors.white,
                            border: 'none',
                            borderRadius: '9999px',
                            fontSize: '15pt',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: spacing.sm
                        }}>
                            <Home size={20} />
                            Home
                        </button>
                    </Link>
                </div>

            </div>
        </ProtectedRoute>
    );
}
