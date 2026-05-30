# CELLOH Pre-Launch Manual

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Project:** `/Users/kimgana/Documents/wadeal-v2`  
**Status:** Operator & developer reference — **planning only, no deploy**

**Start here:** [README_CELLOH.md](./README_CELLOH.md) (doc hub) · [CELLOH_MORNING_HANDOFF.md](./CELLOH_MORNING_HANDOFF.md) (latest handoff)

---

## How to use this manual

| Audience | Read first |
|----------|------------|
| **Operator (운영)** | §5–§12, §15–§17 |
| **Developer (개발)** | §1–§4, §13–§16 |
| **Morning check** | §15 + [CELLOH_FINAL_LOCAL_STATUS.md](./CELLOH_FINAL_LOCAL_STATUS.md) |

Each section lists **related docs**, **summary**, **pre-launch checks**, and **hold items**.

---

## 1. 프로젝트 개요

### Related docs

| Doc | Role |
|-----|------|
| [README_CELLOH.md](./README_CELLOH.md) | Documentation hub |
| [CELLOH_FILE_INVENTORY.md](./CELLOH_FILE_INVENTORY.md) | Folder & file map |
| [CELLOH_SCREEN_TO_FILE_MAP.md](./CELLOH_SCREEN_TO_FILE_MAP.md) | Screen → code map |
| [CELLOH_MORNING_HANDOFF.md](./CELLOH_MORNING_HANDOFF.md) | Overnight handoff |
| [CELLOH_FINAL_REPORT.md](./CELLOH_FINAL_REPORT.md) | Overnight summary report |

### 핵심 요약

- **celloh** — 판매자 중심 스토리 커머스 (Next.js 16, App Router, mock-first)
- **Repo:** `/Users/kimgana/Documents/wadeal-v2` · **Branch:** `mobile-ui`
- Overnight 작업: QA, 정책, 판매자/관리자/CS, 결제·쿠폰·친구추천, 검수 기준, 데이터 모델 **문서화** 완료
- 실제 PG/DB/배포/지급은 **보류** — UI·mock·docs 중심

### 오픈 전 확인

- [ ] `git log -5 --oneline` — 최신 커밋 확인
- [ ] `rm -rf .next && npm run lint && npm run build` — PASS
- [ ] [CELLOH_HOLD_ITEMS_BEFORE_LAUNCH.md](./CELLOH_HOLD_ITEMS_BEFORE_LAUNCH.md) — 보류 항목 숙지

### 아직 보류

- GitHub push, Vercel production deploy, Supabase migration

---

## 2. 브랜드 방향

### Related docs

| Doc | Role |
|-----|------|
| [CELLOH_DESIGN_SYSTEM.md](./CELLOH_DESIGN_SYSTEM.md) | Brand, color, components |
| [CELLOH_DESIGN_SYSTEM_V1.md](./CELLOH_DESIGN_SYSTEM_V1.md) | Tokens, spacing, typography |
| [CELLOH_UX_WRITING_GUIDE.md](./CELLOH_UX_WRITING_GUIDE.md) | Microcopy & tone |
| [CELLOH_PRODUCT_COPY_GUIDE.md](./CELLOH_PRODUCT_COPY_GUIDE.md) | Listing copy standards |
| [CELLOH_REBRAND_AUDIT.md](./CELLOH_REBRAND_AUDIT.md) | Rebrand audit |
| [CELLOH_COLLECTION_COPY_BANK.md](./CELLOH_COLLECTION_COPY_BANK.md) | Collection copy variants |

### 핵심 요약

- **철학:** "누가 만들었는지 알고 사세요." — 판매자 스토리가 구매 출발점
- **Voice:** 담백·신뢰·로컬 감성. 과장 광고·게임화·네온 톤 지양
- **Color:** Primary `#2E5E4E`, Accent `#E28A3B`, surface `#F5F7F6`
- **References:** 오늘의집(50%) + 쿠팡(35%) + 당근(15%) — B마트 UX ref (장바구니 progress)

### 오픈 전 확인

- [ ] 홈·PDP·정책 페이지 카피가 UX writing guide와 일치
- [ ] 과장 표현·"최저가" 등 금지 표현 없음 ([CELLOH_PROMOTION_DISPLAY_RULES.md](./CELLOH_PROMOTION_DISPLAY_RULES.md))
- [ ] Footer·metadata 슬로건 일관

### 아직 보류

- 법무 검토 후 최종 카피 확정
- 사업자정보·대표자명 placeholder → 실제 정보

---

## 3. 핵심 UX

### Related docs

| Doc | Role |
|-----|------|
| [CELLOH_MOBILE_UI_AUDIT.md](./CELLOH_MOBILE_UI_AUDIT.md) | Mobile UI audit |
| [CELLOH_RESPONSIVE_QA_REPORT.md](./CELLOH_RESPONSIVE_QA_REPORT.md) | Responsive layout QA |
| [CELLOH_ROUTE_LINK_AUDIT.md](./CELLOH_ROUTE_LINK_AUDIT.md) | Link audit |
| [CELLOH_RECOMMENDATION_FOUNDATION.md](./CELLOH_RECOMMENDATION_FOUNDATION.md) | Personalization mock |
| [CELLOH_COMPONENT_DEPENDENCY_NOTES.md](./CELLOH_COMPONENT_DEPENDENCY_NOTES.md) | Client/server deps |

### 핵심 요약

- **Mobile-first** 375–430px, bottom nav, sticky header/search
- **Purchase path:** Home → Category/Collection → PDP → Join cart → Checkout (mock PG)
- **Seller story:** PDP seller card, `/sellers/[id]`, seller rail on home
- **Cart:** Guest localStorage + logged-in sync (edge cases documented in backlog)

### 오픈 전 확인

- [ ] P1 routes manual pass ([CELLOH_PRIORITY_BACKLOG.md](./CELLOH_PRIORITY_BACKLOG.md) §P1)
- [ ] Quick Menu 17 items — dead link 없음
- [ ] + stepper / cart badge / purchase bar safe-area

### 아직 보류

- Real device touch + VoiceOver/TalkBack full sweep
- Live commerce (`/collections/live` — prep only)

---

## 4. 홈/카테고리/상품상세/장바구니 QA

### Related docs

| Doc | Role |
|-----|------|
| [CELLOH_QA_SCENARIO_INDEX.md](./CELLOH_QA_SCENARIO_INDEX.md) | **QA hub** — P0 gates |
| [CELLOH_SCREENSHOT_QA_CHECKLIST.md](./CELLOH_SCREENSHOT_QA_CHECKLIST.md) | Manual screenshot guide |
| [CELLOH_USER_PURCHASE_SCENARIOS.md](./CELLOH_USER_PURCHASE_SCENARIOS.md) | Purchase flows (5) |
| [CELLOH_SMOKE_TEST_PLAN.md](./CELLOH_SMOKE_TEST_PLAN.md) | Route smoke |
| [CELLOH_QA_AUTOMATION_GUIDE.md](./CELLOH_QA_AUTOMATION_GUIDE.md) | lint/build/dev workflow |
| [CELLOH_OVERNIGHT_QA_REPORT.md](./CELLOH_OVERNIGHT_QA_REPORT.md) | Overnight QA runs |
| [CELLOH_FINAL_LOCAL_QA_REPORT.md](./CELLOH_FINAL_LOCAL_QA_REPORT.md) | Local QA summary |

### 핵심 요약

| Route | Check |
|-------|-------|
| `/` | Hero, quick menu, rails, seller section |
| `/category/food` | Sub-filter, grid, no clip at 430px |
| `/product/1` | Images, price, seller, purchase bar, tabs |
| `/join-cart` | Coupon notice, checkout CTA, mock payment |
| `/collections/ranking` | Ranking cards, width at 375/390/430px |

**Scripts:** `npm run smoke:check`, `scripts/qa-routes.sh`

### 오픈 전 확인

- [ ] P0: lint/build PASS + 10 morning routes 200
- [ ] P1: stepper, cart badge, PDP purchase bar, category filter
- [ ] Screenshot QA checklist capture (optional archive)

### 아직 보류

- Admin dashboard full manual QA
- Logged-in vs guest cart dual-sync edge cases

---

## 5. 정책 페이지

### Related docs

| Doc | Role |
|-----|------|
| [CELLOH_POLICY_PAYMENT_REFERRAL_PLAN.md](./CELLOH_POLICY_PAYMENT_REFERRAL_PLAN.md) | Policy routes overview |
| [CELLOH_SAFE_SHOPPING_GUIDE.md](./CELLOH_SAFE_SHOPPING_GUIDE.md) | Safe shopping |
| [CELLOH_REVIEW_QNA_REPORT_POLICY.md](./CELLOH_REVIEW_QNA_REPORT_POLICY.md) | Review/Q&A/report |
| [CELLOH_RANKING_RECOMMENDATION_POLICY.md](./CELLOH_RANKING_RECOMMENDATION_POLICY.md) | Ranking policy |
| [CELLOH_SELLER_ENFORCEMENT_POLICY.md](./CELLOH_SELLER_ENFORCEMENT_POLICY.md) | Seller sanctions |

**Live routes:** `/policies/privacy`, `/terms`, `/refund`, `/shipping`, `/payment`, `/referral`, `/review`, `/commerce-policy`, `/info/ranking-policy`

### 핵심 요약

- Policy pages are **content-complete drafts** — legal final review pending
- Footer links → policy routes; seller policy at `/policies/seller`
- Safe shopping: `/support/safe-shopping`

### 오픈 전 확인

- [ ] All policy routes return 200 in build
- [ ] Footer links match live slugs
- [ ] No "법무 검토 중" in customer-facing critical paths (softened where needed)

### 아직 보류

- 개인정보처리방침·이용약관 **법무 확정**
- 사업자등록번호·통신판매업 신고번호 실제 값

---

## 6. 개인정보/결제/환불/배송

### Related docs

| Doc | Role |
|-----|------|
| [CELLOH_PRIVACY_REVIEW_CHECKLIST.md](./CELLOH_PRIVACY_REVIEW_CHECKLIST.md) | Privacy review |
| [CELLOH_LEGAL_REVIEW_ITEMS.md](./CELLOH_LEGAL_REVIEW_ITEMS.md) | 15-area legal inventory |
| [CELLOH_PG_REVIEW_PREP.md](./CELLOH_PG_REVIEW_PREP.md) | PG 심사 prep |
| [CELLOH_ORDER_STATE_MACHINE.md](./CELLOH_ORDER_STATE_MACHINE.md) | Order/payment states |
| [CELLOH_DELIVERY_REFUND_OPERATIONS.md](./CELLOH_DELIVERY_REFUND_OPERATIONS.md) | Shipping/refund ops |
| [CELLOH_BUSINESS_INFO_DISPLAY_PLAN.md](./CELLOH_BUSINESS_INFO_DISPLAY_PLAN.md) | Company info placeholders |

### 핵심 요약

- **Payment:** Toss mock in dev; `lib/payments/toss/*` — live keys **not in repo**
- **Order states:** draft → paid → shipping → delivered → refund (see state machine doc)
- **Refund/shipping:** Policy pages + ops doc; API routes exist, production test pending
- **Privacy:** Checklist draft; retention in [CELLOH_DATA_RETENTION_PLAN.md](./CELLOH_DATA_RETENTION_PLAN.md)

### 오픈 전 확인

- [ ] `/policies/privacy`, `/payment`, `/refund`, `/shipping` content review
- [ ] `.env.local` never committed ([CELLOH_SECRET_ENV_AUDIT.md](./CELLOH_SECRET_ENV_AUDIT.md))
- [ ] Mock PG flow works end-to-end locally

### 아직 보류

- Toss **live keys**, webhook production URL, refund API ops test
- PG 심사, OAuth production redirect URLs
- 개인정보처리방침 확정

---

## 7. 쿠폰/포인트/친구추천

### Related docs

| Doc | Role |
|-----|------|
| [CELLOH_COUPON_POINT_POLICY.md](./CELLOH_COUPON_POINT_POLICY.md) | Coupons & points |
| [CELLOH_COUPON_COST_CONTROL.md](./CELLOH_COUPON_COST_CONTROL.md) | Budget & abuse |
| [CELLOH_REFERRAL_REWARD_POLICY.md](./CELLOH_REFERRAL_REWARD_POLICY.md) | Referral rewards |
| [CELLOH_REFERRAL_COUPON_LEGAL_CHECK.md](./CELLOH_REFERRAL_COUPON_LEGAL_CHECK.md) | Legal check |
| [CELLOH_PROMOTION_OPERATIONS_PLAN.md](./CELLOH_PROMOTION_OPERATIONS_PLAN.md) | Promotion catalog |
| [CELLOH_PROMOTION_DISPLAY_RULES.md](./CELLOH_PROMOTION_DISPLAY_RULES.md) | Display rules |
| [CELLOH_PROMOTION_CALENDAR.md](./CELLOH_PROMOTION_CALENDAR.md) | Seasonal calendar |

**UI:** `/invite`, `/membership`, `/mypage/coupons`, `/mypage/points`, `/admin/coupons`

### 핵심 요약

- Coupons/points/referrals: **mock UI + policy docs** — no real issuance/payout
- Invite page shows reward copy; payout marked "예정"
- Admin coupon CRUD is mock; cost control rules documented

### 오픈 전 확인

- [ ] `/invite`, `/join-cart` coupon notice — no misleading "즉시 지급"
- [ ] Promotion badges follow display rules
- [ ] Legal checklist items flagged

### 아직 보류

- **실제 쿠폰 지급**, **실제 친구추천 지급**
- Referrals DB table, coupon issuance API
- 멤버십 구독 PG + legal

---

## 8. 판매자센터

### Related docs

| Doc | Role |
|-----|------|
| [CELLOH_SELLER_CENTER_CHECKLIST.md](./CELLOH_SELLER_CENTER_CHECKLIST.md) | Route checklist |
| [CELLOH_SELLER_ONBOARDING_GUIDE.md](./CELLOH_SELLER_ONBOARDING_GUIDE.md) | 10-step onboarding |
| [CELLOH_SELLER_ONBOARDING_PLAN.md](./CELLOH_SELLER_ONBOARDING_PLAN.md) | Technical plan |
| [CELLOH_PRODUCT_REGISTRATION_GUIDE.md](./CELLOH_PRODUCT_REGISTRATION_GUIDE.md) | Product listing |
| [CELLOH_SELLER_OPERATION_SCENARIOS.md](./CELLOH_SELLER_OPERATION_SCENARIOS.md) | Ops scenarios (9) |
| [CELLOH_SELLER_MESSAGE_TEMPLATES.md](./CELLOH_SELLER_MESSAGE_TEMPLATES.md) | Notifications |
| [CELLOH_SELLER_TRUST_MODEL.md](./CELLOH_SELLER_TRUST_MODEL.md) | Trust badges |
| [CELLOH_SELLER_PROPOSAL.md](./CELLOH_SELLER_PROPOSAL.md) | Recruitment (draft) |

**UI:** `/seller/*`, `/seller/apply`, `/seller/help`, `/policies/seller`

### 핵심 요약

- Seller apply → pending → admin review → approved/rejected/suspended
- Product requests, orders, settlements, CS — **mock workflows**
- Help center content at `/seller/help`

### 오픈 전 확인

- [ ] `/seller/apply` form loads; pending/rejected/suspended gates work
- [ ] Seller product registration guide matches UI fields
- [ ] No crash on `/seller/dashboard` (login + approval gate)

### 아직 보류

- Seller business verification API
- **실제 정산 처리**, settlement DB workflow
- **판매자 계약서** 법무 확정

---

## 9. 관리자센터

### Related docs

| Doc | Role |
|-----|------|
| [CELLOH_ADMIN_OPERATION_SCENARIOS.md](./CELLOH_ADMIN_OPERATION_SCENARIOS.md) | Admin scenarios (9) |
| [CELLOH_ADMIN_MESSAGE_TEMPLATES.md](./CELLOH_ADMIN_MESSAGE_TEMPLATES.md) | Admin alerts |
| [CELLOH_ANALYTICS_KPI_PLAN.md](./CELLOH_ANALYTICS_KPI_PLAN.md) | KPI & events |
| [CELLOH_ERROR_LOGGING_PLAN.md](./CELLOH_ERROR_LOGGING_PLAN.md) | Error categories |
| [CELLOH_AUTH_ROLE_CHECKLIST.md](./CELLOH_AUTH_ROLE_CHECKLIST.md) | Roles & middleware |
| *CELLOH_ADMIN_OPERATIONS_CHECKLIST.md* | **추후 생성 필요** |

**UI:** `/admin/*` — dashboard, products, sellers, orders, settlements, coupons

### 핵심 요약

- Admin routes gated by login; KPI on dashboard is **mock**
- Product/seller review flows documented; checklist panels on list pages
- Error logs, activity logs — UI present, real aggregation pending

### 오픈 전 확인

- [ ] `/admin/login` gate — no 500 on protected routes
- [ ] Product requests + seller review pages load
- [ ] Review guide panels visible on `/admin/products`, `/admin/sellers`

### 아직 보류

- Real KPI aggregation
- `CELLOH_ADMIN_OPERATIONS_CHECKLIST.md` (docs-only, backlog)
- Admin dashboard full manual QA

---

## 10. 고객센터

### Related docs

| Doc | Role |
|-----|------|
| [CELLOH_CUSTOMER_SUPPORT_PLAN.md](./CELLOH_CUSTOMER_SUPPORT_PLAN.md) | Support hub structure |
| [CELLOH_CS_REPLY_TEMPLATES.md](./CELLOH_CS_REPLY_TEMPLATES.md) | **CS reply copy** |
| [CELLOH_INTERNAL_CS_NOTES.md](./CELLOH_INTERNAL_CS_NOTES.md) | Internal ops memos |
| [CELLOH_CUSTOMER_CS_SCENARIOS.md](./CELLOH_CUSTOMER_CS_SCENARIOS.md) | CS scenarios (8) |
| [CELLOH_CUSTOMER_MESSAGE_TEMPLATES.md](./CELLOH_CUSTOMER_MESSAGE_TEMPLATES.md) | Buyer notifications |
| [CELLOH_NOTIFICATION_TEMPLATES.md](./CELLOH_NOTIFICATION_TEMPLATES.md) | Notification index |

**UI:** `/support/*`, `/mypage/support`, `/notifications`

### 핵심 요약

- Support hub: FAQ, contact, tickets, refund/shipping help
- CS reply templates by scenario — **no auto-send** (paste manually)
- Notifications: mock templates in `lib/notifications/message-templates.ts`

### 오픈 전 확인

- [ ] `/support`, `/support/faq`, `/support/contact` — 200, links OK
- [ ] CS templates cover top 8 scenarios
- [ ] Ticket create flow (mock) no crash

### 아직 보류

- Email/Kakao/SMS actual send
- Real ticket DB workflow

---

## 11. 상품 검수

### Related docs

| Doc | Role |
|-----|------|
| [CELLOH_PRODUCT_REVIEW_CHECKLIST.md](./CELLOH_PRODUCT_REVIEW_CHECKLIST.md) | **15-item checklist** |
| [CELLOH_REJECTION_REASON_TEMPLATES.md](./CELLOH_REJECTION_REASON_TEMPLATES.md) | Reject copy (P-01–P-08) |
| [CELLOH_PRODUCT_DATA_POLICY.md](./CELLOH_PRODUCT_DATA_POLICY.md) | Mock/data rules |
| [CELLOH_STATUS_VALUES.md](./CELLOH_STATUS_VALUES.md) | Product lifecycle |

**Code:** `lib/products/review-checklist.ts`, `components/admin-product-review-checklist.tsx`  
**UI:** `/admin/products`, `/admin/product-requests`

### 핵심 요약

- 15 checks: name, images, price, description, category, shipping, prohibited items, etc.
- Verdicts: 승인 / 수정 요청 / 반려 / 보류
- Status: `draft` → `review_requested` → `approved`|`rejected` → `published`

### 오픈 전 확인

- [ ] Admin review guide panel on product list page
- [ ] Rejection templates ready for copy-paste
- [ ] Category rules aligned ([CELLOH_CATEGORY_CURATION_GUIDE.md](./CELLOH_CATEGORY_CURATION_GUIDE.md))

### 아직 보류

- Actual approval DB writes in production
- Auto-send reject notifications

---

## 12. 판매자 검수

### Related docs

| Doc | Role |
|-----|------|
| [CELLOH_SELLER_REVIEW_CHECKLIST.md](./CELLOH_SELLER_REVIEW_CHECKLIST.md) | **13-item checklist** |
| [CELLOH_REJECTION_REASON_TEMPLATES.md](./CELLOH_REJECTION_REASON_TEMPLATES.md) | Reject copy (S-01–S-06) |
| [CELLOH_STATUS_VALUES.md](./CELLOH_STATUS_VALUES.md) | Seller lifecycle |

**Code:** `lib/sellers/review-checklist.ts`, `components/admin-seller-review-form.tsx`  
**UI:** `/admin/sellers`, `/admin/sellers/[id]/review`

### 핵심 요약

- 13 checks: business registration, contact, settlement account (placeholder), category fit, etc.
- Verdicts: 승인 / 보완 요청 / 반려 / 보류
- Status: `applied` → `reviewing` → `approved`|`rejected`|`suspended`

### 오픈 전 확인

- [ ] Admin review guide panel on seller list page
- [ ] Seller review form loads at `/admin/sellers/[id]/review`
- [ ] Rejection templates S-01–S-06 reviewed

### 아직 보류

- Actual seller status change in production DB
- Business document upload verification API

---

## 13. 데이터 모델 계획

### Related docs

| Doc | Role |
|-----|------|
| [CELLOH_DATA_MODEL_PLAN.md](./CELLOH_DATA_MODEL_PLAN.md) | Tables, relations, priorities |
| [CELLOH_STATUS_VALUES.md](./CELLOH_STATUS_VALUES.md) | Status enums |
| [CELLOH_RLS_PERMISSION_PLAN.md](./CELLOH_RLS_PERMISSION_PLAN.md) | RLS direction |
| [CELLOH_EVENT_TRACKING_PLAN.md](./CELLOH_EVENT_TRACKING_PLAN.md) | Analytics events |
| [CELLOH_DATA_RETENTION_PLAN.md](./CELLOH_DATA_RETENTION_PLAN.md) | Retention & deletion |

### 핵심 요약

- **Planning only** — no migrations executed in overnight work
- Core entities: users, sellers, products, orders, payments, coupons, referrals, reviews
- RLS + event tracking documented for post-launch implementation

### 오픈 전 확인

- [ ] Status values in code match docs (where enums exist)
- [ ] No accidental migration run against production

### 아직 보류

- **Supabase production DB migration**
- RLS policies live
- Real analytics pipeline

---

## 14. 보안/env/secret

### Related docs

| Doc | Role |
|-----|------|
| [CELLOH_SECRET_ENV_AUDIT.md](./CELLOH_SECRET_ENV_AUDIT.md) | Env/secrets inventory |
| [CELLOH_DO_NOT_TOUCH_LIGHTLY.md](./CELLOH_DO_NOT_TOUCH_LIGHTLY.md) | Guardrails |
| [CELLOH_RISKY_FILES_GUIDE.md](./CELLOH_RISKY_FILES_GUIDE.md) | High-impact files |
| [CELLOH_AUTH_ROLE_CHECKLIST.md](./CELLOH_AUTH_ROLE_CHECKLIST.md) | Auth & roles |

### 핵심 요약

- Secrets in `.env.local` only — **never commit**
- Admin/seller routes middleware-gated
- Payment keys, Supabase service role → Vercel production env only
- **KIBI access forbidden** in all overnight tasks

### 오픈 전 확인

- [ ] `.env.local` in `.gitignore`
- [ ] No secrets in git history (recent commits)
- [ ] `CELLOH_DO_NOT_TOUCH_LIGHTLY.md` read before touching middleware/migrations

### 아직 보류

- OAuth redirect URL changes for production
- Rate limiting on auth/payment (post-launch)
- GitHub secret scanning resolution

---

## 15. 런칭 체크리스트

### Related docs

| Doc | Role |
|-----|------|
| [CELLOH_LAUNCH_CHECKLIST.md](./CELLOH_LAUNCH_CHECKLIST.md) | **Business/legal go-live** |
| [CELLOH_RELEASE_CHECKLIST.md](./CELLOH_RELEASE_CHECKLIST.md) | Technical release gate |
| [CELLOH_PERFORMANCE_ACCESSIBILITY_CHECKLIST.md](./CELLOH_PERFORMANCE_ACCESSIBILITY_CHECKLIST.md) | Perf/a11y |
| [CELLOH_HOLD_ITEMS_BEFORE_LAUNCH.md](./CELLOH_HOLD_ITEMS_BEFORE_LAUNCH.md) | Explicit hold list |

### 핵심 요약

Launch = legal + PG + infra + SEO + ops + final QA. See launch checklist for full checkbox list.

**Morning check routes (P0):**

```
/  /category/food  /product/1  /join-cart  /collections/ranking
/invite  /membership  /admin/dashboard  /support  /seller/apply
```

**Commands:**

```bash
rm -rf .next && npm run lint && npm run build
npm run dev && npm run smoke:check
```

### 오픈 전 확인

- [ ] All items in [CELLOH_LAUNCH_CHECKLIST.md](./CELLOH_LAUNCH_CHECKLIST.md) reviewed
- [ ] Hold items acknowledged — none executed prematurely
- [ ] [CELLOH_FINAL_LOCAL_STATUS.md](./CELLOH_FINAL_LOCAL_STATUS.md) updated

### 아직 보류

- Entire production deploy path — see §17 and hold items doc

---

## 16. 백업/복구

### Related docs

| Doc | Role |
|-----|------|
| [CELLOH_BACKUP_RESTORE_RUNBOOK.md](./CELLOH_BACKUP_RESTORE_RUNBOOK.md) | Git/patch/tar recovery |
| [CELLOH_MORNING_HANDOFF.md](./CELLOH_MORNING_HANDOFF.md) | Handoff status |

### 핵심 요약

Before risky work:

```bash
git diff > backups/name-$(date +%Y%m%d-%H%M).patch
git status --short > backups/name-status-$(date +%Y%m%d-%H%M).txt
```

Local backups live in `backups/celloh-*.patch`. Full tar excludes `node_modules` and `.next`.

### 오픈 전 확인

- [ ] Latest patch backup exists before major changes
- [ ] Know how to `git apply --check` before restore

### 아직 보류

- Production DB snapshot strategy (post Supabase setup)
- Vercel instant rollback (post first deploy)

---

## 17. 내일/다음 세션 우선순위

### Related docs

| Doc | Role |
|-----|------|
| [CELLOH_PRIORITY_BACKLOG.md](./CELLOH_PRIORITY_BACKLOG.md) | **P0–P3 backlog** |
| [CELLOH_NEXT_SESSION_PROMPT.md](./CELLOH_NEXT_SESSION_PROMPT.md) | Copy-paste chat prompt |
| [CELLOH_FINAL_LOCAL_STATUS.md](./CELLOH_FINAL_LOCAL_STATUS.md) | Current local state |

### 핵심 요약

| Priority | Focus |
|----------|-------|
| **P0** | lint/build PASS, 10 routes 200, no 500 on core flows |
| **P1** | Cart stepper, badge sync, PDP purchase bar, category filter |
| **P2** | Card spacing, sticky header, ranking width, tap targets |
| **P3** | PG, coupons DB, referral payout, settlements, SEO production |
| **Docs-only** | Queue **맨 뒤** — update existing docs, don't mass-create |

### 오픈 전 확인

- [ ] Read overnight report / handoff **before** new code changes
- [ ] Run lint/build **first** in next session
- [ ] Push/deploy/DB still **hold**

### 아직 보류

- All items in [CELLOH_HOLD_ITEMS_BEFORE_LAUNCH.md](./CELLOH_HOLD_ITEMS_BEFORE_LAUNCH.md)

---

## Quick reference

| Need | Go to |
|------|-------|
| All docs | [README_CELLOH.md](./README_CELLOH.md) |
| QA flows | [CELLOH_QA_SCENARIO_INDEX.md](./CELLOH_QA_SCENARIO_INDEX.md) |
| What's blocked | [CELLOH_HOLD_ITEMS_BEFORE_LAUNCH.md](./CELLOH_HOLD_ITEMS_BEFORE_LAUNCH.md) |
| Next chat | [CELLOH_NEXT_SESSION_PROMPT.md](./CELLOH_NEXT_SESSION_PROMPT.md) |
| Local state | [CELLOH_FINAL_LOCAL_STATUS.md](./CELLOH_FINAL_LOCAL_STATUS.md) |

**Push not executed. DB not changed. Deploy not executed.**
