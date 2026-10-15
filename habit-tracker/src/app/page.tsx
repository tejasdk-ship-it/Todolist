'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
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
  Volume2,
  VolumeX,
  Compass,
  Layers,
  Activity,
  Play,
  MessageSquare,
  Award,
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'habits' | 'streak' | 'duels' | 'analytics'>('streak');
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(78);

  // Generate 48 tick marks for the circular radar gauge (matches reference image aesthetic)
  const totalTicks = 48;
  const activeTicksCount = Math.round((currentProgress / 100) * totalTicks);
  const ticks = Array.from({ length: totalTicks }, (_, i) => {
    const angle = (i / totalTicks) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    const r1 = 52;
    const r2 = i < activeTicksCount ? 64 : 58;
    const x1 = 70 + r1 * Math.cos(rad);
    const y1 = 70 + r1 * Math.sin(rad);
    const x2 = 70 + r2 * Math.cos(rad);
    const y2 = 70 + r2 * Math.sin(rad);
    const isActive = i < activeTicksCount;
    return { x1, y1, x2, y2, isActive, index: i };
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* ======================================================== */}
      {/* 1. CINEMATIC HERO SECTION (Directly inspired by reference) */}
      {/* ======================================================== */}
      <div className="relative min-h-screen flex flex-col justify-between overflow-hidden">
        {/* Background Image with Cinematic Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-105"
          style={{
            backgroundImage: "url('/hero-bg.jpg')",
          }}
        />
        {/* Atmospheric Gradients & Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/30 to-slate-950/80 pointer-events-none" />

        {/* TOP NAVIGATION (Floating Pill Style) */}
        <header className="relative z-30 pt-6 px-4 sm:px-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between">
            {/* Left: Brand Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center bg-white/10 backdrop-blur-md group-hover:border-emerald-400 transition-colors">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1">
                Habit<span className="text-emerald-400 font-light">Depth</span>
              </span>
            </Link>

            {/* Center: Frosted Pill Menu */}
            <nav className="hidden md:flex items-center gap-1 bg-white/10 backdrop-blur-xl border border-white/15 rounded-full px-5 py-1.5 shadow-2xl">
              <Link
                href="#features"
                className="px-3.5 py-1 rounded-full text-xs font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all"
              >
                Explore
              </Link>
              <Link
                href="/dashboard"
                className="px-3.5 py-1 rounded-full text-xs font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all"
              >
                App
              </Link>
              <Link
                href="/friends"
                className="px-3.5 py-1 rounded-full text-xs font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all"
              >
                Race Duels
              </Link>
              <Link
                href="/leaderboard"
                className="px-3.5 py-1 rounded-full text-xs font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all"
              >
                Community
              </Link>
            </nav>

            {/* Right: Split Pill CTA Button */}
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="group flex items-center rounded-full bg-white text-slate-900 px-1 py-1 shadow-xl hover:bg-emerald-50 transition-all active:scale-95"
              >
                <span className="px-3 sm:px-4 py-1 text-xs font-bold">Open App</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center gap-0.5">
                  Free
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* HERO MAIN BODY */}
        <main className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 w-full my-auto py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
            
            {/* LEFT COLUMN: Editorial Typography & Audience */}
            <div className="lg:col-span-4 space-y-6 text-center lg:text-left">
              {/* Pill Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold tracking-wider uppercase">
                <span className="grid grid-cols-2 gap-0.5 w-3 h-3">
                  <span className="bg-emerald-400 rounded-2xs"></span>
                  <span className="bg-emerald-400 rounded-2xs"></span>
                  <span className="bg-emerald-400 rounded-2xs"></span>
                  <span className="bg-emerald-400 rounded-2xs"></span>
                </span>
                <span>Habit Intelligence</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.08]">
                Read the signs <br />
                <span className="font-bold text-white">Know the water</span> <br />
                <span className="text-slate-300 font-normal italic">every single day</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300/90 max-w-sm mx-auto lg:mx-0 leading-relaxed font-light">
                Sensory habit tracking engineered with atmospheric clarity. Monitor routines with
                live duel progress, interactive streak gauges, and zero clutter.
              </p>

              {/* Bottom Left: Active User Avatars */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-3">
                <div className="flex -space-x-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                    alt="User"
                    className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                    alt="User"
                    className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                    alt="User"
                    className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-white tracking-tight leading-none">18K+</div>
                  <div className="text-[10px] text-slate-400 font-medium">Active habit athletes</div>
                </div>
              </div>
            </div>

            {/* CENTER COLUMN: Floating Glass HUD Widgets (The Focal Point) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4 relative">
              {/* Orbital Radar Arc Ring spanning behind the cards */}
              <div className="absolute w-[440px] h-[440px] rounded-full border border-white/10 pointer-events-none -z-10 animate-spin-slow opacity-60" />

              {/* CARD 1: Flow / Momentum Gauge (Matches "Bite Alert") */}
              <div className="w-full max-w-sm rounded-[32px] bg-slate-900/60 backdrop-blur-2xl border border-white/20 p-6 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-white/35">
                {/* Specular Inner Glare */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-[32px]" />

                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-medium text-slate-300 tracking-wide">
                    Momentum Alert
                  </div>
                  <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-[11px] text-white/80">
                    ⚡
                  </div>
                </div>

                {/* Circular Radar Tick Marks Gauge */}
                <div className="relative w-36 h-36 mx-auto my-2 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 140 140">
                    {ticks.map((t) => (
                      <line
                        key={t.index}
                        x1={t.x1}
                        y1={t.y1}
                        x2={t.x2}
                        y2={t.y2}
                        stroke={t.isActive ? '#ffffff' : 'rgba(255,255,255,0.18)'}
                        strokeWidth={t.isActive ? 2 : 1}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                      />
                    ))}
                  </svg>
                  {/* Centered Gauge Value */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-semibold text-white tracking-tight">
                      {currentProgress}%
                    </span>
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                      Optimal
                    </span>
                  </div>
                </div>

                {/* Card Footer: Line tension / Mute toggle */}
                <div className="flex items-center justify-between pt-3 text-xs border-t border-white/10">
                  <span className="text-[11px] text-slate-400 font-medium">Daily flow state</span>
                  <button
                    onClick={() => setIsSoundMuted(!isSoundMuted)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium border border-white/15 transition-all active:scale-95"
                  >
                    <span>{isSoundMuted ? 'Muted' : 'Focus'}</span>
                    {isSoundMuted ? (
                      <VolumeX className="w-3 h-3 text-slate-400" />
                    ) : (
                      <Volume2 className="w-3 h-3 text-emerald-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* CARD 2: Habit Intel / Topographic Card (Matches "Spot Intel") */}
              <div className="w-full max-w-sm rounded-[32px] bg-slate-900/60 backdrop-blur-2xl border border-white/20 p-6 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-white/35">
                {/* Topographic Contour Background SVG */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
                  viewBox="0 0 300 150"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.75"
                >
                  <path d="M-10,30 Q80,10 160,50 T310,20" />
                  <path d="M-10,60 Q90,30 180,80 T310,50" />
                  <path d="M-10,90 Q100,50 200,100 T310,80" />
                  <path d="M-10,120 Q120,70 210,130 T310,110" />
                  <circle cx="210" cy="80" r="3.5" fill="#10b981" />
                </svg>

                {/* Header */}
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="text-xs font-medium text-slate-300">Habit Intel</div>
                  <div className="flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-white/60"></span>
                    <span className="w-1 h-1 rounded-full bg-white/60"></span>
                    <span className="w-1 h-1 rounded-full bg-white/60"></span>
                    <span className="w-1 h-1 rounded-full bg-white/60"></span>
                  </div>
                </div>

                {/* Intel Body */}
                <div className="py-2 space-y-2 relative z-10 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>ACTIVITY: PEAK CONSISTENCY</span>
                  </div>
                </div>

                {/* Footer metrics */}
                <div className="flex items-center justify-between pt-4 mt-2 text-xs border-t border-white/10 relative z-10">
                  <span className="text-[11px] text-slate-400 font-medium">Target: 60m daily</span>
                  <span className="text-[11px] text-emerald-400 font-bold">5/5 Completed Today</span>
                </div>
              </div>

              {/* CARD 3: Floating White AI Tip Pill (Matches "AI TIP") */}
              <div className="w-full max-w-sm rounded-3xl bg-white text-slate-900 p-4 shadow-2xl flex items-center justify-between gap-3 transform -translate-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span>✦ AI HABIT TIP</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 leading-snug">
                      Focus on morning coding. High energy window.
                    </div>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-bold hover:bg-slate-800 transition-all shrink-0 active:scale-95"
                >
                  Start
                </Link>
              </div>
            </div>

            {/* RIGHT COLUMN: Minimalist Category Selector & Routine Spots */}
            <div className="lg:col-span-3 flex flex-col justify-between items-center lg:items-end text-center lg:text-right space-y-12">
              {/* Category Indicator List */}
              <div className="space-y-4">
                {[
                  { id: 'habits', label: 'Habits' },
                  { id: 'streak', label: 'Streak' },
                  { id: 'duels', label: 'Duels & Races' },
                  { id: 'analytics', label: 'Analytics' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setCurrentProgress(item.id === 'streak' ? 78 : item.id === 'habits' ? 92 : 64);
                    }}
                    className={`block w-full text-sm transition-all text-right ${
                      activeTab === item.id
                        ? 'font-bold text-white text-base scale-105'
                        : 'text-slate-400 hover:text-slate-200 font-light'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span>{item.label}</span>
                      {activeTab === item.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm" />
                      )}
                    </span>
                  </button>
                ))}
              </div>

              {/* Bottom Right: Community Verified Routines */}
              <div className="flex items-center gap-2 text-xs text-slate-400 font-light max-w-xs justify-end">
                <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Explore thousands of verified daily routines</span>
              </div>
            </div>

          </div>
        </main>

        {/* BOTTOM MARQUEE / AMBIENT FOOTER OF HERO */}
        <div className="relative z-20 border-t border-white/10 bg-slate-950/60 backdrop-blur-xl py-3 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Duel System Active
              </span>
              <span>&bull;</span>
              <span>Supabase Cloud Sync Ready</span>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login" className="hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="hover:text-white transition-colors">
                Register Free
              </Link>
              <a href="#features" className="hover:text-white transition-colors">
                System Overview &darr;
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. THE THREE CORE PILLARS SECTION                        */}
      {/* ======================================================== */}
      <section id="features" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Architecture of Consistency
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for those who take their days seriously.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed font-light">
            Every feature is stripped of vanity metrics and tuned for sustained focus, accountability
            races, and frictionless daily logs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-emerald-500/50 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Daily Momentum Radar</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track habits with paginated cards, target durations, and reflection logs. Never lose
              track of what truly matters in your morning and evening routines.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-emerald-500/50 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Live Duel & Competition</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Race in real time against your accountability circle. See who completes 100% of their
              habits first today, send fire cheers, and direct message partners.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-emerald-500/50 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Supabase Cloud Sync</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seamlessly backed by Supabase PostgreSQL. Works with zero latency offline, and syncs
              across all your devices automatically with Row-Level Security.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. FINAL CALL TO ACTION                                  */}
      {/* ======================================================== */}
      <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/15 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Ready to master your daily rhythm?
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-8 font-light">
            Join thousands of performers building streaks with clarity. No subscriptions required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-slate-950 font-bold text-sm shadow-xl hover:bg-emerald-50 active:scale-95 transition-all"
            >
              Get Started Free
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
            >
              Enter Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-500">
        <p>© 2026 HabitDepth. Master the routine, own the day.</p>
      </footer>
    </div>
  );
}
