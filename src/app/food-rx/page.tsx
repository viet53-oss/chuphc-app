'use client';

import { Apple, Info, ChevronRight, Book } from 'lucide-react';
import { useState } from 'react';

const NUTRIENTS = [
    { name: 'Protein', value: '-', unit: 'g' },
    { name: 'Carbs', value: '-', unit: 'g' },
    { name: 'Fiber', value: '-', unit: 'g' },
    { name: 'Fat', value: '-', unit: 'g' },
    { name: 'Saturated Fat', value: '-', unit: 'g' },
    { name: 'Phosphorus', value: '-', unit: 'mg' },
    { name: 'Omega-3 ALA', value: '-', unit: 'g' },
    { name: 'Sodium', value: '-', unit: 'mg' },
];

export default function FoodRx() {
    const [activeTab, setActiveTab] = useState<'rx' | 'recipes'>('rx');

    return (
        <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="flex bg-black/5 p-1 rounded-2xl mb-8">
                <button
                    onClick={() => setActiveTab('rx')}
                    className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all ${activeTab === 'rx' ? 'bg-white shadow-md text-[var(--primary)]' : 'text-[var(--text-muted)] hover:text-black'
                        }`}
                >
                    Food Rx
                </button>
                <button
                    onClick={() => setActiveTab('recipes')}
                    className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all ${activeTab === 'recipes' ? 'bg-white shadow-md text-[var(--primary)]' : 'text-[var(--text-muted)] hover:text-black'
                        }`}
                >
                    Recipes
                </button>
            </div>

            {activeTab === 'rx' ? (
                <div className="space-y-6">
                    <section className="glass-card p-8 border-t-4 border-t-[var(--primary)]">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
                                <Apple size={28} />
                            </div>
                            <h2 className="text-2xl font-bold">Current Food Rx</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-black/5">
                                <span className="font-semibold text-[var(--text-muted)]">Plan</span>
                                <span className="font-bold underline decoration-dotted underline-offset-4 cursor-help">Not Assigned</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-black/5">
                                <span className="font-semibold text-[var(--text-muted)]">Caloric Level</span>
                                <span className="font-bold">--- kcal</span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4 flex items-center gap-2">
                                <Info size={14} /> Estimated Daily Nutrients
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {NUTRIENTS.map((n) => (
                                    <div key={n.name} className="flex justify-between items-center p-3 bg-black/5 rounded-xl">
                                        <span className="text-sm font-medium">{n.name}</span>
                                        <span className="font-bold">{n.value} <small className="text-[10px] opacity-60 uppercase">{n.unit}</small></span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-[var(--primary)]/5 rounded-2xl border border-[var(--primary)]/10">
                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] block mb-2">Note</span>
                            <p className="text-sm text-[var(--text-muted)] italic">No specific notes provided for this plan.</p>
                        </div>
                    </section>
                </div>
            ) : (
                <section className="space-y-6">
                    <div className="glass-card p-12 flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center text-[var(--text-muted)]">
                            <Book size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-2">No Recipes Yet</h2>
                            <p className="text-[var(--text-muted)]">Your personalized recipe collection will appear here once your nutritionist assigns them.</p>
                        </div>
                        <button className="mt-4 px-8 py-3 bg-[var(--primary)] text-white rounded-full font-bold shadow-lg hover:bg-[var(--primary-light)] transition-all transform active:scale-95">
                            Explore Public Library
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
}
