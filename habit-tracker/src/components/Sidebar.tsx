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
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-950/85 backdrop-blur-2xl border-r border-white/10 z-30 text-white">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10 gap-3">
        <div className="h-9 w-9 rounded-full border border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-md text-emerald-400 shadow-lg shadow-emerald-950/50">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <div>
          <span className="font-extrabold text-lg tracking-tight text-white block leading-none">
            Habit<span className="text-emerald-400 font-light">Depth</span>
          </span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
            Atmospheric Habit Tracker
          </span>
        </div>
      </div>

      {/* Quick Streak & Points Badge */}
      <div className="mx-4 my-4 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Flame className="w-4 h-4 fill-amber-400" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Streak</div>
            <div className="text-xs font-extrabold text-white">{user.current_streak} Days</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Points</div>
            <div className="text-xs font-extrabold text-emerald-400">{user.total_points}</div>
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
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-medium text-xs transition-all duration-200 ${
                isActive
                  ? 'bg-white/10 text-white font-bold border border-white/20 shadow-lg shadow-black/20 text-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-emerald-400' : 'text-slate-400'
                }`}
              />
              <span className={isActive ? 'text-white' : ''}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User profile card at bottom */}
      <div className="p-4 border-t border-white/10 bg-slate-950/50">
        <Link
          href="/profile"
          className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user.full_name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-400/40"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user.full_name}</p>
            <p className="text-[11px] text-slate-400 truncate">@{user.username}</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
