'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Calendar as CalendarIcon,
  X,
  Sparkles,
} from 'lucide-react';
import { AppStorage } from '@/lib/storage';
import { Habit, HabitCompletion } from '@/types';
import { isHabitScheduledOnDate } from '@/lib/scoring';
import { getTodayDateString, formatTime } from '@/lib/utils';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { Navbar } from '@/components/Navbar';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date('2026-10-14T00:00:00'));
  const [todayStr, setTodayStr] = useState<string>('2026-10-14');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-10-14');

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now);
    const dStr = getTodayDateString();
    setTodayStr(dStr);
    setSelectedDateStr(dStr);
    setHabits(AppStorage.getHabits().filter((h) => h.status !== 'archived'));
    setCompletions(AppStorage.getCompletions());
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleTodayClick = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateStr(getTodayDateString());
  };

  // Inspect selected date data
  const inspectDate = selectedDateStr || todayStr;
  const isFuture = inspectDate > todayStr;
  const scheduledForSelected = habits.filter((h) => isHabitScheduledOnDate(h, inspectDate));
  const completionsForSelected = completions.filter(
    (c) => c.completion_date === inspectDate && c.completed
  );
  const completedIds = new Set(completionsForSelected.map((c) => c.habit_id));
  const completedHabits = scheduledForSelected.filter((h) => completedIds.has(h.id));
  const missedHabits = scheduledForSelected.filter((h) => !completedIds.has(h.id));
  const selectedPercentage =
    scheduledForSelected.length > 0
      ? Math.round((completedHabits.length / scheduledForSelected.length) * 100)
      : 0;

  const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row pb-20 lg:pb-0">
      <Sidebar />

      <div className="flex-1 lg:pl-64 flex flex-col">
        <Navbar title="Activity Calendar" subtitle="Historical tracking & consistency heatmap" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Calendar Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-white/10 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white leading-none">
                  {monthName} {year}
                </h2>
                <p className="text-xs text-slate-400 mt-1">Review completion rates by day</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTodayClick}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-white/15 bg-slate-950 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                Today
              </button>
              <div className="flex items-center rounded-xl border border-white/15 bg-slate-950">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-white/10 text-slate-400 hover:text-white rounded-l-xl transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-white/10" />
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-white/10 text-slate-400 hover:text-white rounded-r-xl transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Legend Strip */}
          <div className="flex items-center gap-4 flex-wrap text-xs text-slate-400 bg-slate-900/60 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10 shadow-lg">
            <span className="font-bold text-slate-200">Legend:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-xs" />
              <span>100% Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400 shadow-xs" />
              <span>Partial</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-xs" />
              <span>Missed (Past)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-700" />
              <span>Rest Day / Future</span>
            </div>
          </div>

          {/* Grid Layout: Calendar + Side Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Grid (2 cols on large) */}
            <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-4 sm:p-6 shadow-xl text-white">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 pb-3 border-b border-white/10">
                {DAYS_OF_WEEK.map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1.5 pt-3">
                {/* Empty cells before month starts */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-14 sm:h-20 rounded-2xl bg-white/[0.02]" />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
                    dayNum
                  ).padStart(2, '0')}`;
                  const isToday = dateStr === todayStr;
                  const isSelected = dateStr === selectedDateStr;
                  const isFutureDate = dateStr > todayStr;

                  // Scheduled habits on this date
                  const scheduled = habits.filter((h) => isHabitScheduledOnDate(h, dateStr));
                  const comps = completions.filter(
                    (c) => c.completion_date === dateStr && c.completed
                  );
                  const scheduledCount = scheduled.length;
                  const completedOnDay = scheduled.filter((h) =>
                    comps.some((c) => c.habit_id === h.id)
                  ).length;

                  // Status determination
                  let statusColor = 'bg-slate-800 text-slate-400';
                  if (scheduledCount > 0) {
                    if (isFutureDate) {
                      statusColor = 'bg-white/5 text-slate-400 border border-dashed border-white/15';
                    } else if (completedOnDay === scheduledCount) {
                      statusColor = 'bg-emerald-400 text-slate-950 font-black shadow-md shadow-emerald-500/20';
                    } else if (completedOnDay > 0) {
                      statusColor = 'bg-amber-400 text-slate-950 font-black';
                    } else {
                      statusColor = 'bg-rose-950/60 text-rose-300 border border-rose-500/30';
                    }
                  }

                  return (
                    <button
                      key={dayNum}
                      onClick={() => setSelectedDateStr(dateStr)}
                      className={`h-14 sm:h-20 p-1.5 sm:p-2 rounded-2xl transition-all flex flex-col justify-between text-left relative ${
                        isSelected
                          ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950 z-10 bg-slate-850'
                          : 'hover:bg-white/5 bg-slate-950/60'
                      } ${isToday ? 'border-2 border-emerald-400' : 'border border-white/10'}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            isToday ? 'text-emerald-400' : 'text-slate-200'
                          }`}
                        >
                          {dayNum}
                        </span>
                        {isToday && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm" />
                        )}
                      </div>

                      {/* Badge indicator */}
                      {scheduledCount > 0 && (
                        <div
                          className={`text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded-lg truncate text-center ${statusColor}`}
                        >
                          {isFutureDate
                            ? `${scheduledCount} plan`
                            : `${completedOnDay}/${scheduledCount}`}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Details Panel */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-5 shadow-xl flex flex-col justify-between text-white">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {new Date(inspectDate + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {isFuture ? 'Future scheduled habits' : 'Day performance record'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-emerald-400">
                      {isFuture ? '—' : `${selectedPercentage}%`}
                    </span>
                    <span className="block text-[10px] text-slate-400">completion</span>
                  </div>
                </div>

                {/* Habit details list */}
                <div className="mt-4 space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {scheduledForSelected.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No habits scheduled for this day.
                    </div>
                  ) : (
                    <>
                      {/* Completed section */}
                      {completedHabits.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed (
                            {completedHabits.length})
                          </h4>
                          <div className="space-y-2">
                            {completedHabits.map((h) => {
                              const comp = completionsForSelected.find((c) => c.habit_id === h.id);
                              return (
                                <div
                                  key={h.id}
                                  className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs"
                                >
                                  <div className="flex items-center justify-between font-bold text-white">
                                    <span>{h.name}</span>
                                    <span className="text-emerald-400 font-semibold">
                                      {comp?.actual_duration_minutes ?? h.target_duration_minutes}m
                                    </span>
                                  </div>
                                  {comp?.notes && (
                                    <p className="text-[11px] text-emerald-300 italic mt-1.5 bg-emerald-950/50 p-2 rounded-xl border border-emerald-500/20">
                                      &quot;{comp.notes}&quot;
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Missed / Pending section */}
                      {missedHabits.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            {isFuture ? (
                              <>
                                <Clock className="w-3.5 h-3.5 text-slate-400" /> Upcoming ({missedHabits.length})
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5 text-rose-400" /> Pending / Missed (
                                {missedHabits.length})
                              </>
                            )}
                          </h4>
                          <div className="space-y-2">
                            {missedHabits.map((h) => (
                              <div
                                key={h.id}
                                className={`p-3 rounded-2xl border text-xs ${
                                  isFuture
                                    ? 'bg-slate-950/60 border-white/10 text-slate-300'
                                    : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                                }`}
                              >
                                <div className="flex items-center justify-between font-bold">
                                  <span className="text-white">{h.name}</span>
                                  <span className="text-[11px] font-normal text-slate-400">
                                    {h.target_duration_minutes}m target
                                  </span>
                                </div>
                                {h.preferred_time && (
                                  <div className="text-[10px] text-slate-400 mt-1">
                                    Scheduled at {formatTime(h.preferred_time)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Quick Advice */}
              <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {selectedPercentage === 100
                    ? 'Perfect score! Full points awarded for this date.'
                    : selectedPercentage > 0
                    ? 'Solid effort! Consistency compounds over time.'
                    : 'Remember: small steps lead to big transformations.'}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
