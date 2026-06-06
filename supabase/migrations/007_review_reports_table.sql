-- Review reports submitted by users.

CREATE TABLE IF NOT EXISTS review_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, review_id)
);

CREATE INDEX IF NOT EXISTS idx_review_reports_review_id ON review_reports(review_id);
CREATE INDEX IF NOT EXISTS idx_review_reports_user_id ON review_reports(user_id);

-- TODO(supabase): RLS를 켤 경우 아래 정책을 함께 적용하세요.
-- ALTER TABLE review_reports ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY review_reports_select_own ON review_reports FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY review_reports_insert_own ON review_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
