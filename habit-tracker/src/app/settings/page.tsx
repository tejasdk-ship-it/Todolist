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
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row pb-20 lg:pb-0">
      <Sidebar />

      <div className="flex-1 lg:pl-64 flex flex-col">
        <Navbar title="Settings & Preferences" subtitle="Configure notifications, backup, and storage" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full">
          {resetSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Reset data back to seed state successfully!</span>
            </div>
          )}

          {/* Preferences Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" /> Notifications & Sound
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Daily Habit Reminders</p>
                <p className="text-xs text-slate-500">
                  Notify before scheduled habit start and completion deadlines
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReminders(!reminders)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  reminders ? 'bg-emerald-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    reminders ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Celebration Confetti</p>
                <p className="text-xs text-slate-500">
                  Trigger colorful confetti effects on completing 100% daily habits
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSoundEffects(!soundEffects)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  soundEffects ? 'bg-emerald-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    soundEffects ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Supabase Cloud Database Connection */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" /> Supabase Cloud Database
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  isSupabaseConfigured
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {isSupabaseConfigured ? '🟢 Supabase Active' : '🟡 Local Storage Mode'}
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              HabitForge can sync directly to your Supabase PostgreSQL database for multi-device sync,
              real-time habit accountability, and persistent backups.
            </p>

            {/* Test result banner */}
            {dbTestStatus && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 border ${
                  dbTestStatus.loading
                    ? 'bg-slate-50 text-slate-700 border-slate-200'
                    : dbTestStatus.connected
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                    : 'bg-rose-50 text-rose-800 border-rose-200 font-semibold'
                }`}
              >
                {dbTestStatus.loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin shrink-0 text-slate-500 mt-0.5" />
                ) : dbTestStatus.connected ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{dbTestStatus.message}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={handleTestSupabase}
                disabled={dbTestStatus?.loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition-all shadow-xs active:scale-95"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${dbTestStatus?.loading ? 'animate-spin' : ''}`} />
                Test Supabase Connection
              </button>

              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <span>Supabase Dashboard</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>

            {/* Quick 3-Step Setup Instructions */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-600 space-y-1.5">
              <p className="font-bold text-slate-800">Connection Checklist:</p>
              <ol className="list-decimal list-inside space-y-1 text-slate-600">
                <li>
                  Copy your Project URL and Anon key from Supabase Dashboard &rarr; Project Settings &rarr; API.
                </li>
                <li>
                  Save them into <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">habit-tracker/.env.local</code>.
                </li>
                <li>
                  Run <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">supabase/schema.sql</code> in your Supabase SQL Editor.
                </li>
              </ol>
            </div>
          </div>

          {/* Data Backup & Export */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Download className="w-4 h-4 text-indigo-600" /> Backup & Export
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              Export all your habits, completion records, streaks, and accountability groups in a
              standard JSON format. You can keep this file as an offline backup.
            </p>

            <button
              onClick={handleExportData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
            >
              <Download className="w-4 h-4" /> Export Habit Data (JSON)
            </button>
          </div>

          {/* Reset Demo Data */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 text-rose-700">
              <RotateCcw className="w-4 h-4 text-rose-600" /> Reset Demo State
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              Want to start fresh or reload the comprehensive 30-day realistic test data? Resetting
              reloads all sample habits, completion logs, and leaderboard records.
            </p>

            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
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
