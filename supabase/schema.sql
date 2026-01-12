-- =====================================================
-- CHU PRECISION HEALTH CENTER - DATABASE SCHEMA
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste & Run
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- Extends Supabase auth.users with patient information
-- =====================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  date_of_birth DATE,
  phone TEXT,
  avatar_url TEXT,
  precision_score INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'Beginner', -- Beginner, Intermediate, Advanced, Elite Professional
  achievement_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies: Users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- =====================================================
-- NUTRITION TABLE
-- Track meals, calories, and nutrition data
-- =====================================================
CREATE TABLE nutrition_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  meal_type TEXT NOT NULL, -- breakfast, lunch, dinner, snack
  meal_name TEXT,
  calories INTEGER,
  protein DECIMAL,
  carbs DECIMAL,
  fats DECIMAL,
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own nutrition logs" ON nutrition_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition logs" ON nutrition_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nutrition logs" ON nutrition_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own nutrition logs" ON nutrition_logs
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- ACTIVITY TABLE
-- Track physical activity and exercise
-- =====================================================
CREATE TABLE activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL, -- walking, running, cycling, gym, yoga, etc.
  duration_minutes INTEGER NOT NULL,
  intensity TEXT, -- low, moderate, high
  calories_burned INTEGER,
  distance DECIMAL, -- in miles or km
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity logs" ON activity_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity logs" ON activity_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activity logs" ON activity_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own activity logs" ON activity_logs
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- STRESS TABLE
-- Track stress levels and management activities
-- =====================================================
CREATE TABLE stress_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stress_level INTEGER NOT NULL, -- 1-10 scale
  activity TEXT, -- meditation, breathing, therapy, etc.
  duration_minutes INTEGER,
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE stress_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stress logs" ON stress_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stress logs" ON stress_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stress logs" ON stress_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stress logs" ON stress_logs
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- SLEEP TABLE
-- Track sleep patterns and quality
-- =====================================================
CREATE TABLE sleep_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sleep_start TIMESTAMP WITH TIME ZONE NOT NULL,
  sleep_end TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_hours DECIMAL GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (sleep_end - sleep_start)) / 3600
  ) STORED,
  quality INTEGER, -- 1-10 scale
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sleep logs" ON sleep_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sleep logs" ON sleep_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sleep logs" ON sleep_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sleep logs" ON sleep_logs
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- SOCIAL TABLE
-- Track social connections and activities
-- =====================================================
CREATE TABLE social_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL, -- family time, friends, community, support group, etc.
  duration_minutes INTEGER,
  satisfaction_level INTEGER, -- 1-10 scale
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE social_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own social logs" ON social_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own social logs" ON social_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own social logs" ON social_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own social logs" ON social_logs
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- RISKY SUBSTANCES TABLE
-- Track substance use for harm reduction
-- =====================================================
CREATE TABLE substance_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  substance_type TEXT NOT NULL, -- alcohol, tobacco, caffeine, etc.
  quantity TEXT,
  unit TEXT, -- drinks, cigarettes, cups, etc.
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE substance_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own substance logs" ON substance_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own substance logs" ON substance_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own substance logs" ON substance_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own substance logs" ON substance_logs
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- EDUCATION CONTENT TABLE
-- Store educational articles and resources
-- =====================================================
CREATE TABLE education_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- nutrition, activity, stress, sleep, social, risky
  content TEXT NOT NULL,
  summary TEXT,
  image_url TEXT,
  video_url TEXT,
  read_time_minutes INTEGER,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE education_content ENABLE ROW LEVEL SECURITY;

-- Everyone can read published education content
CREATE POLICY "Anyone can view published education content" ON education_content
  FOR SELECT USING (published = true);

-- Track which content users have completed
CREATE TABLE education_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content_id UUID REFERENCES education_content(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

ALTER TABLE education_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own education progress" ON education_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own education progress" ON education_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own education progress" ON education_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- REWARDS & ACHIEVEMENTS TABLE
-- Track user achievements and rewards
-- =====================================================
CREATE TABLE achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- nutrition, activity, stress, sleep, social, risky, overall
  points INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  requirement_type TEXT, -- streak, count, milestone
  requirement_value INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Everyone can view available achievements
CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT USING (true);

-- Track user achievements
CREATE TABLE user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- GOALS TABLE
-- Track user-set health goals
-- =====================================================
CREATE TABLE goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL, -- nutrition, activity, stress, sleep, social, risky
  title TEXT NOT NULL,
  description TEXT,
  target_value DECIMAL,
  current_value DECIMAL DEFAULT 0,
  unit TEXT, -- steps, minutes, hours, servings, etc.
  frequency TEXT, -- daily, weekly, monthly
  start_date DATE NOT NULL,
  end_date DATE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals" ON goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON goals
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile automatically
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_content_updated_at BEFORE UPDATE ON education_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INDEXES for better query performance
-- =====================================================
CREATE INDEX idx_nutrition_logs_user_id ON nutrition_logs(user_id);
CREATE INDEX idx_nutrition_logs_logged_at ON nutrition_logs(logged_at);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_logged_at ON activity_logs(logged_at);

CREATE INDEX idx_stress_logs_user_id ON stress_logs(user_id);
CREATE INDEX idx_stress_logs_logged_at ON stress_logs(logged_at);

CREATE INDEX idx_sleep_logs_user_id ON sleep_logs(user_id);
CREATE INDEX idx_sleep_logs_sleep_start ON sleep_logs(sleep_start);

CREATE INDEX idx_social_logs_user_id ON social_logs(user_id);
CREATE INDEX idx_social_logs_logged_at ON social_logs(logged_at);

CREATE INDEX idx_substance_logs_user_id ON substance_logs(user_id);
CREATE INDEX idx_substance_logs_logged_at ON substance_logs(logged_at);

CREATE INDEX idx_education_progress_user_id ON education_progress(user_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_goals_user_id ON goals(user_id);

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Sample achievements
INSERT INTO achievements (name, description, category, points, requirement_type, requirement_value) VALUES
  ('First Steps', 'Log your first activity', 'activity', 10, 'count', 1),
  ('Nutrition Novice', 'Log 7 meals', 'nutrition', 25, 'count', 7),
  ('Sleep Champion', 'Get 8 hours of sleep for 7 days', 'sleep', 50, 'streak', 7),
  ('Stress Warrior', 'Complete 30 stress management sessions', 'stress', 100, 'count', 30),
  ('Social Butterfly', 'Log 10 social activities', 'social', 50, 'count', 10),
  ('Week Warrior', 'Complete all daily goals for 7 days', 'overall', 200, 'streak', 7);

-- Sample education content
INSERT INTO education_content (title, category, content, summary, read_time_minutes, published) VALUES
  ('Understanding Nutrition Basics', 'nutrition', 'A comprehensive guide to macronutrients and healthy eating...', 'Learn the fundamentals of nutrition', 5, true),
  ('Benefits of Regular Exercise', 'activity', 'Discover how physical activity improves your health...', 'Why exercise matters for your health', 7, true),
  ('Stress Management Techniques', 'stress', 'Effective strategies for managing daily stress...', 'Practical stress reduction methods', 6, true),
  ('Sleep Hygiene Best Practices', 'sleep', 'Tips for improving your sleep quality...', 'Get better sleep tonight', 8, true),
  ('Building Strong Social Connections', 'social', 'The importance of social health and how to nurture it...', 'Strengthen your relationships', 5, true);

-- =====================================================
-- DONE!
-- =====================================================
-- Your database schema is now ready!
-- Next steps:
-- 1. Copy this entire SQL file
-- 2. Go to Supabase Dashboard → SQL Editor
-- 3. Paste and run this SQL
-- 4. Your tables, policies, and triggers will be created
-- =====================================================
