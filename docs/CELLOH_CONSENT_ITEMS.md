# CELLOH Consent Items

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Status:** Consent inventory aligned with `UserConsentForm`

**Related:** [CELLOH_PRIVACY_UX_GUIDE.md](./CELLOH_PRIVACY_UX_GUIDE.md), [CELLOH_POLICY_PAYMENT_REFERRAL_PLAN.md](./CELLOH_POLICY_PAYMENT_REFERRAL_PLAN.md)

**Code:** `components/user-consent-form.tsx`, `lib/consents/types.ts`, `app/actions/consents.ts`

---

## Required consents

| 항목 | key | 노출 위치 | Policy route | 미동의 시 |
|------|-----|-----------|--------------|-----------|
| 이용약관 | `terms` | signup, login, checkout(미동의) | `/policies/terms` | 가입/로그인/결제 차단 |
| 개인정보 수집 및 이용 | `privacy` | signup, login, checkout(미동의) | `/policies/privacy` | 가입/로그인/결제 차단 |
| 만 14세 이상 | `age14` | signup, login | `/policies/youth` | 가입/로그인 차단 |
| 전자상거래·가격 확정 | `groupbuy` | signup, login, checkout(미동의) | `/policies/commerce` | 가입/로그인/결제 차단 |
| 주문·환불·배송 정책 | `orderPolicy` | **checkout only** | `/policies/refund` | 결제 차단 |

---

## Optional consents

| 항목 | key | 노출 위치 | Policy route | 미동의 시 |
|------|-----|-----------|--------------|-----------|
| 마케팅 정보 수신 | `marketing` | signup, login, mypage settings | `/policies/marketing` | 혜택 알림 미발송 |
| 개인화 추천 | `personalization` | signup, login | — (추후 정책) | 일반 추천만 |
| 이벤트/쿠폰 알림 | — | 마케팅에 포함 또는 분리 예정 | `/policies/marketing` | 동일 |

**Note:** `personalization`은 UI checkbox만 — DB 저장은 `terms/privacy/groupbuy/marketing` 4종 (`saveUserConsentsAction`).

---

## Other consent surfaces

| Surface | Consent text | Route | Required |
|---------|--------------|-------|----------|
| 결제수단 등록 | 결제수단 등록 및 자동결제 동의 | `/mypage/payment/new` | Yes |
| 1:1 문의 (mock) | 문의 처리를 위한 개인정보 수집·이용 | `/support/contact` | Yes |
| 판매자 mock 입점 | 약관·정산·심사·개인정보 (4 checkbox) | `/seller/apply` (mock form) | Yes |
| 판매자 실제 신청 | 약관 UI 추후 — 현재 form submit only | `/seller/apply` | Business fields required |

---

## Flow by route

### `/signup`

1. `UserConsentForm` variant=`compact`
2. Required: terms, privacy, age14, groupbuy
3. Optional: marketing, personalization
4. Submit blocked until required checked

### `/login`

1. Consent gate before OAuth/username login
2. `saveUserConsentsAction` on first complete consent
3. Message: "필수 약관에 동의하면 로그인할 수 있어요."

### `/checkout/[id]`

1. If `hasRequiredConsents` false → show `UserConsentForm` variant=`checkout`
2. Adds `orderPolicy` to required set
3. `PaymentPolicyNotice` shown with consent block
4. After save → `router.refresh()`, checkout proceeds

### `/mypage/payment/new`

1. Separate checkbox: 자동결제 동의
2. Independent from `UserConsentForm`

---

## Policy links map

| Consent label | href |
|---------------|------|
| 이용약관 동의 | `/policies/terms` |
| 개인정보 수집 및 이용 동의 | `/policies/privacy` |
| 만 14세 이상 확인 | `/policies/youth` |
| 전자상거래·가격 확정 방식 동의 | `/policies/commerce` |
| 주문·환불·배송 정책 확인 | `/policies/refund` |
| 마케팅 정보 수신 동의 | `/policies/marketing` |

Static pages also: `/privacy`, `/terms`, `/marketing-terms`, `/finance-terms`

---

## Withdrawal / change

| Consent | How to withdraw |
|---------|-----------------|
| Marketing | `/mypage/notification-settings` or `/mypage/settings` (planned) |
| Personalization | Same settings (planned) |
| Required terms | Service withdrawal `/mypage/withdrawal` — cannot use service without |

---

## Gaps (document only)

- [ ] `age14`, `orderPolicy`, `personalization` not persisted in `user_consents` table yet
- [ ] Cookie/analytics consent banner — future
- [ ] Seller real form — explicit policy checkbox TBD

**No consent storage logic changed in this task.**
