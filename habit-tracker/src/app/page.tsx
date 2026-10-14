'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Flame,
  Trophy,
  Calendar,
  BarChart3,
  Users,
  ArrowRight,
  Shield,
  Zap,
  Target,
  Clock,
  ChevronRight,
  Star,
} from 'lucide-react';

export default function LandingPage() {
  const [completedDemo, setCompletedDemo] = useState(false);

  const handleDemoClick = () => {
    const nextState = !completedDemo;
    setCompletedDemo(nextState);
    if (nextState) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#34d399', '#f59e0b'],
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Habit<span className="text-emerald-600">Forge</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-xs transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Value Prop */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60 shadow-2xs">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Next-Generation Habit Consistency</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Forge habits that <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy">stick</span>, compete with friends.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Track daily routines with rich duration logs, inspect historical heatmaps, and climb
                the fair community leaderboard. Engineered for effortless consistency on mobile and laptop.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Start Tracking Today</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>1-Click Test Demo</span>
                </Link>
              </div>

              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600" /> 100% Free Tier Compatible
                </span>
                <span className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" /> Fair Scoring System
                </span>
              </div>
            </div>

            {/* Right Column: Live Interactive Card Widget */}
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-lg opacity-30 animate-pulse" />

              <div className="relative bg-white rounded-3xl border border-slate-200 p-6 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Today&apos;s Momentum</h3>
                      <p className="text-[11px] text-slate-400">Interactive live preview</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-amber-500 text-amber-500" /> 12-Day Streak
                  </span>
                </div>

                {/* Interactive Habit Card */}
                <div
                  onClick={handleDemoClick}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all select-none ${
                    completedDemo
                      ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      className="mt-0.5 focus:outline-none transition-transform active:scale-90"
                    >
                      {completedDemo ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-300" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-bold ${
                            completedDemo ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          Morning Workout & Cardio
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Fitness
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">30 mins target • 07:00 AM</p>
                      {completedDemo && (
                        <p className="text-[11px] text-emerald-700 font-semibold mt-1.5">
                          ✓ Completed! +10 Points earned!
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-center text-[11px] text-slate-400">
                  👆 Tap the card above to test completion animation!
                </div>

                {/* Mini Leaderboard Snapshot */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                  <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                    <span>Who&apos;s Winning Today?</span>
                    <span className="text-emerald-600 font-semibold">Live Board</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 font-bold text-[10px] flex items-center justify-center">
                        1
                      </span>
                      <span className="font-semibold text-slate-800">Sarah Jenkins</span>
                    </div>
                    <span className="font-bold text-emerald-600">620 pts</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                        2
                      </span>
                      <span className="font-semibold text-slate-800">Marcus Vance</span>
                    </div>
                    <span className="font-bold text-emerald-600">540 pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Everything you need to sustain lifelong habits
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Designed with scientific behavioral psychology and transparent gamification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Full Habit Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Categorize habits by Health, Learning, Career, or Mindfulness. Set custom weekly
                schedules, target durations, and priority levels without losing historical records.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Activity Calendar & History</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Month-by-month interactive calendar with color badges: green for 100%, yellow for
                partial, red for missed. Inspect actual time spent and reflections on any day.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Community Leaderboard</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compare progress with friends and accountability groups. Transparent scoring (+10
                points per habit, +5 bonus for 100% days) keeps competition fair and engaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">HabitForge</span>
            <span>• Daily Habit Tracker Web Application</span>
          </div>
          <div>
            <span>Ready for Vercel Hobby & Supabase PostgreSQL deployment.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
