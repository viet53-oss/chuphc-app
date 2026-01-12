'use client';

import {
    Users,
    Flag,
    Clock,
    Search,
    ChevronRight,
    MoreVertical,
    MessageSquare,
    ExternalLink,
    Filter
} from 'lucide-react';
import { useState } from 'react';

const PATIENTS = [
    { id: 1, name: 'Viet Chu', status: 'Flagged', lastCheckin: '3 days ago', risk: 'Inactive', email: 'v.chu@example.com' },
    { id: 2, name: 'Sarah Miller', status: 'On Track', lastCheckin: 'Today', risk: 'Low', email: 's.miller@example.com' },
    { id: 3, name: 'James Wilson', status: 'Inactive', lastCheckin: '8 days ago', risk: 'High', email: 'j.wilson@example.com' },
    { id: 4, name: 'Elena Rodriguez', status: 'Flagged', lastCheckin: '2 days ago', risk: 'Missing Data', email: 'e.rod@example.com' },
];

export default function AdminDashboard() {
    const [filter, setFilter] = useState<'All' | 'Flagged' | 'Inactive'>('All');

    const filteredPatients = PATIENTS.filter(p => {
        if (filter === 'All') return true;
        return p.status === filter;
    });

    return (
        <div className="animate-fade-in flex flex-col gap-6 pb-24">
            <header className="flex flex-col gap-2">
                <h2 className="text-3xl font-black text-[var(--secondary)]">Staff Portal</h2>
                <p className="text-sm font-bold text-[var(--text-muted)] italic">Showing prioritized patient list</p>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-4">
                <div className="glass-card p-4 flex flex-col gap-1 border-b-4 border-red-500">
                    <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">Flagged</span>
                    <span className="text-2xl font-black text-red-600">42</span>
                </div>
                <div className="glass-card p-4 flex flex-col gap-1 border-b-4 border-orange-500">
                    <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">Inactive</span>
                    <span className="text-2xl font-black text-orange-500">128</span>
                </div>
                <div className="glass-card p-4 flex flex-col gap-1 border-b-4 border-green-500">
                    <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">On Track</span>
                    <span className="text-2xl font-black text-[var(--primary)]">312</span>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col gap-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                    <input
                        type="text"
                        placeholder="Search patient name..."
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 border-black/5 outline-none focus:border-[var(--primary)]/20 font-bold"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {['All', 'Flagged', 'Inactive', 'On Track'].map((f) => (
                        <button
                            key={f}
                            onClick={() => f === 'All' || f === 'Flagged' || f === 'Inactive' ? setFilter(f as any) : null}
                            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${(filter === f || (f === 'On Track' && filter === 'All'))
                                    ? 'bg-[var(--secondary)] text-white shadow-lg'
                                    : 'bg-black/5 text-[var(--text-muted)]'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Patient List */}
            <div className="flex flex-col gap-3">
                {filteredPatients.map((patient) => (
                    <div key={patient.id} className="glass-card p-5 flex items-center justify-between group active:scale-[0.98] transition-transform">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg ${patient.status === 'Flagged' ? 'bg-red-500 shadow-red-200 shadow-lg' : 'bg-[var(--secondary)]'
                                }`}>
                                {patient.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                                <h4 className="font-black text-[var(--secondary)] text-base">{patient.name}</h4>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${patient.status === 'Flagged' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                        }`}>
                                        {patient.status}
                                    </span>
                                    <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-tight flex items-center gap-1">
                                        <Clock size={10} /> {patient.lastCheckin}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="p-3 bg-black/5 rounded-xl text-[var(--secondary)] hover:bg-[var(--secondary)] hover:text-white transition-all">
                                <MessageSquare size={18} />
                            </button>
                            <button className="p-3 bg-black/5 rounded-xl text-[var(--secondary)] hover:bg-[var(--secondary)] hover:text-white transition-all">
                                <ExternalLink size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full py-5 border-2 border-dashed border-black/10 rounded-[28px] text-[var(--text-muted)] font-black uppercase text-[10px] tracking-widest mt-4">
                Load more patients
            </button>
        </div>
    );
}
