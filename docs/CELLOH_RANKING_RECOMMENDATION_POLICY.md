# CELLOH Ranking & Recommendation Policy

**Date:** 2026-05-29  
**Branch:** `mobile-ui`

## Overview

랭킹·추천 기준은 **운영 초안 mock 설명**입니다. 실제 알고리즘 구현은 상용화 단계에서 별도 진행합니다.

UI: `/info/ranking-policy`  
Source: `lib/product/ranking-policy-content.ts`

## 카테고리 랭킹 기준 (초안)

| 지표 | 설명 |
|------|------|
| 판매량 | 최근 7~30일 판매 실적 |
| 최근 조회수 | 상품 상세·리스트 노출 후 조회 |
| 장바구니 담기 | join-cart 담기 수 (mock) |
| 리뷰 수 | 누적 리뷰 |
| 별점 | 평균 별점 |
| 재구매율 | 동일 상품 재주문 (mock) |
| 할인율 | 현재 할인·혜택 |
| 신상품 가중치 | 등록 14일 이내 가산 |

## 추천상품 기준 (초안)

| 유형 | 설명 |
|------|------|
| 계절/이벤트 | 시즌·날씨·프로모션 테마 |
| 많이 담은 상품 | co-cart 인기 mock |
| 함께 구매 | 동일 주문·카테고리 연관 |
| 최근 본 상품 | 마이페이지 recent views |
| 카테고리 선호 | 구매·찜 카테고리 |

## UI 연결

| 위치 | 링크 |
|------|------|
| 홈 카테고리 랭킹 | `/info/ranking-policy` |
| PDP 관련 추천상품 | `/info/ranking-policy` |
| `/collections/ranking` | HomeRankingSection 동일 |

## Implementation Notes

- `HomeRankingSection` — mock catalog sort only
- `getSimilarDeals` / `getSameSellerDeals` — heuristic, not ML
- Admin MVP readiness tracks ranking data gap

## Push

Not performed.
