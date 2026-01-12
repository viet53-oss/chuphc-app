'use client';

import { User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const getPageTitle = () => {
    const path = pathname.split('/').pop() || '';
    if (!path) return 'Health Dashboard';
    if (path === 'lifestyle-rx') return 'Lifestyle Prescription';
    if (path === 'login') return 'Sign In';
    if (path === 'signup') return 'Create Account';
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  };

  // Don't show logout on auth pages
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <nav className="navbar">
      <div className="navbar-titles">
        <h1 className="title-lg" style={{ color: '#2D5A27', fontWeight: 'bold' }}>Chu Precision Health Center</h1>
        <h2 className="title-lg">{getPageTitle()}</h2>
      </div>

      {user && !isAuthPage && (
        <div className="navbar-actions">
          <div className="user-badge">
            <User size={16} className="text-primary" />
            <span className="text-small text-primary">{user.email}</span>
          </div>
          <button
            onClick={signOut}
            className="btn-logout"
            title="Sign out"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
