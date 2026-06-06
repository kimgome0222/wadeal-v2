# CELLOH CS Reply Templates

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** Operator draft — **no email/SMS/Kakao send, no DB**

**Related:** [CELLOH_CUSTOMER_CS_SCENARIOS.md](./CELLOH_CUSTOMER_CS_SCENARIOS.md), [CELLOH_CUSTOMER_MESSAGE_TEMPLATES.md](./CELLOH_CUSTOMER_MESSAGE_TEMPLATES.md), [CELLOH_UX_WRITING_GUIDE.md](./CELLOH_UX_WRITING_GUIDE.md)

---

## How to use

1. 고객 문의 유형 선택  
2. `{placeholder}` 값 채우기  
3. **내부 확인 항목** 체크 후 발송  
4. 확정 불가 시 “확인 후 재안내” 문구 유지

**Channels (future):** in-app ticket reply, email, Kakao — 본 문서는 **문구 원본**만.

---

## 고객 답변 톤 기준

| Principle | Guide |
|-----------|--------|
| 불편 인정 | 먼저 사과·공감 — “불편을 드려 죄송합니다” |
| 사실만 | 확인된 주문/결제/배송 상태만 안내 |
| 보상 약속 금지 | 미확정 쿠폰·환불·포인트 확정 표현 금지 |
| 개인정보 최소 | 필요 시 주문번호·마스킹 ID만 — 카드/비밀번호 요구 금지 |
| 결제/환불 | PG·주문 상태 확인 후 안내 |
| 책임 구분 | 판매자(배송·상품)·플랫폼(결제·정책) 명확히 |
| 다음 행동 | 고객이 할 일 1–2개 bullet로 |

**예시 톤:**  
“불편을 드려 죄송합니다. 주문 상태를 확인한 뒤 가능한 처리 방법을 안내드릴게요.”

### 금지 표현

- “무조건 환불됩니다” / “바로 처리됩니다” / “100% 보상”  
- “고객님 확인을 안 하셔서” / “당사 귀책이 아닙니다” (단정)  
- PG 오류 코드·카드 정보 요청

---

## Template structure (all categories)

Each template below includes:

- **상황** — when to use  
- **고객 답변** — copy-paste ready  
- **내부 확인** — ops checklist  
- **필요 정보** — data to collect  
- **담당자 메모** — free text  
- **주의** — legal/UX

---

## 1. 주문 확인

| Field | Content |
|-------|---------|
| **상황** | 주문 내역·상태·금액 문의 |
| **고객 답변** | 안녕하세요, celloh 고객센터입니다. 문의 주신 주문 `{orderId}`를 확인했습니다. · 상품: `{productName}` · 결제금액: `{amount}`원 · 현재 상태: `{orderStatusLabel}`. 자세한 내역은 마이페이지 > 주문·배송내역에서도 확인하실 수 있어요. 추가로 궁금한 점이 있으면 알려주세요. |
| **내부 확인** | 주문 존재, 본인 일치, 상태 enum 정확 |
| **필요 정보** | 주문번호, 가입 이메일, 문의 일시 |
| **담당자 메모** | |
| **주의** | 타인 주문 정보 노출 금지 |

---

## 2. 결제 실패

| Field | Content |
|-------|---------|
| **상황** | 결제 미완료·실패 재시도 문의 |
| **고객 답변** | 불편을 드려 죄송합니다. `{productName}` 주문( `{orderId}` ) 결제가 완료되지 않은 것으로 확인됩니다. 카드 한도·인증·네트워크를 확인하신 뒤, 주문서에서 다시 결제를 시도해 주세요. 동일 문제가 반복되면 다른 결제수단 이용 또는 1:1 문의로 알려주시면 확인 후 안내드릴게요. celloh는 카드번호·CVC를 저장하지 않으며, 승인은 PG사를 통해 처리됩니다. |
| **내부 확인** | payment_status=failed/pending, webhook log |
| **필요 정보** | 주문번호, 시도 시각, 결제수단 종류(카드사명만) |
| **주의** | PG raw error 고객 노출 금지 — [CELLOH_PG_REVIEW_PREP.md](./CELLOH_PG_REVIEW_PREP.md) |

---

## 3. 배송 지연

| Field | Content |
|-------|---------|
| **상황** | 예상보다 배송이 늦음 |
| **고객 답변** | 기다려 주셔서 감사합니다. `{orderId}` 배송은 현재 `{shippingStatusLabel}` 상태입니다. 택배사 `{courierName}` / 송장 `{trackingNo}` 기준으로 배송 조회 중이며, **판매자·택배사 확인 후 예상 일정을 다시 안내**드리겠습니다. 영업일 기준 1–2일 내 업데이트 드릴게요. |
| **내부 확인** | seller SLA, tracking API, 출고일 |
| **필요 정보** | 주문번호, 최초 안내 도착일 |
| **주의** | “내일 도착” 확정 약속 금지 |

---

## 4. 배송지 변경

| Field | Content |
|-------|---------|
| **상황** | 주소 변경 요청 |
| **고객 답변** | `{orderId}` 확인했습니다. **배송 준비 전**이면 마이페이지 > 배송지에서 변경 가능하거나, 변경할 주소(수령인·연락처·주소)를 알려주시면 가능 여부를 확인해 드릴게요. **이미 배송 준비중·배송중**이면 택배사/판매자 확인이 필요해 처리가 어려울 수 있습니다. |
| **내부 확인** | order_status, seller 출고 여부 |
| **필요 정보** | 주문번호, 변경 전·후 주소 |
| **주의** | 배송 시작 후 변경 불가 시 대안(재배송비) 정책 링크 |

---

## 5. 주문 취소

| Field | Content |
|-------|---------|
| **상황** | 취소 요청 |
| **고객 답변 (배송 준비 전)** | `{orderId}` 주문은 현재 **배송 준비 전**으로 확인되어, 취소 접수가 가능합니다. 취소 완료 후 결제 수단에 따라 **영업일 기준 3–7일** 환불이 진행될 수 있습니다( PG사·카드사 정책에 따름). 처리 결과는 앱 알림 또는 이메일로 안내드릴게요. |
| **고객 답변 (배송 준비 이후)** | `{orderId}`는 이미 **배송 준비중/배송중** 상태입니다. 취소 대신 **반품·교환** 가능 여부를 판매자·정책 기준으로 확인해야 합니다. `/policies/refund` 안내를 참고해 주시고, 상품 수령 상태를 알려주시면 다음 절차를 안내드릴게요. |
| **내부 확인** | 상태 전이, seller 동의, PG cancel |
| **필요 정보** | 주문번호, 취소 사유 |
| **주의** | “즉시 취소·즉시 환불” 금지 |

---

## 6. 단순변심 반품

| Field | Content |
|-------|---------|
| **상황** | 수령 후 변심 반품 |
| **고객 답변** | `{productName}` `{orderId}` 반품 문의 확인했습니다. 단순 변심 반품은 **상품·카테고리별 정책**에 따라 가능 여부와 왕복 배송비 부담이 달라질 수 있어요. 수령 후 **7일 이내**·미개봉 여부 등을 알려주시면, 가능 시 **반품 접수 방법·반송지·환불 예상 일정**을 안내드리겠습니다. |
| **내부 확인** | refund policy, fresh food restriction |
| **필요 정보** | 개봉 여부, 사진(선택) |
| **주의** | 신선식품 등 제한 카테고리 — [CELLOH_LEGAL_REVIEW_ITEMS.md](./CELLOH_LEGAL_REVIEW_ITEMS.md) |

---

## 7. 상품 불량 / 오배송

| Field | Content |
|-------|---------|
| **상황** | 파손·불량·다른 상품 수령 |
| **고객 답변** | 불편을 드려 정말 죄송합니다. `{orderId}` / `{productName}` 확인을 위해 **① 문제 부분 사진 ② 받으신 상품·수량 ③ 운송장/포장 상태**를 첨부해 주시면, 판매자·CS 검토 후 **교환 또는 전액 환불** 가능 여부를 안내드리겠습니다. 회사·판매자 귀책으로 확인될 경우 반품 배송비는 celloh 또는 판매자가 부담합니다. |
| **내부 확인** | seller photo, admin refund queue |
| **필요 정보** | 사진, 수령일, 불량 설명 |
| **주의** | 판매자 책임 vs 고객 과실 구분 전 확정 금지 |

---

## 8. 환불 처리

| Field | Content |
|-------|---------|
| **상황** | 환불 진행 상황 문의 |
| **고객 답변** | `{orderId}` 환불은 현재 **`{refundStatusLabel}`** 상태입니다. 승인 완료 후 PG·카드사 기준 **영업일 3–7일** 내 결제 수단으로 환불될 수 있습니다. 쿠폰·포인트 사용 주문은 **혜택 회수 또는 차감 후** 환불될 수 있어요. 완료 시 알림으로 안내드립니다. |
| **내부 확인** | refund row, PG cancel API, coupon clawback |
| **필요 정보** | refund id, 승인일 |
| **주의** | “오늘 입금” 확약 금지 |

---

## 9. 쿠폰 미적용

| Field | Content |
|-------|---------|
| **상황** | checkout·장바구니 쿠폰 미적용 |
| **고객 답변** | 쿠폰 `{couponName}` 적용 문의 확인했습니다. 아래를 확인해 주세요. · **유효기간** · **최소 주문금액** · **적용 대상**(장바구니/특정 상품) · **중복 사용** 불가 여부. 조건을 충족하는데도 적용되지 않으면 주문번호·쿠폰명·스크린샷을 보내주시면 **재확인 후** 안내드릴게요. |
| **내부 확인** | coupon record, tier mock vs server coupon |
| **필요 정보** | 쿠폰 ID, cart subtotal, 상품 slug |
| **주의** | [CELLOH_REFERRAL_COUPON_LEGAL_CHECK.md](./CELLOH_REFERRAL_COUPON_LEGAL_CHECK.md) |

---

## 10. 포인트 / 리뷰 적립

| Field | Content |
|-------|---------|
| **상황** | 리뷰·구매 후 포인트 미지급 |
| **고객 답변** | `{productName}` 리뷰·적립 문의 감사합니다. 포인트·리뷰 혜택은 **이벤트·운영 정책**에 따라 지급되며, 일부는 **준비 중(mock)** 상태일 수 있습니다. 구매 확정·리뷰 작성 조건(구매 고객, 작성 기간 등) 충족 여부 확인 후 **지급 예정 또는 미대상 사유**를 안내드리겠습니다. |
| **내부 확인** | review row, points ledger (if any) |
| **필요 정보** | 주문번호, 리뷰 작성일 |
| **주의** | 확정 적립액 약속 금지 |

---

## 11. 친구추천 보상

| Field | Content |
|-------|---------|
| **상황** | 초대 쿠폰·보상 미지급 |
| **고객 답변** | 지인초대 혜택 문의 확인했습니다. · **가입 완료** 시 초대받은 분 쿠폰 · **첫 구매 완료** 시 초대한 분 쿠폰 (운영 정책·이벤트 기준). `{referralCode}` / 가입·주문 일시 확인 중입니다. **동일인·자가추천·취소·환불** 시 지급이 제외될 수 있어요. 확인 후 **지급 예정 또는 제외 사유**를 안내드리겠습니다. 정책: `/policies/referral` |
| **내부 확인** | referral ledger mock, first order paid, fraud flags |
| **필요 정보** | 초대 코드, 피초대 이메일(마스킹), 주문번호 |
| **주의** | 월 한도·법무 검토 전 확정 지급 금지 |

---

## 12. 리뷰 신고

| Field | Content |
|-------|---------|
| **상황** | 허위·욕설·광고 리뷰 신고 |
| **고객 답변** | 신고해 주셔서 감사합니다. `{reportId}` 접수되었으며, **운영 정책·리뷰 가이드**에 따라 검토 중입니다. 조치 결과(비공개·삭제·유지)는 **개별 통지가 제한될 수 있으나**, 필요 시 처리 방향을 안내드리겠습니다. 추가 증빙이 있으면 알려주세요. |
| **내부 확인** | `/admin/review-reports`, review policy |
| **필요 정보** | review id, product id, 신고 사유 |
| **주의** | 명예훼손 등 법적 요청은 법무 에스컬레이션 |

---

## 13. 상품 문의

| Field | Content |
|-------|---------|
| **상황** | PDP Q&A·스펙·재고 |
| **고객 답변** | `{productName}` 문의 확인했습니다. **판매자**에게 확인 요청했으며, **영업일 1–2일 내** 답변드리거나 상품 페이지 문의란에 등록될 예정입니다. 급한 경우 상품 상세의 배송·교환 정책도 함께 참고해 주세요. |
| **내부 확인** | seller inquiry queue, product published |
| **필요 정보** | product slug, 문의 내용 |
| **주의** | 플랫폼이 제조사 대신 단정 답변 금지 |

---

## 14. 판매자 문의

| Field | Content |
|-------|---------|
| **상황** | 입점·정산·판매자 계정 |
| **고객 답변 (구매자)** | 판매자 개인 연락처 대신 **상품 문의·주문 CS**는 celloh 고객센터 또는 상품 문의란을 이용해 주세요. |
| **고객 답변 (판매자)** | 판매자 센터 `{sellerId}` 문의 확인했습니다. **입점·정산·상품 검수**는 판매자 전용 채널에서 순차 처리됩니다. `/seller/help` 및 `/policies/seller`를 참고해 주세요. |
| **내부 확인** | seller status, settlement mock |
| **주의** | buyer/seller 채널 분리 |

---

## 15. 계정 / 로그인

| Field | Content |
|-------|---------|
| **상황** | 로그인 실패·비밀번호·탈퇴 |
| **고객 답변** | 로그인 문의 확인했습니다. · **비밀번호 재설정:** `/forgot-password` · **아이디 찾기:** `/forgot-username` · 소셜 로그인은 가입 시 사용한 계정으로 시도해 주세요. 반복 실패 시 가입 이메일·최근 주문번호(있을 경우)를 알려주시면 **본인 확인 후** 안내드리겠습니다. **탈퇴**는 `/mypage/withdrawal` — 주문·법적 보존 기록은 정책에 따라 유지될 수 있습니다. |
| **내부 확인** | auth provider, withdrawal policy |
| **주의** | 비밀번호·OTP 평문 요청·전달 금지 |

---

## 상황별 요약 (quick ref)

| Topic | Key message |
|-------|-------------|
| 주문 취소 | 준비 전 = 취소 가능 / 이후 = 판매자·반품 확인 |
| 배송 지연 | 택배·판매자 확인 중 → 일정 재안내 |
| 상품 불량 | 사진 요청 → 교환/환불 검토 |
| 쿠폰 | 조건(기간·최소금액·대상) 확인 |
| 친구추천 | 가입·첫구매·취소 시 제외 가능 |
| 리뷰 신고 | 접수 → 검토 → 개별 결과 제한 가능 |

---

## UI / policy links (CS operator)

| Resource | Route |
|----------|-------|
| CS hub | `/support` |
| 1:1 문의 | `/support/contact`, `/support/new` (login) |
| FAQ | `/support/faq` |
| 환불 FAQ | `/support/refund` |
| 배송 FAQ | `/support/shipping` |
| 쿠폰 FAQ | `/support/coupons` |
| 추천 FAQ | `/support/referral` |
| 환불 정책 | `/policies/refund` |
| 배송 정책 | `/policies/shipping` |
| 추천 정책 | `/policies/referral` |

---

## Related

- [CELLOH_INTERNAL_CS_NOTES.md](./CELLOH_INTERNAL_CS_NOTES.md) — internal memos  
- [CELLOH_DELIVERY_REFUND_OPERATIONS.md](./CELLOH_DELIVERY_REFUND_OPERATIONS.md)
