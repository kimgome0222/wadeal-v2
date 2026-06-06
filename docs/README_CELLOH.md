# CELLOH Documentation Hub

**Project:** `/Users/kimgana/Documents/wadeal-v2`  
**Branch:** `mobile-ui`  
**Last updated:** 2026-05-31 (overnight work rule)

Central index for CELLOH docs. **Do not delete overlapping docs** — use this hub to find canonical vs. legacy entries.

**Start here:** [CELLOH_PRE_LAUNCH_MANUAL.md](./CELLOH_PRE_LAUNCH_MANUAL.md) · [CELLOH_MORNING_HANDOFF.md](./CELLOH_MORNING_HANDOFF.md) · [CELLOH_OVERNIGHT_WORK_RULE.md](./CELLOH_OVERNIGHT_WORK_RULE.md) · [CELLOH_QA_SCENARIO_INDEX.md](./CELLOH_QA_SCENARIO_INDEX.md)

---

## Brand & Design

| Document | Description |
|----------|-------------|
| [CELLOH_DESIGN_SYSTEM.md](./CELLOH_DESIGN_SYSTEM.md) | **Main guide** — brand, components, home/card rules |
| [CELLOH_DESIGN_SYSTEM_V1.md](./CELLOH_DESIGN_SYSTEM_V1.md) | Tokens: spacing, typography, radius |
| [CELLOH_UX_WRITING_GUIDE.md](./CELLOH_UX_WRITING_GUIDE.md) | Microcopy & tone |
| [CELLOH_PRODUCT_COPY_GUIDE.md](./CELLOH_PRODUCT_COPY_GUIDE.md) | Product naming & claims |
| [CELLOH_COLLECTION_COPY_BANK.md](./CELLOH_COLLECTION_COPY_BANK.md) | Collection copy variants |
| [CELLOH_CATEGORY_CURATION_GUIDE.md](./CELLOH_CATEGORY_CURATION_GUIDE.md) | Category curation |
| [CELLOH_REBRAND_AUDIT.md](./CELLOH_REBRAND_AUDIT.md) | Rebrand audit |

**Code:** `lib/design-system.ts`, `app/globals.css`, `lib/copy/ux-writing.ts`

---

## UX & QA

| Document | Description |
|----------|-------------|
| [CELLOH_QA_SCENARIO_INDEX.md](./CELLOH_QA_SCENARIO_INDEX.md) | **QA hub** — P0 gates + route audit |
| [CELLOH_QA_AUTOMATION_GUIDE.md](./CELLOH_QA_AUTOMATION_GUIDE.md) | lint/build/dev/smoke workflow |
| [CELLOH_SCREENSHOT_QA_CHECKLIST.md](./CELLOH_SCREENSHOT_QA_CHECKLIST.md) | Manual screenshot capture |
| [CELLOH_SMOKE_TEST_PLAN.md](./CELLOH_SMOKE_TEST_PLAN.md) | Route + content smoke |
| [CELLOH_MOBILE_UI_AUDIT.md](./CELLOH_MOBILE_UI_AUDIT.md) | Mobile UI audit |
| [CELLOH_RESPONSIVE_QA_REPORT.md](./CELLOH_RESPONSIVE_QA_REPORT.md) | Responsive layout QA |
| [CELLOH_ROUTE_LINK_AUDIT.md](./CELLOH_ROUTE_LINK_AUDIT.md) | Link audit |
| [CELLOH_OVERNIGHT_QA_REPORT.md](./CELLOH_OVERNIGHT_QA_REPORT.md) | Overnight QA runs |
| [CELLOH_FINAL_LOCAL_QA_REPORT.md](./CELLOH_FINAL_LOCAL_QA_REPORT.md) | Local QA summary |
| [CELLOH_QA_REPORT.md](./CELLOH_QA_REPORT.md) | Legacy QA notes |
| [CELLOH_PERFORMANCE_ACCESSIBILITY_CHECKLIST.md](./CELLOH_PERFORMANCE_ACCESSIBILITY_CHECKLIST.md) | Perf/a11y (legacy) |
| [CELLOH_ACCESSIBILITY_CHECKLIST.md](./CELLOH_ACCESSIBILITY_CHECKLIST.md) | **A11y hub** — touch, aria, keyboard |
| [CELLOH_COLOR_CONTRAST_NOTES.md](./CELLOH_COLOR_CONTRAST_NOTES.md) | Color contrast & price colors |
| [CELLOH_EMPTY_ERROR_STATE_GUIDE.md](./CELLOH_EMPTY_ERROR_STATE_GUIDE.md) | Empty/error copy + screen reader |
| [CELLOH_USER_PURCHASE_SCENARIOS.md](./CELLOH_USER_PURCHASE_SCENARIOS.md) | Customer purchase flows (5) |

**Scripts:** `scripts/qa-routes.sh`, `scripts/smoke-content.sh`, `scripts/smoke-check.mjs`

---

## Commerce Policy

| Document | Description |
|----------|-------------|
| [CELLOH_POLICY_PAYMENT_REFERRAL_PLAN.md](./CELLOH_POLICY_PAYMENT_REFERRAL_PLAN.md) | Policy routes overview |
| [CELLOH_SAFE_SHOPPING_GUIDE.md](./CELLOH_SAFE_SHOPPING_GUIDE.md) | Safe shopping guide |
| [CELLOH_SELLER_TRUST_MODEL.md](./CELLOH_SELLER_TRUST_MODEL.md) | Seller trust badges & metrics |
| [CELLOH_SELLER_ENFORCEMENT_POLICY.md](./CELLOH_SELLER_ENFORCEMENT_POLICY.md) | Seller violations & sanctions |
| [CELLOH_RANKING_RECOMMENDATION_POLICY.md](./CELLOH_RANKING_RECOMMENDATION_POLICY.md) | Ranking policy |
| [CELLOH_REVIEW_POLICY.md](./CELLOH_REVIEW_POLICY.md) | Review summary |
| [CELLOH_REVIEW_QNA_REPORT_POLICY.md](./CELLOH_REVIEW_QNA_REPORT_POLICY.md) | Review/Q&A/report |
| [CELLOH_PRODUCT_DATA_POLICY.md](./CELLOH_PRODUCT_DATA_POLICY.md) | Product mock/data rules |
| [CELLOH_DELIVERY_REFUND_OPERATIONS.md](./CELLOH_DELIVERY_REFUND_OPERATIONS.md) | Shipping/refund ops |
| [CELLOH_BUSINESS_INFO_DISPLAY_PLAN.md](./CELLOH_BUSINESS_INFO_DISPLAY_PLAN.md) | Company info placeholders |
| [CELLOH_PROMOTION_DISPLAY_RULES.md](./CELLOH_PROMOTION_DISPLAY_RULES.md) | Badge & promo copy rules |

**Live policy pages:** `/policies/privacy`, `/policies/terms`, `/policies/refund`, `/policies/shipping`, `/policies/payment`, `/policies/referral`, `/policies/seller`, `/commerce-policy`

---

## Review & UGC

| Document | Description |
|----------|-------------|
| [CELLOH_REVIEW_UGC_POLICY.md](./CELLOH_REVIEW_UGC_POLICY.md) | **UGC ops** — eligibility, moderation, rewards placeholder |
| [CELLOH_REVIEW_DISPLAY_RULES.md](./CELLOH_REVIEW_DISPLAY_RULES.md) | PDP sort, card review count format, empty states |
| [CELLOH_REVIEW_WRITE_FLOW.md](./CELLOH_REVIEW_WRITE_FLOW.md) | Mypage + PDP write UX flow |
| [CELLOH_SELLER_REVIEW_REPLY_GUIDE.md](./CELLOH_SELLER_REVIEW_REPLY_GUIDE.md) | Seller reply tone & templates |

**Code:** `lib/reviews/*`, `components/product-reviews-section.tsx`, `lib/product/card-badge-meta.ts`  
**UI:** `/product/[id]`, `/mypage/reviews`, `/reports`, `/seller/reviews`, `/admin/reviews`, `/admin/review-reports`

---

## Logistics & Fulfillment

| Document | Description |
|----------|-------------|
| [CELLOH_LOGISTICS_OPERATIONS_PLAN.md](./CELLOH_LOGISTICS_OPERATIONS_PLAN.md) | **Fulfillment models** — direct, 3PL, bundle/split, SLA |
| [CELLOH_SHIPPING_STATUS_GUIDE.md](./CELLOH_SHIPPING_STATUS_GUIDE.md) | Shipping states — customer/seller/admin actions |
| [CELLOH_SHIPPING_FEE_POLICY.md](./CELLOH_SHIPPING_FEE_POLICY.md) | Fees, free shipping, remote area, returns |
| [CELLOH_DELIVERY_REFUND_OPERATIONS.md](./CELLOH_DELIVERY_REFUND_OPERATIONS.md) | Legacy shipping/refund ops (code-aligned) |

**Code:** `lib/shipping/*`, `lib/orders/shipping-status.ts`  
**UI:** `/support/shipping`, `/seller/orders`, `/checkout/[id]`, `/join-cart`

---

## Inventory

| Document | Description |
|----------|-------------|
| [CELLOH_INVENTORY_POLICY.md](./CELLOH_INVENTORY_POLICY.md) | **Stock status** — in_stock, sold_out, oversell handling |
| [CELLOH_PRODUCT_DATA_POLICY.md](./CELLOH_PRODUCT_DATA_POLICY.md) | Product mock/data rules |

**Status codes:** `in_stock`, `low_stock`, `sold_out`, `restocking`, `discontinued`, `hidden` — see inventory doc + [CELLOH_STATUS_VALUES.md](./CELLOH_STATUS_VALUES.md)

---

## Payment & Privacy

| Document | Description |
|----------|-------------|
| [CELLOH_PRIVACY_UX_GUIDE.md](./CELLOH_PRIVACY_UX_GUIDE.md) | **Privacy UX** — input screens, consent, masking |
| [CELLOH_DATA_MASKING_RULES.md](./CELLOH_DATA_MASKING_RULES.md) | Masking formats (name, phone, card, address) |
| [CELLOH_CONSENT_ITEMS.md](./CELLOH_CONSENT_ITEMS.md) | Required/optional consent inventory |
| [CELLOH_ORDER_STATE_MACHINE.md](./CELLOH_ORDER_STATE_MACHINE.md) | Order/payment/shipping states |
| [CELLOH_PG_REVIEW_PREP.md](./CELLOH_PG_REVIEW_PREP.md) | PG 심사 prep · payment mock checklist |
| [CELLOH_PRIVACY_REVIEW_CHECKLIST.md](./CELLOH_PRIVACY_REVIEW_CHECKLIST.md) | Privacy policy review |
| [CELLOH_LEGAL_REVIEW_ITEMS.md](./CELLOH_LEGAL_REVIEW_ITEMS.md) | 15-area legal inventory |
| [CELLOH_REFERRAL_COUPON_LEGAL_CHECK.md](./CELLOH_REFERRAL_COUPON_LEGAL_CHECK.md) | Coupon/referral legal check |
| [CELLOH_COUPON_POINT_POLICY.md](./CELLOH_COUPON_POINT_POLICY.md) | Coupons & points |
| [CELLOH_COUPON_COST_CONTROL.md](./CELLOH_COUPON_COST_CONTROL.md) | Coupon budget & abuse |
| [CELLOH_REFERRAL_REWARD_POLICY.md](./CELLOH_REFERRAL_REWARD_POLICY.md) | Referral rewards |
| [CELLOH_PROMOTION_OPERATIONS_PLAN.md](./CELLOH_PROMOTION_OPERATIONS_PLAN.md) | Promotion catalog |
| [CELLOH_PROMOTION_CALENDAR.md](./CELLOH_PROMOTION_CALENDAR.md) | Seasonal calendar |

---

## Seller Center

| Document | Description |
|----------|-------------|
| [CELLOH_SELLER_CENTER_CHECKLIST.md](./CELLOH_SELLER_CENTER_CHECKLIST.md) | Route & mock checklist |
| [CELLOH_SELLER_ONBOARDING_GUIDE.md](./CELLOH_SELLER_ONBOARDING_GUIDE.md) | 10-step onboarding (content) |
| [CELLOH_SELLER_ONBOARDING_PLAN.md](./CELLOH_SELLER_ONBOARDING_PLAN.md) | Technical onboarding plan |
| [CELLOH_PRODUCT_REGISTRATION_GUIDE.md](./CELLOH_PRODUCT_REGISTRATION_GUIDE.md) | Product listing guide |
| [CELLOH_SELLER_STORY_GUIDE.md](./CELLOH_SELLER_STORY_GUIDE.md) | Seller story writing |
| [CELLOH_SELLER_OPERATION_SCENARIOS.md](./CELLOH_SELLER_OPERATION_SCENARIOS.md) | Seller ops scenarios (9) |
| [CELLOH_SELLER_MESSAGE_TEMPLATES.md](./CELLOH_SELLER_MESSAGE_TEMPLATES.md) | Seller notifications |
| [CELLOH_SELLER_PROPOSAL.md](./CELLOH_SELLER_PROPOSAL.md) | Recruitment proposal (draft) |
| [CELLOH_SELLER_PRICING_PLAN.md](./CELLOH_SELLER_PRICING_PLAN.md) | Seller tiers (draft) |

**UI:** `/seller/*`, `/seller/apply`, `/seller/help`, `/policies/seller`

---

## Finance & Unit Economics

| Document | Description |
|----------|-------------|
| [CELLOH_UNIT_ECONOMICS.md](./CELLOH_UNIT_ECONOMICS.md) | **P&L waterfall** — GMV, fees, coupon cost, margin |
| [CELLOH_SETTLEMENT_EXAMPLES.md](./CELLOH_SETTLEMENT_EXAMPLES.md) | Worked settlement examples (8 scenarios) |
| [CELLOH_AOV_STRATEGY.md](./CELLOH_AOV_STRATEGY.md) | AOV targets 30k–100k + UX tactics |
| [CELLOH_REVENUE_MODEL.md](./CELLOH_REVENUE_MODEL.md) | Revenue streams (draft) |
| [CELLOH_COUPON_COST_CONTROL.md](./CELLOH_COUPON_COST_CONTROL.md) | Coupon budget & abuse |
| [CELLOH_SELLER_PRICING_PLAN.md](./CELLOH_SELLER_PRICING_PLAN.md) | Seller subscription tiers (draft) |

⚠️ All rates **placeholder** — PG/세무/법무 검토 필요.  
**Code:** `lib/coupon/tier-coupon.ts`, `/admin/settlements`, `/seller/finance/settlements`

---

## Admin Operations

| Document | Description |
|----------|-------------|
| [CELLOH_ADMIN_OPERATION_SCENARIOS.md](./CELLOH_ADMIN_OPERATION_SCENARIOS.md) | Admin ops scenarios (9) |
| [CELLOH_PRODUCT_REVIEW_CHECKLIST.md](./CELLOH_PRODUCT_REVIEW_CHECKLIST.md) | Product approval criteria |
| [CELLOH_SELLER_REVIEW_CHECKLIST.md](./CELLOH_SELLER_REVIEW_CHECKLIST.md) | Seller onboarding review |
| [CELLOH_REJECTION_REASON_TEMPLATES.md](./CELLOH_REJECTION_REASON_TEMPLATES.md) | Reject / fix-request copy |
| [CELLOH_ADMIN_MESSAGE_TEMPLATES.md](./CELLOH_ADMIN_MESSAGE_TEMPLATES.md) | Admin alerts |
| [CELLOH_ANALYTICS_KPI_PLAN.md](./CELLOH_ANALYTICS_KPI_PLAN.md) | KPI & events |
| [CELLOH_ERROR_LOGGING_PLAN.md](./CELLOH_ERROR_LOGGING_PLAN.md) | Error categories |
| [CELLOH_AUTH_ROLE_CHECKLIST.md](./CELLOH_AUTH_ROLE_CHECKLIST.md) | Roles & middleware |
| *CELLOH_ADMIN_OPERATIONS_CHECKLIST.md* | **추후 생성 필요** |

**UI:** `/admin/*` — products, sellers, orders, settlements, coupons

---

## Customer Support

| Document | Description |
|----------|-------------|
| [CELLOH_CUSTOMER_SUPPORT_PLAN.md](./CELLOH_CUSTOMER_SUPPORT_PLAN.md) | Support hub structure |
| [CELLOH_CS_REPLY_TEMPLATES.md](./CELLOH_CS_REPLY_TEMPLATES.md) | **CS reply copy by scenario** |
| [CELLOH_INTERNAL_CS_NOTES.md](./CELLOH_INTERNAL_CS_NOTES.md) | Internal ops memo templates |
| [CELLOH_CUSTOMER_CS_SCENARIOS.md](./CELLOH_CUSTOMER_CS_SCENARIOS.md) | CS QA scenarios (8) |
| [CELLOH_CUSTOMER_MESSAGE_TEMPLATES.md](./CELLOH_CUSTOMER_MESSAGE_TEMPLATES.md) | Buyer notifications |
| [CELLOH_NOTIFICATION_TEMPLATES.md](./CELLOH_NOTIFICATION_TEMPLATES.md) | **Index** → role-specific message docs |

**Code:** `lib/notifications/message-templates.ts` (mock, no send)  
**UI:** `/support/*`, `/mypage/support`, `/notifications`

---

## Data Model

| Document | Description |
|----------|-------------|
| [CELLOH_DATA_MODEL_PLAN.md](./CELLOH_DATA_MODEL_PLAN.md) | Tables, relations, priorities |
| [CELLOH_STATUS_VALUES.md](./CELLOH_STATUS_VALUES.md) | Order/product/seller/CS status enums |
| [CELLOH_RLS_PERMISSION_PLAN.md](./CELLOH_RLS_PERMISSION_PLAN.md) | Roles & RLS direction |
| [CELLOH_EVENT_TRACKING_PLAN.md](./CELLOH_EVENT_TRACKING_PLAN.md) | Analytics events & payloads |
| [CELLOH_DATA_RETENTION_PLAN.md](./CELLOH_DATA_RETENTION_PLAN.md) | Retention & deletion (draft) |

**Also see:** [CELLOH_ORDER_STATE_MACHINE.md](./CELLOH_ORDER_STATE_MACHINE.md), [CELLOH_RECOMMENDATION_FOUNDATION.md](./CELLOH_RECOMMENDATION_FOUNDATION.md)

---

## Security

| Document | Description |
|----------|-------------|
| [CELLOH_SECRET_ENV_AUDIT.md](./CELLOH_SECRET_ENV_AUDIT.md) | Env/secrets inventory |
| [CELLOH_DO_NOT_TOUCH_LIGHTLY.md](./CELLOH_DO_NOT_TOUCH_LIGHTLY.md) | Env, middleware, migrations guardrails |
| [CELLOH_RISKY_FILES_GUIDE.md](./CELLOH_RISKY_FILES_GUIDE.md) | High-impact files + test routes |
| [CELLOH_AUTH_ROLE_CHECKLIST.md](./CELLOH_AUTH_ROLE_CHECKLIST.md) | Roles & middleware |
| [CELLOH_COMPONENT_DEPENDENCY_NOTES.md](./CELLOH_COMPONENT_DEPENDENCY_NOTES.md) | Client/server & provider deps |

---

## Launch

| Document | Description |
|----------|-------------|
| [CELLOH_PRE_LAUNCH_MANUAL.md](./CELLOH_PRE_LAUNCH_MANUAL.md) | **Integrated pre-launch manual (17 sections)** |
| [CELLOH_LAUNCH_CHECKLIST.md](./CELLOH_LAUNCH_CHECKLIST.md) | Business/legal go-live |
| [CELLOH_RELEASE_CHECKLIST.md](./CELLOH_RELEASE_CHECKLIST.md) | Technical release gate |
| [CELLOH_HOLD_ITEMS_BEFORE_LAUNCH.md](./CELLOH_HOLD_ITEMS_BEFORE_LAUNCH.md) | Explicit do-not-execute list |
| [CELLOH_FINAL_REPORT.md](./CELLOH_FINAL_REPORT.md) | Final overnight report |
| [CELLOH_FINAL_LOCAL_STATUS.md](./CELLOH_FINAL_LOCAL_STATUS.md) | Current local state |

---

## Runbook

| Document | Description |
|----------|-------------|
| [CELLOH_OPERATIONS_RUNBOOK.md](./CELLOH_OPERATIONS_RUNBOOK.md) | Daily/weekly/incident |
| [CELLOH_OPERATION_RISKS.md](./CELLOH_OPERATION_RISKS.md) | Risk register |
| [CELLOH_BACKUP_RESTORE_RUNBOOK.md](./CELLOH_BACKUP_RESTORE_RUNBOOK.md) | Git/patch/tar recovery |
| [CELLOH_MORNING_HANDOFF.md](./CELLOH_MORNING_HANDOFF.md) | Morning handoff & status |
| [CELLOH_OVERNIGHT_WORK_RULE.md](./CELLOH_OVERNIGHT_WORK_RULE.md) | **Overnight workflow** — code vs docs order, lint/commit rules |
| [CELLOH_REVENUE_MODEL.md](./CELLOH_REVENUE_MODEL.md) | Revenue streams (draft) |
| [CELLOH_GROWTH_MARKETING_PLAN.md](./CELLOH_GROWTH_MARKETING_PLAN.md) | Growth strategy |

**Local backups:** `backups/celloh-*.patch`, `backups/celloh-*-status.txt`

---

## Backlog

| Document | Description |
|----------|-------------|
| [CELLOH_PRIORITY_BACKLOG.md](./CELLOH_PRIORITY_BACKLOG.md) | **P0–P3 remaining work** |
| [CELLOH_NEXT_SESSION_PROMPT.md](./CELLOH_NEXT_SESSION_PROMPT.md) | Copy-paste next chat prompt |

**Queue rule:** Code/UX first · docs-only tasks **맨 뒤**

---

## Architecture (cross-cutting)

| Document | Description |
|----------|-------------|
| [CELLOH_FILE_INVENTORY.md](./CELLOH_FILE_INVENTORY.md) | Folder roles & major files |
| [CELLOH_SCREEN_TO_FILE_MAP.md](./CELLOH_SCREEN_TO_FILE_MAP.md) | Screen → file dependency map |

---

## Overlap notes (keep all files)

| Topic | Canonical | Also see |
|-------|-----------|----------|
| Pre-launch entry | `CELLOH_PRE_LAUNCH_MANUAL.md` | `README_CELLOH.md` (index) |
| Notifications | `CELLOH_NOTIFICATION_TEMPLATES.md` (index) | `CELLOH_*_MESSAGE_TEMPLATES.md` |
| Seller onboarding | `CELLOH_SELLER_ONBOARDING_GUIDE.md` (content) | `CELLOH_SELLER_ONBOARDING_PLAN.md` (technical) |
| QA reports | `CELLOH_QA_SCENARIO_INDEX.md` (flows) | `CELLOH_OVERNIGHT_QA_REPORT.md` (runs) |
| Design system | `CELLOH_DESIGN_SYSTEM.md` (main) | `CELLOH_DESIGN_SYSTEM_V1.md` (tokens) |
| Logistics / shipping fees | `CELLOH_LOGISTICS_OPERATIONS_PLAN.md` | `CELLOH_SHIPPING_FEE_POLICY.md`, `CELLOH_DELIVERY_REFUND_OPERATIONS.md` |
| Inventory / sold out | `CELLOH_INVENTORY_POLICY.md` | `CELLOH_STATUS_VALUES.md` (product lifecycle) |
| Unit economics / settlement | `CELLOH_UNIT_ECONOMICS.md` | `CELLOH_SETTLEMENT_EXAMPLES.md`, `CELLOH_REVENUE_MODEL.md` |
| AOV / cart tier | `CELLOH_AOV_STRATEGY.md` | `CELLOH_COUPON_POINT_POLICY.md` |
| Review / UGC | `CELLOH_REVIEW_UGC_POLICY.md` | `CELLOH_REVIEW_QNA_REPORT_POLICY.md`, `CELLOH_REVIEW_POLICY.md` |
| Review checklists | Product + Seller checklists | `CELLOH_REJECTION_REASON_TEMPLATES.md` |

---

## Quick commands

```bash
rm -rf .next && npm run lint && npm run build
npm run dev
npm run smoke:check
```

See [CELLOH_QA_AUTOMATION_GUIDE.md](./CELLOH_QA_AUTOMATION_GUIDE.md).
