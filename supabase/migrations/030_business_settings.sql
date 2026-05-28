-- Singleton business / operator settings for footer and policy pages.

CREATE TABLE IF NOT EXISTS business_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  business_name TEXT,
  representative_name TEXT,
  business_number TEXT,
  mail_order_sales_number TEXT,
  business_address TEXT,
  customer_service_phone TEXT,
  customer_service_email TEXT,
  customer_service_hours TEXT,
  hosting_provider TEXT,
  privacy_manager_name TEXT,
  privacy_manager_email TEXT,
  bank_account_info TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO business_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION set_business_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS business_settings_updated_at ON business_settings;
CREATE TRIGGER business_settings_updated_at
  BEFORE UPDATE ON business_settings
  FOR EACH ROW
  EXECUTE FUNCTION set_business_settings_updated_at();

ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS business_settings_select_public ON business_settings;
CREATE POLICY business_settings_select_public
  ON business_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS business_settings_insert_admin ON business_settings;
CREATE POLICY business_settings_insert_admin
  ON business_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS business_settings_update_admin ON business_settings;
CREATE POLICY business_settings_update_admin
  ON business_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );
