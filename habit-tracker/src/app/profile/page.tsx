'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Calendar,
  Clock,
  Target,
  Flame,
  Award,
  CheckCircle2,
  Edit2,
  Check,
  Shield,
  Sparkles,
} from 'lucide-react';
import { AppStorage } from '@/lib/storage';
import { UserProfile, Habit, HabitCompletion } from '@/types';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { Navbar } from '@/components/Navbar';

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile>(AppStorage.getUser());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [dailyGoal, setDailyGoal] = useState('');
  const [wakeUpTime, setWakeUpTime] = useState('');
  const [timezone, setTimezone] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'friends_only' | 'private'>('public');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const current = AppStorage.getUser();
    setUser(current);
    setFullName(current.full_name);
    setBio(current.bio || '');
    setDailyGoal(current.daily_goal || '');
    setWakeUpTime(current.wake_up_time || '06:30');
    setTimezone(current.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
    setPrivacy(current.privacy || 'public');
    setHabits(AppStorage.getHabits());
    setCompletions(AppStorage.getCompletions());
  }, []);

  const totalCompleted = completions.filter((c) => c.completed).length;
  const activeHabits = habits.filter((h) => h.status === 'active');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      full_name: fullName,
      bio,
      daily_goal: dailyGoal,
      wake_up_time: wakeUpTime,
      timezone,
      privacy,
      updated_at: new Date().toISOString(),
    };
    AppStorage.setUser(updated);
    setUser(updated);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row pb-20 lg:pb-0">
      <Sidebar />

      <div className="flex-1 lg:pl-64 flex flex-col">
        <Navbar title="My Profile" subtitle="Manage your identity, motivation, and preferences" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full">
          {savedSuccess && (
            <div className="p-3.5 bg-emerald-500 text-slate-950 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl animate-in fade-in">
              <Check className="w-4 h-4 text-slate-950" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* Profile Header Card */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl relative overflow-hidden text-white">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    user.avatar_url ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                  }
                  alt={user.full_name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-emerald-500/30 shadow-xl"
                />
                <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-400 border-2 border-slate-950 rounded-full" />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-extrabold text-white">{user.full_name}</h2>
                    <p className="text-xs text-slate-400 font-medium">@{user.username}</p>
                  </div>

                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-white/15 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors self-center sm:self-auto"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  {user.bio || 'Building consistent daily habits for lifelong health & mastery.'}
                </p>

                {user.daily_goal && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 text-xs font-medium border border-emerald-500/30">
                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Goal: {user.daily_goal}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Performance Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 text-center">
                <div className="text-xs text-slate-400 font-medium">Active Habits</div>
                <div className="text-xl font-bold text-white mt-1">{activeHabits.length}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 text-center">
                <div className="text-xs text-slate-400 font-medium">Total Completed</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">{totalCompleted}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 text-center">
                <div className="text-xs text-slate-400 font-medium">Current Streak</div>
                <div className="text-xl font-bold text-amber-400 mt-1">
                  {user.current_streak} Days
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 text-center">
                <div className="text-xs text-slate-400 font-medium">Points Earned</div>
                <div className="text-xl font-bold text-cyan-400 mt-1">{user.total_points}</div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-xl animate-in fade-in text-white">
              <h3 className="text-base font-bold text-white mb-4">Edit Profile Information</h3>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Daily Wake-Up Time
                    </label>
                    <input
                      type="time"
                      value={wakeUpTime}
                      onChange={(e) => setWakeUpTime(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Short Bio</label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Daily Goal / Core Motivation
                  </label>
                  <input
                    type="text"
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Time Zone
                    </label>
                    <input
                      type="text"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Leaderboard Privacy
                    </label>
                    <select
                      value={privacy}
                      onChange={(e) => setPrivacy(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    >
                      <option value="public" className="bg-slate-950 text-white">Public (Visible on Leaderboard)</option>
                      <option value="friends_only" className="bg-slate-950 text-white">Friends Only</option>
                      <option value="private" className="bg-slate-950 text-white">Private (Hidden from Leaderboard)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md shadow-emerald-500/20 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
