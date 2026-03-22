CREATE TABLE user_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  lessons_completed       TEXT[]      DEFAULT '{}',
  letters_learned         TEXT[]      DEFAULT '{}',
  quiz_scores             JSONB       DEFAULT '{}',
  current_streak          INTEGER     DEFAULT 0,
  last_active_date        TEXT        DEFAULT '',
  total_xp                INTEGER     DEFAULT 0,
  last_practice_date      TEXT        DEFAULT '',
  practice_sessions_today INTEGER     DEFAULT 0,
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own progress" ON user_progress USING (auth.uid() = user_id);

CREATE TABLE subscriptions (
  user_id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id     TEXT,
  stripe_subscription_id TEXT,
  status                 TEXT,
  price_id               TEXT,
  current_period_end     TIMESTAMPTZ,
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own subscription" ON subscriptions USING (auth.uid() = user_id);
