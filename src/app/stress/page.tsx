'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Zap, Plus, X, Wind, Heart, Smile, Sun, Cloud, Moon } from 'lucide-react';

export default function StressPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <ProtectedRoute>
            <div className="flex flex-col gap-4 w-full animate-fade-in pb-24">

                {/* Dashboard Summary Card */}
                <section className="app-section bg-gradient-to-br from-[#14b8a6] to-[#0d9488] !border-none text-white p-6 shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <Wind size={20} />
                            <span className="text-small font-bold uppercase tracking-widest opacity-80">Stress Resilience</span>
                        </div>
                        <h2 className="text-[28pt] font-black leading-tight mb-4">Mental Harmony</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                <p className="text-[10pt] font-bold opacity-80 uppercase leading-none mb-1">Status</p>
                                <p className="text-[18pt] font-black uppercase">CALM</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                <p className="text-[10pt] font-bold opacity-80 uppercase leading-none mb-1">Score</p>
                                <p className="text-[18pt] font-black">92 / 100</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Action Area */}
                <div className="px-1">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-black text-white p-6 rounded-[2rem] flex items-center justify-between shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#14b8a6] rounded-2xl flex items-center justify-center shadow-lg transform rotate-6">
                                <Heart size={28} className="text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-[15pt] font-black uppercase tracking-tight">Check Resilience</h3>
                                <p className="text-[10pt] opacity-60 font-bold uppercase tracking-wider">Log your mental state</p>
                            </div>
                        </div>
                        <Smile className="text-[#14b8a6]" />
                    </button>
                </div>

                {/* Insights */}
                <div className="app-section !p-6 bg-primary-tint border-2 border-black">
                    <h3 className="text-[12pt] font-black uppercase text-gray-400 mb-4 tracking-widest">Resilience Habit</h3>
                    <div className="flex gap-4 items-center">
                        <div className="p-4 bg-[#14b8a6]/10 text-[#14b8a6] rounded-2xl">
                            <Wind size={32} />
                        </div>
                        <div>
                            <h4 className="text-[18pt] font-black uppercase leading-tight">4-7-8 Breathing</h4>
                            <p className="text-[11pt] font-bold opacity-60 uppercase">Instant stress reduction</p>
                        </div>
                    </div>
                    <button className="mt-6 w-full py-4 bg-[#14b8a6] text-white rounded-2xl font-black uppercase tracking-widest">
                        START SESSION
                    </button>
                </div>

                {/* MODAL POPUP - LOG STRESS */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in transition-all">
                        <div className="bg-white w-full sm:max-w-lg h-[80vh] sm:h-auto rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">

                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                                <div>
                                    <h2 className="text-[20pt] font-black uppercase tracking-tighter">Stress Log</h2>
                                    <p className="text-[10pt] font-bold text-gray-400 uppercase tracking-widest">Mindbody Pulse</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-10">
                                <div className="space-y-4 text-center">
                                    <h3 className="text-[12pt] font-black uppercase tracking-widest text-[#14b8a6]">How do you feel?</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { label: 'Calm', icon: Sun },
                                            { label: 'Tense', icon: Cloud },
                                            { label: 'Overwhelmed', icon: Moon }
                                        ].map((m) => (
                                            <button key={m.label} className="p-6 bg-gray-50 rounded-3xl flex flex-col items-center gap-2 border-2 border-transparent active:border-[#14b8a6] transition-all">
                                                <m.icon size={32} className="text-[#14b8a6]" />
                                                <span className="text-[10pt] font-black uppercase">{m.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-gray-100 bg-white grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => { alert('Logged!'); setIsModalOpen(false); }}
                                    className="py-4 bg-[#14b8a6] text-white rounded-2xl font-black uppercase tracking-widest"
                                >
                                    Save Entry
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </ProtectedRoute>
    );
}
