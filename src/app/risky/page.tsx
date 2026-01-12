'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { ShieldAlert, Home } from 'lucide-react';
import Link from 'next/link';
import { colors, spacing, fontSize } from '@/lib/design-system';

export default function RiskyPage() {
    const [riskyBehaviors, setRiskyBehaviors] = useState(0);
    const [safeDays, setSafeDays] = useState(7);

    return (
        <ProtectedRoute>
            <Navbar customTitle="Risky Behaviors" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxl, width: '100%', padding: spacing.xs }}>

                {/* Header Section */}
                <section style={{
                    border: '2px solid black',
                    borderRadius: '12px',
                    backgroundColor: colors.primaryTint,
                    padding: spacing.lg,
                    margin: spacing.xs,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: spacing.md
                }}>
                    <div style={{
                        backgroundColor: colors.white,
                        borderRadius: '12px',
                        width: '80px',
                        height: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <ShieldAlert size={48} color={colors.orange} />
                    </div>
                    <h1 style={{ fontSize: fontSize.xl, fontWeight: 'bold', color: colors.secondary, margin: 0, textAlign: 'center' }}>
                        Risky Behavior Tracking
                    </h1>
                    <p style={{ fontSize: fontSize.sm, color: colors.gray, margin: 0, textAlign: 'center' }}>
                        Monitor and reduce risky behaviors
                    </p>
                </section>

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
                            <p style={{ fontSize: fontSize.xs, color: colors.gray, margin: 0 }}>This Week</p>
                            <p style={{ fontSize: fontSize.xxl, fontWeight: 'bold', margin: 0 }}>{riskyBehaviors}</p>
                        </div>
                        <div style={{
                            padding: spacing.md,
                            backgroundColor: colors.primaryTint,
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: fontSize.xs, color: colors.gray, margin: 0 }}>Safe Days</p>
                            <p style={{ fontSize: fontSize.xxl, fontWeight: 'bold', margin: 0 }}>{safeDays}</p>
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
                            onClick={() => setRiskyBehaviors(prev => prev + 1)}
                            style={{
                                padding: spacing.lg,
                                backgroundColor: colors.orange,
                                color: colors.white,
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: fontSize.base,
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Log Risky Behavior
                        </button>
                        <button
                            onClick={() => setSafeDays(prev => prev + 1)}
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
                            Mark Safe Day
                        </button>
                    </div>
                </section>

                {/* Home Button */}
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <button style={{
                        width: '100%',
                        padding: spacing.lg,
                        backgroundColor: colors.black,
                        color: colors.white,
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: fontSize.base,
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: spacing.sm,
                        margin: spacing.xs
                    }}>
                        <Home size={20} />
                        Back to Home
                    </button>
                </Link>

            </div>
        </ProtectedRoute>
    );
}
