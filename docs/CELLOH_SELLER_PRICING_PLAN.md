# CELLOH Seller Pricing Plan (Draft)

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** ⚠️ **초안** — 구독 결제·계약 미구현. UI mock only.

**UI:** `/seller/policies` — plan cards

---

## Plan comparison

| Feature | Starter | Growth | Premium |
|---------|---------|--------|---------|
| 입점비 | 무료 | 무료 (초안) | 협의 (초안) |
| 상품 등록 | 기본 | 기본 + 기획전 신청 | 무제한 + 우선 검수 |
| 판매자 프로필 | 기본 | 강조 배지 후보 | 스토리·커버 강조 |
| 정산 | 기본 주기 | 기본 | 전용 리포트 (mock) |
| 기획전 | — | 신청 가능 | 우선 배치 후보 |
| 추천 노출 | 알고리즘 기본 | 후보 풀 | 메인/Only Celloh 후보 |
| 쿠폰 캠페인 | — | 공동 부담 참여 | 전용 쿠폰 슬롯 |
| 메인 배너 | — | — | 후보 |
| 라이브커머스 | — | — | 후보 |
| 수수료 | 일반 tier | 일반/우수 | 협의 |

---

## 1. Starter (default)

- 입점 무료  
- 기본 상품 등록·검수  
- 기본 판매자 프로필 (`/sellers/[id]`)  
- 기본 정산 (`/seller/finance/settlements`)  
- **Target:** 신규 입점, 소규모 셀러

---

## 2. Growth

- 기획전 신청 (`/admin/events`, collections)  
- 프로필 강조 (showcase 후보)  
- 추천·랭킹 노출 후보  
- 플랫폼 쿠폰 캠페인 공동 참여  
- **Target:** 월 GMV 성장 셀러

---

## 3. Premium

- 메인 배너 / Hero 후보  
- Only Celloh 단독 구성  
- 라이브커머스 슬롯 후보  
- 판매자 스토리 섹션 강조  
- 운영 리포트 (판매·리뷰·응답률 — future)  
- **Target:** 브랜드·단독 파트너

---

## Upgrade path (draft)

1. Seller applies via `/seller/apply` → Starter  
2. Ops review → Growth invitation (metrics-based)  
3. Brand deal → Premium contract  

**No self-serve payment** in current codebase.

---

## Related

- `docs/CELLOH_REVENUE_MODEL.md`
- `docs/CELLOH_SELLER_ONBOARDING_PLAN.md`
- `/policies/seller`
