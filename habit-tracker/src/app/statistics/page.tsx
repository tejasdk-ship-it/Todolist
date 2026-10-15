'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Flame,
  Award,
  Zap,
  Star,
  Activity,
  Layers,
} from 'lucide-react';
import { AppStorage } from '@/lib/storage';
import { Habit, HabitCompletion, UserProfile } from '@/types';
import { isHabitScheduledOnDate } from '@/lib/scoring';
import { getTodayDateString } from '@/lib/utils';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { Navbar } from '@/components/Navbar';

const CATEGORY_COLORS: Record<string, string> = {
  Health: '#10b981',
  Fitness: '#06b6d4',
  Learning: '#6366f1',
  Career: '#f59e0b',
  'Personal Growth': '#ec4899',
  Mindfulness: '#8b5cf6',
  Other: '#64748b',
};

export default function StatisticsPage() {
  const [filterPeriod, setFilterPeriod] = useState<'7' | '30' | '90' | 'all'>('30');
  const [user, setUser] = useState<UserProfile>(AppStorage.getUser());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [todayStr, setTodayStr] = useState('2026-10-14');

  useEffect(() => {
    setTodayStr(getTodayDateString());
    setUser(AppStorage.getUser());
    setHabits(AppStorage.getHabits());
    setCompletions(AppStorage.getCompletions());
  }, []);

  // Filter completions based on period
  const daysLimit = filterPeriod === 'all' ? 120 : parseInt(filterPeriod, 10);
  const cutoffDate = new Date(todayStr + 'T00:00:00');
  cutoffDate.setDate(cutoffDate.getDate() - daysLimit);
  const cutoffStr = cutoffDate.toISOString().split('T')[0];

  const activeHabits = habits.filter((h) => h.status === 'active');
  const filteredCompletions = completions.filter(
    (c) => c.completion_date >= cutoffStr && c.completion_date <= todayStr && c.completed
  );

  // Total completed occurrences
  const totalCompletions = filteredCompletions.length;

  // Total minutes invested
  const totalMinutes = filteredCompletions.reduce((acc, c) => {
    const habit = habits.find((h) => h.id === c.habit_id);
    return acc + (c.actual_duration_minutes ?? habit?.target_duration_minutes ?? 15);
  }, 0);

  // Consistency per habit
  const habitConsistency = activeHabits.map((habit) => {
    let scheduledDays = 0;
    let completedDays = 0;

    for (let i = 0; i <= daysLimit; i++) {
      const d = new Date(todayStr + 'T00:00:00');
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];

      if (isHabitScheduledOnDate(habit, dStr)) {
        scheduledDays += 1;
        const wasDone = filteredCompletions.some(
          (c) => c.habit_id === habit.id && c.completion_date === dStr
        );
        if (wasDone) completedDays += 1;
      }
    }

    const rate = scheduledDays > 0 ? Math.round((completedDays / scheduledDays) * 100) : 0;
    return {
      habit,
      scheduledDays,
      completedDays,
      rate,
    };
  });

  // Sort consistency
  habitConsistency.sort((a, b) => b.rate - a.rate);
  const topHabit = habitConsistency[0];
  const bottomHabit = habitConsistency[habitConsistency.length - 1];

  // Daily trend chart data (past 14 days or filtered period)
  const chartDaysCount = Math.min(daysLimit, 14);
  const trendData = [];
  for (let i = chartDaysCount - 1; i >= 0; i--) {
    const d = new Date(todayStr + 'T00:00:00');
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    const displayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const scheduled = activeHabits.filter((h) => isHabitScheduledOnDate(h, dStr));
    const done = filteredCompletions.filter((c) => c.completion_date === dStr).length;
    const rate = scheduled.length > 0 ? Math.round((done / scheduled.length) * 100) : 0;
    const minutes = filteredCompletions
      .filter((c) => c.completion_date === dStr)
      .reduce((acc, c) => acc + (c.actual_duration_minutes ?? 15), 0);

    trendData.push({
      date: displayLabel,
      completionRate: rate,
      minutes,
      completed: done,
    });
  }

  // Category breakdown for Donut chart
  const categoryCountMap: Record<string, number> = {};
  filteredCompletions.forEach((c) => {
    const habit = habits.find((h) => h.id === c.habit_id);
    if (habit) {
      categoryCountMap[habit.category] = (categoryCountMap[habit.category] || 0) + 1;
    }
  });

  const categoryChartData = Object.entries(categoryCountMap).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] || '#64748b',
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row pb-20 lg:pb-0">
      <Sidebar />

      <div className="flex-1 lg:pl-64 flex flex-col">
        <Navbar title="Performance & Analytics" subtitle="Data-driven insights to reinforce daily discipline" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Filter Bar */}
          <div className="flex items-center justify-between bg-slate-900/60 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-xl">
            <span className="text-xs font-bold text-slate-300">Timeframe:</span>
            <div className="flex items-center gap-1.5">
              {[
                { id: '7', label: 'Last 7 Days' },
                { id: '30', label: 'Last 30 Days' },
                { id: '90', label: 'Last 90 Days' },
                { id: 'all', label: 'All Time' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterPeriod(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterPeriod === tab.id
                      ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-xl text-white">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Active Habits</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold text-white mt-2">
                {activeHabits.length}
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">Currently tracked</span>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-xl text-white">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Occurrences Completed</span>
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-2xl font-extrabold text-white mt-2">
                {totalCompletions}
              </div>
              <span className="text-[11px] text-teal-400 font-medium">In selected period</span>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-xl text-white">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Total Time Invested</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-extrabold text-white mt-2">
                {Math.round(totalMinutes / 60)} hrs
              </div>
              <span className="text-[11px] text-cyan-400 font-medium">
                {totalMinutes} total minutes
              </span>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-xl text-white">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Current Streak</span>
                <Flame className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-extrabold text-white mt-2">
                {user.current_streak} Days
              </div>
              <span className="text-[11px] text-amber-400 font-medium">
                Best: {user.longest_streak} days
              </span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Completion Trend Area Chart */}
            <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-xl text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Completion Rate Trend</h3>
                  <p className="text-xs text-slate-400">Daily completion percentage</p>
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                    <YAxis unit="%" stroke="#64748b" fontSize={11} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '16px',
                        backgroundColor: '#0f172a',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#f8fafc',
                        fontSize: '12px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="completionRate"
                      name="Completion Rate"
                      stroke="#10b981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRate)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Time Invested Bar Chart */}
            <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-xl text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Minutes Spent Per Day</h3>
                  <p className="text-xs text-slate-400">Time invested in scheduled routines</p>
                </div>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData}>
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                    <YAxis unit="m" stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '16px',
                        backgroundColor: '#0f172a',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#f8fafc',
                        fontSize: '12px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      }}
                    />
                    <Bar
                      dataKey="minutes"
                      name="Minutes Spent"
                      fill="#06b6d4"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Consistency Rankings & Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Habit Consistency Table (2 cols) */}
            <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-xl text-white">
              <h3 className="text-sm font-bold text-white mb-1">Habit Consistency Rankings</h3>
              <p className="text-xs text-slate-400 mb-4">
                Individual habit execution rates in the active window
              </p>

              <div className="space-y-3">
                {habitConsistency.map(({ habit, completedDays, scheduledDays, rate }) => (
                  <div key={habit.id} className="p-3.5 rounded-2xl border border-white/10 bg-slate-950/60">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: habit.color }}
                        />
                        <span className="font-bold text-white">{habit.name}</span>
                        <span className="text-[10px] text-slate-400">({habit.category})</span>
                      </div>
                      <span className="font-bold text-emerald-400">{rate}%</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${rate}%`,
                          backgroundColor: habit.color,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                      <span>{completedDays} completed</span>
                      <span>{scheduledDays} scheduled</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Donut & Scoring Rules */}
            <div className="space-y-6">
              {/* Category Chart */}
              <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-xl text-white">
                <h3 className="text-sm font-bold text-white mb-1">Category Distribution</h3>
                <p className="text-xs text-slate-400 mb-3">Completions by domain</p>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={4}
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          backgroundColor: '#0f172a',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#f8fafc',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
                  {categoryChartData.map((cat) => (
                    <div key={cat.name} className="flex items-center gap-1 text-[11px] text-slate-400">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span>{cat.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transparent Scoring Engine Card */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 border border-white/15 text-white p-5 rounded-3xl shadow-xl">
                <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Fair Scoring Algorithm</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Points and consistency are computed dynamically without bias to habit count:
                </p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-300">Scheduled Habit Completed</span>
                    <span className="font-bold text-emerald-400">+10 pts</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-300">100% Perfect Day Bonus</span>
                    <span className="font-bold text-amber-400">+5 pts</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-300">7-Day Perfect Streak</span>
                    <span className="font-bold text-yellow-400">+20 pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
