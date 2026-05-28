-- Share / referral / viral tracking: referral codes, share logs, referral visits.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS referral_code TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_referral_code
  ON users(referral_code)
  WHERE referral_code IS NOT NULL;

CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars CONSTANT TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT;
  i INT;
BEGIN
  LOOP
    result := '';
    FOR i IN 1..8 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    IF NOT EXISTS (SELECT 1 FROM users WHERE referral_code = result) THEN
      RETURN result;
    END IF;
  END LOOP;
END;
$$;

CREATE TABLE IF NOT EXISTS share_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES group_buy_deals(id) ON DELETE SET NULL,
  channel TEXT NOT NULL CHECK (channel IN ('kakao', 'copy_link', 'web_share')),
  referral_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_share_logs_user_id ON share_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_share_logs_referral_code ON share_logs(referral_code);
CREATE INDEX IF NOT EXISTS idx_share_logs_product_id ON share_logs(product_id);

CREATE TABLE IF NOT EXISTS referral_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code TEXT NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES group_buy_deals(id) ON DELETE SET NULL,
  visitor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referral_visits_referral_code ON referral_visits(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_visits_product_id ON referral_visits(product_id);
CREATE INDEX IF NOT EXISTS idx_referral_visits_created_at ON referral_visits(created_at DESC);

ALTER TABLE share_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS share_logs_select_own ON share_logs;
CREATE POLICY share_logs_select_own
  ON share_logs FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

DROP POLICY IF EXISTS share_logs_insert ON share_logs;
CREATE POLICY share_logs_insert
  ON share_logs FOR INSERT
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

DROP POLICY IF EXISTS referral_visits_insert ON referral_visits;
CREATE POLICY referral_visits_insert
  ON referral_visits FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS referral_visits_select_own ON referral_visits;
CREATE POLICY referral_visits_select_own
  ON referral_visits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
        AND u.referral_code = referral_visits.referral_code
    )
    OR EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );
