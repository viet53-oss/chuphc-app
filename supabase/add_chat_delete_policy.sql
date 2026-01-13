-- Add DELETE policy for chat_messages table
-- Run this in your Supabase SQL Editor

-- Drop the policy if it exists (in case it was partially created)
DROP POLICY IF EXISTS "Users can delete own chat messages" ON chat_messages;

-- Create the delete policy
CREATE POLICY "Users can delete own chat messages" 
  ON chat_messages 
  FOR DELETE 
  USING (auth.uid() = user_id);
