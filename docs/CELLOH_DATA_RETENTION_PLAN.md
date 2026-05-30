# CELLOH Data Retention Plan

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** ⚠️ **법무·개인정보 검토 필요** — no delete logic implemented

**Related:** `CELLOH_DATA_MODEL_PLAN.md`, `/policies/privacy`

---

## Principles

- Separate **account deletion** vs **transaction record retention**
- Personal data minimization; pseudonymize where law allows
- Placeholders below — confirm with legal before implementation

---

## 회원 탈퇴 시 처리

| Data | Action (draft) |
|------|----------------|
| profile (name, phone, avatar) | delete or pseudonymize |
| auth credentials | Supabase auth delete |
| addresses | delete |
| marketing consent | delete |
| cart | delete |
| orders / payments | **retain** (legal/tax) — unlink PII |
| reviews | anonymize author or hide per policy |
| support tickets | retain case record; redact contact if required |
| notifications | delete |
| coupon/point balance | forfeit or cashout window (policy TBD) |

**UI:** `/mypage/withdrawal` — confirm flow + cooling-off period (TBD)

---

## 주문 / 결제 기록

| | |
|---|---|
| **Retention** | 5 years placeholder (전자상거래/세법 — legal confirm) |
| **Content** | amounts, items snapshot, status timeline |
| **PII** | minimize; address snapshot may be retained masked |
| **Deletion** | not on user request if law requires retention |

---

## 문의 / CS 기록

| | |
|---|---|
| **Retention** | 3 years placeholder |
| **Action** | close → archive; PII access admin-only |
| **Attachments** | storage lifecycle same as ticket |

---

## 리뷰 / 신고 기록

| Type | Retention |
|------|-----------|
| Reviews | product lifetime + 1y after delist (TBD) |
| Reports | 3y after resolution |
| Moderation logs | align with admin_logs |

Deleted reviews: soft-delete + hide from public

---

## 쿠폰 / 포인트 내역

| | |
|---|---|
| **Coupons** | issue + redemption rows retained for audit (3y placeholder) |
| **Points** | ledger immutable; balance zero on withdraw |
| **Fraud investigation** | extended hold flag (admin) |

---

## 친구추천 기록

| | |
|---|---|
| **Retention** | 2y placeholder |
| **Withdraw** | stop new rewards; keep fraud audit trail |
| **PII** | referee link pseudonymized after period |

---

## 로그 / 이벤트 기록

| Type | Retention |
|------|-----------|
| `events` (analytics) | 13 months placeholder (aggregated after 90d) |
| `error_logs` | 90 days |
| `admin_logs` | 3 years |
| `webhook_logs` | 1 year (no card data) |

---

## 개인정보 파기 / 분리보관

| Stage | Description |
|-------|-------------|
| Active | full profile |
| Dormant | 1y no login → email only (TBD) |
| Withdrawn | PII deleted; transactional pseudonym ID |
| Legal hold | admin flag blocks purge |

**Methods (placeholder):** DB delete, field null, irreversible hash for join keys

---

## Implementation status

| Item | Status |
|------|--------|
| Withdrawal UI | partial |
| Automated purge jobs | ⏳ planned |
| Export (GDPR-style) | ⏳ planned |
| Retention cron | ⏳ planned |

---

## Related

- `CELLOH_BUSINESS_INFO_DISPLAY_PLAN.md`
- `CELLOH_SELLER_ENFORCEMENT_POLICY.md`
