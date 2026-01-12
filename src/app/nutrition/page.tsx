'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { Apple, Home } from 'lucide-react';
import Link from 'next/link';
import { colors, spacing, fontSize } from '@/lib/design-system';

export default function NutritionPage() {
    const [dailyCalories, setDailyCalories] = useState(0);
    const [mealsLogged, setMealsLogged] = useState(0);

    return (
        <ProtectedRoute>
            <Navbar customTitle="Nutrition" />

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
                        <Apple size={48} color={colors.green} />
                    </div>
                    <h1 style={{ fontSize: fontSize.xl, fontWeight: 'bold', color: colors.secondary, margin: 0, textAlign: 'center' }}>
                        Nutrition Tracking
                    </h1>
                    <p style={{ fontSize: fontSize.sm, color: colors.gray, margin: 0, textAlign: 'center' }}>
                        Monitor your daily food intake
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
                    <h2 style={{ fontSize: fontSize.lg, fontWeight: 'bold', marginBottom: spacing.md }}>Today's Summary</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                        <div style={{
                            padding: spacing.md,
                            backgroundColor: colors.primaryTint,
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: fontSize.xs, color: colors.gray, margin: 0 }}>Calories</p>
                            <p style={{ fontSize: fontSize.xxl, fontWeight: 'bold', margin: 0 }}>{dailyCalories}</p>
                        </div>
                        <div style={{
                            padding: spacing.md,
                            backgroundColor: colors.primaryTint,
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: fontSize.xs, color: colors.gray, margin: 0 }}>Meals</p>
                            <p style={{ fontSize: fontSize.xxl, fontWeight: 'bold', margin: 0 }}>{mealsLogged}/4</p>
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
                            onClick={() => setMealsLogged(prev => prev + 1)}
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
                            Log Meal
                        </button>
                        <button
                            onClick={() => setDailyCalories(prev => prev + 500)}
                            style={{
                                padding: spacing.lg,
                                backgroundColor: colors.blue,
                                color: colors.white,
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: fontSize.base,
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Add Calories
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
