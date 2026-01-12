'use client';

import { LogOut, User } from 'lucide-react';
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
    <nav className="flex flex-col items-center justify-center w-full px-4 py-4 bg-white border-b border-black relative">
      <h1 className="title-lg text-center opacity-40">Chu Precision Health Center</h1>
      <h2 className="title-lg text-center">{getPageTitle()}</h2>

      {user && !isAuthPage && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-primary-tint rounded-full">
            <User size={16} className="text-primary" />
            <span className="text-small text-primary">{user.email}</span>
          </div>
          <button
            onClick={signOut}
            className="p-2 hover:bg-red-50 rounded-full transition-colors group"
            title="Sign out"
          >
            <LogOut size={20} className="text-black/40 group-hover:text-red-500" />
          </button>
        </div>
      )}
    </nav>
  );
}
