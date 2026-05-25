-- Run this in Supabase → SQL Editor to make expenses private per user

-- 1. Add user_id column to expenses
ALTER TABLE expenses
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Drop the old "allow everyone" policy
DROP POLICY IF EXISTS "public_all" ON expenses;

-- 3. New policy: each user sees and manages only their own expenses
CREATE POLICY "own_expenses" ON expenses
  FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Categories stay shared (all signed-in users see the same list)
-- No changes needed to categories policies.
