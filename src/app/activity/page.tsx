'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Dumbbell, Home, Plus, Save } from 'lucide-react';
import Link from 'next/link';
import { colors, spacing, fontSize } from '@/lib/design-system';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function ActivityPage() {
    const { user } = useAuth();
    const [minutesActive, setMinutesActive] = useState(0);
    const [workoutsCompleted, setWorkoutsCompleted] = useState(0);
    const [autoSteps, setAutoSteps] = useState(0);
    const [manualSteps, setManualSteps] = useState(0);
    const [savedSteps, setSavedSteps] = useState(0); // Steps already saved in DB
    const [manualInput, setManualInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const lastAccelRef = useRef({ x: 0, y: 0, z: 0, timestamp: 0 });


    // Load today's data from Supabase
    useEffect(() => {
        if (!user) return;

        const loadDailyData = async () => {
            const today = new Date().toISOString().split('T')[0];
            const { data, error } = await supabase
                .from('daily_activity_summary')
                .select('steps, active_minutes')
                // .eq('user_id', user.id) // Removed for testing
                .eq('date', today)
                .single();

            if (data && !error) {
                setSavedSteps(data.steps || 0);
                setMinutesActive(data.active_minutes || 0);
                setBaselineMinutes(data.active_minutes || 0);
            }
        };

        loadDailyData();
    }, [user]);

    // Track baseline loaded minutes to compare against for Smart Guard
    const [baselineMinutes, setBaselineMinutes] = useState(0);


    // Save functionality
    const saveProgress = useCallback(async () => {
        if (!user) return;

        // SMART GUARD: Only save if we have actual new data to write
        // This prevents the desktop (0 steps) from overwriting a mobile session (5000 steps) with old data
        const hasNewSteps = autoSteps > 0 || manualSteps > 0;
        const hasNewMinutes = minutesActive !== baselineMinutes;

        if (!hasNewSteps && !hasNewMinutes) {
            console.log('No new activity to save, skipping.');
            return;
        }

        setIsSaving(true);

        try {
            const today = new Date().toISOString().split('T')[0];
            const currentTotalSteps = savedSteps + autoSteps + manualSteps;
            const currentTotalMinutes = minutesActive;

            const { error } = await supabase
                .from('daily_activity_summary')
                .upsert({
                    user_id: user.id,
                    date: today,
                    steps: currentTotalSteps,
                    active_minutes: currentTotalMinutes,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id, date'
                });

            if (error) throw error;

            // On successful save, verify by updating "saved" baseline and resetting ephemeral counters
            // Actually, simplest is to just keep the counters running and update the DB
            // But to avoid double counting if we reload:
            // We just updated DB to (saved + auto + manual). 
            // So on next load, DB will return that total.
            // For this session, we can just update the timestamp.
            setLastSaved(new Date());
            console.log('Activity saved successfully');
        } catch (e) {
            console.error('Error saving activity:', e);
        } finally {
            setIsSaving(false);
        }
    }, [user, savedSteps, autoSteps, manualSteps, minutesActive]);

    // Autosave every 1 HOUR (3600000 ms) and on unmount
    useEffect(() => {
        const interval = setInterval(() => {
            console.log('Auto-saving activity...');
            saveProgress();
        }, 3600000);

        // Also save when leaving the page or closing window
        const handleBeforeUnload = () => {
            saveProgress();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            clearInterval(interval);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            saveProgress(); // Attempt save on unmount navigation
        };
    }, [saveProgress]);

    // Accelerometer-based step counting
    useEffect(() => {
        let stepCount = 0;
        const STEP_THRESHOLD = 2.0;
        const STEP_DELAY = 350;

        if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
            const handleMotion = (event: DeviceMotionEvent) => {
                const accel = event.accelerationIncludingGravity;
                if (!accel) return;

                const now = Date.now();
                const timeDiff = now - lastAccelRef.current.timestamp;

                if (timeDiff < STEP_DELAY) return;

                const x = accel.x || 0;
                const y = accel.y || 0;
                const z = accel.z || 0;
                const magnitude = Math.sqrt(x * x + y * y + z * z);

                const lastMagnitude = Math.sqrt(
                    lastAccelRef.current.x ** 2 +
                    lastAccelRef.current.y ** 2 +
                    lastAccelRef.current.z ** 2
                );

                if (Math.abs(magnitude - lastMagnitude) > STEP_THRESHOLD) {
                    setAutoSteps(prev => prev + 1);
                    lastAccelRef.current.timestamp = now;
                }

                lastAccelRef.current = { x, y, z, timestamp: now };
            };

            window.addEventListener('devicemotion', handleMotion);
            return () => window.removeEventListener('devicemotion', handleMotion);
        }
    }, []);

    // Manual step entry handler
    const handleAddManualSteps = () => {
        const steps = parseInt(manualInput);
        if (!isNaN(steps) && steps > 0) {
            setManualSteps(prev => prev + steps);
            setManualInput('');
        }
    };

    const totalSteps = savedSteps + autoSteps + manualSteps;

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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
                        <h2 style={{ fontSize: fontSize.lg, fontWeight: 'bold', margin: 0 }}>Today's Activity</h2>
                        <Link href="/" style={{ textDecoration: 'none' }}>
                            <button style={{
                                padding: '6px 16px',
                                backgroundColor: colors.black,
                                color: colors.white,
                                border: 'none',
                                borderRadius: '9999px',
                                fontSize: '12pt',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                            }}>
                                <Home size={16} />
                                Home
                            </button>
                        </Link>
                    </div>

                    {/* Save Status Indicator */}
                    <div style={{ textAlign: 'center', marginTop: spacing.sm }}>
                        {isSaving ? (
                            <span style={{ fontSize: fontSize.xs, color: colors.blue }}>Saving...</span>
                        ) : lastSaved ? (
                            <span style={{ fontSize: fontSize.xs, color: colors.green }}>
                                Last saved: {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        ) : (
                            <span style={{ fontSize: fontSize.xs, color: colors.gray }}>Not saved yet</span>
                        )}
                        <button
                            onClick={saveProgress}
                            disabled={isSaving}
                            style={{
                                display: 'block',
                                margin: '8px auto 0',
                                padding: '4px 12px',
                                fontSize: fontSize.xs,
                                borderRadius: '4px',
                                border: `1px solid ${colors.gray}`,
                                backgroundColor: 'transparent',
                                cursor: 'pointer'
                            }}
                        >
                            Save Now
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                        <div style={{
                            padding: spacing.md,
                            backgroundColor: colors.primaryTint,
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: fontSize.xs, color: colors.gray, margin: 0 }}>Steps</p>
                            <p style={{ fontSize: fontSize.xxl, fontWeight: 'bold', margin: 0 }}>{totalSteps.toLocaleString()}</p>
                        </div>
                        <div style={{
                            padding: spacing.md,
                            backgroundColor: colors.primaryTint,
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: fontSize.xs, color: colors.gray, margin: 0 }}>Workouts</p>
                            <p style={{ fontSize: fontSize.xxl, fontWeight: 'bold', margin: 0 }}>{workoutsCompleted} / {minutesActive} min</p>
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
                            onClick={() => setMinutesActive(prev => prev + 30)}
                            style={{
                                padding: spacing.lg,
                                backgroundColor: colors.yellow,
                                color: colors.white,
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: fontSize.base,
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Log 30 Minutes
                        </button>
                        <button
                            onClick={() => setWorkoutsCompleted(prev => prev + 1)}
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
                            Complete Workout
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
