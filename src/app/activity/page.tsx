'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Dumbbell, Plus, X, Zap, Target, TrendingUp, Clock, History } from 'lucide-react';

export default function ActivityPage() {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        activity_type: '',
        duration_minutes: '',
        intensity: 'moderate',
        calories_burned: '',
        distance: '',
        notes: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!formData.activity_type || !formData.duration_minutes) {
            alert("Please fill in required fields");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.from('activity_logs').insert([
                {
                    user_id: user.id,
                    activity_type: formData.activity_type,
                    duration_minutes: parseInt(formData.duration_minutes),
                    intensity: formData.intensity,
                    calories_burned: formData.calories_burned ? parseInt(formData.calories_burned) : null,
                    distance: formData.distance ? parseFloat(formData.distance) : null,
                    notes: formData.notes,
                },
            ]);

            if (error) throw error;

            setFormData({
                activity_type: '',
                duration_minutes: '',
                intensity: 'moderate',
                calories_burned: '',
                distance: '',
                notes: '',
            });
            setIsModalOpen(false);
            alert('Success! Activity recorded.');
        } catch (error: any) {
            console.error(error);
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="flex flex-col gap-4 w-full animate-fade-in pb-24">

                {/* Dashboard Summary Card */}
                <section className="app-section bg-gradient-to-br from-[#f59e0b] to-[#d97706] !border-none text-white p-6 shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <Dumbbell size={20} />
                            <span className="text-small font-bold uppercase tracking-widest opacity-80">Activity Summary</span>
                        </div>
                        <h2 className="text-[28pt] font-black leading-tight mb-4">Strength & Motion</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                <p className="text-[10pt] font-bold opacity-80 uppercase leading-none mb-1">Weekly Min</p>
                                <p className="text-[18pt] font-black">120 / 150</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                <p className="text-[10pt] font-bold opacity-80 uppercase leading-none mb-1">Workouts</p>
                                <p className="text-[18pt] font-black">4</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-[-20%] right-[-10%] opacity-10 rotate-12">
                        <Dumbbell size={200} />
                    </div>
                </section>

                {/* Main Action Area */}
                <div className="px-1">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-black text-white p-6 rounded-[2rem] flex items-center justify-between shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#f59e0b] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                                <Plus size={28} className="text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-[15pt] font-black uppercase tracking-tight">Log Movement</h3>
                                <p className="text-[10pt] opacity-60 font-bold uppercase tracking-wider">Record your performance</p>
                            </div>
                        </div>
                        <TrendingUp className="text-[#f59e0b]" />
                    </button>
                </div>

                {/* Status Widgets */}
                <div className="grid grid-cols-2 gap-3 px-1">
                    <div className="app-section !p-4 bg-primary-tint border-2 border-black">
                        <div className="flex items-center gap-2 mb-2">
                            <Target size={16} className="text-primary" />
                            <span className="text-[9pt] font-black uppercase tracking-widest opacity-50">Goal Status</span>
                        </div>
                        <p className="text-[14pt] font-black uppercase">ON TRACK</p>
                    </div>
                    <div className="app-section !p-4 bg-primary-tint border-2 border-black">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap size={16} className="text-[#f59e0b]" />
                            <span className="text-[9pt] font-black uppercase tracking-widest opacity-50">Intensity</span>
                        </div>
                        <p className="text-[14pt] font-black uppercase">MODERATE</p>
                    </div>
                </div>

                {/* History Timeline placeholder */}
                <div className="flex flex-col gap-3 px-1">
                    <h4 className="text-[12pt] font-black uppercase text-gray-400 tracking-widest px-1">Recent Sessions</h4>
                    <div className="app-section flex items-center justify-between !p-5 !border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-50 text-[#f59e0b] rounded-xl"><Dumbbell size={24} /></div>
                            <div>
                                <p className="text-[12pt] font-black uppercase">Running</p>
                                <p className="text-[10pt] opacity-50 font-bold">Yesterday • 45 min</p>
                            </div>
                        </div>
                        <History size={20} className="text-gray-300" />
                    </div>
                </div>

                {/* MODAL POPUP - LOG ACTIVITY */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in transition-all">
                        <div className="bg-white w-full sm:max-w-lg h-[80vh] sm:h-auto rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">

                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                                <div>
                                    <h2 className="text-[20pt] font-black uppercase tracking-tighter">Log Activity</h2>
                                    <p className="text-[10pt] font-bold text-gray-400 uppercase tracking-widest">Performance Record</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Content - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-10">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10pt] font-black uppercase text-gray-400 ml-1">Type of Activity*</label>
                                        <input
                                            type="text"
                                            value={formData.activity_type}
                                            onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
                                            placeholder="e.g. Running, Yoga, Gym"
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-[#f59e0b] rounded-2xl p-4 text-[12pt] font-bold outline-none transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10pt] font-black uppercase text-gray-400 ml-1">Duration (min)*</label>
                                            <input
                                                type="number"
                                                value={formData.duration_minutes}
                                                onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                                                placeholder="30"
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-[#f59e0b] rounded-2xl p-4 text-[12pt] font-bold outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10pt] font-black uppercase text-gray-400 ml-1">Intensity</label>
                                            <select
                                                value={formData.intensity}
                                                onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-[#f59e0b] rounded-2xl p-4 text-[12pt] font-bold outline-none transition-all"
                                            >
                                                <option value="low">Low</option>
                                                <option value="moderate">Moderate</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10pt] font-black uppercase text-gray-400 ml-1">Notes / Achievements</label>
                                        <textarea
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            placeholder="How did you feel?"
                                            rows={3}
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-[#f59e0b] rounded-2xl p-4 text-[12pt] font-bold outline-none transition-all"
                                        />
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
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="py-4 bg-[#f59e0b] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-100 disabled:opacity-50"
                                >
                                    {loading ? 'Logging...' : 'Save Activity'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </ProtectedRoute>
    );
}
