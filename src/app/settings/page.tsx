'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Settings, Home, User, Bell, Shield, Info, Trash, Plus, Users, Pencil, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { colors, spacing, fontSize } from '@/lib/design-system';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { adminUpdateUserPassword, adminCreateUser } from './actions';

interface Member {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    phone?: string;
}

export default function SettingsPage() {
    const { isAdmin, signOut } = useAuth();
    const [members, setMembers] = useState<Member[]>([]);
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [newMemberPassword, setNewMemberPassword] = useState('');
    const [editingPassword, setEditingPassword] = useState('');
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (isAdmin) {
            fetchMembers();
        }
    }, [isAdmin]);

    const fetchMembers = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: false });
        if (data) {
            setMembers(data);
        } else if (error) {
            console.error('Error fetching members:', error);
            // Fallback to local storage if DB fails (optional, but good for prototype stability)
            const stored = localStorage.getItem('chuphc_members_v2');
            if (stored) setMembers(JSON.parse(stored));
        }
        setLoading(false);
    };

    const handleAddMember = async () => {
        setStatusMsg(null);
        if (!newMemberEmail.trim() || !newMemberPassword.trim()) {
            setStatusMsg({ type: 'error', text: 'Please provide both email and password.' });
            return;
        }

        // 1. Create Auth User (Server Action for Auto-Confirm)
        const { user: newUser, error: createError } = await adminCreateUser(newMemberEmail.trim(), newMemberPassword);

        if (createError) {
            setStatusMsg({ type: 'error', text: 'Failed to create account: ' + createError });
            return;
        }

        // 2. Add to Members Table
        const newMember = {
            id: newUser?.id, // Link to Auth ID
            email: newMemberEmail.trim(),
            created_at: new Date().toISOString()
        };

        const { data, error } = await supabase.from('members').insert([newMember]).select();

        if (error) {
            console.error('Error adding member to DB:', error);
            setStatusMsg({ type: 'error', text: 'Database Error (saving locally): ' + error.message });
            // Fallback local
            const localId = Date.now().toString();
            const localMember = { ...newMember, id: localId };
            const updated = [localMember, ...members];
            setMembers(updated);
            localStorage.setItem('chuphc_members_v2', JSON.stringify(updated));
        } else if (data) {
            setMembers([data[0], ...members]);
            setStatusMsg({ type: 'success', text: 'Client added successfully!' });
        }
        setNewMemberEmail('');
        setNewMemberPassword('');
    };

    const handleDeleteMember = async (id: string) => {
        if (!confirm('Delete this member?')) return;

        const { error } = await supabase.from('members').delete().eq('id', id);
        if (error) {
            console.error('Error deleting member:', error);
            // Fallback
            const updated = members.filter(m => m.id !== id);
            setMembers(updated);
            localStorage.setItem('chuphc_members_v2', JSON.stringify(updated));
        } else {
            setMembers(members.filter(m => m.id !== id));
        }
    };

    const handleUpdateMember = async (updated: Member) => {
        const { error } = await supabase.from('members').update({
            first_name: updated.first_name,
            last_name: updated.last_name,
            address: updated.address,
            city: updated.city,
            state: updated.state,
            zip: updated.zip,
            phone: updated.phone
        }).eq('id', updated.id);

        // Update Password if provided
        if (editingPassword && editingPassword.trim()) {
            const result = await adminUpdateUserPassword(updated.id, editingPassword.trim());
            if (result.error) {
                console.error('Password update error:', result.error);
                alert('Note: Password update failed (' + result.error + ')');
            }
        }

        if (error) {
            console.error('Error updating member:', error);
            // Fallback
            const newMembers = members.map(m => m.id === updated.id ? updated : m);
            setMembers(newMembers);
            localStorage.setItem('chuphc_members_v2', JSON.stringify(newMembers));
        } else {
            setMembers(members.map(m => m.id === updated.id ? updated : m));
        }
        setEditingMember(null);
    };

    const handleResetPassword = async (email: string) => {
        if (!confirm(`Send password reset email to ${email}?`)) return;
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) alert('Error sending reset link: ' + error.message);
        else alert('Password reset link sent!');
    };
    return (
        <ProtectedRoute>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxl, width: '100%', padding: spacing.xs }}>



                {/* Members Section (Admin Only) */}
                {isAdmin && (
                    <section style={{
                        border: '2px solid black',
                        borderRadius: '12px',
                        backgroundColor: colors.white,
                        padding: spacing.md,
                        margin: spacing.xs,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: spacing.md
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, borderBottom: '1px solid #eee', paddingBottom: spacing.sm }}>
                            <Users size={24} color={colors.primary} />
                            <h2 style={{ fontSize: fontSize.lg, fontWeight: 'bold', margin: 0 }}>Clients</h2>
                        </div>

                        {/* Add Member */}
                        <div style={{ display: 'flex', gap: spacing.sm }}>
                            <input
                                type="email"
                                placeholder="Client Email"
                                value={newMemberEmail}
                                onChange={(e) => setNewMemberEmail(e.target.value)}
                                autoComplete="off"
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    fontSize: fontSize.base
                                }}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={newMemberPassword}
                                onChange={(e) => setNewMemberPassword(e.target.value)}
                                autoComplete="new-password"
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    fontSize: fontSize.base
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleAddMember}
                                style={{
                                    backgroundColor: colors.green,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <Plus size={20} />
                                Add
                            </button>
                        </div>
                        {statusMsg && (
                            <div style={{
                                padding: '8px',
                                borderRadius: '4px',
                                backgroundColor: statusMsg.type === 'error' ? '#fee2e2' : '#dcfce7',
                                color: statusMsg.type === 'error' ? '#ef4444' : '#16a34a',
                                fontSize: fontSize.sm,
                                fontWeight: 'bold'
                            }}>
                                {statusMsg.text}
                            </div>
                        )}

                        {/* Edit Form Modal/Overlay */}
                        {editingMember && (
                            <div style={{
                                padding: spacing.md,
                                backgroundColor: '#f0f9ff',
                                borderRadius: '8px',
                                border: `1px solid ${colors.blue}`,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: spacing.sm
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0, fontWeight: 'bold' }}>Edit Client: {editingMember.email}</h3>
                                    <button onClick={() => setEditingMember(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm }}>
                                    <input placeholder="First Name" value={editingMember.first_name || ''} onChange={e => setEditingMember({ ...editingMember, first_name: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
                                    <input placeholder="Last Name" value={editingMember.last_name || ''} onChange={e => setEditingMember({ ...editingMember, last_name: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
                                    <input placeholder="Address" value={editingMember.address || ''} onChange={e => setEditingMember({ ...editingMember, address: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', gridColumn: 'span 2' }} />

                                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: spacing.sm, gridColumn: 'span 2' }}>
                                        <input placeholder="City" value={editingMember.city || ''} onChange={e => setEditingMember({ ...editingMember, city: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
                                        <input placeholder="State" value={editingMember.state || ''} onChange={e => setEditingMember({ ...editingMember, state: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
                                        <input placeholder="Zip" value={editingMember.zip || ''} onChange={e => setEditingMember({ ...editingMember, zip: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
                                    </div>

                                    <input placeholder="Phone" value={editingMember.phone || ''} onChange={e => setEditingMember({ ...editingMember, phone: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', gridColumn: 'span 2' }} />
                                    <input
                                        type="password"
                                        placeholder="New Password (leave blank to keep)"
                                        value={editingPassword}
                                        onChange={e => setEditingPassword(e.target.value)}
                                        autoComplete="new-password"
                                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', gridColumn: 'span 2' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: spacing.sm, marginTop: spacing.sm }}>
                                    <button onClick={() => handleUpdateMember(editingMember)} style={{ padding: '8px 16px', backgroundColor: colors.blue, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save Changes</button>
                                    <button onClick={() => handleResetPassword(editingMember.email)} style={{ padding: '8px 16px', backgroundColor: colors.orange, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reset Password</button>
                                </div>
                            </div>
                        )}

                        {/* Members List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                            {members.length === 0 ? (
                                <p style={{ color: colors.gray, fontStyle: 'italic', textAlign: 'center' }}>{loading ? 'Loading...' : 'No clients found.'}</p>
                            ) : (
                                members.map(member => (
                                    <div key={member.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '8px',
                                        backgroundColor: '#f9f9f9',
                                        borderRadius: '8px',
                                        border: '1px solid #eee'
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: fontSize.base, fontWeight: '500' }}>{member.email}</span>
                                            {(member.first_name || member.last_name) && (
                                                <span style={{ fontSize: fontSize.xs, color: colors.gray }}>{member.first_name} {member.last_name}</span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => { setEditingMember(member); setEditingPassword(''); }}
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: '4px'
                                                }}
                                                title="Edit"
                                            >
                                                <Pencil size={18} color={colors.blue} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteMember(member.id)}
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: '4px'
                                                }}
                                                title="Delete"
                                            >
                                                <Trash size={18} color={colors.red} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}

                {/* Settings Menu */}
                <section style={{
                    border: '2px solid black',
                    borderRadius: '12px',
                    backgroundColor: colors.white,
                    padding: spacing.md,
                    margin: spacing.xs,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.sm
                }}>

                    {/* Profile Item */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.md,
                        padding: spacing.md,
                        borderBottom: '1px solid #e5e7eb',
                        cursor: 'pointer'
                    }}>
                        <User size={24} color={colors.secondary} />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: fontSize.base, fontWeight: 'bold', margin: 0 }}>My Profile</h3>
                            <p style={{ fontSize: fontSize.sm, color: colors.gray, margin: 0 }}>Manage your personal information</p>
                        </div>
                    </div>

                    {/* Notifications Item */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.md,
                        padding: spacing.md,
                        borderBottom: '1px solid #e5e7eb',
                        cursor: 'pointer'
                    }}>
                        <Bell size={24} color={colors.secondary} />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: fontSize.base, fontWeight: 'bold', margin: 0 }}>Notifications</h3>
                            <p style={{ fontSize: fontSize.sm, color: colors.gray, margin: 0 }}>Configure alerts and reminders</p>
                        </div>
                    </div>

                    {/* Privacy Item */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.md,
                        padding: spacing.md,
                        borderBottom: '1px solid #e5e7eb',
                        cursor: 'pointer'
                    }}>
                        <Shield size={24} color={colors.secondary} />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: fontSize.base, fontWeight: 'bold', margin: 0 }}>Privacy & Security</h3>
                            <p style={{ fontSize: fontSize.sm, color: colors.gray, margin: 0 }}>Password and data settings</p>
                        </div>
                    </div>

                    {/* About Item */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.md,
                        padding: spacing.md,
                        cursor: 'pointer'
                    }}>
                        <Info size={24} color={colors.secondary} />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: fontSize.base, fontWeight: 'bold', margin: 0 }}>About</h3>
                            <p style={{ fontSize: fontSize.sm, color: colors.gray, margin: 0 }}>Version 1.0.0</p>
                        </div>
                    </div>

                </section>

                <div style={{ display: 'flex', gap: spacing.md, margin: spacing.xs }}>
                    {/* Logout Button */}
                    <button
                        onClick={signOut}
                        style={{
                            flex: 1,
                            padding: '12px 24px',
                            backgroundColor: colors.red || '#ef4444',
                            color: colors.white,
                            border: 'none',
                            borderRadius: '9999px',
                            fontSize: '12pt',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: spacing.sm,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}
                    >
                        <LogOut size={20} />
                        Logout
                    </button>

                    {/* Home Button */}
                    <Link href="/" style={{ textDecoration: 'none', flex: 1 }}>
                        <button style={{
                            width: '100%',
                            padding: '12px 24px',
                            backgroundColor: colors.black,
                            color: colors.white,
                            border: 'none',
                            borderRadius: '9999px',
                            fontSize: '12pt',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: spacing.sm,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}>
                            <Home size={20} />
                            Home
                        </button>
                    </Link>
                </div>

            </div>
        </ProtectedRoute >
    );
}
