'use client';

import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Award,
  Zap,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile } from '@/types';
import { AppStorage } from '@/lib/storage';
import { MessageModal } from './MessageModal';

export interface Competitor {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  streak: number;
  points: number;
  todayCompleted: number;
  todayTotal: number;
  isCurrentUser?: boolean;
}

interface UserCompetitionRaceProps {
  title?: string;
  subtitle?: string;
  competitors?: Competitor[];
}

export function UserCompetitionRace({
  title = 'Live Daily Habit Competition',
  subtitle = 'Compete with accountability partners in real time to finish all habits today',
  competitors: initialCompetitors,
}: UserCompetitionRaceProps) {
  const currentUser = AppStorage.getUser();
  const habits = AppStorage.getHabits().filter((h) => h.status === 'active');
  const completions = AppStorage.getCompletions();
  const todayStr = '2026-10-14';

  const scheduledCount = habits.length;
  const userCompletedCount = completions.filter(
    (c) => c.completion_date === todayStr && c.completed
  ).length;

  const defaultCompetitors: Competitor[] = [
    {
      id: 'fr-1',
      username: 'sarah_fitness',
      full_name: 'Sarah Jenkins',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      streak: 24,
      points: 620,
      todayCompleted: 5,
      todayTotal: 5,
    },
    {
      id: currentUser.id,
      username: currentUser.username,
      full_name: currentUser.full_name,
      avatar_url: currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      streak: currentUser.current_streak,
      points: currentUser.total_points,
      todayCompleted: userCompletedCount,
      todayTotal: Math.max(scheduledCount, 1),
      isCurrentUser: true,
    },
    {
      id: 'fr-2',
      username: 'elena_mind',
      full_name: 'Elena Rostova',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      streak: 14,
      points: 410,
      todayCompleted: 2,
      todayTotal: 3,
    },
    {
      id: 'fr-3',
      username: 'marcus_dev',
      full_name: 'Marcus Vance',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      streak: 18,
      points: 540,
      todayCompleted: 3,
      todayTotal: 5,
    },
    {
      id: 'fr-4',
      username: 'liam_peak',
      full_name: 'Liam Chen',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      streak: 11,
      points: 380,
      todayCompleted: 2,
      todayTotal: 4,
    },
  ];

  const rawList = initialCompetitors || defaultCompetitors;

  // Sort by completion percentage desc, then by streak desc
  const sortedCompetitors = [...rawList].sort((a, b) => {
    const pctA = a.todayTotal > 0 ? (a.todayCompleted / a.todayTotal) * 100 : 0;
    const pctB = b.todayTotal > 0 ? (b.todayCompleted / b.todayTotal) * 100 : 0;
    if (pctB !== pctA) return pctB - pctA;
    return b.streak - a.streak;
  });

  const [activeChatUser, setActiveChatUser] = useState<Competitor | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleQuickCheer = (comp: Competitor) => {
    const cheers = [
      '🔥 Keep crushing it! Amazing streak!',
      '🚀 You are unstoppable today!',
      '👏 Great habit consistency!',
    ];
    const cheer = cheers[Math.floor(Math.random() * cheers.length)];
    AppStorage.sendMessage(comp.id, cheer, true);
    showToast(`Cheered ${comp.full_name}! 🔥`);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/5 via-teal-500/5 to-transparent rounded-full pointer-events-none -mr-20 -mt-20" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center ring-1 ring-amber-500/20">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">{title}</h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Live Duel
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 p-1.5 px-3 rounded-xl border border-slate-200/70 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Resetting at midnight</span>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="mb-4 p-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-between animate-in fade-in slide-in-from-top-2 shadow-lg">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" /> {toastMessage}
          </span>
          <button onClick={() => setToastMessage(null)} className="text-emerald-200 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* Competitors List */}
      <div className="space-y-3 relative">
        {sortedCompetitors.map((comp, idx) => {
          const rank = idx + 1;
          const percentage =
            comp.todayTotal > 0
              ? Math.min(100, Math.round((comp.todayCompleted / comp.todayTotal) * 100))
              : 0;

          // Rank styling
          let rankBadge = (
            <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center">
              #{rank}
            </div>
          );
          if (rank === 1) {
            rankBadge = (
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs ring-2 ring-amber-300/40">
                🥇
              </div>
            );
          } else if (rank === 2) {
            rankBadge = (
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-slate-300 to-slate-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                🥈
              </div>
            );
          } else if (rank === 3) {
            rankBadge = (
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                🥉
              </div>
            );
          }

          return (
            <div
              key={comp.id}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                comp.isCurrentUser
                  ? 'bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/50 border-emerald-300 ring-2 ring-emerald-500/10 shadow-sm'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {/* Left: Rank, Avatar, Name */}
              <div className="flex items-center gap-3 min-w-0">
                {rankBadge}

                <div className="relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={comp.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={comp.full_name}
                    className={`w-11 h-11 rounded-full object-cover ${
                      comp.isCurrentUser
                        ? 'ring-2 ring-emerald-500'
                        : 'ring-1 ring-slate-200'
                    }`}
                  />
                  {percentage === 100 && (
                    <span className="absolute -bottom-1 -right-1 text-xs" title="Finished all habits!">
                      👑
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-bold text-slate-900 truncate">
                      {comp.full_name}
                    </span>
                    {comp.isCurrentUser && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400">@{comp.username}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-amber-500" /> {comp.streak}d streak
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle: Progress Bar & Status */}
              <div className="flex-1 max-w-sm sm:px-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-700">
                    {comp.todayCompleted} of {comp.todayTotal} habits
                  </span>
                  <span
                    className={`font-extrabold ${
                      percentage === 100
                        ? 'text-emerald-600'
                        : percentage >= 50
                        ? 'text-teal-600'
                        : 'text-slate-500'
                    }`}
                  >
                    {percentage}% done
                  </span>
                </div>

                {/* Progress track */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      percentage === 100
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-2xs'
                        : percentage >= 50
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500'
                        : 'bg-gradient-to-r from-amber-400 to-amber-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    {percentage === 100
                      ? '🎯 All target habits done!'
                      : `${comp.todayTotal - comp.todayCompleted} remaining`}
                  </span>
                  <span className="font-medium text-emerald-700">+{comp.points} pts</span>
                </div>
              </div>

              {/* Right: Actions (Cheer / Message) */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {!comp.isCurrentUser ? (
                  <>
                    <button
                      onClick={() => handleQuickCheer(comp)}
                      title={`Send cheer to ${comp.full_name}`}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/60 transition-all flex items-center gap-1 active:scale-95 shadow-2xs"
                    >
                      <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>Cheer</span>
                    </button>

                    <button
                      onClick={() => setActiveChatUser(comp)}
                      title={`Send message to ${comp.full_name}`}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message</span>
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-xl border border-emerald-200">
                    Your Live Position
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat / Message Modal */}
      {activeChatUser && (
        <MessageModal
          isOpen={Boolean(activeChatUser)}
          onClose={() => setActiveChatUser(null)}
          friend={activeChatUser}
        />
      )}
    </div>
  );
}
