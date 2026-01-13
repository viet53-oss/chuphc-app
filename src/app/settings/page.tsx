'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Settings, Home, User, Bell, Shield, Info } from 'lucide-react';
import Link from 'next/link';
import { colors, spacing, fontSize } from '@/lib/design-system';

export default function SettingsPage() {
    return (
        <ProtectedRoute>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxl, width: '100%', padding: spacing.xs }}>



                {/* Settings Menu */}
                <section style={{
                    border: '2px solid black',
                    borderRadius: '12px',
                    backgroundColor: colors.white,
                    padding: spacing.md,
                    margin: spacing.xs,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.sm
                }}>

                    {/* Profile Item */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.md,
                        padding: spacing.md,
                        borderBottom: '1px solid #e5e7eb',
                        cursor: 'pointer'
                    }}>
                        <User size={24} color={colors.secondary} />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: fontSize.base, fontWeight: 'bold', margin: 0 }}>My Profile</h3>
                            <p style={{ fontSize: fontSize.sm, color: colors.gray, margin: 0 }}>Manage your personal information</p>
                        </div>
                    </div>

                    {/* Notifications Item */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.md,
                        padding: spacing.md,
                        borderBottom: '1px solid #e5e7eb',
                        cursor: 'pointer'
                    }}>
                        <Bell size={24} color={colors.secondary} />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: fontSize.base, fontWeight: 'bold', margin: 0 }}>Notifications</h3>
                            <p style={{ fontSize: fontSize.sm, color: colors.gray, margin: 0 }}>Configure alerts and reminders</p>
                        </div>
                    </div>

                    {/* Privacy Item */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.md,
                        padding: spacing.md,
                        borderBottom: '1px solid #e5e7eb',
                        cursor: 'pointer'
                    }}>
                        <Shield size={24} color={colors.secondary} />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: fontSize.base, fontWeight: 'bold', margin: 0 }}>Privacy & Security</h3>
                            <p style={{ fontSize: fontSize.sm, color: colors.gray, margin: 0 }}>Password and data settings</p>
                        </div>
                    </div>

                    {/* About Item */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.md,
                        padding: spacing.md,
                        cursor: 'pointer'
                    }}>
                        <Info size={24} color={colors.secondary} />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: fontSize.base, fontWeight: 'bold', margin: 0 }}>About</h3>
                            <p style={{ fontSize: fontSize.sm, color: colors.gray, margin: 0 }}>Version 1.0.0</p>
                        </div>
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
