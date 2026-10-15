'use client';

import React, { useState } from 'react';
import { X, Sparkles, Clock, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Habit, HabitCategory, HabitPriority, FrequencyType } from '@/types';
import { AppStorage } from '@/lib/storage';
import { getTodayDateString } from '@/lib/utils';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (habit: Habit) => void;
  initialHabit?: Habit | null;
}

const CATEGORIES: HabitCategory[] = [
  'Health',
  'Fitness',
  'Learning',
  'Career',
  'Personal Growth',
  'Mindfulness',
  'Other',
];

const COLORS = [
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#6366f1', // indigo
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // purple
  '#ef4444', // red
];

const ICONS = ['Activity', 'BookOpen', 'Code2', 'Sparkles', 'Droplets', 'Heart', 'Zap'];

export function AddHabitModal({
  isOpen,
  onClose,
  onSuccess,
  initialHabit,
}: AddHabitModalProps) {
  const [name, setName] = useState(initialHabit?.name || '');
  const [description, setDescription] = useState(initialHabit?.description || '');
  const [category, setCategory] = useState<HabitCategory>(initialHabit?.category || 'Fitness');
  const [color, setColor] = useState(initialHabit?.color || '#10b981');
  const [icon, setIcon] = useState(initialHabit?.icon || 'Activity');
  const [targetDuration, setTargetDuration] = useState(initialHabit?.target_duration_minutes || 20);
  const [preferredTime, setPreferredTime] = useState(initialHabit?.preferred_time || '08:00');
  const [frequencyType, setFrequencyType] = useState<FrequencyType>(
    initialHabit?.frequency_type || 'daily'
  );
  const [frequencyDays, setFrequencyDays] = useState<number[]>(
    initialHabit?.frequency_days || [0, 1, 2, 3, 4, 5, 6]
  );
  const [priority, setPriority] = useState<HabitPriority>(initialHabit?.priority || 'Medium');
  const [startDate, setStartDate] = useState(initialHabit?.start_date || getTodayDateString());
  const [endDate, setEndDate] = useState(initialHabit?.end_date || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const toggleDay = (dayIndex: number) => {
    if (frequencyDays.includes(dayIndex)) {
      if (frequencyDays.length === 1) return; // keep at least 1 day
      setFrequencyDays(frequencyDays.filter((d) => d !== dayIndex));
    } else {
      setFrequencyDays([...frequencyDays, dayIndex].sort());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a habit name.');
      return;
    }

    const user = AppStorage.getUser();

    if (initialHabit) {
      // Edit
      const updated = AppStorage.updateHabit(initialHabit.id, {
        name: name.trim(),
        description: description.trim(),
        category,
        color,
        icon,
        target_duration_minutes: Number(targetDuration),
        preferred_time: preferredTime,
        frequency_type: frequencyType,
        frequency_days: frequencyDays,
        priority,
        start_date: startDate,
        end_date: endDate || undefined,
      });
      if (updated) onSuccess(updated);
    } else {
      // Create
      const created = AppStorage.addHabit({
        user_id: user.id,
        name: name.trim(),
        description: description.trim(),
        category,
        color,
        icon,
        target_duration_minutes: Number(targetDuration),
        preferred_time: preferredTime,
        frequency_type: frequencyType,
        frequency_days: frequencyDays,
        priority,
        status: 'active',
        start_date: startDate,
        end_date: endDate || undefined,
      });
      onSuccess(created);
    }
    onClose();
  };

  const DAYS_LABEL = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden my-8 text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: color }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {initialHabit ? 'Edit Habit' : 'Create New Habit'}
              </h3>
              <p className="text-xs text-slate-400">
                Define your routine, duration, and cadence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-300 bg-rose-950/60 border border-rose-500/40 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Habit Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Morning Jog, Read Non-fiction, Code 1 hour"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-white/15 bg-slate-950/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description or Motivation (optional)
            </label>
            <textarea
              rows={2}
              placeholder="Why is this habit important to you?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-white/15 bg-slate-950/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-none"
            />
          </div>

          {/* Category & Priority Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HabitCategory)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-950 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as HabitPriority)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
              >
                <option value="Low" className="bg-slate-950 text-white">Low</option>
                <option value="Medium" className="bg-slate-950 text-white">Medium</option>
                <option value="High" className="bg-slate-950 text-white">High</option>
              </select>
            </div>
          </div>

          {/* Duration & Preferred Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Target Duration (mins)
              </label>
              <input
                type="number"
                min={1}
                max={480}
                value={targetDuration}
                onChange={(e) => setTargetDuration(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-white/15 bg-slate-950/80 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Preferred Time
              </label>
              <input
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-white/15 bg-slate-950/80 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Color & Icon Theme */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Theme Accent Color
            </label>
            <div className="flex items-center gap-2">
              {COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-950' : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Frequency & Days */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Frequency
            </label>
            <div className="grid grid-cols-4 gap-1.5 mb-2">
              {[
                { type: 'daily', label: 'Every Day' },
                { type: 'weekdays', label: 'Weekdays' },
                { type: 'weekends', label: 'Weekends' },
                { type: 'custom', label: 'Custom' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.type}
                  onClick={() => {
                    const t = opt.type as FrequencyType;
                    setFrequencyType(t);
                    if (t === 'daily') setFrequencyDays([0, 1, 2, 3, 4, 5, 6]);
                    if (t === 'weekdays') setFrequencyDays([1, 2, 3, 4, 5]);
                    if (t === 'weekends') setFrequencyDays([0, 6]);
                  }}
                  className={`py-1.5 px-2 text-xs font-medium rounded-xl border transition-all ${
                    frequencyType === opt.type
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold shadow-xs'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Day of week toggles for custom */}
            {frequencyType === 'custom' && (
              <div className="flex items-center justify-between pt-1">
                {DAYS_LABEL.map((day, idx) => {
                  const isSelected = frequencyDays.includes(idx);
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => toggleDay(idx)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                          : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-white/15 bg-slate-950/80 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                End Date (optional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-white/15 bg-slate-950/80 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-95 rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
            >
              {initialHabit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
