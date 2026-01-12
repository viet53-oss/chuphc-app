'use client';

import { Award, Star, Gift, ChevronRight, Trophy, Zap } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const ACHIEVEMENTS = [
    { title: '7 Day Streak', description: 'Log nutrition for a week', points: '+250', icon: Zap, color: '#f59e0b' },
    { title: 'Protein Pro', description: 'Hit protein target 3 days', points: '+150', icon: Star, color: '#10b981' },
    { title: 'Early Bird', description: 'Logged breakfast before 8AM', points: '+100', icon: Trophy, color: '#3b82f6' },
];

export default function RewardsPage() {
    return (
        <ProtectedRoute>
            <div className="flex flex-col gap-4 w-full animate-fade-in pb-24">

                {/* Header Card */}
                <section className="app-section bg-gradient-to-br from-[#10b981] to-[#059669] !border-none text-white p-6 shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <Award size={20} />
                            <span className="text-small font-bold uppercase tracking-widest opacity-80">Achievement Store</span>
                        </div>
                        <h2 className="text-[28pt] font-black leading-tight mb-4">Your Rewards</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md text-center">
                                <p className="text-[10pt] font-bold opacity-80 uppercase leading-none mb-1">Total Points</p>
                                <p className="text-[20pt] font-black">1,240</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md text-center">
                                <p className="text-[10pt] font-bold opacity-80 uppercase leading-none mb-1">Tier</p>
                                <p className="text-[20pt] font-black">ELITE</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-[-20%] right-[-10%] opacity-10 rotate-12">
                        <Award size={200} />
                    </div>
                </section>

                {/* Progress Bar */}
                <div className="app-section !p-6 bg-primary-tint border-2 border-black">
                    <div className="flex justify-between items-end mb-2">
                        <h3 className="text-[12pt] font-black uppercase text-gray-400 tracking-widest leading-none">Next Level</h3>
                        <span className="text-[12pt] font-black uppercase">1,240 / 1,500</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '82%' }}></div>
                    </div>
                </div>

                {/* Recent Achievements */}
                <div className="flex flex-col gap-3">
                    <h4 className="text-[12pt] font-black uppercase text-gray-400 tracking-widest px-1">Recent Achievements</h4>
                    {ACHIEVEMENTS.map((a) => (
                        <div key={a.title} className="app-section flex items-center justify-between !p-5 !border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl" style={{ color: a.color }}>
                                    <a.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-[13pt] font-black uppercase leading-tight">{a.title}</p>
                                    <p className="text-[10pt] font-bold opacity-40 uppercase tracking-tight">{a.description}</p>
                                </div>
                            </div>
                            <span className="text-[12pt] font-black text-primary font-outfit">{a.points}</span>
                        </div>
                    ))}
                </div>

                {/* Redeem Section */}
                <div className="app-section !p-6 flex items-center justify-between border-2 border-black bg-black text-white hover:scale-[1.02] transition-all">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-xl text-[#f59e0b]">
                            <Gift size={24} />
                        </div>
                        <div>
                            <h3 className="text-[15pt] font-black uppercase tracking-tight leading-none">Redeem Points</h3>
                            <p className="text-[10pt] opacity-60 font-bold uppercase tracking-wider">Unlock premium features</p>
                        </div>
                    </div>
                    <ChevronRight className="opacity-40" />
                </div>

            </div>
        </ProtectedRoute>
    );
}
