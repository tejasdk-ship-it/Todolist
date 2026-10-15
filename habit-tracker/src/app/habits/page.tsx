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
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row pb-20 lg:pb-0">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                    selectedStatus === tab.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
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
                className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Habit Cards Grid */}
          {filteredHabits.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">No Habits Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                No habits match your active filters. Create a new habit or adjust the status filter.
              </p>
              <button
                onClick={() => {
                  setEditingHabit(null);
                  setIsAddModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all"
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
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: Category Pill & Status Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-2xs"
                          style={{ backgroundColor: habit.color }}
                        >
                          {habit.category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              habit.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : habit.status === 'paused'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {habit.status}
                          </span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {habit.name}
                      </h3>
                      {habit.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {habit.description}
                        </p>
                      )}

                      {/* Metadata Badges */}
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Target Duration
                          </span>
                          <span className="font-semibold text-slate-800">
                            {habit.target_duration_minutes} mins
                          </span>
                        </div>

                        {habit.preferred_time && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> Scheduled Time
                            </span>
                            <span className="font-semibold text-slate-800">
                              {formatTime(habit.preferred_time)}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> Frequency
                          </span>
                          <span className="font-semibold text-slate-800 capitalize">
                            {habit.frequency_type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleStatus(habit)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          title={habit.status === 'active' ? 'Pause Habit' : 'Resume Habit'}
                        >
                          {habit.status === 'active' ? (
                            <Pause className="w-4 h-4 text-amber-600" />
                          ) : (
                            <Play className="w-4 h-4 text-emerald-600" />
                          )}
                        </button>

                        <button
                          onClick={() => handleArchive(habit)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
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
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Habit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteTargetId(habit.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Habit?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to delete this habit? To preserve your historical streak and calendar records, you can choose to <strong>Archive</strong> instead.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-xs"
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
