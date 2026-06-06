# Kakao login — Supabase OAuth (와딜 app)

Wadeal uses **Supabase Auth Kakao provider** only. Kakao credentials live in the **Supabase dashboard**, not in Wadeal/Vercel env.

## Wadeal app env (Vercel + `.env.local`)

| Variable | Value source |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ptbwemzxkmurwxbjaiwu.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Settings → API Keys → **Publishable key** |

Do **not** add `KAKAO_REST_API_KEY`, `KAKAO_CLIENT_SECRET`, or `SUPABASE_SERVICE_ROLE_KEY` to Wadeal.

## Supabase dashboard checklist

1. **Settings → API Keys** — copy Publishable key into Vercel
2. **Authentication → Providers → Kakao** → Enable
   - Client ID: 와딜 app **REST API key** (Kakao Developers)
   - Client Secret: 와딜 app **카카오 로그인 클라이언트 시크릿** (secret ON)
3. **Authentication → URL configuration**
   - Site URL: `https://wadeal-v2.vercel.app`
   - Redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `https://wadeal-v2.vercel.app/auth/callback`

## Kakao Developers — 와딜 app

1. 제품 설정 → 카카오 로그인 → ON
2. 동의항목: `profile_nickname`, `profile_image` ON / `account_email` OFF
3. 플랫폼 → Web: `http://localhost:3000`, `https://wadeal-v2.vercel.app`
4. 플랫폼 키 → REST API 키 → Redirect URI:
   - `https://ptbwemzxkmurwxbjaiwu.supabase.co/auth/v1/callback`
5. REST API 키 → 카카오 로그인 클라이언트 시크릿 **ON**

## Code (already wired)

| File | Role |
| --- | --- |
| `lib/auth/supabase-oauth.ts` | `signInWithOAuth({ provider: "kakao" })`, scopes `profile_nickname profile_image` |
| `app/auth/callback/route.ts` | `exchangeCodeForSession` + redirect |
| `components/login-screen.tsx` | Kakao button |

After Supabase/Kakao dashboard updates → **Redeploy Vercel production**.
