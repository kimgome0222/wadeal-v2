-- Address book expansion + order shipping snapshots

-- ---------------------------------------------------------------------------
-- addresses: align schema with production address book
-- ---------------------------------------------------------------------------

ALTER TABLE addresses
  ADD COLUMN IF NOT EXISTS address_line1 TEXT,
  ADD COLUMN IF NOT EXISTS address_line2 TEXT,
  ADD COLUMN IF NOT EXISTS region TEXT,
  ADD COLUMN IF NOT EXISTS is_remote_area BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS delivery_memo TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Migrate legacy address_line into line1/line2
UPDATE addresses
SET
  address_line1 = COALESCE(
    NULLIF(TRIM(SPLIT_PART(address_line, ' | ', 1)), ''),
    NULLIF(TRIM(address_line), ''),
    ''
  ),
  address_line2 = NULLIF(TRIM(SUBSTRING(address_line FROM POSITION(' | ' IN address_line) + 3)), ''),
  updated_at = COALESCE(updated_at, created_at)
WHERE address_line1 IS NULL OR address_line1 = '';

UPDATE addresses
SET address_line1 = COALESCE(NULLIF(address_line1, ''), '주소 미입력')
WHERE address_line1 IS NULL OR address_line1 = '';

ALTER TABLE addresses
  ALTER COLUMN address_line1 SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_addresses_user_default
  ON addresses(user_id, is_default)
  WHERE is_default = true;

-- ---------------------------------------------------------------------------
-- orders: shipping snapshot columns (immutable after order)
-- ---------------------------------------------------------------------------

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS shipping_recipient_name TEXT,
  ADD COLUMN IF NOT EXISTS shipping_phone TEXT,
  ADD COLUMN IF NOT EXISTS shipping_postal_code TEXT,
  ADD COLUMN IF NOT EXISTS shipping_address_line1 TEXT,
  ADD COLUMN IF NOT EXISTS shipping_address_line2 TEXT,
  ADD COLUMN IF NOT EXISTS shipping_delivery_memo TEXT,
  ADD COLUMN IF NOT EXISTS shipping_region TEXT,
  ADD COLUMN IF NOT EXISTS shipping_is_remote_area BOOLEAN,
  ADD COLUMN IF NOT EXISTS shipping_fee INTEGER NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0);

-- ---------------------------------------------------------------------------
-- RLS: addresses delete + updated_at trigger
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS addresses_delete_own ON addresses;
CREATE POLICY addresses_delete_own
  ON addresses FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.touch_addresses_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS addresses_set_updated_at ON addresses;
CREATE TRIGGER addresses_set_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_addresses_updated_at();

-- Ensure only one default address per user when setting default
CREATE OR REPLACE FUNCTION public.clear_other_default_addresses()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_default IS TRUE THEN
    UPDATE public.addresses
    SET is_default = FALSE, updated_at = NOW()
    WHERE user_id = NEW.user_id
      AND id IS DISTINCT FROM NEW.id
      AND is_default IS TRUE;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS addresses_single_default ON addresses;
CREATE TRIGGER addresses_single_default
  AFTER INSERT OR UPDATE OF is_default ON addresses
  FOR EACH ROW
  WHEN (NEW.is_default IS TRUE)
  EXECUTE FUNCTION public.clear_other_default_addresses();
