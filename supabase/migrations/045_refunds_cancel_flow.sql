-- Cancel/refund requests: refunds table + orders.refund_status (repo sync; apply if not yet run).

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS refund_status TEXT NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS refund_rejected_reason TEXT;

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_refund_status_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_refund_status_check
  CHECK (refund_status IN ('none', 'requested', 'approved', 'rejected', 'refunded'));

CREATE TABLE IF NOT EXISTS public.refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'refunded')),
  reason TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0 CHECK (amount >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  rejected_at TIMESTAMPTZ,
  rejected_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_refunds_order_id ON public.refunds(order_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_refunds_pending ON public.refunds(status, created_at DESC)
  WHERE status = 'pending';

ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS refunds_select_own ON public.refunds;
CREATE POLICY refunds_select_own
  ON public.refunds FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS refunds_insert_own ON public.refunds;
CREATE POLICY refunds_insert_own
  ON public.refunds FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS refunds_admin_update ON public.refunds;
CREATE POLICY refunds_admin_update
  ON public.refunds FOR UPDATE
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

-- Extend order_timelines statuses when table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'order_timelines'
  ) THEN
    ALTER TABLE public.order_timelines DROP CONSTRAINT IF EXISTS order_timelines_status_check;
    ALTER TABLE public.order_timelines
      ADD CONSTRAINT order_timelines_status_check
      CHECK (
        status IN (
          'created',
          'paid',
          'shipped',
          'delivered',
          'confirmed',
          'cancel_requested',
          'cancelled',
          'refund_requested',
          'refund_rejected',
          'refunded',
          'partial_refunded'
        )
      );
  END IF;
END $$;
