# CELLOH Hold Items Before Launch

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Status:** Explicit do-not-execute list until business/legal/infra sign-off

**Related:** [CELLOH_PRE_LAUNCH_MANUAL.md](./CELLOH_PRE_LAUNCH_MANUAL.md) · [CELLOH_LAUNCH_CHECKLIST.md](./CELLOH_LAUNCH_CHECKLIST.md) · [CELLOH_PRIORITY_BACKLOG.md](./CELLOH_PRIORITY_BACKLOG.md)

---

## Purpose

These items are **intentionally deferred**. Do not execute during overnight or pre-launch local work unless explicitly approved by the project owner.

---

## Infrastructure & deployment

| # | Item | Why held | Unblock when |
|---|------|----------|--------------|
| H-01 | **GitHub push** | Local-only overnight workflow; review before remote | Owner approves PR strategy |
| H-02 | **Vercel production deploy** | Mock-first; legal/PG not ready | Launch checklist §infra complete |
| H-03 | **Supabase production DB migration** | Schema planned only ([CELLOH_DATA_MODEL_PLAN.md](./CELLOH_DATA_MODEL_PLAN.md)) | RLS plan reviewed + staging test |
| H-04 | **OAuth redirect 변경** (Google/Kakao) | Dev URLs only today | Production domain confirmed |

---

## Payments & money

| # | Item | Why held | Unblock when |
|---|------|----------|--------------|
| H-05 | **Toss 실제 결제 키** | Test/mock keys in local; secrets not in repo | PG 심사 완료 |
| H-06 | **실제 쿠폰 지급** | Mock UI + policy docs only | Coupon DB + cost control approved |
| H-07 | **실제 친구추천 지급** | Payout marked "예정" in UI | Legal + referral policy signed off |
| H-08 | **실제 정산 처리** | Settlement UI mock | Seller contract + finance process ready |

---

## Legal & compliance

| # | Item | Why held | Unblock when |
|---|------|----------|--------------|
| H-09 | **개인정보처리방침 확정** | Draft on `/policies/privacy` | Legal review complete |
| H-10 | **사업자정보 확정** | Placeholders in footer/settings | Real business registration data |
| H-11 | **법무/세무 검토** | [CELLOH_LEGAL_REVIEW_ITEMS.md](./CELLOH_LEGAL_REVIEW_ITEMS.md) inventory | External counsel sign-off |
| H-12 | **PG 심사** | [CELLOH_PG_REVIEW_PREP.md](./CELLOH_PG_REVIEW_PREP.md) prep only | Toss/application approved |
| H-13 | **판매자 계약서** | Onboarding guide draft | Legal template finalized |

---

## Also held (related)

| Item | Doc reference |
|------|---------------|
| KIBI access | All overnight task constraints |
| Email/Kakao/SMS send | [CELLOH_NOTIFICATION_TEMPLATES.md](./CELLOH_NOTIFICATION_TEMPLATES.md) |
| Real KPI aggregation | [CELLOH_ANALYTICS_KPI_PLAN.md](./CELLOH_ANALYTICS_KPI_PLAN.md) |
| Seller business verification API | [CELLOH_SELLER_ONBOARDING_PLAN.md](./CELLOH_SELLER_ONBOARDING_PLAN.md) |
| Production SEO submit | [CELLOH_LAUNCH_CHECKLIST.md](./CELLOH_LAUNCH_CHECKLIST.md) |
| Rate limiting (auth/payment) | Post-launch hardening |

---

## Safe to do now (not on hold list)

- Local lint/build/dev
- Mock UI, CSS/layout fixes
- Documentation updates (no deletes)
- Local git commits (no push)
- Manual QA on local routes
- Screenshot capture per QA checklist

---

## Sign-off checklist (future)

When ready to launch, verify each H-01–H-13 row has an owner, date, and evidence before removing from hold.

**Current status:** All items above remain **ON HOLD**.
