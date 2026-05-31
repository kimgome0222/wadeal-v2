# CELLOH Data Masking Rules

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Status:** Display reference — apply on lists, reviews, admin; not on owner's mypage edit screens

**Related:** [CELLOH_PRIVACY_UX_GUIDE.md](./CELLOH_PRIVACY_UX_GUIDE.md)

**Code:** `lib/reviews/review-rules.ts` (`maskAuthorName`, `maskUserId`), `lib/auth/credentials.ts` (`maskUsername`)

---

## Masking table

| Data type | Masked format | Example | When to show full |
|-----------|---------------|---------|-------------------|
| **이름** | 첫·끝 글자, 중간 `*` | `김*나` (3자+) / `김*` (2자) | 본인 프로필, 배송지 관리 |
| **전화번호** | 가운데 4자리 | `010-****-1234` | 본인 배송지·주문 상세(본인) |
| **이메일** | 로컬 앞 2자 + `***` | `ga***@domain.com` | 본인 계정 설정 |
| **주소** | 시/구까지만 | `서울 강남구` | 목록·카드; **상세주소**는 주문 상세(본인)만 |
| **계좌번호** | 끝 4자리만 | `****1234` | 판매자 정산 화면(본인) |
| **카드번호** | **저장 금지** — 표시만 마스킹 | `**** **** **** 1234` | 결제수단 관리(본인) |
| **주문번호** | 전체 표시 OK | `CH12345678` | 고객·판매자·CS |
| **운송장번호** | 필요 범위만 | 전체 (배송 추적) | 주문 상세, 배송 알림 |

---

## Implementation notes

### 이름 — `maskAuthorName`

```ts
// lib/reviews/review-rules.ts
// "홍길동" → "홍****동"
// email local part if name is email-like
```

Used in: product reviews, seller reviews display.

### 사용자 ID — `maskUserId`

```ts
// "abc123xyz789" → "abc1***789"
```

Used in: admin/debug displays where full UUID is unnecessary.

### 아이디 — `maskUsername`

```ts
// lib/auth/credentials.ts — login recovery displays
```

---

## Phone masking (target — not all UI wired yet)

```text
Input:  01012341234 / 010-1234-1234
Output: 010-****-1234
```

Apply to: order list summaries, seller order lists, public profiles — **not** `/mypage/addresses` (owner context).

---

## Address display tiers

| Context | recipientName | phone | addressLine1 | addressLine2 |
|---------|---------------|-------|--------------|--------------|
| 배송지 목록 (본인) | full | full | full | full |
| 체크out 선택 요약 | full | mask optional | 시/구 + 도로명 앞부분 | hidden in summary |
| 판매자 주문 목록 | mask | mask | 시/구 only | hidden |
| 주문 상세 (본인) | full | full | full | full |

**Current:** `CheckoutConsentSection.formatAddressSummary` joins name + line1 + line2 for checkout footer — owner session only.

---

## Card & payment

| Field | Rule |
|-------|------|
| cardLast4 | Only persist last 4 digits |
| cardNumber input | Never persist — mock discards after PG tokenization |
| CVC | Never collect in celloh DB |
| Billing key | Server-only, not shown in UI |

**UI:** `SavedPaymentMethodsContent` — `**** **** **** {cardLast4}`

---

## Order & tracking

| Field | Mask? |
|-------|-------|
| orderId / orderNumber | No — needed for CS |
| trackingNumber | No — needed for customer tracking |
| paymentApprovalNo | Partial in lists if shown |

---

## Do not mask (operational)

- Product names, prices
- Seller public shop name
- Policy URLs, support ticket numbers (mock)

---

## QA verification

| Route | Check |
|-------|-------|
| `/product/1` reviews | Author name masked |
| `/mypage/payment` | Card shows last 4 only |
| `/mypage/addresses` | Full address OK (owner) |
| `/mypage/orders/[id]` | Full shipping for owner |

**No masking logic changes in this task unless documented gap with one-line copy fix.**
