-- Combined apply script for Supabase SQL Editor (047 + 048 + 049)

-- === 047 profile_usernames ===
CREATE TABLE IF NOT EXISTS public.profile_usernames (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  username text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profile_usernames_username_format CHECK (username ~ '^[a-z0-9_]{6,20}$')
);

CREATE UNIQUE INDEX IF NOT EXISTS profile_usernames_username_key
  ON public.profile_usernames (username);

ALTER TABLE public.profile_usernames ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profile_usernames_select_own ON public.profile_usernames;
CREATE POLICY profile_usernames_select_own
  ON public.profile_usernames
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS profile_usernames_insert_own ON public.profile_usernames;
CREATE POLICY profile_usernames_insert_own
  ON public.profile_usernames
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- === 048 featured_search_terms ===
CREATE TABLE IF NOT EXISTS featured_search_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL UNIQUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_featured_search_terms_active_order
  ON featured_search_terms (is_active, display_order);

ALTER TABLE featured_search_terms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS featured_search_terms_select_public ON featured_search_terms;
CREATE POLICY featured_search_terms_select_public
  ON featured_search_terms FOR SELECT
  USING (is_active = TRUE);

DROP POLICY IF EXISTS featured_search_terms_admin_all ON featured_search_terms;
CREATE POLICY featured_search_terms_admin_all
  ON featured_search_terms FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

INSERT INTO featured_search_terms (query, display_order, is_active)
VALUES
  ('감귤', 1, TRUE),
  ('청소기', 2, TRUE),
  ('세제', 3, TRUE),
  ('한우', 4, TRUE)
ON CONFLICT (query) DO NOTHING;

-- === 049 seller payout ===
ALTER TABLE public.settlement_records
  ADD COLUMN IF NOT EXISTS payout_bank_name TEXT,
  ADD COLUMN IF NOT EXISTS payout_account_number TEXT,
  ADD COLUMN IF NOT EXISTS payout_account_holder TEXT,
  ADD COLUMN IF NOT EXISTS payout_requested_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payout_reject_reason TEXT,
  ADD COLUMN IF NOT EXISTS payout_rejected_at TIMESTAMPTZ;

DO $$ BEGIN
  ALTER TYPE seller_settlement_record_status ADD VALUE IF NOT EXISTS 'payout_requested';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE seller_settlement_record_status ADD VALUE IF NOT EXISTS 'payout_rejected';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
