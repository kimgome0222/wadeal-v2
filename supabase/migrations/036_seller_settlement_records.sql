-- Seller settlement records (auto-deduction) and seller billings.

DO $$ BEGIN
  CREATE TYPE seller_settlement_record_status AS ENUM (
    'pending_seller_confirm',
    'seller_confirmed',
    'confirmed',
    'paid',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE seller_billing_status AS ENUM (
    'pending',
    'pending_deduction',
    'paid',
    'overdue',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE seller_billing_payment_mode AS ENUM ('immediate', 'settlement_deduction');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.settlement_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  gross_sales_amount INTEGER NOT NULL DEFAULT 0,
  platform_fee_amount INTEGER NOT NULL DEFAULT 0,
  ad_deduction_amount INTEGER NOT NULL DEFAULT 0,
  other_deduction_amount INTEGER NOT NULL DEFAULT 0,
  net_payout_amount INTEGER NOT NULL DEFAULT 0,
  status seller_settlement_record_status NOT NULL DEFAULT 'pending_seller_confirm',
  seller_confirmed_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  deposit_confirmed_at TIMESTAMPTZ,
  receipt_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (seller_id, period_start, period_end)
);

CREATE INDEX IF NOT EXISTS idx_settlement_records_seller_id
  ON public.settlement_records(seller_id);
CREATE INDEX IF NOT EXISTS idx_settlement_records_status
  ON public.settlement_records(status);

CREATE TABLE IF NOT EXISTS public.settlement_record_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  settlement_record_id UUID NOT NULL REFERENCES public.settlement_records(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (
    item_type IN ('sales', 'platform_fee', 'ad_fee', 'coupon_burden', 'other')
  ),
  label TEXT NOT NULL,
  amount INTEGER NOT NULL,
  reference_id UUID,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_settlement_record_items_record_id
  ON public.settlement_record_items(settlement_record_id);

CREATE TABLE IF NOT EXISTS public.seller_billings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  billing_type TEXT NOT NULL CHECK (billing_type IN ('ad_fee', 'extra_charge')),
  amount INTEGER NOT NULL CHECK (amount >= 0),
  status seller_billing_status NOT NULL DEFAULT 'pending',
  payment_mode seller_billing_payment_mode NOT NULL DEFAULT 'settlement_deduction',
  description TEXT,
  due_date DATE,
  paid_at TIMESTAMPTZ,
  settlement_record_id UUID REFERENCES public.settlement_records(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seller_billings_seller_id
  ON public.seller_billings(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_billings_status
  ON public.seller_billings(status);

DROP TRIGGER IF EXISTS settlement_records_set_updated_at ON public.settlement_records;
CREATE TRIGGER settlement_records_set_updated_at
  BEFORE UPDATE ON public.settlement_records
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS seller_billings_set_updated_at ON public.seller_billings;
CREATE TRIGGER seller_billings_set_updated_at
  BEFORE UPDATE ON public.seller_billings
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();

ALTER TABLE public.settlement_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlement_record_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_billings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS settlement_records_seller_select ON public.settlement_records;
CREATE POLICY settlement_records_seller_select
  ON public.settlement_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sellers s
      WHERE s.id = settlement_records.seller_id
        AND s.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

DROP POLICY IF EXISTS settlement_record_items_seller_select ON public.settlement_record_items;
CREATE POLICY settlement_record_items_seller_select
  ON public.settlement_record_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.settlement_records sr
      JOIN public.sellers s ON s.id = sr.seller_id
      WHERE sr.id = settlement_record_items.settlement_record_id
        AND (s.user_id = auth.uid() OR EXISTS (
          SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'
        ))
    )
  );

DROP POLICY IF EXISTS seller_billings_seller_select ON public.seller_billings;
CREATE POLICY seller_billings_seller_select
  ON public.seller_billings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sellers s
      WHERE s.id = seller_billings.seller_id
        AND s.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

DROP POLICY IF EXISTS settlement_records_admin_all ON public.settlement_records;
CREATE POLICY settlement_records_admin_all
  ON public.settlement_records FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));

DROP POLICY IF EXISTS settlement_record_items_admin_all ON public.settlement_record_items;
CREATE POLICY settlement_record_items_admin_all
  ON public.settlement_record_items FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));

DROP POLICY IF EXISTS seller_billings_admin_all ON public.seller_billings;
CREATE POLICY seller_billings_admin_all
  ON public.seller_billings FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));

-- Notification types for settlement events
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'deal_deadline_soon',
    'price_tier_reached',
    'next_tier_soon',
    'order_confirmed',
    'payment_ready',
    'payment_failed',
    'payment_paid',
    'payment_deposit_completed',
    'shipping_started',
    'shipping_delivered',
    'review_available',
    'refund_updated',
    'support_reply',
    'support_resolved',
    'product_approved',
    'product_rejected',
    'seller_approved',
    'seller_rejected',
    'settlement_ready',
    'settlement_paid'
  ));
