'use client';

import {
    Activity,
    Dumbbell,
    Scale,
    Moon,
    Zap,
    Plus,
    ChevronRight,
    TrendingUp,
    History
} from 'lucide-react';

const METRICS = [
    { id: 'steps', title: 'Steps', icon: Activity, color: '#22c55e', val: '8,432', target: '10k' },
    { id: 'weight', title: 'Weight', icon: Scale, color: '#3b82f6', val: '176 lbs', target: '175' },
    { id: 'sleep', title: 'Sleep', icon: Moon, color: '#db2777', val: '7h 20m', target: '8h' },
];

export default function Tracking() {
    return (
        <div className="fade-in flex flex-col w-full pb-24">

            {/* SECTION 1: HEADER (Standardized Header Layout) */}
            <section className="app-section flex flex-col gap-2 !border-black !bg-primary-tint">
                <span className="text-small text-primary">Biometric Health</span>
                <h1 className="title-xl">Tracking</h1>
                <div className="flex items-center gap-2 mt-2">
                    <TrendingUp size={14} className="text-primary" />
                    <span className="text-small opacity-60">Compliance: 92% This Week</span>
                </div>
            </section>

            {/* SECTION 2: METRICS LIST (Standard List Structure) */}
            <section className="flex flex-col gap-4">
                {METRICS.map((m) => (
                    <div key={m.id} className="app-section flex items-center justify-between !mb-0 border-black hover:border-primary transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                                style={{ backgroundColor: m.color }}
                            >
                                <m.icon size={22} />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="title-md">{m.title}</h3>
                                <p className="text-small opacity-60">Target: {m.target}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                            <span className="title-md">{m.val}</span>
                            <ChevronRight size={18} className="text-muted group-hover:text-primary transition-colors" />
                        </div>
                    </div>
                ))}
            </section>

            {/* SECTION 3: ADD ACTION (Standard Primary Action) */}
            <section className="app-section mt-6 border-black border-dashed !bg-primary/5 flex flex-col items-center justify-center gap-4 py-8">
                <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                    <Plus size={32} />
                </div>
                <p className="title-md">Sync or Log New Data</p>
                <p className="text-body opacity-60 text-center px-4">Keep your precision health dashboard updated in real-time.</p>
            </section>

            {/* SECTION 4: HISTORY (Standard Footer Block) */}
            <section className="app-section mt-6 border-black flex items-center gap-4 !bg-black/5">
                <History size={24} className="text-muted" />
                <div className="flex flex-col">
                    <h4 className="title-md">Full Log History</h4>
                    <p className="text-body opacity-60">Browse your historical biometric data.</p>
                </div>
            </section>

        </div>
    );
}
