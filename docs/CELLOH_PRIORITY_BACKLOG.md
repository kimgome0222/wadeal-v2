# CELLOH Priority Backlog

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Latest commit:** `9c981e5` — `docs: add celloh business operations plans`  
**Overnight status:** 14-task queue complete · lint/build PASS · push/deploy/DB **not done**

This backlog is what remains **after** overnight mock/docs/UI work. Use with `CELLOH_MORNING_HANDOFF.md` and `CELLOH_QA_AUTOMATION_GUIDE.md`.

---

## P0 — 당장 막히는 오류

| Item | Overnight status | Morning action |
|------|------------------|----------------|
| build/lint 실패 | ✅ PASS at closeout | Re-run `npm run qa:preflight` |
| 주요 페이지 500/404 | ✅ smoke routes 200 | `npm run smoke:check` with dev server |
| 홈 진입 불가 | ✅ build OK | Manual `/` load |
| 상품 클릭 불가 | ⏳ verify | `/product/1` → no crash |
| 장바구니 담기 불가 | ⏳ verify | +/stepper → cart sheet or login |
| 결제 진입 불가 | ⏳ verify | `/join-cart` → checkout link (mock PG OK) |
| 관리자/판매자 접근 crash | ⏳ verify | Login gate, not 500 |

**P0 rule:** If lint/build fails or any of the 10 morning routes 500 → fix before anything else.

---

## P1 — 구매 전환에 치명적인 UX

| Item | Notes | Route / component |
|------|-------|-------------------|
| + 버튼 stepper | Rail + grid; must not submit form | `ProductCard`, cart sheet |
| 장바구니 badge | Header/tab count sync guest + logged-in | `header-cart-button`, bottom nav |
| 상품상세 구매하기 | Purchase bar above bottom nav, safe-area | `/product/[id]` |
| 카테고리 필터 | Sub-filter dropdown no clip at 430px | `/category/food` |
| Quick Menu route | 17 items, 2-row scroll, no dead links | Home Quick Menu |
| 쿠폰 안내 위치 | Tier notice vs checkout bar overlap | `/join-cart` `JoinCartCouponNotice` |
| 상품정보 누락 | Price, seller, image fallback | PDP, `ProductCardImage` |
| 판매자 링크 | Seller card → `/sellers/[id]` | PDP, PLP |

**P1 sources:** `CELLOH_RESPONSIVE_QA_REPORT.md`, `CELLOH_MORNING_HANDOFF.md` manual checklist.

---

## P2 — 디자인 완성도

| Item | Notes |
|------|-------|
| 상품카드 간격 | 2-col grid, rail 2.5-up peek |
| 헤더 sticky | Search + category bar on scroll |
| 랭킹 카드 크기 | `ranking-column` width at 375/390/430px |
| 판매자 카드 비율 | Seller rail 4-up, showcase cards |
| 장바구니 버튼 크기 | Checkout bar min 44px tap target |
| 상세페이지 탭 간격 | Section nav sticky, tab padding |

**P2 rule:** Fix after P0/P1 clear; CSS/layout only — no DB.

---

## P3 — 운영/성장

| Item | Doc / route |
|------|-------------|
| 정책 페이지 확정 | `CELLOH_LAUNCH_CHECKLIST.md` — legal review |
| PG 심사 | Toss live keys, webhook, refund API |
| 쿠폰 DB | Real issuance — currently mock (`/admin/coupons`) |
| 친구추천 DB | Referrals table — currently mock (`/invite`) |
| 리뷰 정책 | `CELLOH_REVIEW_QNA_REPORT_POLICY.md` — enforcement |
| 판매자 정산 | Live settlement — `/admin/settlements` |
| 관리자 리포트 | Real KPI aggregation — `CELLOH_ANALYTICS_KPI_PLAN.md` |
| SEO | Production `metadataBase`, sitemap submit |
| 성능 | `CELLOH_PERFORMANCE_ACCESSIBILITY_CHECKLIST.md` |
| 멤버십 구독 | PG + legal — `/membership` mock only |
| OAuth production | Kakao/Google redirect URLs |
| `CELLOH_ADMIN_OPERATIONS_CHECKLIST.md` | 추후 생성 |

---

## 내일 아침 첫 확인 순서

1. `git status` — expect clean on `mobile-ui`
2. `npm run qa:preflight` — lint + build
3. `/` — Quick Menu, rails
4. `/category/food` — grid, filter
5. `/product/1` — purchase bar, stepper
6. `/join-cart` — coupon notice, checkout bar
7. `/collections/ranking` — ranking columns
8. `/invite` — referral mock, copy buttons
9. `/membership` — benefit cards (준비 중)
10. `/admin/dashboard` — login gate or KPI cards

**Automation (dev server required):**

```bash
npm run dev
npm run smoke:check
```

---

## 보류할 것

| Item | Reason |
|------|--------|
| GitHub push | Until morning eye QA + PR review |
| Vercel 배포 | Launch checklist not signed off |
| Supabase DB 변경 | Overnight constraint; migrations need review |
| 실제 결제 연결 | PG 심사 + live keys |
| OAuth 설정 변경 | Production domain not locked |
| KIBI 접근 | Out of scope |
| 새 npm 패키지 (Playwright 등) | Post-launch E2E |

---

## Related docs

| Doc | Use |
|-----|-----|
| `CELLOH_MORNING_HANDOFF.md` | Full overnight summary |
| `CELLOH_NEXT_SESSION_PROMPT.md` | Paste into next chat |
| `CELLOH_QA_AUTOMATION_GUIDE.md` | Commands & failure priority |
| `CELLOH_RELEASE_CHECKLIST.md` | Pre-push gate |
| `README_CELLOH.md` | Doc hub |
