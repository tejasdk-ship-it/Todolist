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
} from 'lucide-react';
import { AppStorage } from '@/lib/storage';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { Navbar } from '@/components/Navbar';

export default function SettingsPage() {
  const [reminders, setReminders] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);

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
