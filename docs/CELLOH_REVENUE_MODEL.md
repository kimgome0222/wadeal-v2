# CELLOH Revenue Model (Draft)

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** ⚠️ **초안** — 법무·세무·PG 계약 검토 필요. 실제 수수료 미확정.

---

## Platform positioning

celloh is a **seller-centric commerce platform**: revenue from transaction fees, visibility products, and optional seller subscriptions — not inventory-first retail margin alone.

---

## Revenue streams

| Stream | Description | Phase |
|--------|-------------|-------|
| **판매 수수료** | GMV 기준 % + PG fee pass-through | Launch |
| **메인 노출 광고비** | Hero / home rail placement | Post-MVP |
| **기획전 참여비** | Curated collection slot fee | Growth |
| **쿠폰 비용 분담** | Platform vs seller co-fund | Launch |
| **셀로 멤버십** | Consumer subscription (shipping, perks) | Phase 2 |
| **셀러 프리미엄 프로필** | Enhanced seller page / story | Growth |
| **라이브커머스 수수료** | Live sale commission uplift | Phase 3 |
| **브랜드 협업/단독 구성** | Only Celloh bundle margin share | Growth |
| **PB/직매입** | Own inventory margin | Long-term |

---

## Transaction fee (draft)

| Item | Draft range | Notes |
|------|-------------|-------|
| Base commission | **8–12%** (placeholder) | Category-dependent TBD |
| PG fee | Pass-through or bundled | Toss contract |
| VAT on commission | Separate invoice | Tax review |

**Refund/cancel:** Commission reversed on full refund; partial refund proportional (placeholder).

---

## Settlement cycle (draft)

| Step | Timing |
|------|--------|
| Order confirmed / delivered | T+0 event |
| Settlement hold | Return window (e.g. 7–14 days) |
| Payout to seller | Weekly or bi-weekly (TBD) |
| Admin confirm | `/admin/settlements` |

---

## Free period for new sellers (draft)

| Policy | Draft |
|--------|-------|
| Initial **3 months** commission-free | Possible for first N sellers or launch cohort |
| Cap | Max GMV or order count during free period |
| After free period | Tiered fee below |

---

## Seller fee tiers (after free period — draft)

| Tier | Criteria (placeholder) | Fee (placeholder) |
|------|------------------------|-----------------|
| **신규 셀러** | First 90 days post-free | 6–8% |
| **일반 셀러** | Default active | 8–10% |
| **우수 셀러** | Rating, response rate, low refund | 6–8% |
| **단독 셀러** | Only Celloh / brand partner | Negotiated |

---

## Coupon & promotion economics

See `docs/CELLOH_COUPON_COST_CONTROL.md` — platform vs seller share per campaign.

---

## Membership revenue (draft)

| Item | Placeholder |
|------|-------------|
| Monthly fee | TODO (legal + PG subscription) |
| Primary value | Free shipping coupon, early access |
| Churn target | Track in future KPI doc |

---

## Legal / tax disclaimer

- All rates are **planning drafts**, not offers of contract.
- Requires: commerce law, VAT, withholding, seller terms update.
- No implementation of billing in this task.

---

## Related

| Doc | Topic |
|-----|-------|
| `CELLOH_SELLER_PRICING_PLAN.md` | Seller tiers |
| `CELLOH_COUPON_COST_CONTROL.md` | Coupon economics |
| `CELLOH_OPERATIONS_RUNBOOK.md` | Daily ops |
| `CELLOH_ANALYTICS_KPI_PLAN.md` | Revenue KPIs |
| `CELLOH_PROMOTION_OPERATIONS_PLAN.md` | Campaign ops |
| `CELLOH_LAUNCH_CHECKLIST.md` | Launch gate |
| `CELLOH_ADMIN_OPERATIONS_CHECKLIST.md` | 추후 생성 |
| `/admin/settlements`, `/seller/finance/settlements` | Settlement UI |
