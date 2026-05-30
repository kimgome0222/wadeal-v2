# CELLOH Safe Shopping Guide

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** 운영 초안 — 법률 확정 전

**UI:** `/support/safe-shopping`  
**Code:** `lib/support/safe-shopping-content.ts`

---

## Summary

celloh에서 **안심하고 구매**하기 위한 고객 안내입니다.  
100% 안전·법적 보증 표현은 사용하지 않습니다.

---

## 주문 전 확인할 것

- 판매자 소개·스토리·대표 상품 (`/sellers/[id]`)
- 상품명, 가격, 원산지·인증 (`/product/[id]`)
- 배송·교환·환불 (`/policies/refund`, `/policies/shipping`)
- 리뷰·문의

---

## 판매자 정보 확인

- 입점 시 기본 정보 확인 (mock)
- 상품 등록 전 검수 (mock)
- 의심 시 `/reports` 신고

---

## 배송·환불 정책

- `/policies/shipping`
- `/policies/refund`
- `/support/shipping`, `/support/refund`

---

## 결제는 celloh 결제창에서만

- 외부 계좌·메신저 결제 유도 **거절**
- 정상 flow: `/join-cart` → `/checkout/[id]`
- 실패: `/payment/fail` → `/support/payment`

---

## 외부 송금 유도 주의

- 미등록 계좌 송금 금지
- 개인정보 과다 요구 거절
- `/support/contact` 문의

---

## 의심 상품 신고

- `/reports` — 허위정보, 금지품, 리뷰 조작 등
- Admin `/admin/review-reports` (future workflow)

---

## 고객센터

- `/support` — FAQ, 1:1 문의
- `/support/contact`
- `/mypage/support`

---

## Related policies

| Doc | Route |
|-----|-------|
| 전자상거래 | `/policies/commerce` |
| 결제 | `/policies/payment` |
| 판매자 | `/policies/seller` |

---

## Related

- [CELLOH_SELLER_TRUST_MODEL.md](./CELLOH_SELLER_TRUST_MODEL.md)
- [CELLOH_SELLER_ENFORCEMENT_POLICY.md](./CELLOH_SELLER_ENFORCEMENT_POLICY.md)
- [CELLOH_CUSTOMER_CS_SCENARIOS.md](./CELLOH_CUSTOMER_CS_SCENARIOS.md)
