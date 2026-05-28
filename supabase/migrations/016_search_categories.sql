-- Categories, product search fields, and search_logs for catalog search/filter.

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO categories (slug, name, sort_order)
VALUES
  ('food', '식품', 1),
  ('living', '생활', 2),
  ('beauty', '뷰티', 3),
  ('digital', '가전', 4),
  ('fashion', '의류', 5),
  ('pet', '반려동물', 6)
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS brand_name TEXT,
  ADD COLUMN IF NOT EXISTS keywords TEXT[] NOT NULL DEFAULT '{}';

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE p.category_id IS NULL
  AND p.category = c.slug;

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_name ON products(brand_name);
CREATE INDEX IF NOT EXISTS idx_products_keywords ON products USING GIN (keywords);

CREATE TABLE IF NOT EXISTS search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  query TEXT NOT NULL,
  result_count INTEGER NOT NULL DEFAULT 0 CHECK (result_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_logs_created_at ON search_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_logs_query ON search_logs(query);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS categories_select_public ON categories;
CREATE POLICY categories_select_public
  ON categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS search_logs_insert_public ON search_logs;
CREATE POLICY search_logs_insert_public
  ON search_logs FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS search_logs_select_admin ON search_logs;
CREATE POLICY search_logs_select_admin
  ON search_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE OR REPLACE FUNCTION get_popular_search_terms(limit_count INTEGER DEFAULT 8)
RETURNS TABLE(query TEXT, search_count BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT sl.query, COUNT(*) AS search_count
  FROM search_logs sl
  WHERE sl.created_at >= NOW() - INTERVAL '30 days'
    AND trim(sl.query) <> ''
  GROUP BY sl.query
  ORDER BY search_count DESC
  LIMIT GREATEST(limit_count, 1);
$$;

GRANT EXECUTE ON FUNCTION get_popular_search_terms(INTEGER) TO anon, authenticated;
