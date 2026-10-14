-- ==========================================================
-- Daily Habit Tracker Seed Data
-- ==========================================================

-- Note: In Supabase, dummy user IDs can be generated or tested.
-- For demo users in public leaderboard testing:
INSERT INTO public.profiles (id, username, full_name, avatar_url, bio, timezone, daily_goal, total_points, current_streak, longest_streak)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'sarah_fitness', 'Sarah Jenkins', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Marathon runner & clean code enthusiast', 'America/New_York', 'Run 10km every 2 days', 580, 24, 45),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'marcus_dev', 'Marcus Vance', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', 'Full stack engineer building daily consistency', 'America/Los_Angeles', 'Code 1 hour every single day', 490, 18, 30),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'elena_mind', 'Elena Rostova', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'Meditation teacher & daily reader', 'Europe/London', 'Read 25 pages & meditate 20 mins', 420, 14, 21),
  ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'alex_lee', 'Alex Lee', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', 'Focusing on deep work & morning workouts', 'Asia/Tokyo', 'No phone before 9am', 360, 9, 14)
ON CONFLICT (id) DO NOTHING;
