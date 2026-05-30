# CELLOH Category Curation Guide

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** mock 큐레이션 기준 초안

**Code:** `lib/home/mock-home-commerce-data.ts`, `lib/recommendations/*`

---

## Overview

카테고리별 홈·컬렉션·랭킹 노출 시 우선 고려하는 **mock 큐레이션 기준**입니다.  
실제 AI/개인화 API 미연동 — 운영팀 수동 검수 참고용.

---

## 식품

| 기준 | 설명 | mock 신호 |
|------|------|-----------|
| 신선도 | 산지·유통기한·포장 | `participants`, 배송 SLA |
| 가격 | 제철·용량 대비 합리성 | 할인율, tier |
| 후기 | 맛·신선·포장 리뷰 | review score |
| 재구매 | 반복 구매 mock | `repurchaseDeals` |
| 배송 안정성 | 송장·지연율 | seller badge |

**금지:** 유통기한 미표기, 허위 원산지

---

## 생활

| 기준 | 설명 |
|------|------|
| 반복 구매 | consumables, refill |
| 가성비 | 용량/가격, 대용량 |
| 사용 편의 | 실사용 리뷰, 내구성 |

**예시 셀러:** 살림연구소, 데일리홈

---

## 뷰티

| 기준 | 설명 |
|------|------|
| 성분 | 전성분 표기, 자극 |
| 피부 타입 | 건성·민감·데일리 |
| 후기 | 사용감, 지속력 |

**예시 셀러:** 루미뷰티

---

## 패션

| 기준 | 설명 |
|------|------|
| 시즌성 | SS/FW, 레이어 |
| 스타일 | 코디·색상 일관 |
| 사이즈 안내 | 실측·핏 리뷰 |

---

## 디지털

| 기준 | 설명 |
|------|------|
| 호환성 | 기기·OS |
| 인증 | KC, 정품 |
| 리뷰 | 내구·AS |

---

## 반려동물

| 기준 | 설명 |
|------|------|
| 안전성 | 원료, 급여 대상 |
| 성분 | 알레르기, 첨가물 |
| 반려동물 종류 | 강아지·고양이 구분 |

**예시 셀러:** 펫밀리

---

## 홈 섹션 매핑

| 섹션 | 주요 카테고리 |
|------|---------------|
| 카테고리 랭킹 | 전 카테고리 탭 |
| AI기반 계절상품 | 월별 테마 (mock) |
| 재구매율 높은 상품 | 식품·생활·반려 |
| 신규상품 | 전 카테고리 |

→ `lib/copy/home-section-copy.ts`

---

## Related

- [CELLOH_PRODUCT_COPY_GUIDE.md](./CELLOH_PRODUCT_COPY_GUIDE.md)
- [CELLOH_RANKING_RECOMMENDATION_POLICY.md](./CELLOH_RANKING_RECOMMENDATION_POLICY.md)
- [CELLOH_RECOMMENDATION_FOUNDATION.md](./CELLOH_RECOMMENDATION_FOUNDATION.md)
