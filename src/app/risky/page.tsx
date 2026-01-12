'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ShieldAlert, Plus, X, ShieldCheck, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function RiskyPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <ProtectedRoute>
            <div className="flex flex-col gap-4 w-full animate-fade-in pb-24">

                {/* Dashboard Summary Card */}
                <section className="app-section bg-gradient-to-br from-[#f97316] to-[#ea580c] !border-none text-white p-6 shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldAlert size={20} />
                            <span className="text-small font-bold uppercase tracking-widest opacity-80">Harm Reduction</span>
                        </div>
                        <h2 className="text-[28pt] font-black leading-tight mb-4">Risk Management</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                <p className="text-[10pt] font-bold opacity-80 uppercase leading-none mb-1">Status</p>
                                <p className="text-[18pt] font-black uppercase">SAFE</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                <p className="text-[10pt] font-bold opacity-80 uppercase leading-none mb-1">Score</p>
                                <p className="text-[18pt] font-black">100 / 100</p>
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
                            <div className="w-12 h-12 bg-[#f97316] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-12">
                                <ShieldCheck size={28} className="text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-[15pt] font-black uppercase tracking-tight">Log Awareness</h3>
                                <p className="text-[10pt] opacity-60 font-bold uppercase tracking-wider">Record substance intake</p>
                            </div>
                        </div>
                        <CheckCircle2 className="text-[#f97316]" />
                    </button>
                </div>

                {/* Info Card */}
                <div className="app-section !p-6 bg-primary-tint border-2 border-black flex items-start gap-4">
                    <div className="p-3 bg-white border-2 border-black rounded-xl">
                        <Info size={24} className="text-[#f97316]" />
                    </div>
                    <div>
                        <h3 className="text-[12pt] font-black uppercase tracking-wider mb-1">Harm Reduction</h3>
                        <p className="text-[10pt] font-bold opacity-60 uppercase">Managing sugar, alcohol, and caffeine is key to metabolic precision health.</p>
                    </div>
                </div>

                {/* MODAL (Placeholder) */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in transition-all">
                        <div className="bg-white w-full sm:max-w-lg h-[80vh] sm:h-auto rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                                <h2 className="text-[20pt] font-black uppercase tracking-tighter">Substance Log</h2>
                                <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                            </div>
                            <div className="p-10 text-center opacity-30 italic font-bold">Risk Management Log System</div>
                            <div className="p-6 border-t grid grid-cols-2 gap-4">
                                <button onClick={() => setIsModalOpen(false)} className="py-4 bg-gray-100 rounded-2xl font-black uppercase">Cancel</button>
                                <button onClick={() => setIsModalOpen(false)} className="py-4 bg-[#f97316] text-white rounded-2xl font-black uppercase">Log</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </ProtectedRoute>
    );
}
