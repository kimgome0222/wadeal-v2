-- Admin CMS persistence: banners, events, category display overrides.

CREATE TABLE IF NOT EXISTS public.admin_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '/wadeal-wordmark.svg',
  link_url TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMPTZ NOT NULL DEFAULT '2099-12-31 23:59:59+00',
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  device TEXT NOT NULL DEFAULT 'all' CHECK (device IN ('mobile', 'pc', 'all')),
  position TEXT NOT NULL DEFAULT 'home-main'
    CHECK (position IN ('home-main', 'home-mid', 'category')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_banners_visible_position
  ON public.admin_banners (visible, position, sort_order);

CREATE TABLE IF NOT EXISTS public.admin_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMPTZ NOT NULL DEFAULT '2099-12-31 23:59:59+00',
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'live', 'ended')),
  hero_image_url TEXT NOT NULL DEFAULT '/wadeal-wordmark.svg',
  linked_category_slugs TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_events_status ON public.admin_events (status);

CREATE TABLE IF NOT EXISTS public.admin_category_overrides (
  slug TEXT PRIMARY KEY,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_category_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS admin_banners_select_public ON public.admin_banners;
CREATE POLICY admin_banners_select_public
  ON public.admin_banners FOR SELECT
  USING (visible = TRUE);

DROP POLICY IF EXISTS admin_banners_admin_all ON public.admin_banners;
CREATE POLICY admin_banners_admin_all
  ON public.admin_banners FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS admin_events_select_public ON public.admin_events;
CREATE POLICY admin_events_select_public
  ON public.admin_events FOR SELECT
  USING (status IN ('live', 'scheduled'));

DROP POLICY IF EXISTS admin_events_admin_all ON public.admin_events;
CREATE POLICY admin_events_admin_all
  ON public.admin_events FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS admin_category_overrides_select_public ON public.admin_category_overrides;
CREATE POLICY admin_category_overrides_select_public
  ON public.admin_category_overrides FOR SELECT
  USING (visible = TRUE);

DROP POLICY IF EXISTS admin_category_overrides_admin_all ON public.admin_category_overrides;
CREATE POLICY admin_category_overrides_admin_all
  ON public.admin_category_overrides FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));
