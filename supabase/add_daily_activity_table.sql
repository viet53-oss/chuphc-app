-- Create a table for daily activity summaries (steps and minutes)
CREATE TABLE IF NOT EXISTS daily_activity_summary (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  steps INTEGER DEFAULT 0,
  active_minutes INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE daily_activity_summary ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own daily summary" ON daily_activity_summary
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily summary" ON daily_activity_summary
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily summary" ON daily_activity_summary
  FOR UPDATE USING (auth.uid() = user_id);
