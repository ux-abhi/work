'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@/types';

interface Props {
  user: User | null;
}

export function DashboardNav({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const navItems = [
    { href: '/dashboard', label: 'Links' },
    { href: '/dashboard/analytics', label: 'Analytics' },
    { href: '/dashboard/qr', label: 'QR Code' },
    { href: '/dashboard/wallet', label: 'Wallet' },
    { href: '/dashboard/settings', label: 'Settings' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-xl font-bold text-white">
            LinkCard
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-zinc-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <Link
              href={`/${user.username}`}
              target="_blank"
              className="text-sm text-gray-400 hover:text-white"
            >
              View Profile
            </Link>
          )}
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-400 hover:text-white"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <nav className="flex md:hidden overflow-x-auto border-t border-zinc-800 px-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-shrink-0 px-4 py-3 text-sm ${
              pathname === item.href
                ? 'border-b-2 border-white text-white'
                : 'text-gray-400'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
