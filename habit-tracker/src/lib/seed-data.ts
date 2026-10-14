import { Habit, HabitCompletion, UserProfile, LeaderboardEntry, GroupChallenge } from '@/types';

export const INITIAL_USER: UserProfile = {
  id: 'user-primary-001',
  username: 'alex_tracker',
  full_name: 'Alex Tracker',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  bio: 'Building consistent daily habits for lifelong health & coding mastery.',
  age: 26,
  timezone: 'America/New_York',
  wake_up_time: '06:30',
  daily_goal: 'Stay consistent, embrace deep work, and meditate daily.',
  privacy: 'public',
  total_points: 440,
  current_streak: 12,
  longest_streak: 19,
  created_at: '2026-09-01T08:00:00Z',
};

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    user_id: 'user-primary-001',
    name: 'Morning Workout & Cardio',
    description: 'High intensity interval training or brisk morning run.',
    category: 'Fitness',
    icon: 'Activity',
    color: '#10b981',
    target_duration_minutes: 30,
    preferred_time: '07:00',
    deadline_time: '08:30',
    frequency_type: 'daily',
    frequency_days: [0, 1, 2, 3, 4, 5, 6],
    start_date: '2026-09-01',
    priority: 'High',
    status: 'active',
    created_at: '2026-09-01T07:00:00Z',
  },
  {
    id: 'habit-2',
    user_id: 'user-primary-001',
    name: 'Read Non-Fiction Book',
    description: 'Read 20+ pages on psychology, systems thinking or architecture.',
    category: 'Learning',
    icon: 'BookOpen',
    color: '#6366f1',
    target_duration_minutes: 25,
    preferred_time: '21:00',
    deadline_time: '22:30',
    frequency_type: 'daily',
    frequency_days: [0, 1, 2, 3, 4, 5, 6],
    start_date: '2026-09-01',
    priority: 'Medium',
    status: 'active',
    created_at: '2026-09-01T07:00:00Z',
  },
  {
    id: 'habit-3',
    user_id: 'user-primary-001',
    name: 'Deep Work & Coding',
    description: 'Focused coding on side projects and algorithms without interruptions.',
    category: 'Career',
    icon: 'Code2',
    color: '#f59e0b',
    target_duration_minutes: 60,
    preferred_time: '09:30',
    deadline_time: '12:00',
    frequency_type: 'weekdays',
    frequency_days: [1, 2, 3, 4, 5],
    start_date: '2026-09-01',
    priority: 'High',
    status: 'active',
    created_at: '2026-09-01T07:00:00Z',
  },
  {
    id: 'habit-4',
    user_id: 'user-primary-001',
    name: 'Mindful Meditation',
    description: '10-15 minutes box breathing and mindfulness session.',
    category: 'Mindfulness',
    icon: 'Sparkles',
    color: '#06b6d4',
    target_duration_minutes: 15,
    preferred_time: '06:45',
    deadline_time: '08:00',
    frequency_type: 'daily',
    frequency_days: [0, 1, 2, 3, 4, 5, 6],
    start_date: '2026-09-01',
    priority: 'Medium',
    status: 'active',
    created_at: '2026-09-01T07:00:00Z',
  },
  {
    id: 'habit-5',
    user_id: 'user-primary-001',
    name: 'Hydration Target (2.5 Liters)',
    description: 'Consistent water intake throughout the entire day.',
    category: 'Health',
    icon: 'Droplets',
    color: '#059669',
    target_duration_minutes: 5,
    preferred_time: '08:00',
    deadline_time: '20:00',
    frequency_type: 'daily',
    frequency_days: [0, 1, 2, 3, 4, 5, 6],
    start_date: '2026-09-01',
    priority: 'Low',
    status: 'active',
    created_at: '2026-09-01T07:00:00Z',
  },
];

// Generate past 30 days of completions
export function generatePastCompletions(todayStr: string = '2026-10-14'): HabitCompletion[] {
  const completions: HabitCompletion[] = [];
  const baseDate = new Date(todayStr + 'T00:00:00');

  for (let i = 28; i >= 1; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();

    // Past 12 days are 100% completed (active streak)
    const isStreakDay = i <= 12;
    // Some older days had 1 missed or partial
    const isPartialDay = i === 15 || i === 22;

    INITIAL_HABITS.forEach((h) => {
      // Check if scheduled
      let scheduled = true;
      if (h.frequency_type === 'weekdays') scheduled = dayOfWeek >= 1 && dayOfWeek <= 5;

      if (scheduled) {
        let completed = true;
        if (isPartialDay && (h.id === 'habit-3' || h.id === 'habit-2')) {
          completed = false;
        }

        if (completed) {
          completions.push({
            id: `comp-${dateStr}-${h.id}`,
            habit_id: h.id,
            user_id: 'user-primary-001',
            completion_date: dateStr,
            completed: true,
            completed_at: `${dateStr}T12:00:00Z`,
            actual_duration_minutes: h.target_duration_minutes,
            notes: i % 4 === 0 ? 'Felt energized and focused today!' : undefined,
            created_at: `${dateStr}T12:00:00Z`,
          });
        }
      }
    });
  }

  // Today (2026-10-14): partially completed (2 completed, 3 pending)
  completions.push({
    id: `comp-${todayStr}-habit-4`,
    habit_id: 'habit-4',
    user_id: 'user-primary-001',
    completion_date: todayStr,
    completed: true,
    completed_at: `${todayStr}T07:15:00Z`,
    actual_duration_minutes: 15,
    notes: 'Peaceful morning meditation in the garden.',
    created_at: `${todayStr}T07:15:00Z`,
  });

  completions.push({
    id: `comp-${todayStr}-habit-1`,
    habit_id: 'habit-1',
    user_id: 'user-primary-001',
    completion_date: todayStr,
    completed: true,
    completed_at: `${todayStr}T07:50:00Z`,
    actual_duration_minutes: 35,
    notes: 'Ran 4.2 km at 5:15 pace.',
    created_at: `${todayStr}T07:50:00Z`,
  });

  return completions;
}

export const LEADERBOARD_USERS: LeaderboardEntry[] = [
  {
    rank: 1,
    user: {
      id: 'user-002',
      username: 'sarah_fitness',
      full_name: 'Sarah Jenkins',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      bio: 'Marathon runner & early bird',
      timezone: 'America/New_York',
      privacy: 'public',
      total_points: 620,
      current_streak: 24,
      longest_streak: 45,
      created_at: '2026-08-10T00:00:00Z',
    },
    totalActiveHabits: 5,
    completedToday: 5,
    todayPercentage: 100,
    periodPoints: 620,
    currentStreak: 24,
    weeklyConsistencyRate: 98,
    statusTag: 'Leading the Board',
  },
  {
    rank: 2,
    user: {
      id: 'user-003',
      username: 'marcus_dev',
      full_name: 'Marcus Vance',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      bio: 'Full stack engineer building daily consistency',
      timezone: 'America/Los_Angeles',
      privacy: 'public',
      total_points: 540,
      current_streak: 18,
      longest_streak: 30,
      created_at: '2026-08-15T00:00:00Z',
    },
    totalActiveHabits: 4,
    completedToday: 4,
    todayPercentage: 100,
    periodPoints: 540,
    currentStreak: 18,
    weeklyConsistencyRate: 94,
    statusTag: 'Perfect Day',
  },
  {
    rank: 3,
    user: INITIAL_USER,
    totalActiveHabits: 5,
    completedToday: 2,
    todayPercentage: 40,
    periodPoints: 440,
    currentStreak: 12,
    weeklyConsistencyRate: 91,
    statusTag: 'On Track',
  },
  {
    rank: 4,
    user: {
      id: 'user-004',
      username: 'elena_mind',
      full_name: 'Elena Rostova',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      bio: 'Daily mindfulness & book reviewer',
      timezone: 'Europe/London',
      privacy: 'public',
      total_points: 410,
      current_streak: 14,
      longest_streak: 21,
      created_at: '2026-08-20T00:00:00Z',
    },
    totalActiveHabits: 3,
    completedToday: 2,
    todayPercentage: 66,
    periodPoints: 410,
    currentStreak: 14,
    weeklyConsistencyRate: 88,
    statusTag: 'On Track',
  },
  {
    rank: 5,
    user: {
      id: 'user-005',
      username: 'david_chen',
      full_name: 'David Chen',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      bio: 'Product designer focusing on habits',
      timezone: 'America/Chicago',
      privacy: 'public',
      total_points: 320,
      current_streak: 6,
      longest_streak: 12,
      created_at: '2026-09-05T00:00:00Z',
    },
    totalActiveHabits: 4,
    completedToday: 1,
    todayPercentage: 25,
    periodPoints: 320,
    currentStreak: 6,
    weeklyConsistencyRate: 72,
    statusTag: 'Needs a Push',
  },
];

export const INITIAL_GROUPS: GroupChallenge[] = [
  {
    id: 'grp-1',
    name: '30-Day Productivity Sprint',
    description: 'A community challenge to maintain uninterrupted daily coding and exercise.',
    owner_id: 'user-002',
    invite_code: 'SPRINT30',
    created_at: '2026-10-01T00:00:00Z',
    members_count: 8,
  },
  {
    id: 'grp-2',
    name: 'Mindful Morning Club',
    description: 'Waking up before 7am, meditation, and reading 20 minutes.',
    owner_id: 'user-004',
    invite_code: 'MORNING7',
    created_at: '2026-10-05T00:00:00Z',
    members_count: 5,
  },
];
