'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Target, Clock, Globe, User, Check } from 'lucide-react';
import { AppStorage } from '@/lib/storage';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
];

export default function OnboardingPage() {
  const router = useRouter();
  const currentUser = AppStorage.getUser();

  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar_url || AVATAR_OPTIONS[0]);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [wakeUpTime, setWakeUpTime] = useState(currentUser.wake_up_time || '06:30');
  const [dailyGoal, setDailyGoal] = useState(currentUser.daily_goal || 'Maintain consistent daily discipline');
  const [timezone, setTimezone] = useState(
    currentUser.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  );

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      avatar_url: avatarUrl,
      bio,
      wake_up_time: wakeUpTime,
      daily_goal: dailyGoal,
      timezone,
      updated_at: new Date().toISOString(),
    };
    AppStorage.setUser(updated);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step 2 of 2: Personal Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Welcome to HabitForge!
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Customize your habit tracking preferences to tailor your daily experience.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100">
          <form onSubmit={handleFinish} className="space-y-6">
            {/* Avatar picker */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Choose an Avatar
              </label>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {AVATAR_OPTIONS.map((url, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setAvatarUrl(url)}
                    className={`relative rounded-full shrink-0 transition-all ${
                      avatarUrl === url
                        ? 'ring-4 ring-emerald-500 scale-105'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt="Avatar option"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {avatarUrl === url && (
                      <div className="absolute inset-0 rounded-full bg-emerald-500/20 flex items-center justify-center text-white">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Goal */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-600" />
                Daily Goal or Core Motivation
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Code 1 hour and run 5k, read 20 pages every night"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Short Bio */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Short Bio (optional)
              </label>
              <textarea
                rows={2}
                placeholder="Share a sentence about your focus or passions..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Timezone & Wake up time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Target Wake-Up Time
                </label>
                <input
                  type="time"
                  value={wakeUpTime}
                  onChange={(e) => setWakeUpTime(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-slate-400" />
                  Time Zone
                </label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Go to My Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
