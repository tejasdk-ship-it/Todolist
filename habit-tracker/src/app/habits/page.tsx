'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  Edit2,
  Archive,
  Trash2,
  Play,
  Pause,
  AlertTriangle,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { AppStorage } from '@/lib/storage';
import { Habit, HabitCategory, HabitStatus } from '@/types';
import { formatTime } from '@/lib/utils';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { Navbar } from '@/components/Navbar';
import { AddHabitModal } from '@/components/AddHabitModal';
import { Pagination } from '@/components/Pagination';

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [currentPage, setCurrentPage] = useState(1);
  const HABITS_PER_PAGE = 6;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const loadHabits = () => {
    setHabits(AppStorage.getHabits());
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const handleToggleStatus = (habit: Habit) => {
    const nextStatus: HabitStatus = habit.status === 'active' ? 'paused' : 'active';
    AppStorage.updateHabit(habit.id, { status: nextStatus });
    loadHabits();
  };

  const handleArchive = (habit: Habit) => {
    const nextStatus: HabitStatus = habit.status === 'archived' ? 'active' : 'archived';
    AppStorage.updateHabit(habit.id, { status: nextStatus });
    loadHabits();
  };

  const confirmDelete = () => {
    if (!deleteTargetId) return;
    AppStorage.deleteHabit(deleteTargetId);
    setDeleteTargetId(null);
    loadHabits();
  };

  // Filtering
  const filteredHabits = habits.filter((h) => {
    const matchesCategory = selectedCategory === 'All' || h.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || h.status === selectedStatus;
    return matchesCategory && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredHabits.length / HABITS_PER_PAGE));
  const paginatedHabits = filteredHabits.slice(
    (currentPage - 1) * HABITS_PER_PAGE,
    currentPage * HABITS_PER_PAGE
  );

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleStatusSelect = (st: string) => {
    setSelectedStatus(st);
    setCurrentPage(1);
  };

  const CATEGORIES = [
    'All',
    'Health',
    'Fitness',
    'Learning',
    'Career',
    'Personal Growth',
    'Mindfulness',
    'Other',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row pb-20 lg:pb-0">
      <Sidebar />

      <div className="flex-1 lg:pl-64 flex flex-col">
        <Navbar
          title="Habit Management"
          subtitle="Organize, customize, and maintain your routines"
          onAddHabitClick={() => {
            setEditingHabit(null);
            setIsAddModalOpen(true);
          }}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-xl">
            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'active', label: 'Active' },
                { id: 'paused', label: 'Paused' },
                { id: 'archived', label: 'Archived' },
                { id: 'all', label: 'All' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleStatusSelect(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedStatus === tab.id
                      ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategorySelect(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-950 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Habit Cards Grid */}
          {filteredHabits.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-dashed border-white/15">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3 border border-white/10">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">No Habits Found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                No habits match your active filters. Create a new habit or adjust the status filter.
              </p>
              <button
                onClick={() => {
                  setEditingHabit(null);
                  setIsAddModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
              >
                Add Your First Habit
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedHabits.map((habit) => (
                  <div
                    key={habit.id}
                    className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-5 shadow-xl hover:border-white/25 hover:shadow-2xl transition-all flex flex-col justify-between text-white"
                  >
                    <div>
                      {/* Top Row: Category Pill & Status Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-xs"
                          style={{ backgroundColor: habit.color }}
                        >
                          {habit.category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              habit.status === 'active'
                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                                : habit.status === 'paused'
                                ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400 border border-white/10'
                            }`}
                          >
                            {habit.status}
                          </span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-base font-bold text-white leading-snug">
                        {habit.name}
                      </h3>

                      {habit.description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {habit.description}
                        </p>
                      )}

                      {/* Metadata Badges */}
                      <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-xs text-slate-300">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" /> Target Duration
                          </span>
                          <span className="font-semibold text-slate-200">
                            {habit.target_duration_minutes} mins
                          </span>
                        </div>

                        {habit.preferred_time && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-500" /> Scheduled Time
                            </span>
                            <span className="font-semibold text-slate-200">
                              {formatTime(habit.preferred_time)}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" /> Frequency
                          </span>
                          <span className="font-semibold text-slate-200 capitalize">
                            {habit.frequency_type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleStatus(habit)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                          title={habit.status === 'active' ? 'Pause Habit' : 'Resume Habit'}
                        >
                          {habit.status === 'active' ? (
                            <Pause className="w-4 h-4 text-amber-400" />
                          ) : (
                            <Play className="w-4 h-4 text-emerald-400" />
                          )}
                        </button>

                        <button
                          onClick={() => handleArchive(habit)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                          title={habit.status === 'archived' ? 'Unarchive' : 'Archive Habit'}
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingHabit(habit);
                            setIsAddModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                          title="Edit Habit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteTargetId(habit.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
                          title="Delete Habit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredHabits.length}
                itemsPerPage={HABITS_PER_PAGE}
                onPageChange={setCurrentPage}
                label="habits"
              />
            </div>
          )}
        </main>
      </div>

      {/* Add / Edit Modal */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        initialHabit={editingHabit}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingHabit(null);
        }}
        onSuccess={() => {
          loadHabits();
          setEditingHabit(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/20 space-y-4 text-white">
            <div className="w-10 h-10 rounded-xl bg-rose-950/60 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Delete Habit?</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Are you sure you want to delete this habit? To preserve your historical streak and calendar records, you can choose to <strong className="text-white">Archive</strong> instead.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-md shadow-rose-950"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <MobileNav />
    </div>
  );
}
