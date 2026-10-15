'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BarChart3,
  Trophy,
  User,
} from 'lucide-react';

const MOBILE_ITEMS = [
  { name: 'Today', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Habits', href: '/habits', icon: CheckSquare },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Stats', href: '/statistics', icon: BarChart3 },
  { name: 'Rank', href: '/leaderboard', icon: Trophy },
  { name: 'Profile', href: '/profile', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950/85 backdrop-blur-2xl border-t border-white/10 z-40 px-2 py-1.5 safe-area-pb text-white">
      <div className="flex items-center justify-around">
        {MOBILE_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2.5 rounded-2xl text-[10px] font-medium transition-all ${
                isActive
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-white/10 text-emerald-400 border border-white/15 scale-105' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="mt-0.5 text-[9px]">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
