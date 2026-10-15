'use client';

import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Crown,
  Medal,
  Flame,
  Award,
  Sparkles,
  Users,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { AppStorage } from '@/lib/storage';
import { LeaderboardEntry } from '@/types';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { Navbar } from '@/components/Navbar';

export default function LeaderboardPage() {
  const [tab, setTab] = useState<'today' | 'week' | 'month' | 'all'>('today');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setEntries(AppStorage.getLeaderboard());
  }, []);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-lg ring-2 ring-amber-300">
          <Crown className="w-4 h-4 fill-slate-950" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-950 flex items-center justify-center font-black text-sm shadow-md ring-2 ring-slate-100">
          2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-sm shadow-md ring-2 ring-amber-500">
          3
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 text-slate-400 flex items-center justify-center font-bold text-xs">
        {rank}
      </div>
    );
  };

  const getStatusBadge = (status: LeaderboardEntry['statusTag']) => {
    switch (status) {
      case 'Leading the Board':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow-sm">
            <Crown className="w-3 h-3 text-amber-400" /> Leading
          </span>
        );
      case 'Perfect Day':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-emerald-400" /> Perfect Day
          </span>
        );
      case 'On Track':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-sm">
            On Track
          </span>
        );
      case 'Needs a Push':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm">
            Needs a Push
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row pb-20 lg:pb-0">
      <Sidebar />

      <div className="flex-1 lg:pl-64 flex flex-col">
        <Navbar title="Who's Winning Today?" subtitle="Community leaderboard & friendly competition" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Top Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-emerald-950/90 border border-white/15 p-6 sm:p-8 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden backdrop-blur-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-2 text-center sm:text-left relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md border border-white/10">
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>Global Consistency Standings</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Who&apos;s Winning Today?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                Rankings are scored fairly by points, completion consistency, and streak momentum.
                Private habit notes and emails are kept secure.
              </p>
            </div>

            {/* Top Leader Pod */}
            {entries[0] && (
              <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/15 flex items-center gap-4 min-w-[240px] relative z-10 shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={entries[0].user.avatar_url}
                  alt={entries[0].user.full_name}
                  className="w-14 h-14 rounded-full object-cover ring-4 ring-amber-400"
                />
                <div>
                  <div className="text-[11px] text-amber-300 font-extrabold uppercase tracking-wider flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 fill-amber-300" /> Ranked #1 Today
                  </div>
                  <div className="text-sm font-bold text-white">{entries[0].user.full_name}</div>
                  <div className="text-xs text-slate-300 font-medium">
                    {entries[0].periodPoints} pts • {entries[0].currentStreak}d streak
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Timeframe Tabs */}
          <div className="flex items-center justify-between bg-slate-900/60 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-xl">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'today', label: 'Today' },
                { id: 'week', label: 'This Week' },
                { id: 'month', label: 'This Month' },
                { id: 'all', label: 'All Time' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    tab === t.id
                      ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Anti-cheat verified calculations</span>
            </div>
          </div>

          {/* Leaderboard Table / Cards */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl overflow-hidden text-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 pl-6 pr-3">Rank</th>
                    <th className="py-4 px-3">Member</th>
                    <th className="py-4 px-3">Status</th>
                    <th className="py-4 px-3">Completion Today</th>
                    <th className="py-4 px-3">Streak</th>
                    <th className="py-4 px-3">Consistency</th>
                    <th className="py-4 pr-6 pl-3 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {entries.map((entry) => (
                    <tr
                      key={entry.user.id}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      {/* Rank */}
                      <td className="py-4 pl-6 pr-3 whitespace-nowrap">
                        {getRankBadge(entry.rank)}
                      </td>

                      {/* Member profile */}
                      <td className="py-4 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              entry.user.avatar_url ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                            }
                            alt={entry.user.full_name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
                          />
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{entry.user.full_name}</span>
                              {entry.user.id === 'user-primary-001' && (
                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-emerald-400 text-slate-950">
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">@{entry.user.username}</div>
                          </div>
                        </div>
                      </td>

                      {/* Status Tag */}
                      <td className="py-4 px-3 whitespace-nowrap">
                        {getStatusBadge(entry.statusTag)}
                      </td>

                      {/* Today Completion Bar */}
                      <td className="py-4 px-3 whitespace-nowrap">
                        <div className="w-36">
                          <div className="flex items-center justify-between font-bold text-slate-200 text-[11px] mb-1">
                            <span>
                              {entry.completedToday}/{entry.totalActiveHabits} habits
                            </span>
                            <span className="text-emerald-400">{entry.todayPercentage}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${entry.todayPercentage}%`,
                                backgroundColor:
                                  entry.todayPercentage === 100
                                    ? '#10b981'
                                    : entry.todayPercentage > 50
                                    ? '#06b6d4'
                                    : '#f59e0b',
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Streak */}
                      <td className="py-4 px-3 whitespace-nowrap font-bold text-white">
                        <div className="flex items-center gap-1 text-amber-400">
                          <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span>{entry.currentStreak}d</span>
                        </div>
                      </td>

                      {/* Consistency */}
                      <td className="py-4 px-3 whitespace-nowrap font-semibold text-slate-300">
                        {entry.weeklyConsistencyRate}%
                      </td>

                      {/* Points */}
                      <td className="py-4 pr-6 pl-3 whitespace-nowrap text-right font-extrabold text-sm text-emerald-400">
                        {entry.periodPoints} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
