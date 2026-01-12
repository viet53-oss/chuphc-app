'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Zap, Plus, X } from 'lucide-react';

export default function StressPage() {
    const { user } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        stress_level: '5',
        activity: '',
        duration_minutes: '',
        notes: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            const { error } = await supabase.from('stress_logs').insert([
                {
                    user_id: user.id,
                    stress_level: parseInt(formData.stress_level),
                    activity: formData.activity || null,
                    duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
                    notes: formData.notes,
                },
            ]);

            if (error) throw error;

            setFormData({
                stress_level: '5',
                activity: '',
                duration_minutes: '',
                notes: '',
            });
            setShowForm(false);
            alert('Stress log saved successfully!');
        } catch (error: any) {
            alert('Error logging stress: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="flex flex-col gap-3 w-full animate-fade-in pb-20">
                <div className="app-section flex items-center justify-between !border-[#14b8a6] bg-[#14b8a6]/10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#14b8a6] rounded-lg flex items-center justify-center">
                            <Zap size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="title-md">Stress Management</h2>
                            <p className="text-small opacity-60">Track your stress levels</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="p-2 bg-[#14b8a6] text-white rounded-full hover:bg-[#14b8a6]/90 active:scale-95 transition-all"
                    >
                        {showForm ? <X size={20} /> : <Plus size={20} />}
                    </button>
                </div>

                {showForm && (
                    <div className="app-section !p-6">
                        <h3 className="title-md mb-4">Log Stress Level</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-body font-bold mb-2">
                                    Stress Level (1-10) *
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={formData.stress_level}
                                    onChange={(e) => setFormData({ ...formData, stress_level: e.target.value })}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-small opacity-60 mt-1">
                                    <span>1 - Very Low</span>
                                    <span className="font-bold text-[#14b8a6] text-body">{formData.stress_level}</span>
                                    <span>10 - Very High</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-body font-bold mb-2">Management Activity</label>
                                <select
                                    value={formData.activity}
                                    onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
                                >
                                    <option value="">Select activity (optional)</option>
                                    <option value="meditation">Meditation</option>
                                    <option value="breathing">Breathing Exercises</option>
                                    <option value="yoga">Yoga</option>
                                    <option value="therapy">Therapy</option>
                                    <option value="journaling">Journaling</option>
                                    <option value="walk">Walk</option>
                                    <option value="music">Music</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {formData.activity && (
                                <div>
                                    <label className="block text-body font-bold mb-2">Duration (minutes)</label>
                                    <input
                                        type="number"
                                        value={formData.duration_minutes}
                                        onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                                        placeholder="15"
                                        className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-body font-bold mb-2">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="What's causing stress? How do you feel?"
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#14b8a6] text-white py-3 rounded-lg font-bold text-body hover:bg-[#14b8a6]/90 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Log Stress Level'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="app-section !p-6 bg-[#14b8a6]/5">
                    <h3 className="title-md mb-2">Manage Your Stress</h3>
                    <p className="text-body opacity-60 mb-4">
                        Regular stress management is crucial for your overall health. Track your stress levels and the activities that help you relax.
                    </p>
                    <div className="space-y-2">
                        <div className="p-3 bg-white rounded-lg border-2 border-black">
                            <p className="text-small opacity-60 mb-1">Quick Tips:</p>
                            <ul className="text-small space-y-1">
                                <li>• Practice deep breathing for 5 minutes</li>
                                <li>• Take a short walk outside</li>
                                <li>• Listen to calming music</li>
                                <li>• Connect with a friend</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
