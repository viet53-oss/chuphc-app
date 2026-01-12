'use client';

import { User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar({ customTitle }: { customTitle?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const getPageTitle = () => {
    if (customTitle) return customTitle;
    const path = pathname.split('/').pop() || '';
    if (!path) return 'Health Dashboard';
    if (path === 'lifestyle-rx') return 'Lifestyle Prescription';
    if (path === 'login') return 'Sign In';
    if (path === 'signup') return 'Create Account';
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  };

  // Don't show header buttons on auth pages
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  const handleAdminClick = () => {
    const password = prompt('Enter Admin Password:');
    if (password === 'ujs') {
      router.push('/admin');
    } else if (password !== null) {
      alert('Incorrect password');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-titles">
        <h1 className="title-lg" style={{ color: '#2D5A27', fontWeight: 'bold' }}>Chu Precision Health Center</h1>
        <h2 className="title-lg">{getPageTitle()}</h2>
      </div>

      {user && !isAuthPage && (
        <div className="navbar-actions">
          {/* Email display removed as requested */}
          <button
            onClick={handleAdminClick}
            className="btn-logout"
            title="Admin Access"
          >
            Admin
          </button>
        </div>
      )}
    </nav>
  );
}
