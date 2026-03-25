-- Add WITH CHECK so authenticated users can insert their own subscriptions row.
-- The existing "own subscription" policy only had USING (covers SELECT/UPDATE/DELETE).
-- INSERT requires WITH CHECK, otherwise it's blocked even for the row owner.
DROP POLICY IF EXISTS "own subscription" ON subscriptions;

CREATE POLICY "own subscription" ON subscriptions
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Same fix for user_progress
DROP POLICY IF EXISTS "own progress" ON user_progress;

CREATE POLICY "own progress" ON user_progress
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);