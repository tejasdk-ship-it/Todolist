'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Plus, Bell, Flame } from 'lucide-react';
import { AppStorage } from '@/lib/storage';

interface NavbarProps {
  title?: string;
  subtitle?: string;
  onAddHabitClick?: () => void;
}

export function Navbar({ title, subtitle, onAddHabitClick }: NavbarProps) {
  const [user, setUser] = React.useState(AppStorage.getUser());

  React.useEffect(() => {
    setUser(AppStorage.getUser());
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Mobile brand / Desktop title */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900">
            Habit<span className="text-emerald-600">Forge</span>
          </span>
        </div>

        <div className="hidden lg:block">
          {title && <h1 className="text-xl font-bold text-slate-900 leading-tight">{title}</h1>}
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Streak on mobile */}
        <div className="lg:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
          <Flame className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
          <span>{user.current_streak}d</span>
        </div>

        {/* Quick Add Habit Button */}
        {onAddHabitClick && (
          <button
            onClick={onAddHabitClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Habit</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}

        {/* Profile Avatar */}
        <Link href="/profile" className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user.full_name}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-emerald-500/20 hover:ring-emerald-500/50 transition-all"
          />
        </Link>
      </div>
    </header>
  );
}
