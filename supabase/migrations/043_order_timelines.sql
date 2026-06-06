-- Order status timeline for customer order detail and admin audit.

CREATE TABLE IF NOT EXISTS public.order_timelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (
    status IN (
      'created',
      'paid',
      'shipped',
      'delivered',
      'confirmed',
      'cancel_requested',
      'cancelled',
      'refund_requested',
      'refunded',
      'partial_refunded'
    )
  ),
  title TEXT NOT NULL,
  message TEXT,
  actor_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_timelines_order_id
  ON public.order_timelines(order_id, created_at DESC);

ALTER TABLE public.order_timelines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS order_timelines_select_own ON public.order_timelines;
CREATE POLICY order_timelines_select_own
  ON public.order_timelines FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
    OR public.is_admin_user(auth.uid())
  );

DROP POLICY IF EXISTS order_timelines_insert_service ON public.order_timelines;
CREATE POLICY order_timelines_insert_service
  ON public.order_timelines FOR INSERT
  WITH CHECK (
    public.is_admin_user(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS order_timelines_admin_all ON public.order_timelines;
CREATE POLICY order_timelines_admin_all
  ON public.order_timelines FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE OR REPLACE FUNCTION public.append_order_timeline(
  p_order_id UUID,
  p_status TEXT,
  p_title TEXT,
  p_message TEXT DEFAULT NULL,
  p_actor_user_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.order_timelines (order_id, status, title, message, actor_user_id)
  VALUES (p_order_id, p_status, p_title, p_message, p_actor_user_id)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.append_order_timeline(UUID, TEXT, TEXT, TEXT, UUID) TO authenticated;
