-- Subcategories for Wadeal catalog (optional — app also uses static lib/categories/catalog.ts)

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS display_order INTEGER;

CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- Seed top-level categories (idempotent)
INSERT INTO categories (slug, name, sort_order, display_order, is_active)
VALUES
  ('food', '식품', 1, 1, true),
  ('living', '생활', 2, 2, true),
  ('beauty', '뷰티', 3, 3, true),
  ('digital', '가전·디지털', 4, 4, true),
  ('fashion', '패션', 5, 5, true),
  ('pet', '반려동물', 6, 6, true),
  ('baby', '육아', 7, 7, true),
  ('local', '지역특산', 8, 8, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- Subcategories under food (example — extend as needed)
INSERT INTO categories (slug, name, sort_order, display_order, parent_id, is_active)
SELECT
  v.slug,
  v.name,
  v.sort_order,
  v.display_order,
  p.id,
  true
FROM (
  VALUES
    ('food-fresh', '신선식품', 1, 1),
    ('food-processed', '가공식품', 2, 2),
    ('food-health', '건강식품', 3, 3),
    ('food-drink', '음료', 4, 4)
) AS v(slug, name, sort_order, display_order)
JOIN categories p ON p.slug = 'food'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  parent_id = EXCLUDED.parent_id,
  sort_order = EXCLUDED.sort_order,
  display_order = EXCLUDED.display_order;

COMMENT ON COLUMN categories.parent_id IS 'NULL = top-level category; set for subcategory';
