-- Unified role-based notifications (user / seller / admin).

ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE;

-- Migrate role_target -> target_role if needed
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'notifications'
      AND column_name = 'role_target'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'notifications'
      AND column_name = 'target_role'
  ) THEN
    ALTER TABLE public.notifications RENAME COLUMN role_target TO target_role;
  END IF;
END $$;

ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS target_role TEXT NOT NULL DEFAULT 'user';

ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_role_target_check;
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_target_role_check;
ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_target_role_check
  CHECK (target_role IN ('user', 'seller', 'admin'));

ALTER TABLE public.notifications ALTER COLUMN user_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread_role
  ON public.notifications (user_id, created_at DESC)
  WHERE target_role = 'user' AND read_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_seller_unread
  ON public.notifications (seller_id, created_at DESC)
  WHERE target_role = 'seller' AND read_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_admin_unread
  ON public.notifications (created_at DESC)
  WHERE target_role = 'admin' AND read_at IS NULL;

-- Expand notification types
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check CHECK (
  type IN (
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
    'settlement_paid',
    'seller_application_approved',
    'seller_application_rejected',
    'product_request_approved',
    'product_request_rejected',
    'product_changes_requested',
    'new_order_received',
    'shipping_required',
    'new_product_question',
    'new_review',
    'settlement_confirmed',
    'seller_notice_published',
    'new_seller_application',
    'new_product_request',
    'product_change_request',
    'refund_request',
    'escalated_support_ticket',
    'payment_webhook_failed',
    'critical_error',
    'settlement_pending',
    'prohibited_keyword_detected'
  )
);

DROP POLICY IF EXISTS notifications_select_own ON public.notifications;
DROP POLICY IF EXISTS notifications_update_own ON public.notifications;

CREATE POLICY notifications_select_by_role
  ON public.notifications FOR SELECT
  USING (
    (target_role = 'user' AND user_id = auth.uid())
    OR (
      target_role = 'seller'
      AND seller_id IN (
        SELECT s.id FROM public.sellers s WHERE s.user_id = auth.uid()
      )
    )
    OR (target_role = 'admin' AND public.is_admin_user(auth.uid()))
  );

CREATE POLICY notifications_update_read_by_role
  ON public.notifications FOR UPDATE
  USING (
    (target_role = 'user' AND user_id = auth.uid())
    OR (
      target_role = 'seller'
      AND seller_id IN (
        SELECT s.id FROM public.sellers s WHERE s.user_id = auth.uid()
      )
    )
    OR (target_role = 'admin' AND public.is_admin_user(auth.uid()))
  )
  WITH CHECK (
    (target_role = 'user' AND user_id = auth.uid())
    OR (
      target_role = 'seller'
      AND seller_id IN (
        SELECT s.id FROM public.sellers s WHERE s.user_id = auth.uid()
      )
    )
    OR (target_role = 'admin' AND public.is_admin_user(auth.uid()))
  );

CREATE OR REPLACE FUNCTION public._insert_role_notification(
  p_user_id UUID,
  p_seller_id UUID,
  p_target_role TEXT,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_link_url TEXT DEFAULT NULL,
  p_channel TEXT DEFAULT 'in_app'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (
    user_id,
    seller_id,
    target_role,
    type,
    title,
    message,
    link_url,
    channel
  ) VALUES (
    p_user_id,
    p_seller_id,
    p_target_role,
    p_type,
    p_title,
    NULLIF(TRIM(p_message), ''),
    NULLIF(TRIM(p_link_url), ''),
    COALESCE(NULLIF(TRIM(p_channel), ''), 'in_app')
  )
  RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_role_notification(
  p_target_role TEXT,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_link_url TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT NULL,
  p_seller_id UUID DEFAULT NULL,
  p_channel TEXT DEFAULT 'in_app'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_target_role NOT IN ('user', 'seller', 'admin') THEN
    RAISE EXCEPTION 'invalid_target_role';
  END IF;

  IF p_target_role = 'user' AND p_user_id IS NULL THEN
    RAISE EXCEPTION 'user_id_required';
  END IF;

  IF p_target_role = 'seller' AND p_seller_id IS NULL THEN
    RAISE EXCEPTION 'seller_id_required';
  END IF;

  RETURN public._insert_role_notification(
    p_user_id,
    p_seller_id,
    p_target_role,
    p_type,
    p_title,
    p_message,
    p_link_url,
    p_channel
  );
END;
$$;

REVOKE ALL ON FUNCTION public._insert_role_notification(UUID, UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_role_notification(TEXT, TEXT, TEXT, TEXT, TEXT, UUID, UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_role_notification(TEXT, TEXT, TEXT, TEXT, TEXT, UUID, UUID, TEXT) TO authenticated;

-- Backfill existing rows
UPDATE public.notifications
SET target_role = 'user'
WHERE target_role IS NULL OR target_role = '';
