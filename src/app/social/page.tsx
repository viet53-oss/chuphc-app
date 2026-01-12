'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Users, Plus, X, Heart, MessageCircle, UserPlus, Share2 } from 'lucide-react';

export default function SocialPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <ProtectedRoute>
            <div className="flex flex-col gap-4 w-full animate-fade-in pb-24">

                {/* Dashboard Summary Card */}
                <section className="app-section bg-gradient-to-br from-[#ef4444] to-[#b91c1c] !border-none text-white p-6 shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <Users size={20} />
                            <span className="text-small font-bold uppercase tracking-widest opacity-80">Social Connection</span>
                        </div>
                        <h2 className="text-[28pt] font-black leading-tight mb-4">Support Network</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                <p className="text-[10pt] font-bold opacity-80 uppercase leading-none mb-1">Circle</p>
                                <p className="text-[18pt] font-black">12 Active</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                <p className="text-[10pt] font-bold opacity-80 uppercase leading-none mb-1">Impact</p>
                                <p className="text-[18pt] font-black">HIGH</p>
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
                            <div className="w-12 h-12 bg-[#ef4444] rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                                <UserPlus size={28} className="text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-[15pt] font-black uppercase tracking-tight">Log Connection</h3>
                                <p className="text-[10pt] opacity-60 font-bold uppercase tracking-wider">Record social activity</p>
                            </div>
                        </div>
                        <Share2 className="text-[#ef4444]" />
                    </button>
                </div>

                {/* Recent Activities */}
                <div className="flex flex-col gap-3 px-1">
                    <h4 className="text-[12pt] font-black uppercase text-gray-400 tracking-widest px-1">Recent Interactions</h4>
                    <div className="app-section flex items-center justify-between !p-5 !border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-50 text-[#ef4444] rounded-xl"><Heart size={24} /></div>
                            <div>
                                <p className="text-[12pt] font-black uppercase">Family Dinner</p>
                                <p className="text-[10pt] opacity-50 font-bold uppercase">Yesterday • Meaningful</p>
                            </div>
                        </div>
                        <MessageCircle size={20} className="text-gray-300" />
                    </div>
                </div>

                {/* MODAL POPUP - LOG SOCIAL */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in transition-all">
                        <div className="bg-white w-full sm:max-w-lg h-[80vh] sm:h-auto rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">

                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                                <h2 className="text-[20pt] font-black uppercase tracking-tighter">Social Log</h2>
                                <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 overflow-y-auto">
                                <p className="text-center opacity-50 py-10 font-bold uppercase">Form placeholder for social tracking</p>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t grid grid-cols-2 gap-4 bg-white">
                                <button onClick={() => setIsModalOpen(false)} className="py-4 bg-gray-100 rounded-2xl font-black uppercase">Cancel</button>
                                <button onClick={() => setIsModalOpen(false)} className="py-4 bg-[#ef4444] text-white rounded-2xl font-black uppercase">Save</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </ProtectedRoute>
    );
}
