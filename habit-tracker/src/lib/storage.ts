'use client';

import {
  Habit,
  HabitCompletion,
  UserProfile,
  LeaderboardEntry,
  GroupChallenge,
  Friendship,
  FriendMessage,
} from '@/types';
import {
  INITIAL_USER,
  INITIAL_HABITS,
  generatePastCompletions,
  LEADERBOARD_USERS,
  INITIAL_GROUPS,
} from './seed-data';
import {
  calculateDatePoints,
  calculateStreaks,
  isHabitScheduledOnDate,
  SCORING_RULES,
} from './scoring';
import { getTodayDateString } from './utils';

const STORAGE_KEYS = {
  AUTH_LOGGED_IN: 'habittracker_auth_logged_in',
  USER: 'habittracker_user_profile',
  HABITS: 'habittracker_habits',
  COMPLETIONS: 'habittracker_completions',
  FRIENDSHIPS: 'habittracker_friendships',
  GROUPS: 'habittracker_groups',
  LEADERBOARD: 'habittracker_leaderboard',
  MESSAGES: 'habittracker_messages',
};

const INITIAL_MESSAGES: FriendMessage[] = [
  {
    id: 'msg-1',
    sender_id: 'user-002',
    receiver_id: 'user-primary-001',
    sender_name: 'Sarah Jenkins',
    sender_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    content: "Awesome consistency on the morning run today! Let's hit that 100% daily completion! 🔥",
    created_at: '2026-10-14T08:15:00Z',
    is_cheer: true,
  },
  {
    id: 'msg-2',
    sender_id: 'user-primary-001',
    receiver_id: 'user-002',
    sender_name: 'Alex Tracker',
    sender_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    content: 'Thanks Sarah! Your 24-day streak is super motivating. Going to finish the coding block this afternoon!',
    created_at: '2026-10-14T08:30:00Z',
  },
  {
    id: 'msg-3',
    sender_id: 'user-004',
    receiver_id: 'user-primary-001',
    sender_name: 'Elena Rostova',
    sender_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    content: 'Loved the meditation notes today. Remember: 15 minutes of calm sets the tone for the entire day. 🧘‍♀️✨',
    created_at: '2026-10-14T09:05:00Z',
    is_cheer: true,
  },
];

export class AppStorage {
  private static isClient(): boolean {
    return typeof window !== 'undefined';
  }

  // --- Auth Session ---
  static isLoggedIn(): boolean {
    if (!this.isClient()) return true;
    const val = localStorage.getItem(STORAGE_KEYS.AUTH_LOGGED_IN);
    return val !== 'false'; // default to logged in with demo user
  }

  static setLoggedIn(status: boolean): void {
    if (!this.isClient()) return;
    localStorage.setItem(STORAGE_KEYS.AUTH_LOGGED_IN, status ? 'true' : 'false');
  }

  // --- User Profile ---
  static getUser(): UserProfile {
    if (!this.isClient()) return INITIAL_USER;
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) {
      this.setUser(INITIAL_USER);
      return INITIAL_USER;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USER;
    }
  }

  static setUser(user: UserProfile): void {
    if (!this.isClient()) return;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  // --- Habits ---
  static getHabits(): Habit[] {
    if (!this.isClient()) return INITIAL_HABITS;
    const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (!raw) {
      this.setHabits(INITIAL_HABITS);
      return INITIAL_HABITS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_HABITS;
    }
  }

  static setHabits(habits: Habit[]): void {
    if (!this.isClient()) return;
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  }

  static addHabit(newHabit: Omit<Habit, 'id' | 'created_at'>): Habit {
    const habits = this.getHabits();
    const created: Habit = {
      ...newHabit,
      id: `habit-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    habits.unshift(created);
    this.setHabits(habits);
    return created;
  }

  static updateHabit(id: string, updates: Partial<Habit>): Habit | null {
    const habits = this.getHabits();
    const index = habits.findIndex((h) => h.id === id);
    if (index === -1) return null;
    habits[index] = {
      ...habits[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.setHabits(habits);
    return habits[index];
  }

  static deleteHabit(id: string): void {
    const habits = this.getHabits().filter((h) => h.id !== id);
    this.setHabits(habits);
  }

  // --- Completions ---
  static getCompletions(): HabitCompletion[] {
    if (!this.isClient()) return generatePastCompletions(getTodayDateString());
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETIONS);
    if (!raw) {
      const initial = generatePastCompletions(getTodayDateString());
      this.setCompletions(initial);
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static setCompletions(completions: HabitCompletion[]): void {
    if (!this.isClient()) return;
    localStorage.setItem(STORAGE_KEYS.COMPLETIONS, JSON.stringify(completions));
  }

  /**
   * Toggles completion for a habit on a specific date.
   */
  static toggleHabitCompletion(
    habitId: string,
    dateStr: string,
    actualDuration?: number,
    notes?: string
  ): { completion: HabitCompletion; isCompleted: boolean } {
    const user = this.getUser();
    const habits = this.getHabits();
    const completions = this.getCompletions();

    const existingIndex = completions.findIndex(
      (c) => c.habit_id === habitId && c.completion_date === dateStr
    );

    let isCompleted = true;
    let resultCompletion: HabitCompletion;

    if (existingIndex > -1) {
      // Toggle
      const existing = completions[existingIndex];
      isCompleted = !existing.completed;
      existing.completed = isCompleted;
      existing.completed_at = new Date().toISOString();
      if (actualDuration !== undefined) existing.actual_duration_minutes = actualDuration;
      if (notes !== undefined) existing.notes = notes;
      existing.updated_at = new Date().toISOString();
      resultCompletion = existing;
      completions[existingIndex] = existing;
    } else {
      // Create new
      const habit = habits.find((h) => h.id === habitId);
      resultCompletion = {
        id: `comp-${dateStr}-${habitId}`,
        habit_id: habitId,
        user_id: user.id,
        completion_date: dateStr,
        completed: true,
        completed_at: new Date().toISOString(),
        actual_duration_minutes: actualDuration ?? habit?.target_duration_minutes ?? 15,
        notes: notes ?? '',
        created_at: new Date().toISOString(),
      };
      completions.push(resultCompletion);
      isCompleted = true;
    }

    this.setCompletions(completions);
    this.recalculateUserStats(dateStr);

    return { completion: resultCompletion, isCompleted };
  }

  /**
   * Recalculates streak and point totals for the active user
   */
  static recalculateUserStats(todayStr: string = getTodayDateString()): void {
    const user = this.getUser();
    const habits = this.getHabits();
    const completions = this.getCompletions();

    const { currentStreak, longestStreak } = calculateStreaks(habits, completions, todayStr);

    // Sum points from all completed habits
    let totalPoints = 0;
    const completedSet = new Set<string>();

    completions.forEach((c) => {
      if (c.completed) {
        totalPoints += SCORING_RULES.HABIT_COMPLETION_POINTS;
        completedSet.add(c.completion_date);
      }
    });

    // Add perfect day bonus
    completedSet.forEach((dStr) => {
      const scheduled = habits.filter((h) => isHabitScheduledOnDate(h, dStr));
      if (scheduled.length > 0) {
        const completedOnDate = completions.filter((c) => c.completion_date === dStr && c.completed);
        if (completedOnDate.length >= scheduled.length) {
          totalPoints += SCORING_RULES.PERFECT_DAY_BONUS;
        }
      }
    });

    const updatedUser: UserProfile = {
      ...user,
      total_points: Math.max(totalPoints, user.total_points),
      current_streak: currentStreak,
      longest_streak: Math.max(longestStreak, user.longest_streak),
      updated_at: new Date().toISOString(),
    };

    this.setUser(updatedUser);
  }

  // --- Leaderboard ---
  static getLeaderboard(): LeaderboardEntry[] {
    if (!this.isClient()) return LEADERBOARD_USERS;
    const user = this.getUser();
    const habits = this.getHabits().filter((h) => h.status === 'active');
    const completions = this.getCompletions();
    const todayStr = getTodayDateString();

    const scheduledToday = habits.filter((h) => isHabitScheduledOnDate(h, todayStr));
    const completedToday = completions.filter(
      (c) => c.completion_date === todayStr && c.completed
    );

    const todayPercentage =
      scheduledToday.length > 0
        ? Math.round((completedToday.length / scheduledToday.length) * 100)
        : 0;

    let statusTag: LeaderboardEntry['statusTag'] = 'On Track';
    if (todayPercentage === 100) statusTag = 'Perfect Day';
    else if (todayPercentage < 40) statusTag = 'Needs a Push';

    // Update current user's entry
    const entries = [...LEADERBOARD_USERS];
    const userEntryIndex = entries.findIndex((e) => e.user.id === user.id);

    const currentUserEntry: LeaderboardEntry = {
      rank: 3,
      user: user,
      totalActiveHabits: habits.length,
      completedToday: completedToday.length,
      todayPercentage,
      periodPoints: user.total_points,
      currentStreak: user.current_streak,
      weeklyConsistencyRate: 91,
      statusTag,
    };

    if (userEntryIndex > -1) {
      entries[userEntryIndex] = currentUserEntry;
    } else {
      entries.push(currentUserEntry);
    }

    // Sort by points desc, then percentage desc
    entries.sort((a, b) => {
      if (b.periodPoints !== a.periodPoints) return b.periodPoints - a.periodPoints;
      return b.todayPercentage - a.todayPercentage;
    });

    // Re-rank
    entries.forEach((entry, idx) => {
      entry.rank = idx + 1;
      if (entry.rank === 1) entry.statusTag = 'Leading the Board';
    });

    return entries;
  }

  // --- Friends & Groups ---
  static getGroups(): GroupChallenge[] {
    if (!this.isClient()) return INITIAL_GROUPS;
    const raw = localStorage.getItem(STORAGE_KEYS.GROUPS);
    if (!raw) {
      this.setGroups(INITIAL_GROUPS);
      return INITIAL_GROUPS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_GROUPS;
    }
  }

  static setGroups(groups: GroupChallenge[]): void {
    if (!this.isClient()) return;
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  }

  static createGroup(name: string, description: string): GroupChallenge {
    const groups = this.getGroups();
    const user = this.getUser();
    const newGroup: GroupChallenge = {
      id: `grp-${Date.now()}`,
      name,
      description,
      owner_id: user.id,
      invite_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      created_at: new Date().toISOString(),
      members_count: 1,
    };
    groups.unshift(newGroup);
    this.setGroups(groups);
    return newGroup;
  }

  // --- Friend Messaging & Cheers ---
  static getMessages(friendId?: string): FriendMessage[] {
    if (!this.isClient()) return INITIAL_MESSAGES;
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    let msgs: FriendMessage[] = [];
    if (!raw) {
      this.setMessages(INITIAL_MESSAGES);
      msgs = INITIAL_MESSAGES;
    } else {
      try {
        msgs = JSON.parse(raw);
      } catch {
        msgs = INITIAL_MESSAGES;
      }
    }

    if (friendId) {
      const user = this.getUser();
      return msgs.filter(
        (m) =>
          (m.sender_id === user.id && m.receiver_id === friendId) ||
          (m.sender_id === friendId && m.receiver_id === user.id)
      );
    }
    return msgs;
  }

  static setMessages(messages: FriendMessage[]): void {
    if (!this.isClient()) return;
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }

  static sendMessage(receiverId: string, content: string, isCheer?: boolean): FriendMessage {
    const user = this.getUser();
    const msgs = this.getMessages();
    const newMsg: FriendMessage = {
      id: `msg-${Date.now()}`,
      sender_id: user.id,
      receiver_id: receiverId,
      sender_name: user.full_name,
      sender_avatar: user.avatar_url,
      content,
      created_at: new Date().toISOString(),
      is_cheer: Boolean(isCheer),
    };
    msgs.push(newMsg);
    this.setMessages(msgs);
    return newMsg;
  }

  // Reset to default seed
  static resetToDemoData(): void {
    if (!this.isClient()) return;
    localStorage.clear();
    this.setUser(INITIAL_USER);
    this.setHabits(INITIAL_HABITS);
    this.setCompletions(generatePastCompletions(getTodayDateString()));
    this.setGroups(INITIAL_GROUPS);
    this.setMessages(INITIAL_MESSAGES);
    this.setLoggedIn(true);
  }
}
