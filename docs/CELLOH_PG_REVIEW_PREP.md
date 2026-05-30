# CELLOH PG Review Prep

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** ⚠️ **심사 제출용 준비 메모 — 실제 PG 심사 제출 금지**

**Related:** `lib/payments/*`, `components/celloh-pay/*`, `CELLOH_SECRET_ENV_AUDIT.md`

---

## Scope

PG(결제대행) 심사 시 필요한 정책·UI·기술 항목 점검 목록. 현재는 **mock 결제 UI** 중심이며, Toss Payments 연동은 TODO 상태입니다.

---

## 결제수단 목록 (UI + policy)

| 수단 | UI | 실제 승인 | Code |
|------|-----|-----------|------|
| 신용/체크카드 | ✅ checkout picker | ⏳ Toss widget | `lib/payments/payment-methods.ts` |
| 카카오페이 | ✅ | ⏳ | same |
| 토스페이 | ✅ | ⏳ | same |
| 무통장입금(가상계좌) | ✅ | ⏳ | same |
| 셀로페이 | ✅ mock | ❌ mock only | `components/celloh-pay/*` |
| 빌링/자동결제 | ✅ mock form | ❌ mock | `components/payment-setup-form.tsx` |

---

## 필수 고지 (policy + checkout)

| 항목 | Status | Location |
|------|--------|----------|
| 카드번호·CVC·결제비밀번호 **저장 안 함** | ✅ copy | `FINANCE_POLICY`, `PaymentPolicyNotice`, `/payment/fail` |
| PG사를 통한 결제 처리 | ✅ copy | payment policy §1 |
| 셀로페이 mock 구분 | ✅ | `CellohPaySection` footer, payment policy §4 |
| 결제 실패 안내 | ✅ | `/payment/fail`, `CELLOH_ERRORS.paymentFailed*` |
| 환불 처리 기준 | 🔶 draft | `/policies/refund` — PG별 기간 TODO |

---

## 셀로페이 mock vs production

| Area | Current (mock) | Production target |
|------|----------------|-------------------|
| Card registration | `registerMockCellohPayCard()` localStorage | Toss Brand Pay / billing key |
| Password sheet | 6-digit UI, no persist | PG-hosted or tokenized |
| Checkout charge | No real API | `api/payments/toss/confirm` |
| Saved cards | Last-4 mask only | PG vault |

**UI notices:**
- `components/celloh-pay/celloh-pay-section.tsx` — PG 연동 후 처리, 카드번호 미저장
- `components/checkout/payment-policy-notice.tsx` — mock + PG 검토 필요
- `components/payment-setup-form.tsx` — mock 카드 입력 + 미저장 안내 (added)

---

## 사업자·통신판매업 정보 (PG 심사 필수)

| Field | Status | Source |
|-------|--------|--------|
| 상호 | ⏳ TODO | `/admin/settings/business` |
| 대표자 | ⏳ TODO | same |
| 사업자등록번호 | ⏳ TODO | same |
| 통신판매업 신고번호 | ⏳ TODO | same |
| 사업장 주소 | ⏳ TODO | same |
| 고객센터 | ⏳ TODO | same |

**Display:** `components/site-footer-content.tsx` — empty 시 TODO notice

---

## 필수 정책 페이지 (PG 심사)

| Policy | Route | Status |
|--------|-------|--------|
| 이용약관 | `/policies/terms` | ✅ draft |
| 개인정보처리방침 | `/policies/privacy` | ✅ draft |
| 결제/환불 | `/policies/payment`, `/policies/refund` | ✅ draft |
| 전자상거래 | `/policies/commerce` | ✅ draft |

---

## Secret / env 노출 점검

| Check | Result |
|-------|--------|
| PG secret keys in client bundle | ❌ must not — see `CELLOH_SECRET_ENV_AUDIT.md` |
| `.env.local` in repo | ❌ gitignored |
| Webhook route | server-only `api/payments/toss/webhook` |
| Mock auth keys in UI | `mock_auth_*` — dev only |

---

## 결제창 테스트 체크리스트 (pre-submission)

### Guest checkout
- [ ] 상품 선택 → `/checkout/[id]` → 결제수단 선택
- [ ] `PaymentPolicyNotice` 표시 확인
- [ ] 셀로페이 선택 시 mock 등록 flow
- [ ] 결제 성공/실패 mock route (`/payment/success`, `/payment/fail`)
- [ ] fail page: 카드 미저장 + PG 처리 문구

### Member checkout
- [ ] 저장 결제수단 last-4만 표시 (`/mypage/payment`)
- [ ] `payment-setup-form`: mock 입력 + 미저장 안내

### Refund flow (draft)
- [ ] `/admin/refunds` mock panel
- [ ] refund policy linked from order/support

### Policy links
- [ ] Checkout → `/policies/payment`
- [ ] Footer → terms, privacy, commerce

### Forbidden before PG live
- [ ] No production card data collection without PG widget
- [ ] No "즉시환불" guarantee copy
- [ ] No real PG submit from mock celloh-pay password sheet

---

## Code references

| File | Role |
|------|------|
| `lib/payments/toss/env.ts` | Toss env guard |
| `lib/payments/payment-flow.ts` | Flow state |
| `app/api/payments/toss/confirm/route.ts` | Confirm API |
| `app/api/payments/toss/webhook/route.ts` | Webhook (TODO live) |
| `components/toss-payment-widget.tsx` | Widget placeholder |

---

## Related

- [CELLOH_LEGAL_REVIEW_ITEMS.md](./CELLOH_LEGAL_REVIEW_ITEMS.md)
- [CELLOH_BUSINESS_INFO_DISPLAY_PLAN.md](./CELLOH_BUSINESS_INFO_DISPLAY_PLAN.md)
- [PAYMENT_FLOW.md](./PAYMENT_FLOW.md)
