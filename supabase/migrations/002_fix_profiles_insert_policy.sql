-- Migration: Fix missing INSERT policy for profiles table
-- This allows the trigger function to create profiles for new users

-- Add INSERT policy for trigger function
CREATE POLICY "Trigger can insert profiles" 
  ON profiles FOR INSERT 
  WITH CHECK (true);

-- Verify the policy was created
-- This will be checked in the next step