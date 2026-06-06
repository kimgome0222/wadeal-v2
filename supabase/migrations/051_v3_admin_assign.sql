-- 051 v3 Step 2 — assign admin (run AFTER 051_v3_bootstrap_public_users.sql)
-- Edit email before run. No users_role_guard yet → safe in SQL Editor.

UPDATE public.users
SET role = 'admin'
WHERE email = 'YOUR_ADMIN_EMAIL@example.com';

-- Verify (expect 1 row):
-- SELECT id, email, role FROM public.users WHERE role = 'admin';
