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
        <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black text-sm shadow-md ring-2 ring-amber-300">
          <Crown className="w-4 h-4 fill-amber-950" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-800 flex items-center justify-center font-black text-sm shadow-xs ring-2 ring-slate-200">
          2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center font-black text-sm shadow-xs ring-2 ring-amber-600">
          3
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
        {rank}
      </div>
    );
  };

  const getStatusBadge = (status: LeaderboardEntry['statusTag']) => {
    switch (status) {
      case 'Leading the Board':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
            <Crown className="w-3 h-3 text-amber-600" /> Leading
          </span>
        );
      case 'Perfect Day':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" /> Perfect Day
          </span>
        );
      case 'On Track':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-teal-100 text-teal-800 border border-teal-200">
            On Track
          </span>
        );
      case 'Needs a Push':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
            Needs a Push
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row pb-20 lg:pb-0">
      <Sidebar />

      <div className="flex-1 lg:pl-64 flex flex-col">
        <Navbar title="Who's Winning Today?" subtitle="Community leaderboard & friendly competition" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Top Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-700 p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs">
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>Global Consistency Standings</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Who&apos;s Winning Today?
              </h2>
              <p className="text-xs sm:text-sm text-white/90 max-w-lg leading-relaxed">
                Rankings are scored fairly by points, completion consistency, and streak momentum.
                Private habit notes and emails are kept secure.
              </p>
            </div>

            {/* Top Leader Pod */}
            {entries[0] && (
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4 min-w-[240px]">
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
                  <div className="text-xs text-white/80 font-medium">
                    {entries[0].periodPoints} pts • {entries[0].currentStreak}d streak
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Timeframe Tabs */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    tab === t.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Anti-cheat verified calculations</span>
            </div>
          </div>

          {/* Leaderboard Table / Cards */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 pl-6 pr-3">Rank</th>
                    <th className="py-3.5 px-3">Member</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-3">Completion Today</th>
                    <th className="py-3.5 px-3">Streak</th>
                    <th className="py-3.5 px-3">Consistency</th>
                    <th className="py-3.5 pr-6 pl-3 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {entries.map((entry) => (
                    <tr
                      key={entry.user.id}
                      className="hover:bg-slate-50/80 transition-colors group"
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
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{entry.user.full_name}</span>
                              {entry.user.id === 'user-primary-001' && (
                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-emerald-100 text-emerald-800">
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
                          <div className="flex items-center justify-between font-bold text-slate-800 text-[11px] mb-1">
                            <span>
                              {entry.completedToday}/{entry.totalActiveHabits} habits
                            </span>
                            <span>{entry.todayPercentage}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
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
                      <td className="py-4 px-3 whitespace-nowrap font-bold text-slate-900">
                        <div className="flex items-center gap-1 text-amber-600">
                          <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                          <span>{entry.currentStreak}d</span>
                        </div>
                      </td>

                      {/* Consistency */}
                      <td className="py-4 px-3 whitespace-nowrap font-semibold text-slate-700">
                        {entry.weeklyConsistencyRate}%
                      </td>

                      {/* Points */}
                      <td className="py-4 pr-6 pl-3 whitespace-nowrap text-right font-extrabold text-sm text-emerald-600">
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
