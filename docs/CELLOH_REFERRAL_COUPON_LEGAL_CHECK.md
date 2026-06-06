# CELLOH Referral & Coupon Legal Check

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** ⚠️ **법무·프로모션 검토용 — 실제 지급·약관 확정 아님**

**Related:** `CELLOH_COUPON_POINT_POLICY.md`, `CELLOH_REFERRAL_REWARD_POLICY.md`, `lib/policies/content.ts`

---

## Coupon program

### 지급 조건

| Type | Condition (current) | Legal review |
|------|---------------------|--------------|
| Tier auto (mock) | Subtotal 30k/50k/70k/100k | ✅ 표시·중복 규칙 |
| Server coupon | Code + min order + active | ✅ |
| Welcome / event | Admin issued | ✅ |
| Membership | 준비 중 | ⏳ |

### 유효기간

| | |
|---|---|
| **Tier mock** | 주문 시점 적용 (session) |
| **Server** | `coupon.expires_at` |
| **Review** | 만료일 표시 의무, D-day 고지 |

### 최소 결제금액

| | |
|---|---|
| **Tier** | threshold = min order |
| **Server** | `min_order_not_met` validation |
| **UI** | checkout + `/mypage/coupons` |
| **Review** | ✅ 조건 명시 on coupon card |

### 환불 시 회수

| Scenario | Draft rule | Status |
|----------|------------|--------|
| 전액 취소 | 쿠폰 복원 | placeholder |
| 부분 환불 | 할인 비례 차감 | placeholder |
| 포인트 사용 | 동일 원칙 | placeholder |

**Policy:** `/policies/refund` §5, `CELLOH_COUPON_POINT_POLICY.md`

### 부정 이용 제한

| Rule | Documented | Enforced |
|------|------------|----------|
| 중복 계정 | coupon policy | ⏳ |
| 쿠폰 대량 생성 | admin only | ✅ |
| 환불 후 재사용 | placeholder | ⏳ |

---

## Referral program

### 지급 조건 (draft / mock)

| Event | Invitee | Inviter | Code |
|-------|---------|---------|------|
| 가입 | 3,000원 쿠폰 (mock) | — | `/invite`, `REFERRAL_POLICY` |
| 첫 구매 | — | 3,000원 쿠폰 (mock) | same |

**Review:** 이벤트성 vs 상시 — 고지·약관·당첨자 발표 의무 여부

### 동일인 / 자가추천 제한

| Rule | UI | Policy |
|------|-----|--------|
| 본인 추천 | `/invite` 부정이용 섹션 | `REFERRAL_POLICY` §2 |
| 동일 기기 | copy only | TBD tech |
| 동일 결제수단 | copy only | TBD PG hash |

### 월 지급 한도

| | |
|---|---|
| **Current** | `monthlyLimit: TODO` in code |
| **UI** | "운영 정책에 따라 달라질 수 있어요" |
| **Review** | ✅ 한도·초과 시 처리 확정 |

### 이벤트 조기 종료

| | |
|---|---|
| **Draft** | "운영 사정에 따라 변경·종료될 수 있어요" |
| **Policy** | referral §1 — 초안 명시 |
| **Review** | ✅ 약관 + 이벤트 페이지 고지 |

### 고지 방법

| Channel | Status |
|---------|--------|
| `/policies/referral` | ✅ |
| `/invite` event card | ✅ (customer-friendly) |
| Push/email on reward | ⏳ templates |
| App notice / banner | ⏳ |

---

## Risk phrases (coupons/referrals)

| Avoid | Use instead |
|-------|-------------|
| "무조건 지급" | "조건 충족 시 지급" |
| "100% 환불 + 쿠폰 유지" | refund policy link |
| "최대 혜택 보장" | "이벤트 기준 안내" |

---

## UI routes audit

| Route | Customer copy | Internal notes |
|-------|---------------|----------------|
| `/invite` | 혜택 + 부정이용 | legal TODO in docs only |
| `/membership` | 준비 중 + 혜택 목록 | no "법무 검토" banner |
| `/mypage/coupons` | mock banner (admin/dev context OK) | |
| `/support/coupons` | FAQ | |
| `/support/referral` | FAQ | |
| `/policies/coupon` | policy doc | legalNotice banner |
| `/policies/referral` | policy doc | legalNotice banner |

---

## Pre-launch checklist

- [ ] Legal sign-off on reward amounts & tax treatment
- [ ] Coupon T&C linked at checkout apply
- [ ] Referral monthly cap in policy + admin config
- [ ] Refund clawback logic documented + implemented
- [ ] Event end / change notice template
- [ ] Remove mock payout claims from marketing

---

## Related

- [CELLOH_LEGAL_REVIEW_ITEMS.md](./CELLOH_LEGAL_REVIEW_ITEMS.md)
- [CELLOH_COUPON_COST_CONTROL.md](./CELLOH_COUPON_COST_CONTROL.md)
- [CELLOH_PROMOTION_DISPLAY_RULES.md](./CELLOH_PROMOTION_DISPLAY_RULES.md)
