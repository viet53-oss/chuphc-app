-- =====================================================
-- CHU PRECISION HEALTH CENTER - COMPLETE DATABASE SCHEMA
-- =====================================================
-- Run this SQL in your Supabase SQL Editor to reset/create everything.
-- This includes all tables needed for the app, including Members, Nutrition, Activity, Chat, and Settings.
-- =====================================================

-- 0. CLEANUP (Drop existing tables to avoid conflicts with old policies)
-- The CASCADE option ensures that policies and dependent objects are also removed.
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS nutrition_logs CASCADE;
DROP TABLE IF EXISTS stress_logs CASCADE;
DROP TABLE IF EXISTS sleep_logs CASCADE;
DROP TABLE IF EXISTS social_logs CASCADE;
DROP TABLE IF EXISTS substance_logs CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
-- Also drop functions to ensure clean slate
DROP FUNCTION IF EXISTS handle_new_user CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (Linked to Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  phone TEXT,
  avatar_url TEXT,
  precision_score INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'Beginner',
  achievement_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- 3. MEMBERS TABLE (Client Directory for Admin)
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Linked to auth.users.id manually
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  phone TEXT,
  auth_id UUID REFERENCES auth.users(id) -- Optional redundant link
);

alter table members enable row level security;
create policy "Enable all access for users" on members for all using (true) with check (true);

-- 4. ACTIVITY LOGS (Updated with Steps)
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL, -- walking, running, steps, etc.
  duration_minutes INTEGER DEFAULT 0,
  steps INTEGER DEFAULT 0, -- Added for step tracking
  intensity TEXT,
  calories_burned INTEGER,
  distance DECIMAL,
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

alter table activity_logs enable row level security;
create policy "Users can view own activity logs" on activity_logs for select using (auth.uid() = user_id);
create policy "Users can insert own activity logs" on activity_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own activity logs" on activity_logs for update using (auth.uid() = user_id);
create policy "Users can delete own activity logs" on activity_logs for delete using (auth.uid() = user_id);

-- 5. NUTRITION LOGS
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  meal_type TEXT NOT NULL,
  meal_name TEXT,
  calories INTEGER,
  protein DECIMAL,
  carbs DECIMAL,
  fats DECIMAL,
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

alter table nutrition_logs enable row level security;
create policy "Users can view own nutrition logs" on nutrition_logs for select using (auth.uid() = user_id);
create policy "Users can insert own nutrition logs" on nutrition_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own nutrition logs" on nutrition_logs for update using (auth.uid() = user_id);
create policy "Users can delete own nutrition logs" on nutrition_logs for delete using (auth.uid() = user_id);

-- 6. SUPPORTING LOG TABLES (Stress, Sleep, Social, Substance)

-- Stress
CREATE TABLE IF NOT EXISTS stress_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stress_level INTEGER NOT NULL,
  activity TEXT,
  duration_minutes INTEGER,
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
alter table stress_logs enable row level security;
create policy "Users can view own stress logs" on stress_logs for select using (auth.uid() = user_id);
create policy "Users can insert own stress logs" on stress_logs for insert with check (auth.uid() = user_id);

-- Sleep
CREATE TABLE IF NOT EXISTS sleep_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sleep_start TIMESTAMP WITH TIME ZONE NOT NULL,
  sleep_end TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_hours DECIMAL GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (sleep_end - sleep_start)) / 3600) STORED,
  quality INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
alter table sleep_logs enable row level security;
create policy "Users can view own sleep logs" on sleep_logs for select using (auth.uid() = user_id);
create policy "Users can insert own sleep logs" on sleep_logs for insert with check (auth.uid() = user_id);

-- Social
CREATE TABLE IF NOT EXISTS social_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,
  duration_minutes INTEGER,
  satisfaction_level INTEGER,
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
alter table social_logs enable row level security;
create policy "Users can view own social logs" on social_logs for select using (auth.uid() = user_id);
create policy "Users can insert own social logs" on social_logs for insert with check (auth.uid() = user_id);

-- Substance (Risky)
CREATE TABLE IF NOT EXISTS substance_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  substance_type TEXT NOT NULL,
  quantity TEXT,
  unit TEXT,
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
alter table substance_logs enable row level security;
create policy "Users can view own substance logs" on substance_logs for select using (auth.uid() = user_id);
create policy "Users can insert own substance logs" on substance_logs for insert with check (auth.uid() = user_id);

-- 7. CHAT LOGS
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL, -- 'user' or 'bot'
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
alter table chat_messages enable row level security;
create policy "Users can view own chat messages" on chat_messages for select using (auth.uid() = user_id);
create policy "Users can insert own chat messages" on chat_messages for insert with check (auth.uid() = user_id);

-- 8. USER SETTINGS
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  theme TEXT DEFAULT 'light',
  notifications_enabled BOOLEAN DEFAULT true,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
alter table user_settings enable row level security;
create policy "Users can view own settings" on user_settings for select using (auth.uid() = user_id);
create policy "Users can insert own settings" on user_settings for insert with check (auth.uid() = user_id);
create policy "Users can update own settings" on user_settings for update using (auth.uid() = user_id);

-- 9. GOALS
CREATE TABLE IF NOT EXISTS goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_value DECIMAL,
  current_value DECIMAL DEFAULT 0,
  unit TEXT,
  frequency TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
alter table goals enable row level security;
create policy "Users can view own goals" on goals for select using (auth.uid() = user_id);
create policy "Users can insert own goals" on goals for insert with check (auth.uid() = user_id);

-- 10. TRIGGERS

-- Handle New User (Create Profile + Default Settings)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create Profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  -- Create Default Settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated At
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DONE
-- Copy and run this in Supabase SQL Editor.
-- =====================================================
