-- 051 v3 Step 3 — role escalation guard (run AFTER admin assigned)

CREATE OR REPLACE FUNCTION public.guard_users_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL AND session_user IN ('postgres', 'supabase_admin') THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.role IS DISTINCT FROM 'user' AND NOT public.is_admin_user(auth.uid()) THEN
      NEW.role := 'user';
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_admin_user(auth.uid()) THEN
    RAISE EXCEPTION 'forbidden_role_change';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS users_role_guard ON public.users;
CREATE TRIGGER users_role_guard
  BEFORE INSERT OR UPDATE OF role ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_users_role_escalation();
