'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Apple,
  Dumbbell,
  Zap,
  Moon,
  Users,
  ShieldAlert,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
// Navbar removed to avoid duplication

const PILLARS = [
  { title: 'Nutrition', icon: Apple, color: '#10b981', link: '/nutrition', status: 'On Track' },
  { title: 'Activity', icon: Dumbbell, color: '#f59e0b', link: '/activity', status: 'Due' },
  { title: 'Stress', icon: Zap, color: '#14b8a6', link: '/stress', status: 'Check' },
  { title: 'Sleep', icon: Moon, color: '#3b82f6', link: '/sleep', status: 'Good' },
  { title: 'Social', icon: Users, color: '#ef4444', link: '/social', status: 'Active' },
  { title: 'Risky', icon: ShieldAlert, color: '#f97316', link: '/risky', status: 'Safe' },
  { title: 'Settings', icon: Settings, color: '#6b7280', link: '/settings', status: 'Options' }
];

export default function Dashboard() {
  const [dailySteps, setDailySteps] = useState(0);
  const [isEditingSteps, setIsEditingSteps] = useState(false);
  const [manualStepInput, setManualStepInput] = useState('');
  const lastAccelRef = useRef({ x: 0, y: 0, z: 0, timestamp: 0 });

  // Accelerometer-based step counting
  useEffect(() => {
    let stepCount = 0;
    const STEP_THRESHOLD = 1.2; // Acceleration threshold for detecting a step
    const STEP_DELAY = 250; // Minimum ms between steps

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
          setDailySteps(prev => prev + 1);
          lastAccelRef.current.timestamp = now;
        }

        lastAccelRef.current = { x, y, z, timestamp: now };
      };

      window.addEventListener('devicemotion', handleMotion);
      return () => window.removeEventListener('devicemotion', handleMotion);
    }
  }, []);

  // Manual step entry handler
  const handleManualStepEntry = () => {
    const steps = parseInt(manualStepInput);
    if (!isNaN(steps) && steps >= 0) {
      setDailySteps(steps);
      setIsEditingSteps(false);
      setManualStepInput('');
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', padding: '4px' }}>

        {/* HEADER SECTION */}
        <section style={{
          border: '2px solid black',
          borderRadius: '12px',
          backgroundColor: '#E8F5E9',
          padding: '16px',
          margin: '4px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>


          {/* Brand Name */}
          <h1 style={{
            fontWeight: 'bold',
            fontSize: '20pt',
            color: '#1F363D',
            whiteSpace: 'nowrap',
            margin: 0
          }}>
            Chu Precision Health Center
          </h1>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            width: '100px',
            height: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <img
              src="/logo.png"
              alt="Chu Precision Health"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderTop: '2px solid black',
              borderBottom: '2px solid black',
              padding: '4px 8px',
              backgroundColor: 'white'
            }}>
              <span style={{ fontSize: '18pt', fontWeight: 'bold', textTransform: 'uppercase' }}>PRECISION SCORE:</span>
              <span style={{ fontSize: '18pt', fontWeight: 'bold' }}>84/100</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderTop: '2px solid black',
              borderBottom: '2px solid black',
              padding: '4px 8px',
              backgroundColor: 'white'
            }}>
              <span style={{ fontSize: '18pt', fontWeight: 'bold', textTransform: 'uppercase' }}>WEEKLY STATUS:</span>
              <span style={{ fontSize: '18pt', fontWeight: 'bold' }}>On Target</span>
            </div>
          </div>
        </section>

        {/* STEPS SECTION */}
        <section style={{
          border: '2px solid black',
          borderRadius: '12px',
          backgroundColor: 'white',
          padding: '16px',
          margin: '4px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '4px'
        }}>
          <p
            style={{ fontSize: '30pt', fontWeight: 'bold', color: 'black', margin: 0, cursor: 'pointer' }}
            onClick={() => {
              setIsEditingSteps(true);
              setManualStepInput(dailySteps.toString());
            }}
            title="Click to edit steps"
          >
            {isEditingSteps ? (
              <input
                type="number"
                value={manualStepInput}
                onChange={(e) => setManualStepInput(e.target.value)}
                onBlur={handleManualStepEntry}
                onKeyPress={(e) => e.key === 'Enter' && handleManualStepEntry()}
                autoFocus
                style={{
                  fontSize: '30pt',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  border: '2px solid black',
                  borderRadius: '8px',
                  padding: '4px',
                  width: '180px'
                }}
              />
            ) : (
              dailySteps.toLocaleString()
            )}
          </p>
          <p style={{ fontSize: '18pt', fontWeight: 'bold', color: 'black', margin: 0 }}>
            Steps
          </p>
          <p style={{ fontSize: '10pt', color: '#666', margin: 0, fontStyle: 'italic' }}>
            {dailySteps > 0 ? 'Auto-tracking • Click to edit' : 'Click number to enter manually'}
          </p>
        </section>

        {/* BUTTONS SECTION */}
        <section style={{
          border: '2px solid black',
          borderRadius: '12px',
          backgroundColor: 'white',
          padding: '16px',
          margin: '4px'
        }}>
          <div className="pillar-grid">
            {PILLARS.map((p) => (
              <Link
                href={p.link}
                key={p.title}
                className="app-section !p-4 flex items-center justify-between hover:bg-black/5 active:scale-95 transition-all"
                style={{ borderLeft: `6px solid ${p.color}` }}
              >
                <div className="flex items-center gap-2">
                  <p.icon size={16} style={{ color: p.color }} />
                  <h3 className="title-md">{p.title}</h3>
                </div>
                <span className="text-small font-bold" style={{ color: p.color }}>{p.status.toUpperCase()}</span>
              </Link>
            ))}
          </div>
        </section>

      </div >
    </ProtectedRoute >
  );
}
