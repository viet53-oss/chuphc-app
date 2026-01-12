'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { User, Mail, Phone, Calendar, Award, TrendingUp } from 'lucide-react';
import type { Profile } from '@/types/database';

export default function ProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        date_of_birth: '',
    });

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            setProfile(data);
            setFormData({
                full_name: data.full_name || '',
                phone: data.phone || '',
                date_of_birth: data.date_of_birth || '',
            });
        } catch (error: any) {
            console.error('Error fetching profile:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone,
                    date_of_birth: formData.date_of_birth || null,
                })
                .eq('id', user.id);

            if (error) throw error;

            alert('Profile updated successfully!');
            fetchProfile();
        } catch (error: any) {
            alert('Error updating profile: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-body opacity-60">Loading profile...</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="flex flex-col gap-3 w-full animate-fade-in pb-20">
                {/* Profile Header */}
                <div className="app-section !p-6 bg-primary-tint">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                            <User size={40} className="text-white" />
                        </div>
                        <div>
                            <h2 className="title-lg">{profile?.full_name || 'User'}</h2>
                            <p className="text-body opacity-60">{user?.email}</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-white rounded-lg border-2 border-black text-center">
                            <TrendingUp size={20} className="text-primary mx-auto mb-1" />
                            <p className="title-md text-primary">{profile?.precision_score || 0}</p>
                            <p className="text-small opacity-60">Score</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border-2 border-black text-center">
                            <Award size={20} className="text-primary mx-auto mb-1" />
                            <p className="title-md text-primary">{profile?.achievement_points || 0}</p>
                            <p className="text-small opacity-60">Points</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border-2 border-black text-center">
                            <p className="title-sm text-primary">{profile?.tier || 'Beginner'}</p>
                            <p className="text-small opacity-60">Tier</p>
                        </div>
                    </div>
                </div>

                {/* Edit Profile Form */}
                <div className="app-section !p-6">
                    <h3 className="title-md mb-4">Edit Profile</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-body font-bold mb-2">
                                <div className="flex items-center gap-2">
                                    <User size={16} />
                                    Full Name
                                </div>
                            </label>
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-body font-bold mb-2">
                                <div className="flex items-center gap-2">
                                    <Mail size={16} />
                                    Email
                                </div>
                            </label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full px-4 py-3 border-2 border-black/20 rounded-lg text-body bg-black/5 opacity-60"
                            />
                            <p className="text-small opacity-40 mt-1">Email cannot be changed</p>
                        </div>

                        <div>
                            <label className="block text-body font-bold mb-2">
                                <div className="flex items-center gap-2">
                                    <Phone size={16} />
                                    Phone
                                </div>
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="(555) 123-4567"
                                className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-body font-bold mb-2">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    Date of Birth
                                </div>
                            </label>
                            <input
                                type="date"
                                value={formData.date_of_birth}
                                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-primary text-white py-3 rounded-lg font-bold text-body hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    );
}
