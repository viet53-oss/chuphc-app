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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
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
        const { error } = await supabase.from('members').delete().eq('id', id);
        if (error) {
            console.error('Error deleting member:', error);
            // Fallback
            const updated = members.filter(m => m.id !== id);
            setMembers(updated);
            localStorage.setItem('chuphc_members_v2', JSON.stringify(updated));
            setStatusMsg({ type: 'error', text: 'Error deleting client from database.' });
        } else {
            setMembers(members.filter(m => m.id !== id));
            setStatusMsg({ type: 'success', text: 'Client deleted successfully.' });
        }
        setShowDeleteConfirm(false);
        setMemberToDelete(null);
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
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) setStatusMsg({ type: 'error', text: 'Error sending reset link: ' + error.message });
        else setStatusMsg({ type: 'success', text: 'Password reset link sent to ' + email });
    };
    return (
        <ProtectedRoute>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxl, width: '100%', padding: spacing.xs }}>





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
                                    backgroundColor: colors.black,
                                    color: colors.white,
                                    border: 'none',
                                    borderRadius: '9999px',
                                    padding: '10px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: spacing.sm,
                                    fontSize: '14pt',
                                    fontWeight: '700'
                                }}
                            >
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



                        {/* Members List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                            {members.length === 0 ? (
                                <p style={{ color: colors.gray, fontStyle: 'italic', textAlign: 'center' }}>{loading ? 'Loading...' : 'No clients found.'}</p>
                            ) : (
                                members.map(member => (
                                    <div key={member.id} style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: spacing.xs,
                                        padding: '12px',
                                        backgroundColor: '#f9f9f9',
                                        borderRadius: '12px',
                                        border: '1px solid #eee'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: fontSize.base, fontWeight: '700' }}>{member.email}</span>
                                                {(member.first_name || member.last_name) && (
                                                    <span style={{ fontSize: fontSize.sm, color: colors.gray }}>{member.first_name} {member.last_name}</span>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => { setEditingMember(member); setEditingPassword(''); }}
                                                    style={{
                                                        backgroundColor: colors.black,
                                                        color: colors.white,
                                                        border: 'none',
                                                        borderRadius: '9999px',
                                                        padding: '10px',
                                                        fontSize: '14pt',
                                                        fontWeight: '700',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setMemberToDelete(member.id);
                                                        setShowDeleteConfirm(true);
                                                    }}
                                                    style={{
                                                        backgroundColor: colors.black,
                                                        color: colors.white,
                                                        border: 'none',
                                                        borderRadius: '9999px',
                                                        padding: '10px',
                                                        fontSize: '14pt',
                                                        fontWeight: '700',
                                                        cursor: 'pointer'
                                                    }}
                                                    title="Delete"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        {editingMember?.id === member.id && (
                                            <div style={{
                                                marginTop: spacing.sm,
                                                padding: spacing.md,
                                                backgroundColor: '#f0f9ff',
                                                borderRadius: '8px',
                                                border: `1px solid ${colors.blue}`,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: spacing.sm
                                            }}>
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
                                                </div>
                                                <div style={{ display: 'flex', gap: spacing.sm, marginTop: spacing.sm }}>
                                                    <button onClick={() => handleUpdateMember(editingMember)} style={{ padding: '10px', backgroundColor: colors.blue, color: colors.white, border: 'none', borderRadius: '9999px', cursor: 'pointer', fontWeight: '700', fontSize: '14pt', transition: 'background-color 0.3s ease' }}>Save Changes</button>
                                                    <button onClick={() => setEditingMember(null)} style={{ padding: '10px', backgroundColor: colors.black, color: colors.white, border: 'none', borderRadius: '9999px', cursor: 'pointer', fontWeight: '700', fontSize: '14pt' }}>Cancel</button>
                                                    <button onClick={() => handleResetPassword(editingMember.email)} style={{ padding: '10px', backgroundColor: colors.black, color: colors.white, border: 'none', borderRadius: '9999px', cursor: 'pointer', fontSize: '14pt', fontWeight: '700', marginLeft: 'auto' }}>Send Reset Email</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}

                <div style={{ display: 'flex', gap: spacing.md, margin: spacing.xs }}>
                    {/* Logout Button */}
                    <button
                        onClick={signOut}
                        style={{
                            flex: 1,
                            padding: '10px',
                            backgroundColor: colors.black,
                            color: colors.white,
                            border: 'none',
                            borderRadius: '9999px',
                            fontSize: '14pt',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: spacing.sm,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}
                    >
                        Logout
                    </button>

                    {/* Home Button */}
                    <Link href="/" style={{ textDecoration: 'none', flex: 1 }}>
                        <button style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: colors.black,
                            color: colors.white,
                            border: 'none',
                            borderRadius: '9999px',
                            fontSize: '14pt',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: spacing.sm,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}>
                            Home
                        </button>
                    </Link>
                </div>

            </div>

            {/* Delete Confirmation Popup */}
            {showDeleteConfirm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        backgroundColor: colors.white,
                        padding: spacing.xl,
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: spacing.lg,
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h2 style={{ fontSize: '18pt', fontWeight: 'bold', margin: 0, textAlign: 'center' }}>Confirm Delete</h2>
                        <p style={{ textAlign: 'center', fontSize: '14pt', color: colors.gray }}>Are you sure you want to delete this client? This action cannot be undone.</p>
                        <div style={{ display: 'flex', gap: spacing.md }}>
                            <button
                                onClick={() => memberToDelete && handleDeleteMember(memberToDelete)}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    backgroundColor: colors.red || '#ef4444',
                                    color: colors.white,
                                    border: 'none',
                                    borderRadius: '9999px',
                                    fontSize: '14pt',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                }}
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setMemberToDelete(null);
                                }}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    backgroundColor: colors.black,
                                    color: colors.white,
                                    border: 'none',
                                    borderRadius: '9999px',
                                    fontSize: '14pt',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ProtectedRoute >
    );
}
