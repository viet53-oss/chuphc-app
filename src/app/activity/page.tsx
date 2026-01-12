'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Dumbbell, Plus, X } from 'lucide-react';

export default function ActivityPage() {
    const { user } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
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
            setShowForm(false);
            alert('Activity logged successfully!');
        } catch (error: any) {
            alert('Error logging activity: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="flex flex-col gap-3 w-full animate-fade-in pb-20">
                <div className="app-section flex items-center justify-between !border-[#f59e0b] bg-[#f59e0b]/10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#f59e0b] rounded-lg flex items-center justify-center">
                            <Dumbbell size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="title-md">Physical Activity</h2>
                            <p className="text-small opacity-60">Track your workouts</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="p-2 bg-[#f59e0b] text-white rounded-full hover:bg-[#f59e0b]/90 active:scale-95 transition-all"
                    >
                        {showForm ? <X size={20} /> : <Plus size={20} />}
                    </button>
                </div>

                {showForm && (
                    <div className="app-section !p-6">
                        <h3 className="title-md mb-4">Log Activity</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-body font-bold mb-2">Activity Type *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.activity_type}
                                    onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
                                    placeholder="e.g., Running, Cycling, Yoga"
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-body font-bold mb-2">Duration (min) *</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.duration_minutes}
                                        onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                                        placeholder="30"
                                        className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-body font-bold mb-2">Intensity</label>
                                    <select
                                        value={formData.intensity}
                                        onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                                    >
                                        <option value="low">Low</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-body font-bold mb-2">Calories Burned</label>
                                    <input
                                        type="number"
                                        value={formData.calories_burned}
                                        onChange={(e) => setFormData({ ...formData, calories_burned: e.target.value })}
                                        placeholder="250"
                                        className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-body font-bold mb-2">Distance (miles)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.distance}
                                        onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                                        placeholder="3.5"
                                        className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-body font-bold mb-2">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="How did you feel?"
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#f59e0b] text-white py-3 rounded-lg font-bold text-body hover:bg-[#f59e0b]/90 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Logging...' : 'Log Activity'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="app-section !p-6 bg-[#f59e0b]/5">
                    <h3 className="title-md mb-2">Stay Active</h3>
                    <p className="text-body opacity-60 mb-4">
                        Regular physical activity is essential for maintaining good health. Aim for at least 150 minutes of moderate activity per week.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white rounded-lg border-2 border-black">
                            <p className="text-small opacity-60">This Week</p>
                            <p className="title-md text-[#f59e0b]">0 min</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border-2 border-black">
                            <p className="text-small opacity-60">Activities</p>
                            <p className="title-md text-[#f59e0b]">0</p>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
