# CELLOH UX Writing Guide

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Code:** `lib/copy/ux-writing.ts`, `lib/copy/empty-states.ts`, `lib/copy/display-copy.ts`

---

## Brand tone

| Principle | Guidance |
|-----------|----------|
| Voice | 쉽고 안전한 커머스 |
| Discovery | 좋은 판매자를 발견하는 느낌 |
| Reference | 쿠팡(편함) · 마켓컬리(신뢰) · B마트(계속 담기) |
| Style | 너무 딱딱하지 않게, `-요`체 |
| Avoid | 과장 광고, 확정적 최저가, 법무 미검수 과장 |

**Core lines:**

- 메인: **누가 만들었는지 알고 사세요.**
- 서브: **좋은 상품은 좋은 판매자에게서 시작됩니다.**
- 신뢰: **판매자 정보와 상품 혜택을 한눈에 확인하세요.**
- 쿠폰: **조금만 더 담으면 더 큰 혜택을 받을 수 있어요.**

---

## Button labels (`CELLOH_BUTTONS`)

| Action | Standard copy |
|--------|---------------|
| 장바구니 | 장바구니 |
| 구매하기 | 구매하기 |
| 결제하기 | 결제하기 |
| 담기 | 담기 |
| 장바구니 보기 | 장바구니 보기 (not "바로가기") |
| 판매자 보기 | 판매자 보기 |
| 초대 링크 복사 | 초대 링크 복사 |
| 1:1 문의 | 1:1 문의하기 |
| 리뷰 | 리뷰 작성하기 |
| 재시도 | 다시 시도하기 |
| 홈 | 홈으로 돌아가기 |

**Rules:** Same function → same label. Prefer short labels on mobile (avoid 2-line buttons).

---

## Empty states (`CELLOH_EMPTY`)

| Surface | Title | Description |
|---------|-------|-------------|
| 장바구니 | 장바구니가 비어 있어요 | 필요한 상품을 담아보세요. |
| 검색 | 찾는 상품이 아직 없어요 | 다른 검색어로 다시 찾아보세요. |
| 리뷰 | 아직 리뷰가 없어요 | 첫 번째 리뷰를 기다리고 있어요. |
| 문의 | 아직 등록된 문의가 없어요 | 상품이 궁금하다면 문의를 남겨보세요. |
| 쿠폰 | 사용할 수 있는 쿠폰이 없어요 | 새로운 혜택이 생기면 알려드릴게요. |

Empty cart must **not** show coupon progress alone — `JoinCartCouponNotice` returns null when subtotal ≤ 0.

---

## Cart / coupon copy (`CELLOH_CART_COPY`)

| Situation | Copy |
|-----------|------|
| Applied | `{amount} 쿠폰이 자동 적용됐어요` |
| Next tier | `조금만 더 담으면 {amount} 쿠폰을 쓸 수 있어요` |
| Generic hint | `조금만 더 담으면 더 큰 혜택을 받을 수 있어요` |
| Remaining | `{discount} 쿠폰까지 {remaining}원 남았어요` |
| Free shipping | `무료배송이 적용됐어요` / `무료배송까지 {remaining}원 남았어요` |
| Upsell rail | `함께 구매하면 좋아요` |

---

## Product detail (`CELLOH_PRODUCT_DETAIL`)

| Element | Copy |
|---------|------|
| Quantity tiers | `2개 이상 3%↓`, `5개 이상 7%↓`, `10개 이상 12%↓` |
| Same seller rail | 판매자의 다른 상품 |
| Related rail | 관련 추천상품 · 함께 보면 좋은 상품이에요 |
| Review gate | 구매한 고객만 리뷰를 작성할 수 있어요. |
| Inquiry prompt | 상품에 대해 궁금한 점을 남겨보세요. |

---

## Error copy (`CELLOH_ERRORS`)

| Case | Title | Description |
|------|-------|-------------|
| Generic | 문제가 발생했어요 | 잠시 후 다시 시도해 주세요. |
| Payment | 결제에 실패했어요 | 결제수단을 확인하고 다시 시도해 주세요. |
| Login | 로그인이 필요해요 | 계속하려면 먼저 로그인해 주세요. |
| Product 404 | 상품을 찾을 수 없어요 | 다른 상품을 둘러보세요. |
| Permission | 접근 권한이 없어요 | 필요한 권한이 있는 계정으로 다시 로그인해 주세요. |

**UI:** `RouteErrorFallback`, `app/global-error.tsx`, `app/payment/fail/page.tsx`

---

## Forbidden phrases (`CELLOH_FORBIDDEN_PHRASES`)

- 전국 최저가, 무조건 최저, 100% 환불 보장, 반드시 최저, 업계 1위  
- See also `CELLOH_PROMOTION_DISPLAY_RULES.md`

---

## Review checklist (pre-launch)

- [ ] Button labels consistent across home, PDP, cart, mypage  
- [ ] Empty states use `CELLOH_EMPTY` — no orphan hardcoded strings  
- [ ] Cart coupon hidden when empty  
- [ ] Error pages link to 홈 / 고객센터 / 다시 시도하기  
- [ ] Promotion copy includes mock/disclaimer where required  
- [ ] Legal review for policies and payment/refund pages  

---

## Related

- `CELLOH_PROMOTION_DISPLAY_RULES.md` — anti-exaggeration  
- `CELLOH_DESIGN_SYSTEM_V1.md` — typography  
- `README_CELLOH.md` — doc hub
