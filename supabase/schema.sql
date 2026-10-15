-- ==========================================================
-- Daily Habit Tracker Database Schema
-- Compatible with Supabase PostgreSQL and Row Level Security (RLS)
-- ==========================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    age INT,
    timezone VARCHAR(64) DEFAULT 'UTC',
    wake_up_time TIME,
    daily_goal TEXT,
    privacy VARCHAR(20) DEFAULT 'public' CHECK (privacy IN ('public', 'friends_only', 'private')),
    total_points INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HABITS TABLE
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('Health', 'Fitness', 'Learning', 'Career', 'Personal Growth', 'Mindfulness', 'Other')),
    icon TEXT DEFAULT 'CheckCircle2',
    color TEXT DEFAULT '#10b981',
    target_duration_minutes INT DEFAULT 15,
    preferred_time TIME,
    frequency_type TEXT DEFAULT 'daily' CHECK (frequency_type IN ('daily', 'weekdays', 'weekends', 'custom')),
    frequency_days INT[] DEFAULT '{0,1,2,3,4,5,6}', -- 0=Sunday, 1=Monday, ..., 6=Saturday
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HABIT COMPLETIONS TABLE
CREATE TABLE IF NOT EXISTS public.habit_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    completion_date DATE NOT NULL,
    completed BOOLEAN DEFAULT TRUE,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    actual_duration_minutes INT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_habit_completion_per_day UNIQUE(habit_id, completion_date)
);

-- 4. FRIENDSHIPS TABLE
CREATE TABLE IF NOT EXISTS public.friendships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_friendship UNIQUE(requester_id, receiver_id)
);

-- 5. GROUPS & GROUP MEMBERS
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    invite_code VARCHAR(20) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_group_member UNIQUE(group_id, user_id)
);

-- 6. POINT TRANSACTIONS (Optional Ledger for Audit & Scoring)
CREATE TABLE IF NOT EXISTS public.point_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    points INT NOT NULL,
    reason TEXT NOT NULL,
    related_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_status ON public.habits(status);
CREATE INDEX IF NOT EXISTS idx_completions_user_date ON public.habit_completions(user_id, completion_date);
CREATE INDEX IF NOT EXISTS idx_completions_habit_date ON public.habit_completions(habit_id, completion_date);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_points ON public.profiles(total_points DESC);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
-- Anyone authenticated can view public profiles for the leaderboard
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- HABITS POLICIES
CREATE POLICY "Users can view own habits" 
ON public.habits FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits" 
ON public.habits FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits" 
ON public.habits FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits" 
ON public.habits FOR DELETE 
USING (auth.uid() = user_id);

-- HABIT COMPLETIONS POLICIES
CREATE POLICY "Users can view own completions" 
ON public.habit_completions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions" 
ON public.habit_completions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own completions" 
ON public.habit_completions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own completions" 
ON public.habit_completions FOR DELETE 
USING (auth.uid() = user_id);

-- FRIENDSHIPS POLICIES
CREATE POLICY "Users can view their friendships" 
ON public.friendships FOR SELECT 
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create friendship requests" 
ON public.friendships FOR INSERT 
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update friendship requests sent to them" 
ON public.friendships FOR UPDATE 
USING (auth.uid() = receiver_id OR auth.uid() = requester_id);

CREATE POLICY "Users can delete their friendships" 
ON public.friendships FOR DELETE 
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- GROUPS & MEMBERS POLICIES
CREATE POLICY "Group members can view groups" 
ON public.groups FOR SELECT 
USING (
    auth.uid() = owner_id OR 
    EXISTS (SELECT 1 FROM public.group_members WHERE group_id = groups.id AND user_id = auth.uid())
);

CREATE POLICY "Users can create groups" 
ON public.groups FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update groups" 
ON public.groups FOR UPDATE 
USING (auth.uid() = owner_id);

CREATE POLICY "Members can view membership" 
ON public.group_members FOR SELECT 
USING (true);

CREATE POLICY "Users can join groups" 
ON public.group_members FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- POINT TRANSACTIONS POLICIES
CREATE POLICY "Users can view their point ledger" 
ON public.point_transactions FOR SELECT 
USING (auth.uid() = user_id);

-- ==========================================================
-- AUTOMATIC PROFILE TRIGGER ON SIGNUP
-- ==========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    raw_username TEXT;
    raw_full_name TEXT;
BEGIN
    raw_username := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));
    raw_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'Habit Tracker Member');

    INSERT INTO public.profiles (id, username, full_name, avatar_url, timezone, created_at, updated_at)
    VALUES (
        NEW.id,
        raw_username,
        raw_full_name,
        'https://api.dicebear.com/7.x/avataaars/svg?seed=' || raw_username,
        COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC'),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function on every new auth.users insertion
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================================
-- GRANT SCHEMA AND TABLE PERMISSIONS TO CLIENT ROLES
-- ==========================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated;

COMMENT ON TABLE public.habits IS 'Daily habits configured by individual users';
COMMENT ON TABLE public.habit_completions IS 'Daily completion records preventing duplicate days';
