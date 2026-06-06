-- Admin product management: detail images + admin write policies

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS detail_image_urls TEXT[] NOT NULL DEFAULT '{}';

-- Admin catalog access (public SELECT policies remain for active rows)
DROP POLICY IF EXISTS admin_products_select ON products;
CREATE POLICY admin_products_select
  ON products FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

DROP POLICY IF EXISTS admin_products_insert ON products;
CREATE POLICY admin_products_insert
  ON products FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

DROP POLICY IF EXISTS admin_products_update ON products;
CREATE POLICY admin_products_update
  ON products FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

DROP POLICY IF EXISTS admin_deals_select ON group_buy_deals;
CREATE POLICY admin_deals_select
  ON group_buy_deals FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

DROP POLICY IF EXISTS admin_deals_insert ON group_buy_deals;
CREATE POLICY admin_deals_insert
  ON group_buy_deals FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

DROP POLICY IF EXISTS admin_deals_update ON group_buy_deals;
CREATE POLICY admin_deals_update
  ON group_buy_deals FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

DROP POLICY IF EXISTS admin_price_tiers_select ON price_tiers;
CREATE POLICY admin_price_tiers_select
  ON price_tiers FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

DROP POLICY IF EXISTS admin_price_tiers_insert ON price_tiers;
CREATE POLICY admin_price_tiers_insert
  ON price_tiers FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

DROP POLICY IF EXISTS admin_price_tiers_update ON price_tiers;
CREATE POLICY admin_price_tiers_update
  ON price_tiers FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

DROP POLICY IF EXISTS admin_price_tiers_delete ON price_tiers;
CREATE POLICY admin_price_tiers_delete
  ON price_tiers FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));
