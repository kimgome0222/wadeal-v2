# CELLOH Seller Trust Model

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** mock/UI 초안 — **실제 검증 API·법적 보증 아님**

**Code:** `lib/copy/seller-trust-copy.ts`, `lib/sellers/types.ts`, `lib/sellers/trust-display.ts`

---

## 판매자 프로필 필수 정보

| 필드 | 고객 노출 | Mock today |
|------|-----------|------------|
| 판매자명 | ✅ | `SellerProfile.name` |
| 소개글 | ✅ | `tagline` + showcase `story` |
| 대표 이미지/로고 | ✅ | cover + avatar |
| 사업자 검증 여부 | badge/hint | `isVerified` (mock) |
| 누적 판매수 | ✅ | `totalSales` |
| 평균 별점 | ✅ | `rating` |
| 리뷰수 | ✅ | `reviewCount` |
| 재구매율 | ✅ | `repurchaseRate` (mock) |
| 문의 응답률 | ✅ | `inquiryResponseRate` (mock) |
| 배송 준수율 | doc only | future `seller_stats` |

---

## 검증 배지 기준 (mock)

| Badge ID | 고객 라벨 | Mock 기준 |
|----------|-----------|-----------|
| `verified` | 입점 정보 확인 | 입점 승인 + `isVerified` |
| (hint) | 상품 검수 | 모든 상품 검수 요청 flow |
| `fast_response` | 응답률 높음 | `inquiryResponseRate >= 85` |
| `high_repurchase` | 재구매 많음 | `repurchaseRate >= 35` |
| `popular` | 우수 판매자 | sales/rating threshold |
| `best_seller` | 리뷰 우수 | rating/reviews |
| `new_seller` | 신규 입점 | recent join |

**Future (미구현):** 정산 계좌 확인 API, 사업자 진위 API

---

## 고객에게 보여줄 신뢰 문구 (허용)

- 입점 시 사업자·기본 정보를 확인했어요. **(mock)**
- 상품 등록 전 기본 정보를 검수해요. **(mock)**
- 문의 응답률이 높은 편이에요. **(mock)**
- 재구매 고객이 많은 편이에요. **(mock)**

**금지:** "100% 안전", "법적 보증", "완전 검증 완료", "에스크로 보장"

---

## 검증 보류 / 반려 기준

- 사업자등록증 불일치
- 통신판매업 미신고 (해당 시)
- 금지 카테고리
- 허위 서류
- 반복 정책 위반

→ `/seller/rejected`, `/seller/pending`

---

## 허위 정보 신고

1. 고객 `/reports` 접수 (mock)
2. Admin `/admin/review-reports` 검토
3. Seller 경고 → 노출 제한 → 이용 제한

→ `docs/CELLOH_SELLER_ENFORCEMENT_POLICY.md`

---

## UI

- `/sellers/[id]` — badges, trust panel, stats
- `SellerProfileTrustPanel`, `SellerProfileBadges`

---

## Related

- [CELLOH_SELLER_ENFORCEMENT_POLICY.md](./CELLOH_SELLER_ENFORCEMENT_POLICY.md)
- [CELLOH_SAFE_SHOPPING_GUIDE.md](./CELLOH_SAFE_SHOPPING_GUIDE.md)
- [CELLOH_BUSINESS_INFO_DISPLAY_PLAN.md](./CELLOH_BUSINESS_INFO_DISPLAY_PLAN.md)
