# CELLOH Referral Reward Policy

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** Mock UI + copy — **no actual payout DB**

**Code:** `lib/referral/mock-referral-status.ts`, `lib/share/referral-code.ts`

---

## Reward rules (placeholder)

| Event | 초대한 사람 | 초대받은 사람 |
|-------|------------|--------------|
| 가입 완료 | — | 3,000원 쿠폰 (mock copy) |
| 첫 구매 완료 | 3,000원 쿠폰 (mock copy) | — |
| 취소/환불 | 지급 취소 / 회수 | 지급 취소 |

Copy source: `REFERRAL_BENEFIT_COPY` in `lib/referral/mock-referral-status.ts`

---

## Status flow (mock)

| Status | Label | Meaning |
|--------|-------|---------|
| `invited` | 초대 완료 | Link shared |
| `signed_up` | 가입 완료 | Friend registered |
| `first_purchase` | 첫 구매 완료 | Qualifying order paid |
| `reward_pending` | 지급 예정 | Admin/review queue |

---

## Anti-abuse placeholders

| Rule | Placeholder |
|------|-------------|
| 동일 기기 | Device fingerprint — TBD |
| 동일 결제수단 | PG card hash match — TBD |
| 동일 배송지 | Address normalization — TBD |
| 월 최대 지급 | `monthlyLimit: TODO` in code |
| 부정 이용 탐지 | Velocity + duplicate signals — TBD |
| 관리자 검수 | `reward_pending` > 30 days, high amount, flagged device |

**No enforcement implemented** — document only.

---

## Cancel / refund impact

- First purchase reversed within 7 days → inviter reward void
- Partial refund on qualifying order → reward held until final state
- Chargeback → both parties rewards revoked

*(Placeholder — legal review required)*

---

## UI routes

| Route | Role |
|-------|------|
| `/invite` | Guest mock code `GUEST-MOCK` |
| `/mypage/invite` | Real referral code + share stats |
| `/mypage/referrals` | Redirect → `/mypage/invite` |
| `/policies/referral` | Policy document ✅ |
| `/support/referral` | FAQ topic ✅ |

**Kakao share:** disabled ("준비 중") on invite panel

---

## Production checklist (future)

- [ ] Referral ledger table (no DB in this task)
- [ ] Webhook on `payment_paid` for first order
- [ ] Coupon issuance via admin job
- [ ] Monthly cap enforcement
- [ ] Fraud review queue in `/admin`

---

## Related

- `docs/CELLOH_COUPON_POINT_POLICY.md`
- `docs/CELLOH_POLICY_PAYMENT_REFERRAL_PLAN.md`
