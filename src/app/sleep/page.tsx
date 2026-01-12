'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Moon, Plus, X, Star, AlarmClock, Bed, Battery } from 'lucide-react';

export default function SleepPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <ProtectedRoute>
            <div className="flex flex-col gap-4 w-full animate-fade-in pb-24">

                {/* Dashboard Summary Card */}
                <section className="app-section bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] !border-none text-white p-6 shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <Moon size={20} />
                            <span className="text-small font-bold uppercase tracking-widest opacity-80">Recovery Sync</span>
                        </div>
                        <h2 className="text-[28pt] font-black leading-tight mb-4">Deep Recovery</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                <p className="text-[10pt] font-bold opacity-80 uppercase leading-none mb-1">Avg Duration</p>
                                <p className="text-[18pt] font-black">7h 20m</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                <p className="text-[10pt] font-bold opacity-80 uppercase leading-none mb-1">Quality</p>
                                <p className="text-[18pt] font-black">88%</p>
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
                            <div className="w-12 h-12 bg-[#3b82f6] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
                                <Bed size={28} className="text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-[15pt] font-black uppercase tracking-tight">Log Recovery</h3>
                                <p className="text-[10pt] opacity-60 font-bold uppercase tracking-wider">Sync your sleep data</p>
                            </div>
                        </div>
                        <Battery className="text-[#3b82f6]" />
                    </button>
                </div>

                {/* Insights Grid */}
                <div className="grid grid-cols-2 gap-3 px-1">
                    <div className="app-section !p-4 border-2 border-black bg-primary-tint">
                        <AlarmClock size={20} className="text-[#3b82f6] mb-2" />
                        <p className="text-[9pt] font-black uppercase opacity-40">Bedtime Goal</p>
                        <p className="text-[14pt] font-black uppercase">10:30 PM</p>
                    </div>
                    <div className="app-section !p-4 border-2 border-black bg-primary-tint">
                        <Star size={20} className="text-[#f59e0b] mb-2" />
                        <p className="text-[9pt] font-black uppercase opacity-40">Consistency</p>
                        <p className="text-[14pt] font-black uppercase">GOLD</p>
                    </div>
                </div>

                {/* MODAL POPUP - LOG SLEEP */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in transition-all">
                        <div className="bg-white w-full sm:max-w-lg h-[80vh] sm:h-auto rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">

                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                                <div>
                                    <h2 className="text-[20pt] font-black uppercase tracking-tighter">Sleep Log</h2>
                                    <p className="text-[10pt] font-bold text-gray-400 uppercase tracking-widest">Recovery Record</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-10">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10pt] font-black uppercase text-gray-400 ml-1">Hours Rested*</label>
                                        <input type="number" step="0.5" placeholder="8.0" className="w-full bg-gray-50 border-2 border-transparent focus:border-[#3b82f6] rounded-2xl p-4 text-[12pt] font-bold outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10pt] font-black uppercase text-gray-400 ml-1">Quality (1-10)</label>
                                        <input type="range" min="1" max="10" className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#3b82f6]" />
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-gray-100 bg-white grid grid-cols-2 gap-4">
                                <button onClick={() => setIsModalOpen(false)} className="py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest">Cancel</button>
                                <button onClick={() => setIsModalOpen(false)} className="py-4 bg-[#3b82f6] text-white rounded-2xl font-black uppercase tracking-widest">Save Sleep</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </ProtectedRoute>
    );
}
