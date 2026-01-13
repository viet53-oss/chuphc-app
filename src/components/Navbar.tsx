'use client';

import { useState } from 'react';
import { User, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar({ customTitle }: { customTitle?: string }) {
    const pathname = usePathname();
    const { user, isAdmin, setIsAdmin } = useAuth();
    const [showAdminPopup, setShowAdminPopup] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');

    const getPageTitle = () => {
        if (customTitle) return customTitle;
        const path = pathname.split('/').pop() || '';
        if (!path) return 'Health Dashboard';
        if (path === 'lifestyle-rx') return 'Lifestyle Prescription';
        if (path === 'login') return 'Sign In';
        if (path === 'signup') return 'Create Account';
        if (path === 'settings') return 'App Settings';
        return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
    };

    // Don't show header buttons on auth pages
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    const handleAdminClick = () => {
        if (isAdmin) {
            // If already admin, simply exit admin mode
            setIsAdmin(false);
        } else {
            // If not admin, show popup
            setShowAdminPopup(true);
            setAdminPassword('');
        }
    };

    const submitAdminPassword = () => {
        if (adminPassword === '123') {
            setIsAdmin(true);
            setShowAdminPopup(false);
            setAdminPassword('');
        } else {
            alert('Incorrect password');
        }
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-titles">
                    <h1 className="title-lg" style={{ color: '#2D5A27', fontWeight: 'bold' }}>Chu Precision Health Center</h1>
                    <h2 className="title-lg">{getPageTitle()}</h2>
                </div>

                {user && !isAuthPage && (
                    <div className="navbar-actions">

                        <button
                            onClick={handleAdminClick}
                            className="btn-logout"
                            title={isAdmin ? "Exit Admin Mode" : "Enter Admin Mode"}
                            style={{
                                padding: '10px',
                                ...(isAdmin ? { backgroundColor: '#d32f2f', color: 'white' } : {})
                            }}
                        >
                            Admin
                        </button>
                    </div>
                )}
            </nav>

            {/* Admin Password Popup */}
            {showAdminPopup && (
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
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '24px',
                        borderRadius: '12px',
                        width: '300px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontWeight: 'bold' }}>Admin Access</h3>
                            <button
                                onClick={() => setShowAdminPopup(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <input
                            type="password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            placeholder="Enter password"
                            style={{
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                fontSize: '14px'
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') submitAdminPassword();
                            }}
                            autoFocus
                        />
                        <button
                            onClick={submitAdminPassword}
                            style={{
                                backgroundColor: '#000000',
                                color: 'white',
                                border: 'none',
                                padding: '10px',
                                borderRadius: '9999px',
                                fontWeight: '700',
                                fontSize: '14pt',
                                cursor: 'pointer'
                            }}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
