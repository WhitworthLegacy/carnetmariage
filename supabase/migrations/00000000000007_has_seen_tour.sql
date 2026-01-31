-- Add has_seen_tour column to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS has_seen_tour boolean DEFAULT false;
