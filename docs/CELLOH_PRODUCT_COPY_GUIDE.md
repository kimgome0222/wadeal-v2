# CELLOH Product Copy Guide

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** UX·운영 초안 — 법무 검토 전

**Code:** `lib/copy/home-section-copy.ts`, `lib/promotions/promotion-copy.ts`

---

## Tone

- 과장·절대 표현 금지 (`최저가`, `1위`, `100%`, `완치`)
- mock·기준 기간 명시 (할인, 랭킹, 재구매율)
- 판매자 스토리와 상품 설명 연결
- celloh 톤: **~해요**, 신뢰·큐레이션

→ `docs/CELLOH_UX_WRITING_GUIDE.md`

---

## 1. 좋은 상품명 기준

| 기준 | 예시 |
|------|------|
| brand/특성 + 용량 + 유형 | `고당도 제철 감귤 3kg` |
| 검색 키워드 포함 | `도톰한 물티슈 80매 x 10팩` |
| 판매자·원산지 연결 | `제주 산지 감귤 5kg` |

---

## 2. 나쁜 상품명 예시

| 예시 | 문제 |
|------|------|
| `대박특가!!!` | 과장·특수문자 |
| `국내 최저가 1위` | 검증 불가 |
| `완판임박` | 허위 긴급성 |
| `○○ 연예인 픽` | 근거 없는 추천 |

---

## 3. 할인 문구 기준

- **원가·할인율:** 허위 원가 금지
- **표시:** `(mock)` 또는 기준 기간 안내
- **최저가:** `최근 7일 기준 mock · 실제 최저가 보장 아님`
- **쿠폰가:** `mock 쿠폰가 · 실제 적용은 운영 정책`

---

## 4. 원산지·제조사·인증

| 정보 | 식품 | 뷰티 | 생활 |
|------|------|------|------|
| 원산지 | 필수 | 해당 시 | 해당 시 |
| 제조사 | 해당 시 | 필수 | 해당 시 |
| KC/HACCP | 해당 시 | — | 해당 시 |

→ `docs/CELLOH_PRODUCT_REGISTRATION_GUIDE.md`

---

## 5. 판매자 스토리 + 상품 설명

1. 판매자 **선별 기준** (신선도, 성분, 가성비)
2. **대표 상품**과 연결 (`고당도 감귤` ↔ 산지 선별)
3. 과정·포장·배송 한 줄 추가

→ `docs/CELLOH_SELLER_STORY_GUIDE.md`

---

## 6. 과장 표현 금지

- `100%`, `완치`, `의학적 효능`
- `업계 1위`, `국내 최저`
- Before/After 조작
- 허위 재고·마감 긴급성

---

## 7. 최저가 / 1위 / 인기 / 추천

| 표현 | 허용 조건 |
|------|-----------|
| 최저가 | mock + 기준 기간 + 보장 아님 명시 |
| 1위 | 랭킹 정책 페이지 링크 + 카테고리·기간 |
| 인기 | mock 조회·참여 기준 |
| 추천 | `RECOMMENDATION_BASIS_SHORT` 안내 |

→ `/info/ranking-policy`

---

## 8. 리뷰·판매수 표기

- mock 데이터: 실제 거래 아님을 UI에서 구분
- `getDealReviewScoreLabel` — 리뷰 수·별점
- 허위 리뷰·구매 수 조작 금지
- “○○명 구매” — participants mock 기준

---

## 9. 카테고리별 상품명 예시

| 카테고리 | 좋은 예 | 나쁜 예 |
|----------|---------|---------|
| 식품 | `제철 감귤 3kg 산지직송` | `최고 맛집 1위 과일` |
| 생활 | `도톰한 물티슈 10팩` | `역대급 특가!!!` |
| 뷰티 | `진정 마스크팩 10매` | `피부 완치 100%` |
| 패션 | `코튼 라운드 티셔츠` | `명품급 최저가` |
| 반려 | `강아지 수제간식 200g` | `수의사 1위 추천` |

---

## Related

- [CELLOH_CATEGORY_CURATION_GUIDE.md](./CELLOH_CATEGORY_CURATION_GUIDE.md)
- [CELLOH_COLLECTION_COPY_BANK.md](./CELLOH_COLLECTION_COPY_BANK.md)
- [CELLOH_PRODUCT_DATA_POLICY.md](./CELLOH_PRODUCT_DATA_POLICY.md)
