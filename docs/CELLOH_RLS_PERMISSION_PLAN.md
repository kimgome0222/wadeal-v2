# CELLOH RLS & Permission Plan

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** Design memo — **no SQL, no RLS policy changes**

**Related:** `CELLOH_AUTH_ROLE_CHECKLIST.md`, `supabase/migrations/009_production_rls.sql` (reference)

---

## Roles

| Role | Identity |
|------|----------|
| **guest** | No session |
| **authenticated user** | Supabase `auth.users` + profile |
| **seller** | User linked to `sellers` row, `status=approved` |
| **admin** | `users.role=admin` or allowlist |

---

## Permission matrix

| Area | guest | user | seller | admin |
|------|-------|------|--------|-------|
| 상품 조회 (published) | ✅ | ✅ | ✅ | ✅ |
| 상품 조회 (draft/rejected) | ❌ | ❌ | own | ✅ |
| 리뷰 작성 | ❌ | own orders | ❌ | ❌ |
| 문의 작성 | ❌ | ✅ | ❌ | ✅ |
| 문의 답변 (product Q&A) | ❌ | ❌ | own products | ✅ |
| 주문 조회 | ❌ | own | ❌ | ✅ |
| 판매자 주문 조회 | ❌ | ❌ | own SKUs | ✅ |
| 판매자 상품 등록 | ❌ | ❌ | ✅ (approved) | ✅ |
| 상품 검수 승인 | ❌ | ❌ | ❌ | ✅ |
| 정산 조회 | ❌ | ❌ | own | ✅ |
| 정산 확정/지급 | ❌ | ❌ | ❌ | ✅ |
| 신고 처리 | ❌ | submit | ❌ | ✅ |
| 쿠폰 발급/캠페인 | ❌ | read own | ❌ | ✅ |
| 알림 | ❌ | own | own (seller channel) | admin feed |
| admin_logs | ❌ | ❌ | ❌ | ✅ |

---

## RLS direction by table (future)

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| profiles | own + public fields | system | own | soft-delete admin |
| products | public if published | seller | seller own / admin | admin |
| orders | user own / seller via items / admin | user checkout | status transitions via RPC | ❌ |
| payments | user own / admin | webhook service role | admin | ❌ |
| reviews | public approved | user | user own window | admin moderate |
| support_tickets | user own / admin | user | admin / system | archive admin |
| settlements | seller own / admin | system | admin | ❌ |
| reports | reporter own / admin | user | admin | ❌ |
| notifications | recipient | system | recipient read | ❌ |

**Pattern:** prefer **RPC / service role** for payment webhooks, settlement batch, coupon issue.

---

## Current vs future

| Item | Current | Future |
|------|---------|--------|
| Middleware route guard | ✅ `middleware.ts` | keep |
| Supabase RLS | ✅ partial migrations | harden per table |
| Seller product requests | 🔶 mock forms | DB + admin queue |
| Admin KPI | 🔶 mock | read-only aggregates |
| Service role usage | server actions | document each path |

---

## Security notes

- Never expose seller PII (buyer phone) to seller UI
- Admin actions → `admin_logs`
- Webhook endpoints: signature verify only, no client RLS
- Prototype auth (`PROTOTYPE_AUTH`) — **disable in production**

---

## Related

- `CELLOH_DATA_MODEL_PLAN.md`
- `CELLOH_SECRET_ENV_AUDIT.md`
