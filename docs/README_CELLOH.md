# CELLOH Documentation Hub

**Project:** `/Users/kimgana/Documents/wadeal-v2`  
**Branch:** `mobile-ui`  
**Last updated:** 2026-05-29 (integrity check)

Central index for CELLOH overnight docs. **Do not delete overlapping docs** — use this hub to find the canonical vs. legacy entry.

**Start here:** [CELLOH_MORNING_HANDOFF.md](./CELLOH_MORNING_HANDOFF.md) · [CELLOH_QA_SCENARIO_INDEX.md](./CELLOH_QA_SCENARIO_INDEX.md)

---

## Architecture / File map

| Document | Description |
|----------|-------------|
| [CELLOH_FILE_INVENTORY.md](./CELLOH_FILE_INVENTORY.md) | Folder roles & major files |
| [CELLOH_SCREEN_TO_FILE_MAP.md](./CELLOH_SCREEN_TO_FILE_MAP.md) | Screen → file dependency map |
| [CELLOH_RISKY_FILES_GUIDE.md](./CELLOH_RISKY_FILES_GUIDE.md) | High-impact files + test routes |
| [CELLOH_COMPONENT_DEPENDENCY_NOTES.md](./CELLOH_COMPONENT_DEPENDENCY_NOTES.md) | Client/server & provider deps |
| [CELLOH_DO_NOT_TOUCH_LIGHTLY.md](./CELLOH_DO_NOT_TOUCH_LIGHTLY.md) | Env, middleware, migrations guardrails |

**Also see:** [CELLOH_DESIGN_SYSTEM.md](./CELLOH_DESIGN_SYSTEM.md), [CELLOH_ROUTE_LINK_AUDIT.md](./CELLOH_ROUTE_LINK_AUDIT.md)

---

## QA

| Document | Description |
|----------|-------------|
| [CELLOH_QA_AUTOMATION_GUIDE.md](./CELLOH_QA_AUTOMATION_GUIDE.md) | lint/build/dev/smoke workflow |
| [CELLOH_SMOKE_TEST_PLAN.md](./CELLOH_SMOKE_TEST_PLAN.md) | Route + content smoke |
| [CELLOH_RELEASE_CHECKLIST.md](./CELLOH_RELEASE_CHECKLIST.md) | Technical release gate |
| [CELLOH_PERFORMANCE_ACCESSIBILITY_CHECKLIST.md](./CELLOH_PERFORMANCE_ACCESSIBILITY_CHECKLIST.md) | Perf/a11y |
| [CELLOH_RESPONSIVE_QA_REPORT.md](./CELLOH_RESPONSIVE_QA_REPORT.md) | Mobile layout QA |
| [CELLOH_ROUTE_LINK_AUDIT.md](./CELLOH_ROUTE_LINK_AUDIT.md) | Link audit |
| [CELLOH_MOBILE_UI_AUDIT.md](./CELLOH_MOBILE_UI_AUDIT.md) | UI audit |
| [CELLOH_OVERNIGHT_QA_REPORT.md](./CELLOH_OVERNIGHT_QA_REPORT.md) | Overnight QA runs |
| [CELLOH_FINAL_LOCAL_QA_REPORT.md](./CELLOH_FINAL_LOCAL_QA_REPORT.md) | Local QA summary |
| [CELLOH_QA_REPORT.md](./CELLOH_QA_REPORT.md) | Legacy QA notes |
| [CELLOH_SCREENSHOT_QA_CHECKLIST.md](./CELLOH_SCREENSHOT_QA_CHECKLIST.md) | Manual screenshot capture guide |

**Scripts:** `scripts/qa-routes.sh`, `scripts/smoke-content.sh`, `scripts/smoke-check.mjs`

---

## 시나리오

| Document | Description |
|----------|-------------|
| [CELLOH_QA_SCENARIO_INDEX.md](./CELLOH_QA_SCENARIO_INDEX.md) | **Hub** — P0 gates + route audit |
| [CELLOH_USER_PURCHASE_SCENARIOS.md](./CELLOH_USER_PURCHASE_SCENARIOS.md) | Customer purchase flows (5) |
| [CELLOH_CUSTOMER_CS_SCENARIOS.md](./CELLOH_CUSTOMER_CS_SCENARIOS.md) | Customer CS flows (8) |
| [CELLOH_SELLER_OPERATION_SCENARIOS.md](./CELLOH_SELLER_OPERATION_SCENARIOS.md) | Seller ops (9) |
| [CELLOH_ADMIN_OPERATION_SCENARIOS.md](./CELLOH_ADMIN_OPERATION_SCENARIOS.md) | Admin ops (9) |

---

## 정책

| Document | Description |
|----------|-------------|
| [CELLOH_SELLER_TRUST_MODEL.md](./CELLOH_SELLER_TRUST_MODEL.md) | Seller trust badges & metrics |
| [CELLOH_BUSINESS_INFO_DISPLAY_PLAN.md](./CELLOH_BUSINESS_INFO_DISPLAY_PLAN.md) | Company info placeholders |
| [CELLOH_SAFE_SHOPPING_GUIDE.md](./CELLOH_SAFE_SHOPPING_GUIDE.md) | Safe shopping guide |
| [CELLOH_SELLER_ENFORCEMENT_POLICY.md](./CELLOH_SELLER_ENFORCEMENT_POLICY.md) | Seller violations & sanctions |
| [CELLOH_POLICY_PAYMENT_REFERRAL_PLAN.md](./CELLOH_POLICY_PAYMENT_REFERRAL_PLAN.md) | Policy routes overview |
| [CELLOH_PRODUCT_DATA_POLICY.md](./CELLOH_PRODUCT_DATA_POLICY.md) | Product mock/data rules |
| [CELLOH_RANKING_RECOMMENDATION_POLICY.md](./CELLOH_RANKING_RECOMMENDATION_POLICY.md) | Ranking policy |
| [CELLOH_REVIEW_POLICY.md](./CELLOH_REVIEW_POLICY.md) | Review summary |
| [CELLOH_REVIEW_QNA_REPORT_POLICY.md](./CELLOH_REVIEW_QNA_REPORT_POLICY.md) | Review/Q&A/report |
| [CELLOH_REFERRAL_REWARD_POLICY.md](./CELLOH_REFERRAL_REWARD_POLICY.md) | Referral rewards |
| [CELLOH_DELIVERY_REFUND_OPERATIONS.md](./CELLOH_DELIVERY_REFUND_OPERATIONS.md) | Shipping/refund ops |
| [CELLOH_AUTH_ROLE_CHECKLIST.md](./CELLOH_AUTH_ROLE_CHECKLIST.md) | Roles & middleware |
| [CELLOH_SECRET_ENV_AUDIT.md](./CELLOH_SECRET_ENV_AUDIT.md) | Env/secrets |

**Live policy pages:** `/policies/privacy`, `/policies/terms`, `/policies/refund`, `/policies/seller`, etc.

---

## Legal / Privacy / PG Review

| Document | Description |
|----------|-------------|
| [CELLOH_LEGAL_REVIEW_ITEMS.md](./CELLOH_LEGAL_REVIEW_ITEMS.md) | 15-area legal review inventory |
| [CELLOH_PG_REVIEW_PREP.md](./CELLOH_PG_REVIEW_PREP.md) | PG 심사 준비·결제 mock 체크리스트 |
| [CELLOH_PRIVACY_REVIEW_CHECKLIST.md](./CELLOH_PRIVACY_REVIEW_CHECKLIST.md) | 개인정보 방침 검토 체크리스트 |
| [CELLOH_REFERRAL_COUPON_LEGAL_CHECK.md](./CELLOH_REFERRAL_COUPON_LEGAL_CHECK.md) | 쿠폰·친구추천 법무 점검 |

**Also see:** [CELLOH_BUSINESS_INFO_DISPLAY_PLAN.md](./CELLOH_BUSINESS_INFO_DISPLAY_PLAN.md), [CELLOH_DATA_RETENTION_PLAN.md](./CELLOH_DATA_RETENTION_PLAN.md)

---

## 결제 / 쿠폰

| Document | Description |
|----------|-------------|
| [CELLOH_ORDER_STATE_MACHINE.md](./CELLOH_ORDER_STATE_MACHINE.md) | Order/payment/shipping states |
| [CELLOH_COUPON_POINT_POLICY.md](./CELLOH_COUPON_POINT_POLICY.md) | Coupons & points |
| [CELLOH_COUPON_COST_CONTROL.md](./CELLOH_COUPON_COST_CONTROL.md) | Coupon budget & abuse |
| [CELLOH_PROMOTION_OPERATIONS_PLAN.md](./CELLOH_PROMOTION_OPERATIONS_PLAN.md) | Promotion catalog |
| [CELLOH_PROMOTION_DISPLAY_RULES.md](./CELLOH_PROMOTION_DISPLAY_RULES.md) | Display / anti-exaggeration |
| [CELLOH_PROMOTION_CALENDAR.md](./CELLOH_PROMOTION_CALENDAR.md) | Seasonal calendar |

---

## 판매자

| Document | Description |
|----------|-------------|
| [CELLOH_SELLER_CENTER_CHECKLIST.md](./CELLOH_SELLER_CENTER_CHECKLIST.md) | Route & mock checklist |
| [CELLOH_SELLER_PROPOSAL.md](./CELLOH_SELLER_PROPOSAL.md) | Recruitment proposal (draft) |
| [CELLOH_SELLER_ONBOARDING_GUIDE.md](./CELLOH_SELLER_ONBOARDING_GUIDE.md) | 10-step onboarding |
| [CELLOH_SELLER_ONBOARDING_PLAN.md](./CELLOH_SELLER_ONBOARDING_PLAN.md) | Technical onboarding plan |
| [CELLOH_PRODUCT_REGISTRATION_GUIDE.md](./CELLOH_PRODUCT_REGISTRATION_GUIDE.md) | Product listing guide |
| [CELLOH_SELLER_STORY_GUIDE.md](./CELLOH_SELLER_STORY_GUIDE.md) | Seller story writing |
| [CELLOH_SELLER_PRICING_PLAN.md](./CELLOH_SELLER_PRICING_PLAN.md) | Seller tiers (draft) |
| [CELLOH_SELLER_MESSAGE_TEMPLATES.md](./CELLOH_SELLER_MESSAGE_TEMPLATES.md) | Seller notifications |

**UI:** `/seller/*`, `/seller/help`, `/policies/seller`

---

## 관리자

| Document | Description |
|----------|-------------|
| [CELLOH_ANALYTICS_KPI_PLAN.md](./CELLOH_ANALYTICS_KPI_PLAN.md) | KPI & events |
| [CELLOH_ADMIN_MESSAGE_TEMPLATES.md](./CELLOH_ADMIN_MESSAGE_TEMPLATES.md) | Admin alerts |
| [CELLOH_ERROR_LOGGING_PLAN.md](./CELLOH_ERROR_LOGGING_PLAN.md) | Error categories |
| [ERROR_MONITORING.md](./ERROR_MONITORING.md) | Legacy monitoring |

**UI:** `/admin/*` — KPI mock on `/admin/dashboard`

*Note:* `CELLOH_ADMIN_OPERATIONS_CHECKLIST.md` — 추후 생성 (see backlog)

---

## 고객센터

| Document | Description |
|----------|-------------|
| [CELLOH_CUSTOMER_SUPPORT_PLAN.md](./CELLOH_CUSTOMER_SUPPORT_PLAN.md) | Support hub structure |
| [CELLOH_CS_REPLY_TEMPLATES.md](./CELLOH_CS_REPLY_TEMPLATES.md) | **CS reply copy by scenario** |
| [CELLOH_INTERNAL_CS_NOTES.md](./CELLOH_INTERNAL_CS_NOTES.md) | Internal ops memo templates |
| [CELLOH_CUSTOMER_CS_SCENARIOS.md](./CELLOH_CUSTOMER_CS_SCENARIOS.md) | CS QA scenarios (8) |
| [CELLOH_SAFE_SHOPPING_GUIDE.md](./CELLOH_SAFE_SHOPPING_GUIDE.md) | Safe shopping (`/support/safe-shopping`) |
| [CELLOH_CUSTOMER_MESSAGE_TEMPLATES.md](./CELLOH_CUSTOMER_MESSAGE_TEMPLATES.md) | Buyer notifications |
| [CELLOH_NOTIFICATION_TEMPLATES.md](./CELLOH_NOTIFICATION_TEMPLATES.md) | **Index** → role-specific message docs |

**Code:** `lib/notifications/message-templates.ts` (mock, no send)

**UI:** `/support/*`, `/mypage/support`, `/notifications`

---

## 런칭

| Document | Description |
|----------|-------------|
| [CELLOH_LAUNCH_CHECKLIST.md](./CELLOH_LAUNCH_CHECKLIST.md) | Business/legal go-live |
| [CELLOH_FINAL_REPORT.md](./CELLOH_FINAL_REPORT.md) | Final report |
| [CELLOH_FINAL_LOCAL_STATUS.md](./CELLOH_FINAL_LOCAL_STATUS.md) | Local status |
| [CELLOH_REBRAND_AUDIT.md](./CELLOH_REBRAND_AUDIT.md) | Rebrand audit |
| [CELLOH_PRIORITY_BACKLOG.md](./CELLOH_PRIORITY_BACKLOG.md) | P0–P3 remaining work |
| [CELLOH_NEXT_SESSION_PROMPT.md](./CELLOH_NEXT_SESSION_PROMPT.md) | Next chat prompt |

---

## 운영

| Document | Description |
|----------|-------------|
| [CELLOH_OPERATIONS_RUNBOOK.md](./CELLOH_OPERATIONS_RUNBOOK.md) | Daily/weekly/incident |
| [CELLOH_OPERATION_RISKS.md](./CELLOH_OPERATION_RISKS.md) | Risk register |
| [CELLOH_REVENUE_MODEL.md](./CELLOH_REVENUE_MODEL.md) | Revenue streams (draft) |
| [CELLOH_GROWTH_MARKETING_PLAN.md](./CELLOH_GROWTH_MARKETING_PLAN.md) | Growth strategy |
| [CELLOH_RECOMMENDATION_FOUNDATION.md](./CELLOH_RECOMMENDATION_FOUNDATION.md) | Personalization mock |

---

## 백업 / 복구

| Document | Description |
|----------|-------------|
| [CELLOH_BACKUP_RESTORE_RUNBOOK.md](./CELLOH_BACKUP_RESTORE_RUNBOOK.md) | Git/patch/tar recovery |
| [CELLOH_MORNING_HANDOFF.md](./CELLOH_MORNING_HANDOFF.md) | Morning handoff & status |

**Local backups:** `backups/celloh-*.patch`, `backups/celloh-*-status.txt`

---

## 문구 / 콘텐츠

| Document | Description |
|----------|-------------|
| [CELLOH_UX_WRITING_GUIDE.md](./CELLOH_UX_WRITING_GUIDE.md) | Microcopy & tone |
| [CELLOH_PRODUCT_COPY_GUIDE.md](./CELLOH_PRODUCT_COPY_GUIDE.md) | Product naming & claims |
| [CELLOH_CATEGORY_CURATION_GUIDE.md](./CELLOH_CATEGORY_CURATION_GUIDE.md) | Category curation |
| [CELLOH_COLLECTION_COPY_BANK.md](./CELLOH_COLLECTION_COPY_BANK.md) | Collection copy variants |
| [CELLOH_DESIGN_SYSTEM_V1.md](./CELLOH_DESIGN_SYSTEM_V1.md) | Design system |

**Code:** `lib/copy/home-section-copy.ts`, `lib/copy/ux-writing.ts`, `lib/promotions/promotion-copy.ts`

---

## Overlap notes (keep all files)

| Topic | Canonical | Also see |
|-------|-----------|----------|
| Notifications | `CELLOH_NOTIFICATION_TEMPLATES.md` (index) | `CELLOH_*_MESSAGE_TEMPLATES.md` |
| Seller onboarding | `CELLOH_SELLER_ONBOARDING_GUIDE.md` (content) | `CELLOH_SELLER_ONBOARDING_PLAN.md` (technical) |
| QA reports | `CELLOH_QA_SCENARIO_INDEX.md` (flows) | `CELLOH_OVERNIGHT_QA_REPORT.md` (runs) |
| Revenue / seller pricing | `CELLOH_REVENUE_MODEL.md` | `CELLOH_SELLER_PRICING_PLAN.md` |

---

## Design System

| Document | Description |
|----------|-------------|
| [CELLOH_DESIGN_SYSTEM.md](./CELLOH_DESIGN_SYSTEM.md) | **Brand, components, home/card rules (main guide)** |
| [CELLOH_DESIGN_SYSTEM_V1.md](./CELLOH_DESIGN_SYSTEM_V1.md) | Tokens: spacing, typography, radius |
| [CELLOH_MOBILE_UI_AUDIT.md](./CELLOH_MOBILE_UI_AUDIT.md) | Mobile layout QA |
| [CELLOH_PROMOTION_DISPLAY_RULES.md](./CELLOH_PROMOTION_DISPLAY_RULES.md) | Badge & promo copy rules |
| [CELLOH_PRODUCT_COPY_GUIDE.md](./CELLOH_PRODUCT_COPY_GUIDE.md) | Listing copy standards |
| [CELLOH_UX_WRITING_GUIDE.md](./CELLOH_UX_WRITING_GUIDE.md) | UX writing tone |

**Code:** `lib/design-system.ts`, `app/globals.css`

---

## Data & DB design (planning only)

| Document | Description |
|----------|-------------|
| [CELLOH_DATA_MODEL_PLAN.md](./CELLOH_DATA_MODEL_PLAN.md) | Tables, relations, priorities |
| [CELLOH_STATUS_VALUES.md](./CELLOH_STATUS_VALUES.md) | Order/product/seller/CS status enums |
| [CELLOH_EVENT_TRACKING_PLAN.md](./CELLOH_EVENT_TRACKING_PLAN.md) | Analytics events & payloads |
| [CELLOH_RLS_PERMISSION_PLAN.md](./CELLOH_RLS_PERMISSION_PLAN.md) | Roles & RLS direction |
| [CELLOH_DATA_RETENTION_PLAN.md](./CELLOH_DATA_RETENTION_PLAN.md) | Retention & deletion (draft) |

**Also see:** [CELLOH_ORDER_STATE_MACHINE.md](./CELLOH_ORDER_STATE_MACHINE.md), [CELLOH_ANALYTICS_KPI_PLAN.md](./CELLOH_ANALYTICS_KPI_PLAN.md)

---

## Quick commands

```bash
rm -rf .next && npm run lint && npm run build
npm run dev
npm run smoke:check
```

See [CELLOH_QA_AUTOMATION_GUIDE.md](./CELLOH_QA_AUTOMATION_GUIDE.md).
