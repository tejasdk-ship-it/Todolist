'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Circle,
  Flame,
  Trophy,
  Clock,
  Sparkles,
  FileText,
  Calendar,
  AlertCircle,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { AppStorage } from '@/lib/storage';
import { Habit, HabitCompletion, UserProfile } from '@/types';
import { isHabitScheduledOnDate } from '@/lib/scoring';
import { getTodayDateString, formatTime } from '@/lib/utils';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { Navbar } from '@/components/Navbar';
import { AddHabitModal } from '@/components/AddHabitModal';
import { CompletionNoteModal } from '@/components/CompletionNoteModal';

const MOTIVATIONAL_QUOTES = [
  '“We are what we repeatedly do. Excellence, then, is not an act, but a habit.” — Will Durant',
  '“Success is the product of daily habits—not once-in-a-lifetime transformations.” — James Clear',
  '“Small disciplines repeated with consistency every day lead to great achievements.” — John C. Maxwell',
  '“You do not rise to the level of your goals. You fall to the level of your systems.” — James Clear',
  '“Energy flows where attention goes. Win your morning, win your day!”',
];

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile>(AppStorage.getUser());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedNoteHabit, setSelectedNoteHabit] = useState<Habit | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const todayStr = getTodayDateString();
  const todayDateObj = new Date();
  const formattedToday = todayDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const loadData = () => {
    setUser(AppStorage.getUser());
    setHabits(AppStorage.getHabits().filter((h) => h.status !== 'archived'));
    setCompletions(AppStorage.getCompletions());
  };

  useEffect(() => {
    loadData();
    // Rotate quote based on day of month
    setQuoteIndex(new Date().getDate() % MOTIVATIONAL_QUOTES.length);
  }, []);

  // Filter today's scheduled habits
  const scheduledHabits = habits.filter((h) => isHabitScheduledOnDate(h, todayStr));

  // Completions today
  const todayCompletions = completions.filter(
    (c) => c.completion_date === todayStr && c.completed
  );

  const completedHabitIds = new Set(todayCompletions.map((c) => c.habit_id));
  const completedCount = scheduledHabits.filter((h) => completedHabitIds.has(h.id)).length;
  const totalScheduled = scheduledHabits.length;
  const completionPercentage =
    totalScheduled > 0 ? Math.round((completedCount / totalScheduled) * 100) : 0;

  // Total completed activities all time
  const totalCompletedAllTime = completions.filter((c) => c.completed).length;

  const handleToggleHabit = (habitId: string) => {
    const { isCompleted } = AppStorage.toggleHabitCompletion(habitId, todayStr);
    loadData();

    if (isCompleted) {
      // Check if this triggers 100% completion
      const newCompletedCount = completedCount + 1;
      if (newCompletedCount === totalScheduled && totalScheduled > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#6ee7b7', '#f59e0b'],
        });
      }
    }
  };

  const handleSaveNotes = (actualDuration: number, notes: string) => {
    if (!selectedNoteHabit) return;
    AppStorage.toggleHabitCompletion(selectedNoteHabit.id, todayStr, actualDuration, notes);
    loadData();
    setSelectedNoteHabit(null);
  };

  const handleUndoNotes = () => {
    if (!selectedNoteHabit) return;
    const existing = completions.find(
      (c) => c.habit_id === selectedNoteHabit.id && c.completion_date === todayStr
    );
    if (existing) {
      AppStorage.toggleHabitCompletion(selectedNoteHabit.id, todayStr);
    }
    loadData();
    setSelectedNoteHabit(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row pb-20 lg:pb-0">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col">
        <Navbar
          title="Daily Momentum"
          subtitle={formattedToday}
          onAddHabitClick={() => setIsAddModalOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Top Hero Banner */}
          <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-xs border border-emerald-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Today&apos;s Focus</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome back, {user.full_name.split(' ')[0]}!
                </h2>
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  {MOTIVATIONAL_QUOTES[quoteIndex]}
                </p>
              </div>

              {/* Today's Completion Circular Progress */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 self-stretch md:self-auto justify-between md:justify-start">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="#10b981"
                      strokeWidth="6"
                      strokeDasharray={163.3}
                      strokeDashoffset={163.3 - (163.3 * completionPercentage) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <span className="absolute text-sm font-bold">{completionPercentage}%</span>
                </div>
                <div>
                  <div className="text-xs text-slate-300 font-medium">Daily Progress</div>
                  <div className="text-lg font-bold">
                    {completedCount} of {totalScheduled}{' '}
                    <span className="text-xs font-normal text-slate-300">Habits</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium">
                    {completionPercentage === 100
                      ? 'All done! Fantastic job!'
                      : `${totalScheduled - completedCount} habits remaining`}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> Current Streak
                </div>
                <div className="text-xl font-bold mt-1">{user.current_streak} Days</div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-yellow-400" /> Best Streak
                </div>
                <div className="text-xl font-bold mt-1">{user.longest_streak} Days</div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Total Completed
                </div>
                <div className="text-xl font-bold mt-1">{totalCompletedAllTime}</div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-400" /> Total Points
                </div>
                <div className="text-xl font-bold mt-1">{user.total_points}</div>
              </div>
            </div>
          </div>

          {/* Scheduled Habits Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Today&apos;s Habits</h3>
                <p className="text-xs text-slate-500">
                  Tap the checkmark to record completion or notes to add details
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
              >
                <Plus className="w-4 h-4" /> New Habit
              </button>
            </div>

            {scheduledHabits.length === 0 ? (
              <div className="text-center py-12 px-4 bg-white rounded-2xl border border-dashed border-slate-300">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">No Habits Scheduled Today</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  Enjoy your rest day or create a new habit to start building your streak!
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all"
                >
                  Create a Habit
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scheduledHabits.map((habit) => {
                  const isDone = completedHabitIds.has(habit.id);
                  const completionRecord = completions.find(
                    (c) => c.habit_id === habit.id && c.completion_date === todayStr
                  );

                  return (
                    <div
                      key={habit.id}
                      className={`group relative p-4 rounded-2xl border transition-all duration-200 ${
                        isDone
                          ? 'bg-emerald-50/40 border-emerald-200/80 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* Checkbox Button */}
                        <button
                          onClick={() => handleToggleHabit(habit.id)}
                          className="mt-0.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-full transition-transform active:scale-90"
                          title={isDone ? 'Mark Pending' : 'Mark Completed'}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-7 h-7 text-emerald-600 fill-emerald-100 transition-colors" />
                          ) : (
                            <Circle className="w-7 h-7 text-slate-300 hover:text-emerald-500 transition-colors" />
                          )}
                        </button>

                        {/* Habit Information */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-sm font-bold transition-all ${
                                isDone ? 'line-through text-slate-400' : 'text-slate-900'
                              }`}
                            >
                              {habit.name}
                            </span>
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                              style={{ backgroundColor: habit.color }}
                            >
                              {habit.category}
                            </span>
                            {habit.priority === 'High' && (
                              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                                High
                              </span>
                            )}
                          </div>

                          {habit.description && (
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                              {habit.description}
                            </p>
                          )}

                          {/* Time & Target duration */}
                          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                            {habit.preferred_time && (
                              <span className="flex items-center gap-1 font-medium text-slate-600">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {formatTime(habit.preferred_time)}
                              </span>
                            )}
                            <span className="flex items-center gap-1 font-medium">
                              {habit.target_duration_minutes} mins target
                            </span>
                          </div>

                          {/* Completed info preview if exists */}
                          {completionRecord?.notes && (
                            <div className="mt-2 text-xs text-emerald-800 bg-emerald-100/60 p-2 rounded-xl flex items-start gap-1.5 border border-emerald-200/50">
                              <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                              <span className="italic line-clamp-2">
                                &quot;{completionRecord.notes}&quot;
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Note & Actual Duration Modal Trigger */}
                        <button
                          onClick={() => setSelectedNoteHabit(habit)}
                          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                          title="Add details or reflection"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => loadData()}
      />

      {selectedNoteHabit && (
        <CompletionNoteModal
          isOpen={Boolean(selectedNoteHabit)}
          onClose={() => setSelectedNoteHabit(null)}
          habit={selectedNoteHabit}
          completion={completions.find(
            (c) => c.habit_id === selectedNoteHabit.id && c.completion_date === todayStr
          )}
          dateStr={todayStr}
          onSave={handleSaveNotes}
          onUndo={handleUndoNotes}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
