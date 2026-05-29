-- Featured search terms for admin-managed popular keywords.

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
