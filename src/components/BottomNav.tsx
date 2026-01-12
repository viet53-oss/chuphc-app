'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
    const pathname = usePathname();

    // Only show on pages other than the Home page
    if (pathname === '/') return null;

    return (
        <div className="w-full flex justify-between px-1 mt-8 mb-10">
            <Link href="/" className="btn-logout">
                HOME
            </Link>
            <Link href="/" className="btn-logout">
                HOME
            </Link>
        </div>
    );
}
