'use client';

import { useState, useEffect, useRef } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Dumbbell, Home, Plus } from 'lucide-react';
import Link from 'next/link';
import { colors, spacing, fontSize } from '@/lib/design-system';

export default function ActivityPage() {
    const [minutesActive, setMinutesActive] = useState(0);
    const [workoutsCompleted, setWorkoutsCompleted] = useState(0);
    const [autoSteps, setAutoSteps] = useState(0);
    const [manualSteps, setManualSteps] = useState(0);
    const [manualInput, setManualInput] = useState('');
    const lastAccelRef = useRef({ x: 0, y: 0, z: 0, timestamp: 0 });

    // Accelerometer-based step counting
    useEffect(() => {
        let stepCount = 0;
        const STEP_THRESHOLD = 3.0; // Increased from 1.2 - higher threshold requires more significant movement
        const STEP_DELAY = 500; // Increased from 250ms - minimum time between step detections

        if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
            const handleMotion = (event: DeviceMotionEvent) => {
                const accel = event.accelerationIncludingGravity;
                if (!accel) return;

                const now = Date.now();
                const timeDiff = now - lastAccelRef.current.timestamp;

                if (timeDiff < STEP_DELAY) return;

                // Calculate total acceleration magnitude
                const x = accel.x || 0;
                const y = accel.y || 0;
                const z = accel.z || 0;
                const magnitude = Math.sqrt(x * x + y * y + z * z);

                // Detect significant movement (potential step)
                const lastMagnitude = Math.sqrt(
                    lastAccelRef.current.x ** 2 +
                    lastAccelRef.current.y ** 2 +
                    lastAccelRef.current.z ** 2
                );

                if (Math.abs(magnitude - lastMagnitude) > STEP_THRESHOLD) {
                    stepCount++;
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

    const totalSteps = autoSteps + manualSteps;

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
