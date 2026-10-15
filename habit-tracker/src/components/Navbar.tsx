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
    <header className="sticky top-0 z-20 bg-slate-950/70 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between text-white">
      {/* Mobile brand / Desktop title */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden flex items-center gap-2">
          <div className="h-8 w-8 rounded-full border border-white/30 flex items-center justify-center bg-white/10 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-white">
            Habit<span className="text-emerald-400 font-light">Depth</span>
          </span>
        </div>

        <div className="hidden lg:block">
          {title && <h1 className="text-lg font-bold text-white tracking-tight leading-tight">{title}</h1>}
          {subtitle && <p className="text-xs text-slate-400 font-light">{subtitle}</p>}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Streak on mobile */}
        <div className="lg:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-semibold border border-white/15">
          <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{user.current_streak}d</span>
        </div>

        {/* Quick Add Habit Button */}
        {onAddHabitClick && (
          <button
            onClick={onAddHabitClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-slate-950 hover:bg-emerald-50 text-xs sm:text-xs font-bold rounded-full shadow-lg transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Habit</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}

        {/* Profile Avatar */}
        <Link href="/profile" className="relative group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user.full_name}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-emerald-400/30 group-hover:ring-emerald-400/80 transition-all"
          />
        </Link>
      </div>
    </header>
  );
}
