-- Add DELETE policy for chat_messages table
-- Run this in your Supabase SQL Editor

-- Allow users to delete their own chat messages
create policy "Users can delete own chat messages" 
  on chat_messages 
  for delete 
  using (auth.uid() = user_id);
