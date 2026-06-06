# CELLOH Auth & Role Checklist

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** Documentation only — no DB/RLS/OAuth provider changes.

---

## Role matrix

| Role | Access |
|------|--------|
| **Guest** | Browse, search, policies, public support FAQ |
| **User** | Mypage sub-routes, cart, checkout (logged-in), reviews, real support tickets |
| **Seller** | `/seller/*` (approved status) |
| **Admin** | `/admin/*` (`users.role = admin` or dev allowlist) |

---

## Guest — no login required

| Area | Routes |
|------|--------|
| Home / discovery | `/`, `/search`, `/categories`, `/category/*`, `/product/*`, `/collections/*`, `/sellers/*` |
| Policies | `/policies/*`, `/privacy`, `/terms`, `/membership`, `/invite` |
| Support (public) | `/support`, `/support/faq`, `/support/contact` (mock), `/support/notices`, topic FAQs |
| Cart browse | `/join-cart` (guest localStorage cart) |
| Checkout preview | `/checkout/*` — guest sees preview + login CTA, cannot submit order |

**Note:** `/mypage` hub is intentionally public (guest preview). `/mypage/*` sub-routes require login via middleware.

---

## User — login required

| Area | Routes | Guard |
|------|--------|-------|
| Mypage | `/mypage/recent`, `/mypage/orders`, `/mypage/settings`, … | Middleware `/mypage/*` |
| Checkout submit | `/checkout/*` logged-in flow | Server action `login_required` |
| Reviews | write flows | Server actions |
| Support tickets | `/support/new`, `/support/[id]` | Middleware + server action |
| Saved / notifications | `/saved`, `/notifications` | Page-level (not middleware) — verify before go-live |

**Login entry:** `/login?next=<path>`  
**Session:** Supabase cookie session, or prototype cookie when `PROTOTYPE_AUTH` enabled locally.

---

## Seller — login + seller record

| Route | Requirement |
|-------|-------------|
| `/seller/login` | Public |
| `/seller/apply` | Logged-in user |
| `/seller/pending`, `/rejected`, `/suspended` | Status pages |
| `/seller/dashboard`, products, orders, … | Approved seller (or admin) |

**Guards:**
- Middleware: auth on `/seller/*` (except login)
- `app/seller/layout.tsx` → `enforceSellerRouteAccess`
- Status redirects: pending → `/seller/pending`, rejected → `/seller/rejected`

**Login entry:** `/seller/login?next=/seller/dashboard`

---

## Admin — login + admin role

| Route | Requirement |
|-------|-------------|
| `/admin/login` | Public |
| `/admin/*` | `users.role = admin` or dev `ADMIN_USER_IDS` |

**Guards:**
- Middleware: auth + `isAdminUserId` → else `/unauthorized`
- `app/admin/layout.tsx` → `requireAdmin()`

**Login entry:** `/admin/login?redirect=/admin/dashboard`  
**Important:** Use admin login URL, not buyer `/login`, for admin deep links.

---

## Mock vs real integration

| Feature | Current | Production note |
|---------|---------|-----------------|
| Username/password login | Supabase auth or prototype | Keep Supabase |
| Kakao / Google OAuth | Supabase provider | Configure redirect URLs in Supabase dashboard |
| Naver / Apple / Samsung | UI disabled “준비중” | Enable when provider ready |
| Phone verification | Mock / env flag | Real PASS or SMS provider |
| Support contact form | Mock (no DB) | Wire to `createSupportTicketAction` |
| Seller apply | Real DB when Supabase configured | RLS already assumed |
| Prototype demo login | Dev only | Disable in production |

---

## OAuth callback

**Route:** `/auth/callback`

| Case | Redirect |
|------|----------|
| Success | `redirect` param (default `/mypage`) |
| OAuth error | `/login?error=auth&reason=...` |
| Missing code | `/login?error=auth&reason=missing_code` |
| Supabase not configured | `/login?error=auth&reason=supabase` |
| Exchange failure | `/login?error=auth&reason=<message>` |

**Checks before production:**
- [ ] Supabase → Authentication → URL Configuration: Site URL + redirect allowlist
- [ ] Kakao/Google callback URL = `https://<domain>/auth/callback`
- [ ] No open redirect — `safeRedirectPath` blocks `//` only; review allowlist if needed

---

## Admin login cautions

- Admin accounts must have `users.role = 'admin'` in Supabase (or dev allowlist).
- Non-admin users hitting `/admin/*` → `/unauthorized?next=...`
- `/unauthorized` now routes login button to `/admin/login` when `next` starts with `/admin`.
- Do not share admin credentials in docs or chat.

---

## Middleware summary

**Protected:** `/mypage/*`, most `/support/*`, `/admin/*`, `/seller/*`  
**Public support allowlist:** FAQ, contact mock, notices, refund/shipping/payment/coupons/referral topics  
**Not middleware-protected:** `/`, `/join-cart`, `/checkout`, `/login`, `/signup`, `/invite`

---

## Supabase role migration (future)

When moving from mock/prototype to full production:

1. Ensure `users.role` enum: `user` | `seller` | `admin`
2. Seller access = `sellers` row + `status = approved` (not role alone)
3. RLS policies per table — **no changes in this audit**
4. Service role key: server-only, never `NEXT_PUBLIC_*`
5. Session refresh via middleware cookie handler

---

## Related files

| Concern | Path |
|---------|------|
| Middleware | `middleware.ts` |
| Access guards | `lib/auth/access.ts` |
| Admin check | `lib/auth/admin-access.ts` |
| Seller gate | `lib/auth/seller-route-guard.ts` |
| OAuth callback | `app/auth/callback/route.ts` |
| Login UI | `components/login-screen.tsx` |
| Redirect helpers | `lib/auth/login-redirects.ts` |
| Form validation | `lib/auth/form-input-validation.ts` |
