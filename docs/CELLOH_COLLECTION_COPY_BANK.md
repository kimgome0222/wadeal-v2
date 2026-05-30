# CELLOH Collection Copy Bank

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** 기획전 문구 mock — 법무 검토 전

**Code:** `lib/promotions/promotion-copy.ts` → `COLLECTION_COPY_BANK`  
**Home:** `lib/copy/home-section-copy.ts` → `HOME_SECTION_COPY`

---

## Usage

- 홈 subtitle: `HOME_SECTION_COPY[slug].subtitle`
- 컬렉션 description: `shortDescription`
- A/B variant: `getCollectionCopyVariant(slug, index)`

**주의:** `최저가`는 기준 기간 + mock + 보장 아님 명시 필수

---

## 오늘의특가

1. 오늘만 더 좋은 가격으로 만나는 상품
2. 하루 특가, 오늘 확인해 보세요
3. 오늘의 큐레이션 특가를 모았어요
4. 지금 담기 좋은 오늘의 상품
5. 오늘 하루만 이 가격 (mock · 운영 일정)

---

## 마감세일

1. 오늘 끝나는 혜택을 놓치지 마세요
2. 남은 시간 동안 더 좋은 가격으로 만나요
3. 마감 전 마지막으로 확인해 보세요
4. 오늘 밤 11:59까지 (mock · 운영 설정)
5. 마감세일 상품을 한곳에 모았어요

---

## 주말특가

1. 이번 주말만 만나는 특별 가격
2. 주말에 담기 좋은 상품을 모았어요
3. 토·일 한정 혜택 (mock)
4. 주말 장보기 전에 확인해 보세요
5. 이번 주말 큐레이션 특가

---

## 쿠폰세일

1. 쿠폰 적용가로 더 부담 없이 담아보세요
2. 쿠폰 쓰면 더 좋아지는 상품
3. 적용 가능 쿠폰 상품 모음 (mock)
4. 쿠폰 혜택 받을 수 있는 상품이에요
5. 쿠폰 적용가 참고용 표시

---

## 셀로단독특가

1. celloh에서만 만나는 구성과 혜택
2. Only Celloh 단독 구성 상품
3. 플랫폼만의 큐레이션 특가 (mock)
4. 셀로에서만 만나는 상품
5. 단독 구성·혜택 안내 (mock)

---

## 재구매율 높은 상품

1. 다시 찾는 고객이 많은 상품이에요
2. 재구매 mock 기준 · 참고용
3. 한 번 쓰고 또 찾는 상품
4. 단골 고객이 많은 상품 모음
5. 재구매율 높은 상품 (mock 큐레이션)

---

## 신규상품

1. 새로 올라온 상품을 먼저 만나보세요
2. 신규 등록 상품 모음
3. 방금 입점한 상품을 확인해 보세요
4. 새로운 큐레이션 상품
5. 신규상품 · 최근 등록 순

---

## AI기반 계절상품

1. 이번 달에 어울리는 상품 mock 큐레이션
2. 계절에 맞는 상품을 추천해요 (mock AI)
3. 월별 테마 상품 모음
4. 지금 시기에 담기 좋은 상품
5. 계절 추천 · 실제 AI API 미연동

---

## 인기 판매자

1. 고객이 자주 찾는 판매자를 소개해요
2. 인기 판매자 mock 기준
3. 믿고 보는 판매자를 만나보세요
4. 판매 실적·리뷰 참고 (mock)
5. 인기 판매자의 대표 상품

---

## 신규 입점 판매자

1. 새롭게 입점한 판매자를 만나보세요
2. 신규 입점 셀러 소개
3. 새로운 브랜드 스토리를 확인해 보세요
4. 입점 판매자 기획전 (mock)
5. 신규 셀러의 대표 상품

---

## Collection routes

| Slug | Route |
|------|-------|
| today-special | `/collections/today-special` |
| recommended | `/collections/recommended` |
| ending-sale | `/collections/ending-sale` |
| coupon-sale | `/collections/coupon-sale` |
| only-celloh | `/collections/only-celloh` |
| repurchase | `/collections/repurchase` |
| seasonal | `/collections/seasonal` |
| popular-sellers | `/collections/popular-sellers` |
| new-sellers | `/collections/new-sellers` |

---

## Related

- [CELLOH_PRODUCT_COPY_GUIDE.md](./CELLOH_PRODUCT_COPY_GUIDE.md)
- [CELLOH_PROMOTION_DISPLAY_RULES.md](./CELLOH_PROMOTION_DISPLAY_RULES.md)
