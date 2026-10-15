'use client';

import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  Download,
  RotateCcw,
  Shield,
  Check,
  AlertTriangle,
  Database,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { AppStorage } from '@/lib/storage';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { Navbar } from '@/components/Navbar';

export default function SettingsPage() {
  const [reminders, setReminders] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [dbTestStatus, setDbTestStatus] = useState<{
    tested: boolean;
    loading: boolean;
    connected: boolean;
    message: string;
  } | null>(null);

  const handleTestSupabase = async () => {
    setDbTestStatus({
      tested: false,
      loading: true,
      connected: false,
      message: 'Testing connection to Supabase...',
    });
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!url || !key || url.includes('your-project') || key.includes('your-anon-key')) {
      setDbTestStatus({
        tested: true,
        loading: false,
        connected: false,
        message: 'Not connected. Placeholder credentials found in habit-tracker/.env.local.',
      });
      return;
    }

    try {
      const res = await fetch(`${url}/rest/v1/profiles?select=id&limit=1`, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      });

      if (res.ok) {
        setDbTestStatus({
          tested: true,
          loading: false,
          connected: true,
          message: 'Successfully connected! Your Supabase database is online and reachable.',
        });
      } else {
        const err = await res.text();
        setDbTestStatus({
          tested: true,
          loading: false,
          connected: false,
          message: `Connected, but received HTTP ${res.status}: ${err.slice(0, 80)}`,
        });
      }
    } catch (err: any) {
      setDbTestStatus({
        tested: true,
        loading: false,
        connected: false,
        message: `Network error: ${err.message}`,
      });
    }
  };

  const handleExportData = () => {
    const data = {
      user: AppStorage.getUser(),
      habits: AppStorage.getHabits(),
      completions: AppStorage.getCompletions(),
      groups: AppStorage.getGroups(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habitforge-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (confirm('Reset your habit tracker back to default sample data?')) {
      AppStorage.resetToDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row pb-20 lg:pb-0">
      <Sidebar />

      <div className="flex-1 lg:pl-64 flex flex-col">
        <Navbar title="Settings & Preferences" subtitle="Configure notifications, backup, and storage" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full">
          {resetSuccess && (
            <div className="p-3.5 bg-emerald-500 text-slate-950 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl animate-in fade-in">
              <Check className="w-4 h-4 text-slate-950" />
              <span>Reset data back to seed state successfully!</span>
            </div>
          )}

          {/* Preferences Section */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-xl space-y-6 text-white">
            <h3 className="text-base font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" /> Notifications & Sound
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Daily Habit Reminders</p>
                <p className="text-xs text-slate-400">
                  Notify before scheduled habit start and completion deadlines
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReminders(!reminders)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  reminders ? 'bg-emerald-400' : 'bg-slate-800 border border-white/10'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                    reminders ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Celebration Confetti</p>
                <p className="text-xs text-slate-400">
                  Trigger colorful confetti effects on completing 100% daily habits
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSoundEffects(!soundEffects)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  soundEffects ? 'bg-emerald-400' : 'bg-slate-800 border border-white/10'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                    soundEffects ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Supabase Cloud Database Connection */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" /> Supabase Cloud Database
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  isSupabaseConfigured
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                {isSupabaseConfigured ? '🟢 Supabase Active' : '🟡 Local Storage Mode'}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              HabitForge can sync directly to your Supabase PostgreSQL database for multi-device sync,
              real-time habit accountability, and persistent backups.
            </p>

            {/* Test result banner */}
            {dbTestStatus && (
              <div
                className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 border ${
                  dbTestStatus.loading
                    ? 'bg-slate-950/60 text-slate-300 border-white/10'
                    : dbTestStatus.connected
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 font-semibold'
                    : 'bg-rose-950/40 text-rose-300 border-rose-500/30 font-semibold'
                }`}
              >
                {dbTestStatus.loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin shrink-0 text-slate-400 mt-0.5" />
                ) : dbTestStatus.connected ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <span>{dbTestStatus.message}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={handleTestSupabase}
                disabled={dbTestStatus?.loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${dbTestStatus?.loading ? 'animate-spin' : ''}`} />
                Test Supabase Connection
              </button>

              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
              >
                <span>Supabase Dashboard</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>

            {/* Quick 3-Step Setup Instructions */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/10 text-xs text-slate-300 space-y-1.5">
              <p className="font-bold text-white">Connection Checklist:</p>
              <ol className="list-decimal list-inside space-y-1 text-slate-400">
                <li>
                  Copy your Project URL and Anon key from Supabase Dashboard &rarr; Project Settings &rarr; API.
                </li>
                <li>
                  Save them into <code className="bg-white/10 text-emerald-300 px-1.5 py-0.5 rounded font-mono text-[11px]">habit-tracker/.env.local</code>.
                </li>
                <li>
                  Run <code className="bg-white/10 text-emerald-300 px-1.5 py-0.5 rounded font-mono text-[11px]">supabase/schema.sql</code> in your Supabase SQL Editor.
                </li>
              </ol>
            </div>
          </div>

          {/* Data Backup & Export */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-xl space-y-4 text-white">
            <h3 className="text-base font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-400" /> Backup & Export
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Export all your habits, completion records, streaks, and accountability groups in a
              standard JSON format. You can keep this file as an offline backup.
            </p>

            <button
              onClick={handleExportData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition-colors"
            >
              <Download className="w-4 h-4" /> Export Habit Data (JSON)
            </button>
          </div>

          {/* Reset Demo Data */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-xl space-y-4 text-white">
            <h3 className="text-base font-bold text-rose-400 border-b border-white/10 pb-3 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-400" /> Reset Demo State
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Want to start fresh or reload the comprehensive 30-day realistic test data? Resetting
              reloads all sample habits, completion logs, and leaderboard records.
            </p>

            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/30 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Reset to Demo Seed Data
            </button>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
