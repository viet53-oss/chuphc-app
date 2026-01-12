'use client';

import {
  Apple,
  Dumbbell,
  Zap,
  Moon,
  Users,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Award,
  Target,
  BookOpen,
  Gift
} from 'lucide-react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const PILLARS = [
  { title: 'Nutrition', icon: Apple, color: '#10b981', link: '/nutrition', status: 'On Track' },
  { title: 'Activity', icon: Dumbbell, color: '#f59e0b', link: '/activity', status: 'Due' },
  { title: 'Stress', icon: Zap, color: '#14b8a6', link: '/stress', status: 'Check' },
  { title: 'Sleep', icon: Moon, color: '#3b82f6', link: '/sleep', status: 'Good' },
  { title: 'Social', icon: Users, color: '#ef4444', link: '/social', status: 'Active' },
  { title: 'Risky', icon: ShieldAlert, color: '#f97316', link: '/risky', status: 'Safe' },
  { title: 'Education', icon: BookOpen, color: '#3b82f6', link: '/education', status: 'New' },
  { title: 'Rewards', icon: Award, color: '#10b981', link: '/rewards', status: 'Earned' },
];

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-3 w-full animate-fade-in">

        {/* HEADER: Score & Brand (Balanced) */}
        <section className={`app-section !border-black bg-primary-tint !py-6 dashboard-header`}>
          {/* Logo */}
          <div style={{ maxWidth: '200px', width: '100%', height: 'auto', flexShrink: 0 }}>
            <img src="/logo.png" alt="Chu Logo" className="w-full h-full object-contain" />
          </div>

          {/* Precision Score (One Line) */}
          <div className="flex items-center gap-2">
            <span className="text-primary uppercase font-bold tracking-wider" style={{ fontSize: '20pt' }}>PRECISION SCORE:</span>
            <div className="flex items-baseline gap-1">
              <h1 className="title-xl" style={{ fontSize: '20pt' }}>84</h1>
              <span className="font-bold opacity-30" style={{ fontSize: '20pt' }}>/100</span>
            </div>
          </div>

          {/* Weekly Status (One Line) */}
          <div className="flex items-center gap-2">
            <span className="opacity-40 uppercase font-bold tracking-wider" style={{ fontSize: '20pt' }}>WEEKLY STATUS:</span>
            <p className="font-bold text-primary" style={{ fontSize: '20pt' }}>On Target</p>
          </div>
        </section>

        {/* QUICK LOG BANNER */}
        <div className="p-3 border-2 border-black rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target size={18} className="text-primary" />
            <p className="text-body font-bold">Today: Log 30m Movement</p>
          </div>
          <ChevronRight size={18} className="text-primary" />
        </div>

        {/* PILLAR GRID (2-Column for 15pt) */}
        <div className="pillar-grid">
          {PILLARS.map((p) => (
            <Link
              href={p.link}
              key={p.title}
              className="app-section !p-4 flex flex-col gap-2 hover:bg-black/5 active:scale-95 transition-all"
              style={{ borderLeft: `6px solid ${p.color}` }}
            >
              <div className="flex items-center gap-2">
                <p.icon size={16} style={{ color: p.color }} />
                <h3 className="title-md">{p.title}</h3>
              </div>
              <div className="flex justify-end">
                <span className="text-small font-bold" style={{ color: p.color }}>{p.status}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* REWARDS (Streamlined Footer) */}
        <section className="app-section !py-3 flex items-center justify-between bg-black/5 border-2 border-black">
          <div className="flex items-center gap-4">
            <Award size={24} className="text-primary" />
            <div className="flex flex-col">
              <h4 className="title-md">1,240 Achievement Points</h4>
              <span className="text-small opacity-50">Tier: Elite Professional</span>
            </div>
          </div>
          <ChevronRight size={20} className="opacity-30" />
        </section>

      </div>
    </ProtectedRoute>
  );
}
