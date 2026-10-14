export type HabitCategory =
  | 'Health'
  | 'Fitness'
  | 'Learning'
  | 'Career'
  | 'Personal Growth'
  | 'Mindfulness'
  | 'Other';

export type HabitPriority = 'Low' | 'Medium' | 'High';

export type HabitStatus = 'active' | 'paused' | 'archived';

export type FrequencyType = 'daily' | 'weekdays' | 'weekends' | 'custom';

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  age?: number;
  timezone: string;
  wake_up_time?: string;
  daily_goal?: string;
  privacy: 'public' | 'friends_only' | 'private';
  total_points: number;
  current_streak: number;
  longest_streak: number;
  created_at: string;
  updated_at?: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  icon: string;
  color: string;
  target_duration_minutes: number;
  preferred_time?: string;
  deadline_time?: string;
  frequency_type: FrequencyType;
  frequency_days: number[]; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  start_date: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  priority: HabitPriority;
  status: HabitStatus;
  created_at: string;
  updated_at?: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completion_date: string; // YYYY-MM-DD
  completed: boolean;
  completed_at: string;
  actual_duration_minutes?: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface DaySummary {
  date: string; // YYYY-MM-DD
  totalScheduled: number;
  completedCount: number;
  percentage: number;
  status: 'completed' | 'partial' | 'missed' | 'none' | 'future';
}

export interface Friendship {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  friend_profile?: UserProfile;
}

export interface GroupChallenge {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  invite_code: string;
  created_at: string;
  members_count: number;
}

export interface LeaderboardEntry {
  rank: number;
  user: UserProfile;
  totalActiveHabits: number;
  completedToday: number;
  todayPercentage: number;
  periodPoints: number;
  currentStreak: number;
  weeklyConsistencyRate: number;
  statusTag: 'Leading the Board' | 'Perfect Day' | 'On Track' | 'Needs a Push';
}
