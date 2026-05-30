# CELLOH Documentation Hub

**Project:** `/Users/kimgana/Documents/wadeal-v2`  
**Branch:** `mobile-ui`  
**Last updated:** 2026-05-29

Central index for CELLOH overnight docs. No code UI exposure required.

---

## QA & release

| Document | Description |
|----------|-------------|
| [CELLOH_QA_AUTOMATION_GUIDE.md](./CELLOH_QA_AUTOMATION_GUIDE.md) | lint/build/dev/smoke workflow |
| [CELLOH_SMOKE_TEST_PLAN.md](./CELLOH_SMOKE_TEST_PLAN.md) | Route + content smoke |
| [CELLOH_RELEASE_CHECKLIST.md](./CELLOH_RELEASE_CHECKLIST.md) | Technical release gate |
| [CELLOH_LAUNCH_CHECKLIST.md](./CELLOH_LAUNCH_CHECKLIST.md) | Business/legal go-live |
| [CELLOH_PERFORMANCE_ACCESSIBILITY_CHECKLIST.md](./CELLOH_PERFORMANCE_ACCESSIBILITY_CHECKLIST.md) | Perf/a11y |
| [CELLOH_RESPONSIVE_QA_REPORT.md](./CELLOH_RESPONSIVE_QA_REPORT.md) | Mobile QA |
| [CELLOH_ROUTE_LINK_AUDIT.md](./CELLOH_ROUTE_LINK_AUDIT.md) | Link audit |
| [CELLOH_MOBILE_UI_AUDIT.md](./CELLOH_MOBILE_UI_AUDIT.md) | UI audit |

**Scripts:** `scripts/qa-routes.sh`, `scripts/smoke-content.sh`, `scripts/smoke-check.mjs`

---

## Operations & runbooks

| Document | Description |
|----------|-------------|
| [CELLOH_OPERATIONS_RUNBOOK.md](./CELLOH_OPERATIONS_RUNBOOK.md) | Daily/weekly/incident |
| [CELLOH_BACKUP_RESTORE_RUNBOOK.md](./CELLOH_BACKUP_RESTORE_RUNBOOK.md) | Git/patch/tar recovery |
| [CELLOH_ERROR_LOGGING_PLAN.md](./CELLOH_ERROR_LOGGING_PLAN.md) | Error categories + redaction |
| [ERROR_MONITORING.md](./ERROR_MONITORING.md) | Legacy monitoring notes |
| [CELLOH_MORNING_HANDOFF.md](./CELLOH_MORNING_HANDOFF.md) | Morning handoff template |

---

## Commerce & promotions

| Document | Description |
|----------|-------------|
| [CELLOH_ORDER_STATE_MACHINE.md](./CELLOH_ORDER_STATE_MACHINE.md) | Order states |
| [CELLOH_COUPON_POINT_POLICY.md](./CELLOH_COUPON_POINT_POLICY.md) | Coupons/points |
| [CELLOH_COUPON_COST_CONTROL.md](./CELLOH_COUPON_COST_CONTROL.md) | Coupon cost & abuse |
| [CELLOH_PROMOTION_OPERATIONS_PLAN.md](./CELLOH_PROMOTION_OPERATIONS_PLAN.md) | Promotions |
| [CELLOH_PROMOTION_DISPLAY_RULES.md](./CELLOH_PROMOTION_DISPLAY_RULES.md) | Display rules |
| [CELLOH_PROMOTION_CALENDAR.md](./CELLOH_PROMOTION_CALENDAR.md) | Weekly/seasonal calendar |
| [CELLOH_REFERRAL_REWARD_POLICY.md](./CELLOH_REFERRAL_REWARD_POLICY.md) | Referral |
| [CELLOH_DELIVERY_REFUND_OPERATIONS.md](./CELLOH_DELIVERY_REFUND_OPERATIONS.md) | Shipping/refund |
| [CELLOH_NOTIFICATION_TEMPLATES.md](./CELLOH_NOTIFICATION_TEMPLATES.md) | Notifications |

---

## Business, monetization & growth

| Document | Description |
|----------|-------------|
| [CELLOH_REVENUE_MODEL.md](./CELLOH_REVENUE_MODEL.md) | Revenue streams (draft) |
| [CELLOH_SELLER_PRICING_PLAN.md](./CELLOH_SELLER_PRICING_PLAN.md) | Seller tiers |
| [CELLOH_GROWTH_MARKETING_PLAN.md](./CELLOH_GROWTH_MARKETING_PLAN.md) | Growth strategy |
| [CELLOH_OPERATION_RISKS.md](./CELLOH_OPERATION_RISKS.md) | Risk register |
| [CELLOH_ANALYTICS_KPI_PLAN.md](./CELLOH_ANALYTICS_KPI_PLAN.md) | KPI & events |

**KPI / admin ops (추후 생성):**

- `CELLOH_ADMIN_OPERATIONS_CHECKLIST.md` — 추후 생성

---

## Reviews & support

| Document | Description |
|----------|-------------|
| [CELLOH_REVIEW_QNA_REPORT_POLICY.md](./CELLOH_REVIEW_QNA_REPORT_POLICY.md) | Review/Q&A/report |
| [CELLOH_REVIEW_POLICY.md](./CELLOH_REVIEW_POLICY.md) | Review summary |
| [CELLOH_CUSTOMER_SUPPORT_PLAN.md](./CELLOH_CUSTOMER_SUPPORT_PLAN.md) | Support |

---

## Seller & admin

| Document | Description |
|----------|-------------|
| [CELLOH_SELLER_CENTER_CHECKLIST.md](./CELLOH_SELLER_CENTER_CHECKLIST.md) | Seller center |
| [CELLOH_SELLER_ONBOARDING_PLAN.md](./CELLOH_SELLER_ONBOARDING_PLAN.md) | Onboarding |
| [CELLOH_SELLER_PRICING_PLAN.md](./CELLOH_SELLER_PRICING_PLAN.md) | Seller plans |
| [CELLOH_REVENUE_MODEL.md](./CELLOH_REVENUE_MODEL.md) | Platform revenue |
| [CELLOH_AUTH_ROLE_CHECKLIST.md](./CELLOH_AUTH_ROLE_CHECKLIST.md) | Roles |
| [CELLOH_SECRET_ENV_AUDIT.md](./CELLOH_SECRET_ENV_AUDIT.md) | Env/secrets |

---

## Product & design

| Document | Description |
|----------|-------------|
| [CELLOH_DESIGN_SYSTEM_V1.md](./CELLOH_DESIGN_SYSTEM_V1.md) | Design system |
| [CELLOH_PRODUCT_DATA_POLICY.md](./CELLOH_PRODUCT_DATA_POLICY.md) | Product data |
| [CELLOH_RANKING_RECOMMENDATION_POLICY.md](./CELLOH_RANKING_RECOMMENDATION_POLICY.md) | Ranking |
| [CELLOH_RECOMMENDATION_FOUNDATION.md](./CELLOH_RECOMMENDATION_FOUNDATION.md) | Recommendations |

---

## Reports & status

| Document | Description |
|----------|-------------|
| [CELLOH_FINAL_REPORT.md](./CELLOH_FINAL_REPORT.md) | Final report |
| [CELLOH_FINAL_LOCAL_STATUS.md](./CELLOH_FINAL_LOCAL_STATUS.md) | Local status |
| [CELLOH_OVERNIGHT_QA_REPORT.md](./CELLOH_OVERNIGHT_QA_REPORT.md) | Overnight QA |

---

## Quick commands

```bash
rm -rf .next && npm run lint && npm run build
# or: npm run qa:preflight
npm run dev
npm run smoke:check
```

See [CELLOH_QA_AUTOMATION_GUIDE.md](./CELLOH_QA_AUTOMATION_GUIDE.md).
