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
  Users,
  User,
  Settings,
  Sparkles,
  Flame,
  Award,
} from 'lucide-react';
import { AppStorage } from '@/lib/storage';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Habits', href: '/habits', icon: CheckSquare },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Statistics', href: '/statistics', icon: BarChart3 },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { name: 'Friends & Groups', href: '/friends', icon: Users },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = React.useState(AppStorage.getUser());

  React.useEffect(() => {
    setUser(AppStorage.getUser());
  }, [pathname]);

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-slate-200 z-30">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-lg tracking-tight text-slate-900 block leading-none">
            Habit<span className="text-emerald-600">Forge</span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium tracking-wide">
            Daily Momentum
          </span>
        </div>
      </div>

      {/* Quick Streak & Points Badge */}
      <div className="mx-4 my-4 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500 text-white shadow-xs">
            <Flame className="w-4 h-4 fill-white" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Streak</div>
            <div className="text-sm font-bold text-slate-900">{user.current_streak} Days</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500 text-white shadow-xs">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Points</div>
            <div className="text-sm font-bold text-slate-900">{user.total_points}</div>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-emerald-600' : 'text-slate-400'
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User profile card at bottom */}
      <div className="p-4 border-t border-slate-100">
        <Link
          href="/profile"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user.full_name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user.full_name}</p>
            <p className="text-xs text-slate-500 truncate">@{user.username}</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
