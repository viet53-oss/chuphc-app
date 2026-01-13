'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Users, Home } from 'lucide-react';
import Link from 'next/link';
import { colors, spacing, fontSize } from '@/lib/design-system';

export default function SocialPage() {
    const [socialInteractions, setSocialInteractions] = useState(0);
    const [qualityTime, setQualityTime] = useState(0);

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
                    <h2 style={{ fontSize: fontSize.lg, fontWeight: 'bold', marginBottom: spacing.md }}>Today's Social Activity</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                        <div style={{
                            padding: spacing.md,
                            backgroundColor: colors.primaryTint,
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: fontSize.xs, color: colors.gray, margin: 0 }}>Interactions</p>
                            <p style={{ fontSize: fontSize.xxl, fontWeight: 'bold', margin: 0 }}>{socialInteractions}</p>
                        </div>
                        <div style={{
                            padding: spacing.md,
                            backgroundColor: colors.primaryTint,
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: fontSize.xs, color: colors.gray, margin: 0 }}>Quality Time</p>
                            <p style={{ fontSize: fontSize.xxl, fontWeight: 'bold', margin: 0 }}>{qualityTime}h</p>
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
                            onClick={() => setSocialInteractions(prev => prev + 1)}
                            style={{
                                padding: spacing.lg,
                                backgroundColor: colors.red,
                                color: colors.white,
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: fontSize.base,
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Log Interaction
                        </button>
                        <button
                            onClick={() => setQualityTime(prev => prev + 1)}
                            style={{
                                padding: spacing.lg,
                                backgroundColor: '#ec4899',
                                color: colors.white,
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: fontSize.base,
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Add Quality Time (1h)
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
