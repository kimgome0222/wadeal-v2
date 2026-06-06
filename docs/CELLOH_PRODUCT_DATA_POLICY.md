# CELLOH Product Data Policy

**Date:** 2026-05-29  
**Branch:** `mobile-ui`

## 상품 상세 정보 구조

| 영역 | 컴포넌트 | 상태 |
|------|----------|------|
| 상품명·가격·할인 | `ProductSummaryPanel` | ✅ fallback 가격 |
| 별점·리뷰수·판매수 | `ProductSummaryPanel` | ✅ mock fallback |
| 배송·무료배송 | `ProductDetailShippingSummary` | ✅ |
| 수량별 혜택가 | `ProductDetailPurchaseBar` | ✅ 기존 |
| 판매자 정보 | `ProductDetailSellerCard` | ✅ celloh 추천 셀러 fallback |
| 상품 설명 | `ProductDetailVisualSection` | ✅ |
| 상세정보(고시) | `ProductDetailInfoTable` | ✅ placeholder |
| 후기 | `ProductReviewsSection` | ✅ 정책 안내 |
| 문의 | `ProductInquiryTabContent` | ✅ mock |
| 관련/판매자 상품 | `SimilarProductsSection` | ✅ 추천 기준 링크 |

## 상품고시 placeholder

- `lib/product/product-disclosure.ts` — 카테고리별 hint
- 카테고리: 식품, 생활, 뷰티, 패션, 디지털, 반려, 유아
- 안내: `ProductDisclosureNotice` — “판매자 입력 기준, 법정 확정본 아님”

## 리뷰 정책

- UI: `ProductReviewPolicyNotice` (PDP 후기 탭)
- 정책: `/policies/review`
- 문서: `docs/CELLOH_REVIEW_POLICY.md`
- 마이페이지: 작성 가능 / 작성 완료 / 기간 만료(mock) 탭

## 상품 문의

- 유형: 상품, 배송, 교환/반품, 재입고, 기타
- mock 샘플: `lib/product/mock-product-inquiries.ts`
- 공개/비공개 placeholder UI
- 응답 기준: `INQUIRY_POLICY_NOTES`

## Display Fallbacks

`lib/product/display-fallbacks.ts`

| Field | Fallback |
|-------|----------|
| price | 0 → "가격 문의" |
| originalPrice | null → 숨김 |
| discountRate | null → 숨김 |
| reviewCount | participants/seed |
| soldCount | soldQuantity/participants/seed |
| image | `/wadeal-wordmark.svg` |
| seller | celloh 추천 셀러 |
| category | 기타 |

## Constraints

- No DB/schema changes
- Not legal final product disclosure
- No review DB changes
- No ranking algorithm implementation

## Push

Not performed.
