'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';


import {
  Apple,
  Dumbbell,
  Zap,
  Moon,
  Users,
  ShieldAlert,
  Settings,
  LogOut,
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
  const { user, signOut } = useAuth();
  const [dailyCalories, setDailyCalories] = useState<number>(0);
  const [weeklyCalories, setWeeklyCalories] = useState<number>(0);
  const [activityMinutes, setActivityMinutes] = useState(0);
  const [todaySteps, setTodaySteps] = useState(0);
  const [weekSteps, setWeekSteps] = useState(0);

  // Load Activity Data from Supabase
  useEffect(() => {
    if (!user) return;

    const fetchActivity = async () => {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      // Calculate start of week (Sunday)
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const startOfWeekStr = startOfWeek.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('daily_activity_summary')
        .select('date, steps, active_minutes')
        .eq('user_id', user.id)
        .gte('date', startOfWeekStr);

      if (data && !error) {
        let tSteps = 0;
        let tMinutes = 0;
        let wSteps = 0;

        data.forEach(log => {
          wSteps += log.steps || 0;
          if (log.date === todayStr) {
            tSteps = log.steps || 0;
            tMinutes = log.active_minutes || 0;
          }
        });

        setTodaySteps(tSteps);
        setActivityMinutes(tMinutes);
        setWeekSteps(wSteps);
      }
    };

    fetchActivity();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchCalories = async () => {
      // Today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Start of Week (Sunday)
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      const { data: logs, error } = await supabase
        .from('nutrition_logs')
        .select('calories, logged_at')
        // .eq('user_id', user.id) // Removed for testing
        .gte('logged_at', startOfWeek.toISOString());

      if (logs && !error) {
        let daySum = 0;
        let weekSum = 0;

        logs.forEach(log => {
          const logDate = new Date(log.logged_at);
          weekSum += log.calories || 0;
          if (logDate >= today) {
            daySum += log.calories || 0;
          }
        });

        setDailyCalories(daySum);
        setWeeklyCalories(weekSum);
      }
    };

    fetchCalories();
  }, [user]);


  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%', padding: '2px' }}>

        {/* HEADER SECTION */}
        <section style={{
          border: '2px solid black',
          borderRadius: '12px',
          backgroundColor: '#E8F5E9',
          padding: '2px',
          margin: '2px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px'
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
          {user?.user_metadata?.full_name && (
            <h2 style={{ fontSize: '16pt', color: '#1F363D', margin: '4px 0' }}>
              Welcome, {user.user_metadata.full_name}
            </h2>
          )}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              borderTop: '2px solid black',
              borderBottom: '2px solid black',
              padding: '2px',
              backgroundColor: 'white'
            }}>
              <span style={{ fontSize: '12pt', fontWeight: 'bold', textTransform: 'uppercase' }}>PRECISION SCORE:</span>
              <span style={{ fontSize: '16pt', fontWeight: 'bold' }}>84/100</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              borderTop: '2px solid black',
              borderBottom: '2px solid black',
              padding: '2px',
              backgroundColor: 'white'
            }}>
              <span style={{ fontSize: '12pt', fontWeight: 'bold', textTransform: 'uppercase' }}>WEEKLY STATUS:</span>
              <span style={{ fontSize: '14pt', fontWeight: 'bold' }}>On Target</span>
            </div>
          </div>
        </section>



        {/* BUTTONS SECTION */}
        <section style={{
          border: '2px solid black',
          borderRadius: '12px',
          backgroundColor: 'white',
          padding: '2px',
          margin: '2px'
        }}>
          <div className="pillar-grid">
            {PILLARS.map((p) => (
              <Link
                href={p.link}
                key={p.title}
                className="app-section !p-[2px] flex items-center justify-between hover:bg-black/5 active:scale-95 transition-all"
                style={{ borderLeft: `6px solid ${p.color}` }}
              >
                {p.title === 'Activity' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <h3 style={{ fontSize: '20pt', fontWeight: 'bold', margin: 0 }}>{p.title}</h3>
                      <span style={{ fontSize: '14pt', fontWeight: 'bold', color: p.color }}>{activityMinutes}m</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12pt', fontWeight: 'bold', color: p.color }}>TD: {todaySteps.toLocaleString()}</span>
                      <span style={{ fontSize: '12pt', fontWeight: 'bold', color: p.color }}>WK: {weekSteps.toLocaleString()}</span>
                    </div>
                  </div>
                ) : p.title === 'Nutrition' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <h3 style={{ fontSize: '20pt', fontWeight: 'bold', margin: 0 }}>{p.title}</h3>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12pt', fontWeight: 'bold', color: p.color }}>TD: {dailyCalories}</span>
                      <span style={{ fontSize: '12pt', fontWeight: 'bold', color: p.color }}>WK: {weeklyCalories}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 style={{ fontSize: '20pt', fontWeight: 'bold', margin: 0 }}>{p.title}</h3>
                    <span style={{ fontSize: '12pt', fontWeight: 'bold', color: p.color }}>{p.status.toUpperCase()}</span>
                  </>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* LOGOUT BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0 16px' }}>
          <button
            onClick={signOut}
            style={{
              padding: '10px',
              backgroundColor: '#000000',
              color: 'white',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '14pt',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            Logout
          </button>
        </div>

      </div >
    </ProtectedRoute >
  );
}
