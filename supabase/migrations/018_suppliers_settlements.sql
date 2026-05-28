-- Suppliers and settlements for direct sales + future marketplace

DO $$ BEGIN
  CREATE TYPE supplier_status AS ENUM ('active', 'paused', 'terminated');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE settlement_status AS ENUM ('pending', 'confirmed', 'paid', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  business_number TEXT,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  bank_name TEXT,
  bank_account TEXT,
  bank_holder TEXT,
  status supplier_status NOT NULL DEFAULT 'active',
  commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON products(supplier_id);

CREATE TABLE IF NOT EXISTS settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
  deal_id UUID NOT NULL REFERENCES group_buy_deals(id) ON DELETE RESTRICT,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  total_sales_amount INTEGER NOT NULL DEFAULT 0,
  commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
  commission_amount INTEGER NOT NULL DEFAULT 0,
  settlement_amount INTEGER NOT NULL DEFAULT 0,
  status settlement_status NOT NULL DEFAULT 'pending',
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (deal_id)
);

CREATE INDEX IF NOT EXISTS idx_settlements_supplier_id ON settlements(supplier_id);
CREATE INDEX IF NOT EXISTS idx_settlements_product_id ON settlements(product_id);
CREATE INDEX IF NOT EXISTS idx_settlements_status ON settlements(status);

CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS suppliers_set_updated_at ON suppliers;
CREATE TRIGGER suppliers_set_updated_at
  BEFORE UPDATE ON suppliers
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS settlements_set_updated_at ON settlements;
CREATE TRIGGER settlements_set_updated_at
  BEFORE UPDATE ON settlements
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS admin_suppliers_select ON suppliers;
CREATE POLICY admin_suppliers_select
  ON suppliers FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

DROP POLICY IF EXISTS admin_suppliers_insert ON suppliers;
CREATE POLICY admin_suppliers_insert
  ON suppliers FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

DROP POLICY IF EXISTS admin_suppliers_update ON suppliers;
CREATE POLICY admin_suppliers_update
  ON suppliers FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

DROP POLICY IF EXISTS admin_settlements_select ON settlements;
CREATE POLICY admin_settlements_select
  ON settlements FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

DROP POLICY IF EXISTS admin_settlements_insert ON settlements;
CREATE POLICY admin_settlements_insert
  ON settlements FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

DROP POLICY IF EXISTS admin_settlements_update ON settlements;
CREATE POLICY admin_settlements_update
  ON settlements FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));
