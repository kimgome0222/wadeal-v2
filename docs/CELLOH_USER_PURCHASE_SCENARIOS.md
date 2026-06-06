# CELLOH User Purchase Scenarios

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** QA 시나리오 — mock/문서. **실제 결제·DB 변경 없음**

**Related:** `docs/CELLOH_ORDER_STATE_MACHINE.md`, `scripts/qa-routes.sh`

---

## Legend

| Priority | Meaning |
|----------|---------|
| **P0** | 런칭 전 반드시 통과 |
| **P1** | 상용 직전 권장 |
| **P2** | mock 허용, 추후 개선 |

---

## Scenario 1 — 홈 특가 → 결제

**Flow:** 홈 → 오늘의특가 → 상품상세 → 장바구니 → 쿠폰 확인 → 결제

| Step | Action | Route | Expected |
|------|--------|-------|----------|
| 1 | 홈 진입 | `/` | 오늘의특가 섹션 노출 |
| 2 | 더보기 | `/collections/today-special` | 특가 상품 grid |
| 3 | 상품 카드 | `/product/[slug]` | 상세·가격·담기 |
| 4 | 장바구니 | `/join-cart` | 담긴 상품·수량 |
| 5 | 쿠폰 확인 | `/mypage/coupons` | 보유 쿠폰 (mock) |
| 6 | 결제 | `/checkout/[slug]` | 주문서·결제 UI |

**UI checkpoints**
- 홈: `HOME_SECTION_COPY["today-special"]` subtitle
- 상품: 가격·할인·장바구니 CTA
- 장바구니: empty state 없음(상품 있을 때)
- checkout: PG mock / fail-safe

**Failure debug**
- `components/home-catalog.tsx`
- `lib/home/collection-data.ts`
- `app/product/[id]/page.tsx`
- `app/join-cart/page.tsx`
- `app/checkout/[id]/page.tsx`

**Priority:** **P0**

---

## Scenario 2 — 카테고리 탐색 → 결제

**Flow:** 카테고리 → 하위카테고리 → 필터 → 상품상세 → 구매하기 → 마지막으로 둘러보기 → 결제

| Step | Action | Route | Expected |
|------|--------|-------|----------|
| 1 | 카테고리 | `/category/food` | chip·상품 목록 |
| 2 | 하위 | `/category/food?sub=fruit` | 필터된 목록 |
| 3 | (필터) | same + query | UI 필터 동작 |
| 4 | 상품 상세 | `/product/[slug]` | 구매하기 CTA |
| 5 | 구매 진행 | `/checkout/[slug]` or `/join/[id]` | 주문 flow |
| 6 | 마지막 둘러보기 | `/cart-preview` | 추천 rail |
| 7 | 결제 | `/checkout/[slug]` | 결제 완료/실패 페이지 |

**UI checkpoints**
- `components/category-product-list.tsx` empty fallback
- `components/cart/cart-preview-content.tsx` — "마지막으로 둘러보기"
- `components/growth/checkout-last-minute-rail.tsx` — checkout 내 rail

**Failure debug**
- `app/category/[slug]/page.tsx`
- `components/cart/cart-preview-content.tsx`
- `app/checkout/[id]/page.tsx`

**Priority:** **P0**

---

## Scenario 3 — 셀로쿠폰 Quick Menu

**Flow:** Quick Menu 셀로쿠폰 → 쿠폰 상품 → 장바구니 → 쿠폰 적용

| Step | Action | Route | Expected |
|------|--------|-------|----------|
| 1 | Quick Menu | `/` → tap | 쿠폰 컬렉션 링크 |
| 2 | 셀로쿠폰 | `/collections/celloh-coupon` | 쿠폰 적용가 표시 |
| 3 | 상품 담기 | `/product/[slug]` | showCouponPrice |
| 4 | 장바구니 | `/join-cart` | mock 쿠폰가 |

**UI checkpoints**
- `HomeQuickMenu` → `/collections/celloh-coupon`
- `showCouponPrice` on deal cards
- `/support/coupons` 정책 링크

**Failure debug**
- `components/home/home-quick-menu.tsx`
- `lib/home/collection-data.ts` (celloh-coupon)
- `lib/growth/cart-growth-mock.ts`

**Priority:** **P1** (mock 쿠폰 자동 적용)

---

## Scenario 4 — 친구추천

**Flow:** 지인초대 → 친구 가입 → 첫 구매 → 보상 예정

| Step | Action | Route | Expected |
|------|--------|-------|----------|
| 1 | 초대 링크 | `/invite` | 초대 코드·안내 |
| 2 | 가입 | `/signup` | referral param |
| 3 | 마이 초대 | `/mypage/invite` | 추천 현황 mock |
| 4 | 첫 구매 | purchase flow | 보상 **예정** (mock) |
| 5 | FAQ | `/support/referral` | 정책 |

**UI checkpoints**
- 보상 지급 **실제 없음** — "예정" copy
- `docs/CELLOH_REFERRAL_REWARD_POLICY.md`

**Failure debug**
- `app/invite/page.tsx`
- `app/mypage/invite/page.tsx`
- `lib/notifications/message-templates.ts` (`referral_*`)

**Priority:** **P2** (mock phase)

---

## Scenario 5 — 후기 → 판매자 → 재구매

**Flow:** 상품상세 → 후기 → 판매자 페이지 → 다른 상품 구매

| Step | Action | Route | Expected |
|------|--------|-------|----------|
| 1 | 상품 | `/product/[slug]` | 리뷰 섹션 |
| 2 | 판매자 링크 | `/sellers/[id]` | intro + story |
| 3 | 대표/전체 상품 | same page | deal list |
| 4 | 다른 상품 | `/product/[slug]` | 구매 flow |

**Example routes (smoke)**
- `/sellers/moon-fruit`
- `/sellers/living-lab`
- `/sellers/lumi-beauty`

**UI checkpoints**
- `SellerProfilePageContent` — 판매자 소개·story
- 리뷰 empty state compact

**Failure debug**
- `components/seller-profile-page-content.tsx`
- `lib/sellers/showcase-seller-profiles.ts`

**Priority:** **P1**

---

## Smoke commands

```bash
npm run dev
npm run smoke:check   # includes qa-routes.sh
```

---

## Related

- [CELLOH_QA_SCENARIO_INDEX.md](./CELLOH_QA_SCENARIO_INDEX.md)
- [CELLOH_CUSTOMER_CS_SCENARIOS.md](./CELLOH_CUSTOMER_CS_SCENARIOS.md)
