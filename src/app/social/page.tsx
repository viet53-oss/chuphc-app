'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Users, Plus, X } from 'lucide-react';

export default function SocialPage() {
    const { user } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        activity_type: '',
        duration_minutes: '',
        satisfaction_level: '5',
        notes: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            const { error } = await supabase.from('social_logs').insert([
                {
                    user_id: user.id,
                    activity_type: formData.activity_type,
                    duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
                    satisfaction_level: parseInt(formData.satisfaction_level),
                    notes: formData.notes,
                },
            ]);

            if (error) throw error;

            setFormData({
                activity_type: '',
                duration_minutes: '',
                satisfaction_level: '5',
                notes: '',
            });
            setShowForm(false);
            alert('Social activity logged successfully!');
        } catch (error: any) {
            alert('Error logging activity: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="flex flex-col gap-3 w-full animate-fade-in pb-20">
                <div className="app-section flex items-center justify-between !border-[#ef4444] bg-[#ef4444]/10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#ef4444] rounded-lg flex items-center justify-center">
                            <Users size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="title-md">Social Connection</h2>
                            <p className="text-small opacity-60">Track social activities</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="p-2 bg-[#ef4444] text-white rounded-full hover:bg-[#ef4444]/90 active:scale-95 transition-all"
                    >
                        {showForm ? <X size={20} /> : <Plus size={20} />}
                    </button>
                </div>

                {showForm && (
                    <div className="app-section !p-6">
                        <h3 className="title-md mb-4">Log Social Activity</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-body font-bold mb-2">Activity Type *</label>
                                <select
                                    required
                                    value={formData.activity_type}
                                    onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[#ef4444]"
                                >
                                    <option value="">Select activity</option>
                                    <option value="family time">Family Time</option>
                                    <option value="friends">Time with Friends</option>
                                    <option value="community">Community Event</option>
                                    <option value="support group">Support Group</option>
                                    <option value="volunteering">Volunteering</option>
                                    <option value="phone call">Phone Call</option>
                                    <option value="video call">Video Call</option>
                                    <option value="social gathering">Social Gathering</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-body font-bold mb-2">Duration (minutes)</label>
                                <input
                                    type="number"
                                    value={formData.duration_minutes}
                                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                                    placeholder="60"
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[#ef4444]"
                                />
                            </div>

                            <div>
                                <label className="block text-body font-bold mb-2">
                                    Satisfaction Level (1-10)
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={formData.satisfaction_level}
                                    onChange={(e) => setFormData({ ...formData, satisfaction_level: e.target.value })}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-small opacity-60 mt-1">
                                    <span>1 - Not Satisfying</span>
                                    <span className="font-bold text-[#ef4444] text-body">{formData.satisfaction_level}</span>
                                    <span>10 - Very Satisfying</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-body font-bold mb-2">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Who did you spend time with? What did you do?"
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[#ef4444]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#ef4444] text-white py-3 rounded-lg font-bold text-body hover:bg-[#ef4444]/90 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Log Social Activity'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="app-section !p-6 bg-[#ef4444]/5">
                    <h3 className="title-md mb-2">Stay Connected</h3>
                    <p className="text-body opacity-60 mb-4">
                        Strong social connections are vital for mental and emotional well-being. Regular social interaction can reduce stress and improve overall health.
                    </p>
                    <div className="space-y-2">
                        <div className="p-3 bg-white rounded-lg border-2 border-black">
                            <p className="text-small opacity-60 mb-1">Connection Ideas:</p>
                            <ul className="text-small space-y-1">
                                <li>• Call a friend or family member</li>
                                <li>• Join a community group or club</li>
                                <li>• Volunteer for a cause you care about</li>
                                <li>• Attend social events or gatherings</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
