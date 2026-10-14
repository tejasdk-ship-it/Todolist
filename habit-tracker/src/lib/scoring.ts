import { Habit, HabitCompletion } from '@/types';

export const SCORING_RULES = {
  HABIT_COMPLETION_POINTS: 10,
  PERFECT_DAY_BONUS: 5,
  SEVEN_DAY_PERFECT_STREAK_BONUS: 20,
};

/**
 * Calculates whether a habit is scheduled on a given day of the week (0 = Sunday, 6 = Saturday)
 */
export function isHabitScheduledOnDate(habit: Habit, dateStr: string): boolean {
  if (habit.status === 'archived') return false;
  if (habit.start_date && dateStr < habit.start_date) return false;
  if (habit.end_date && dateStr > habit.end_date) return false;

  const dateObj = new Date(dateStr + 'T00:00:00');
  const dayOfWeek = dateObj.getDay();

  if (habit.frequency_type === 'daily') return true;
  if (habit.frequency_type === 'weekdays') return dayOfWeek >= 1 && dayOfWeek <= 5;
  if (habit.frequency_type === 'weekends') return dayOfWeek === 0 || dayOfWeek === 6;
  if (habit.frequency_type === 'custom' && habit.frequency_days) {
    return habit.frequency_days.includes(dayOfWeek);
  }
  return true;
}

/**
 * Calculates points earned on a specific date for a user
 */
export function calculateDatePoints(
  dateStr: string,
  userHabits: Habit[],
  completionsForDate: HabitCompletion[]
): {
  points: number;
  scheduledCount: number;
  completedCount: number;
  isPerfectDay: boolean;
} {
  const scheduledHabits = userHabits.filter((h) => isHabitScheduledOnDate(h, dateStr));
  const scheduledCount = scheduledHabits.length;

  if (scheduledCount === 0) {
    return { points: 0, scheduledCount: 0, completedCount: 0, isPerfectDay: false };
  }

  const completedMap = new Set(
    completionsForDate.filter((c) => c.completed).map((c) => c.habit_id)
  );

  let completedScheduledCount = 0;
  scheduledHabits.forEach((habit) => {
    if (completedMap.has(habit.id)) {
      completedScheduledCount += 1;
    }
  });

  let points = completedScheduledCount * SCORING_RULES.HABIT_COMPLETION_POINTS;
  const isPerfectDay = completedScheduledCount === scheduledCount && scheduledCount > 0;

  if (isPerfectDay) {
    points += SCORING_RULES.PERFECT_DAY_BONUS;
  }

  return {
    points,
    scheduledCount,
    completedCount: completedScheduledCount,
    isPerfectDay,
  };
}

/**
 * Calculates current streak and longest streak accurately
 */
export function calculateStreaks(
  userHabits: Habit[],
  allCompletions: HabitCompletion[],
  todayStr: string
): { currentStreak: number; longestStreak: number } {
  const completionMap = new Map<string, Set<string>>(); // date -> Set<habit_id>

  allCompletions.forEach((c) => {
    if (c.completed) {
      if (!completionMap.has(c.completion_date)) {
        completionMap.set(c.completion_date, new Set());
      }
      completionMap.get(c.completion_date)!.add(c.habit_id);
    }
  });

  const checkDatePerfect = (dStr: string): { scheduled: number; perfect: boolean } => {
    const scheduled = userHabits.filter((h) => isHabitScheduledOnDate(h, dStr));
    if (scheduled.length === 0) return { scheduled: 0, perfect: true }; // rest day
    const completedSet = completionMap.get(dStr);
    if (!completedSet) return { scheduled: scheduled.length, perfect: false };
    const allDone = scheduled.every((h) => completedSet.has(h.id));
    return { scheduled: scheduled.length, perfect: allDone };
  };

  let currentStreak = 0;
  let tempDate = new Date(todayStr + 'T00:00:00');

  // Check today first
  const todayResult = checkDatePerfect(todayStr);
  let streakActive = true;

  if (todayResult.scheduled > 0 && !todayResult.perfect) {
    // If today is not finished yet, streak can continue from yesterday
    tempDate.setDate(tempDate.getDate() - 1);
  }

  // Count backwards from current active date
  for (let i = 0; i < 365; i++) {
    const dStr = tempDate.toISOString().split('T')[0];
    const res = checkDatePerfect(dStr);

    if (res.scheduled === 0) {
      // Free day / no habits scheduled - doesn't break streak
      tempDate.setDate(tempDate.getDate() - 1);
      continue;
    }

    if (res.perfect) {
      currentStreak += 1;
      tempDate.setDate(tempDate.getDate() - 1);
    } else {
      break;
    }
  }

  // For longest streak, scan past 120 days
  let longestStreak = currentStreak;
  let runningStreak = 0;
  const scanDate = new Date(todayStr + 'T00:00:00');
  scanDate.setDate(scanDate.getDate() - 120);

  for (let i = 0; i <= 120; i++) {
    const dStr = scanDate.toISOString().split('T')[0];
    const res = checkDatePerfect(dStr);
    if (res.scheduled > 0) {
      if (res.perfect) {
        runningStreak += 1;
        if (runningStreak > longestStreak) longestStreak = runningStreak;
      } else {
        runningStreak = 0;
      }
    }
    scanDate.setDate(scanDate.getDate() + 1);
  }

  return { currentStreak, longestStreak };
}
