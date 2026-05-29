-- Username login mapping for Wadeal (apply manually; not auto-applied remotely)
CREATE TABLE IF NOT EXISTS public.profile_usernames (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  username text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profile_usernames_username_format CHECK (username ~ '^[a-z0-9_]{6,20}$')
);

CREATE UNIQUE INDEX IF NOT EXISTS profile_usernames_username_key
  ON public.profile_usernames (username);

ALTER TABLE public.profile_usernames ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profile_usernames_select_own ON public.profile_usernames;
CREATE POLICY profile_usernames_select_own
  ON public.profile_usernames
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS profile_usernames_insert_own ON public.profile_usernames;
CREATE POLICY profile_usernames_insert_own
  ON public.profile_usernames
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

COMMENT ON TABLE public.profile_usernames IS
  'Maps Wadeal username logins to auth.users. Passwords stay in Supabase Auth only.';
