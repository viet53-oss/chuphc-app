'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Settings as SettingsIcon, Home, Bell, User, Lock, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { colors, spacing, fontSize, styles, mergeStyles } from '@/lib/design-system';

export default function SettingsPage() {
    return (
        <ProtectedRoute>

            <div style={styles.pageContainer}>

                {/* Header Section */}
                <section style={mergeStyles(styles.sectionPrimary, styles.centered, { gap: spacing.md })}>
                    <div style={{
                        backgroundColor: colors.white,
                        borderRadius: '12px',
                        width: '80px',
                        height: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <SettingsIcon size={48} color={colors.secondary} />
                    </div>
                    <h1 style={mergeStyles(styles.heading1, { textAlign: 'center' })}>
                        Account Settings
                    </h1>
                    <p style={mergeStyles(styles.smallText, { textAlign: 'center', fontSize: fontSize.sm })}>
                        Manage your preferences and security
                    </p>
                </section>

                {/* Profile Section */}
                <section style={styles.section}>
                    <h2 style={mergeStyles(styles.heading2, { marginBottom: spacing.md, display: 'flex', alignItems: 'center', gap: spacing.sm })}>
                        <User size={24} /> Profile
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: spacing.sm, backgroundColor: colors.background, borderRadius: '8px' }}>
                            <span style={styles.bodyText}>Edit Profile Picture</span>
                            <button style={mergeStyles(styles.button, styles.buttonBlack, { fontSize: fontSize.sm })}>Edit</button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: spacing.sm, backgroundColor: colors.background, borderRadius: '8px' }}>
                            <span style={styles.bodyText}>Change Personal Details</span>
                            <button style={mergeStyles(styles.button, styles.buttonBlack, { fontSize: fontSize.sm })}>Update</button>
                        </div>
                    </div>
                </section>

                {/* Notifications */}
                <section style={styles.section}>
                    <h2 style={mergeStyles(styles.heading2, { marginBottom: spacing.md, display: 'flex', alignItems: 'center', gap: spacing.sm })}>
                        <Bell size={24} /> Notifications
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: spacing.sm, backgroundColor: colors.background, borderRadius: '8px' }}>
                            <span style={styles.bodyText}>Push Notifications</span>
                            <div style={{ width: '40px', height: '20px', backgroundColor: colors.green, borderRadius: '20px', position: 'relative' }}>
                                <div style={{ width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: spacing.sm, backgroundColor: colors.background, borderRadius: '8px' }}>
                            <span style={styles.bodyText}>Email Updates</span>
                            <div style={{ width: '40px', height: '20px', backgroundColor: colors.gray, borderRadius: '20px', position: 'relative' }}>
                                <div style={{ width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', left: '2px', top: '2px' }} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Device Settings */}
                <section style={styles.section}>
                    <h2 style={mergeStyles(styles.heading2, { marginBottom: spacing.md, display: 'flex', alignItems: 'center', gap: spacing.sm })}>
                        <Smartphone size={24} /> Device
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: spacing.sm, backgroundColor: colors.background, borderRadius: '8px' }}>
                            <span style={styles.bodyText}>Auto-track Step Sensitivity</span>
                            <span style={{ fontSize: fontSize.sm, fontWeight: 'bold' }}>Normal</span>
                        </div>
                    </div>
                </section>

                {/* Security */}
                <section style={styles.section}>
                    <h2 style={mergeStyles(styles.heading2, { marginBottom: spacing.md, display: 'flex', alignItems: 'center', gap: spacing.sm })}>
                        <Lock size={24} /> Security
                    </h2>
                    <button style={{
                        ...styles.button,
                        backgroundColor: colors.white,
                        color: colors.red,
                        border: `2px solid ${colors.red}`,
                        width: '100%'
                    }}>
                        Change Password
                    </button>
                </section>

                {/* Home Button */}
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <button style={mergeStyles(styles.button, styles.buttonBlack, {
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: spacing.sm,
                        margin: spacing.xs
                    })}>
                        <Home size={20} />
                        Back to Home
                    </button>
                </Link>

            </div>
        </ProtectedRoute>
    );
}
