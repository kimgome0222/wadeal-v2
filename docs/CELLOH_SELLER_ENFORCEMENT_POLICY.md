# CELLOH Seller Enforcement Policy

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** ⚠️ **정책 초안 · 법무 검토 필요** — 실제 제재 실행 미구현

---

## Violation types

| 유형 | 예시 |
|------|------|
| 허위 상품정보 | 원가·원산지·인증 허위 |
| 배송 지연 반복 | SLA 초과 반복 |
| CS 미응답 | 48h SLA 반복 위반 |
| 리뷰 조작 | 허위·대가 리뷰 |
| 외부거래 유도 | celloh 외 결제·연락 유도 |
| 금지상품 판매 | 의약품, 위조품 등 |
| 개인정보 요구 | 불필요 주민번호·계좌 |
| 환불 거부 | 정당 환불 거절 |
| 가격 오류 반복 | 반복적 허위 할인 |

---

## Enforcement stages (draft)

| 단계 | 조치 | UI (mock) |
|------|------|-----------|
| 경고 | 공지·이메일 (future) | `/seller/notices` |
| 노출 제한 | 검색·추천 제외 | future |
| 상품 판매중지 | SKU hide | admin action |
| 정산 보류 | payout hold | `/admin/settlements` |
| 이용 제한 | suspend | `/seller/suspended` |

**No automated enforcement** in current codebase.

---

## Admin routes

- `/admin/review-reports` — 신고
- `/admin/refunds` — 환불 분쟁
- `/admin/orders` — 배송 SLA
- `/admin/support` — CS escalations
- `/admin/settlements` — 정산 보류

---

## Seller routes

- `/seller/policies` — policy links
- `/seller/suspended` — restricted state
- `/seller/notices` — policy updates

---

## Customer reporting

- `/reports` — mock submit
- `/support/safe-shopping` — prevention guide

---

## Notifications (templates only)

- Seller: `policy_update`, `inquiry_sla_warning`
- Admin: `report_received`, `shipping_delay`, `settlement_hold`

→ `docs/CELLOH_SELLER_MESSAGE_TEMPLATES.md`

---

## Related

- [CELLOH_SELLER_TRUST_MODEL.md](./CELLOH_SELLER_TRUST_MODEL.md)
- `/policies/seller`
