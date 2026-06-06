-- Admin-targeted in-app notifications (admin notification center).

ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS role_target TEXT NOT NULL DEFAULT 'user';

ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_role_target_check;
ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_role_target_check
  CHECK (role_target IN ('user', 'admin'));

CREATE INDEX IF NOT EXISTS idx_notifications_admin_created_at
  ON public.notifications (created_at DESC)
  WHERE role_target = 'admin';
