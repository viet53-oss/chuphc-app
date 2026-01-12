'use client';

import { Home, ClipboardList, Plus, BookOpen, Trophy } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { title: 'Home', icon: Home, href: '/' },
        { title: 'Logs', icon: ClipboardList, href: '/nutrition' },
        { title: 'Action', icon: Plus, href: '/activity', isFab: true },
        { title: 'Learn', icon: BookOpen, href: '#' },
        { title: 'Awards', icon: Trophy, href: '#' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6">
            <nav className="glass w-full max-w-md mx-6 flex items-center justify-between px-6 py-2 rounded-3xl shadow-nav">
                {navItems.map((item) => {
                    const isActive = pathname === item.href && !item.isFab;
                    const Icon = item.icon;

                    if (item.isFab) {
                        return (
                            <Link key={item.title} href={item.href} className="flex flex-col items-center">
                                <div className="btn-fab -mt-10">
                                    <Icon size={32} />
                                </div>
                                <span className="text-xs font-black uppercase text-primary mt-1 tracking-widest">{item.title}</span>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'opacity-100' : 'opacity-60'}`}
                        >
                            <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-black-5' : ''}`}>
                                <Icon size={22} className={isActive ? 'text-primary' : 'text-main'} />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-primary' : 'text-muted'}`}>
                                {item.title}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
