'use client';

import {
    Dumbbell,
    Apple,
    Zap,
    Moon,
    Users,
    ShieldAlert,
    CheckCircle2,
    ChevronDown,
    Target
} from 'lucide-react';
import { useState } from 'react';

const PILLARS = [
    { id: 'nutrition', name: 'Nutrition', icon: Apple, color: '#f59e0b' },
    { id: 'activity', name: 'Activity', icon: Dumbbell, color: '#84cc16' },
    { id: 'stress', name: 'Stress', icon: Zap, color: '#f97316' },
    { id: 'sleep', name: 'Sleep', icon: Moon, color: '#db2777' },
];

export default function LifestyleRx() {
    const [expanded, setExpanded] = useState('nutrition');

    return (
        <div className="fade-in flex flex-col w-full pb-24">

            {/* SECTION 1: HEADER (Standard Layout) */}
            <section className="app-section flex flex-col gap-2 !border-black bg-primary-tint">
                <span className="text-small text-primary">Prescription Roadmap</span>
                <h1 className="title-xl">Lifestyle Rx</h1>
                <p className="text-body opacity-60">Personalized targets for your CORE health.</p>
            </section>

            {/* SECTION 2: PILLAR SELECTOR (Standard Grid) */}
            <section className="grid grid-cols-4 gap-2 mb-6">
                {PILLARS.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => setExpanded(p.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${expanded === p.id ? 'border-black bg-primary-tint' : 'border-black/5 opacity-50'
                            }`}
                    >
                        <p.icon size={22} className={expanded === p.id ? 'text-primary' : ''} />
                    </button>
                ))}
            </section>

            {/* SECTION 3: Rx DETAIL (Standard Container System) */}
            <section className="flex flex-col gap-4">
                {PILLARS.map((pillar) => (
                    expanded === pillar.id && (
                        <div key={pillar.id} className="app-section fade-in !border-black" style={{ borderLeft: `8px solid ${pillar.color}` }}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ background: pillar.color }}>
                                    <pillar.icon size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="title-md">{pillar.name} Prescription</h3>
                                    <p className="text-small opacity-60">Status: Verified</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 p-4 border-2 border-black/5 rounded-2xl mb-6">
                                <div className="flex items-center gap-3">
                                    <Target size={22} className="text-primary" />
                                    <span className="text-body font-bold">Standard Goal: Daily Logging</span>
                                </div>
                                <p className="text-body opacity-60 ml-8">Maintain consistency in your {pillar.name.toLowerCase()} habits for the best clinical outcome.</p>
                            </div>

                            <div className="flex justify-between items-center bg-black/5 p-4 rounded-2xl border border-black/10">
                                <span className="text-small">Compliance</span>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(d => (
                                        <CheckCircle2 key={d} size={18} className={d < 4 ? 'text-primary' : 'opacity-20'} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </section>

        </div>
    );
}
