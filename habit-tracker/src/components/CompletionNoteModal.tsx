'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Clock, FileText, Trash2 } from 'lucide-react';
import { Habit, HabitCompletion } from '@/types';

interface CompletionNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit;
  completion?: HabitCompletion;
  dateStr: string;
  onSave: (actualDuration: number, notes: string) => void;
  onUndo: () => void;
}

export function CompletionNoteModal({
  isOpen,
  onClose,
  habit,
  completion,
  dateStr,
  onSave,
  onUndo,
}: CompletionNoteModalProps) {
  const [duration, setDuration] = useState(
    completion?.actual_duration_minutes ?? habit.target_duration_minutes
  );
  const [notes, setNotes] = useState(completion?.notes ?? '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: habit.color }}
            >
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{habit.name}</h3>
              <p className="text-xs text-slate-500">Record activity details for {dateStr}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Actual Duration Spent (minutes)
            </label>
            <input
              type="number"
              min={1}
              max={600}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Target duration was {habit.target_duration_minutes} minutes
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Activity Notes & Reflections (optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Read chapter 4 on feedback loops, went on high incline, felt energized..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {completion?.completed ? (
              <button
                type="button"
                onClick={() => {
                  onUndo();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Undo Completion
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onSave(duration, notes);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-xs transition-all"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
