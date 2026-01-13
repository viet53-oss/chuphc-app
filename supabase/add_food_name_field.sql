-- Add food_name field to nutrition_logs table
-- Run this in your Supabase SQL Editor

-- Add the new food_name column
ALTER TABLE nutrition_logs 
ADD COLUMN IF NOT EXISTS food_name TEXT;

-- Optional: Copy data from meal_name to food_name if needed
-- UPDATE nutrition_logs SET food_name = meal_name WHERE food_name IS NULL;

-- Optional: Extract food name from notes JSON if it exists
-- UPDATE nutrition_logs 
-- SET food_name = notes->>'foodName' 
-- WHERE food_name IS NULL AND notes IS NOT NULL;
