# CELLOH Privacy Review Checklist

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** ⚠️ **법무·개인정보 검토용 — 확정 방침 아님**

**Source of truth (draft):** `lib/policies/content.ts` → `PRIVACY_POLICY`, `/policies/privacy`

---

## Checklist

### 수집 항목

| Category | Items | Code touchpoints | Legal review |
|----------|-------|------------------|--------------|
| 회원 | email, name, nickname, social ID | signup, auth | ✅ |
| 주문·배송 | name, phone, address | checkout, addresses | ✅ |
| 결제 | PG token, approval no — **not full card** | payments table | ✅ |
| CS | inquiry body, attachments | support forms | ✅ |
| 이용 | logs, cookies, device, browse history | analytics (planned) | ✅ |

**Gap:** 실제 수집 vs 방침 일치 검증 필요

---

### 수집 목적

| Purpose | Documented | Implemented |
|---------|------------|-------------|
| 회원 식별·계정 | ✅ §2 | ✅ partial |
| 주문·결제·배송 | ✅ §2 | ✅ partial |
| CS·분쟁 | ✅ §2 | 🔶 mock support |
| 서비스 개선·부정이용 | ✅ §2 | ⏳ |
| 마케팅 (동의 시) | ✅ §2 | 🔶 checkbox |

---

### 보유 기간

| Data | Policy text | Detail doc |
|------|-------------|------------|
| 회원 정보 | 탈퇴 시 파기, 법령 예외 | `CELLOH_DATA_RETENTION_PLAN.md` |
| 거래 기록 | 법령 준수 | placeholder 5y |
| CS | placeholder 3y | draft |
| Logs | placeholder 90d–13mo | draft |

**TODO:** 법무 확정 후 privacy §3 + retention plan 동기화

---

### 제3자 제공

| | |
|---|---|
| **Policy** | 원칙적 미제공, 법령·서비스 제공 필요 시 |
| **Review** | PG·택배·알림 발송 시 "제공" vs "위탁" 구분 명확화 |

---

### 처리 위탁

| Processor | Purpose | Status |
|-----------|---------|--------|
| PG (Toss 등) | 결제 | TODO: contract |
| 택배사 | 배송 | TODO |
| 알림/SMS | 카카오, email | TODO |
| Supabase | DB/hosting | TODO: name in policy |
| Vercel | hosting | TODO |

---

### 이용자 권리

| Right | UI path | Status |
|-------|---------|--------|
| 열람·정정 | `/mypage/profile`, `/mypage/account` | ✅ partial |
| 삭제·탈퇴 | `/mypage/withdrawal` | 🔶 UI |
| 동의 철회 | marketing settings | 🔶 |
| 처리 정지 | support contact | ⏳ |

---

### 쿠키 / 행태정보

| | |
|---|---|
| **Policy** | §9 — 쿠키 사용, 행태정보 시 별도 동의 |
| **Impl** | ⏳ consent banner, cookie policy page |
| **Review** | ✅ 법무 — 맞춤형 광고 여부 확정 |

---

### 마케팅 수신 동의

| | |
|---|---|
| **Policy** | `/marketing-terms`, privacy §2·§6 |
| **Signup** | checkbox on signup flow |
| **Settings** | `/mypage/notification-settings` |
| **Review** | ✅ 필수 — 선택/필수 구분, 철회 UX |

---

### 만 14세 미만

| | |
|---|---|
| **Policy** | privacy §8, `/policies/youth` |
| **Signup** | age confirmation |
| **Review** | ✅ 필수 — 법정대리인 동의 절차 필요 여부 |

---

### 개인정보보호책임자 (placeholder)

```
담당자: TODO — 성명 (운영 확정 후 게시)
이메일: TODO — privacy@celloh.example
전화: TODO — 고객센터 전화 (customerServicePhone) 연동
```

**Location:** privacy policy §11, admin business settings

---

### 파기 절차

| | |
|---|---|
| **Policy** | §7 — 전자파일 복구불가 삭제, 출력물 분쇄 |
| **Impl** | ⏳ automated jobs — see retention plan |
| **Review** | 🔶 법무 + DPO |

---

### 접근 제한

| | |
|---|---|
| **Policy** | (implicit) admin-only PII |
| **Tech** | RLS direction — `CELLOH_RLS_PERMISSION_PLAN.md` |
| **Review** | ✅ — seller must not see buyer phone |

---

### 로그 보관

| Log type | Retention (draft) | PII rule |
|----------|-------------------|----------|
| Access logs | 90d | minimize |
| Error logs | 90d | no card data |
| Webhook logs | 1y | no card/CVC |
| Admin logs | 3y | audit trail |

---

## Pre-launch privacy actions

- [ ] Fill privacy officer in admin + policy
- [ ] Confirm all processors listed with contract dates
- [ ] Match signup consent checkboxes to policy sections
- [ ] Cookie/tracking consent before analytics
- [ ] Withdrawal flow legal sign-off
- [ ] Cross-border transfer statement (if any)

---

## Related

- [CELLOH_LEGAL_REVIEW_ITEMS.md](./CELLOH_LEGAL_REVIEW_ITEMS.md)
- [CELLOH_DATA_RETENTION_PLAN.md](./CELLOH_DATA_RETENTION_PLAN.md)
- [PRIVACY_DRAFT.md](./PRIVACY_DRAFT.md) (legacy)
