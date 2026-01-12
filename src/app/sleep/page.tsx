'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Moon, Plus, X } from 'lucide-react';

export default function SleepPage() {
    const { user } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        sleep_start: '',
        sleep_end: '',
        quality: '5',
        notes: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            const { error } = await supabase.from('sleep_logs').insert([
                {
                    user_id: user.id,
                    sleep_start: new Date(formData.sleep_start).toISOString(),
                    sleep_end: new Date(formData.sleep_end).toISOString(),
                    quality: parseInt(formData.quality),
                    notes: formData.notes,
                },
            ]);

            if (error) throw error;

            setFormData({
                sleep_start: '',
                sleep_end: '',
                quality: '5',
                notes: '',
            });
            setShowForm(false);
            alert('Sleep log saved successfully!');
        } catch (error: any) {
            alert('Error logging sleep: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateDuration = () => {
        if (formData.sleep_start && formData.sleep_end) {
            const start = new Date(formData.sleep_start);
            const end = new Date(formData.sleep_end);
            const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            return hours > 0 ? hours.toFixed(1) : '0';
        }
        return '0';
    };

    return (
        <ProtectedRoute>
            <div className="flex flex-col gap-3 w-full animate-fade-in pb-20">
                <div className="app-section flex items-center justify-between !border-[#3b82f6] bg-[#3b82f6]/10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#3b82f6] rounded-lg flex items-center justify-center">
                            <Moon size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="title-md">Sleep Tracking</h2>
                            <p className="text-small opacity-60">Monitor your sleep</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="p-2 bg-[#3b82f6] text-white rounded-full hover:bg-[#3b82f6]/90 active:scale-95 transition-all"
                    >
                        {showForm ? <X size={20} /> : <Plus size={20} />}
                    </button>
                </div>

                {showForm && (
                    <div className="app-section !p-6">
                        <h3 className="title-md mb-4">Log Sleep</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-body font-bold mb-2">Bedtime *</label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={formData.sleep_start}
                                    onChange={(e) => setFormData({ ...formData, sleep_start: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                                />
                            </div>

                            <div>
                                <label className="block text-body font-bold mb-2">Wake Time *</label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={formData.sleep_end}
                                    onChange={(e) => setFormData({ ...formData, sleep_end: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                                />
                            </div>

                            {formData.sleep_start && formData.sleep_end && (
                                <div className="p-3 bg-[#3b82f6]/10 rounded-lg border-2 border-[#3b82f6]">
                                    <p className="text-small opacity-60">Total Sleep Duration</p>
                                    <p className="title-lg text-[#3b82f6]">{calculateDuration()} hours</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-body font-bold mb-2">
                                    Sleep Quality (1-10)
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={formData.quality}
                                    onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-small opacity-60 mt-1">
                                    <span>1 - Poor</span>
                                    <span className="font-bold text-[#3b82f6] text-body">{formData.quality}</span>
                                    <span>10 - Excellent</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-body font-bold mb-2">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="How did you sleep? Any interruptions?"
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#3b82f6] text-white py-3 rounded-lg font-bold text-body hover:bg-[#3b82f6]/90 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Log Sleep'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="app-section !p-6 bg-[#3b82f6]/5">
                    <h3 className="title-md mb-2">Better Sleep</h3>
                    <p className="text-body opacity-60 mb-4">
                        Quality sleep is essential for physical and mental health. Aim for 7-9 hours per night.
                    </p>
                    <div className="space-y-2">
                        <div className="p-3 bg-white rounded-lg border-2 border-black">
                            <p className="text-small opacity-60 mb-1">Sleep Tips:</p>
                            <ul className="text-small space-y-1">
                                <li>• Keep a consistent sleep schedule</li>
                                <li>• Avoid screens 1 hour before bed</li>
                                <li>• Keep your bedroom cool and dark</li>
                                <li>• Avoid caffeine after 2 PM</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
