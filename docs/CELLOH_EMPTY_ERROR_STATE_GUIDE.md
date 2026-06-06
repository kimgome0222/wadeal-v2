# CELLOH Empty & Error State Guide

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Status:** Copy + accessibility reference

**Related:** [CELLOH_ACCESSIBILITY_CHECKLIST.md](./CELLOH_ACCESSIBILITY_CHECKLIST.md), [CELLOH_UX_WRITING_GUIDE.md](./CELLOH_UX_WRITING_GUIDE.md)

**Code:** `components/empty-state.tsx`, `lib/copy/ux-writing.ts` → `CELLOH_EMPTY`, `CELLOH_ERRORS`

---

## Pattern

Each state includes:

| Field | Purpose |
|-------|---------|
| **제목** | Short, neutral headline |
| **설명** | One sentence — what happened / what to do |
| **CTA** | Single primary action when applicable |
| **aria-friendly** | Title readable as status; container `role="status"` |

---

## Empty states

### 빈 장바구니

| Field | Copy |
|-------|------|
| 제목 | 장바구니가 비어 있어요 |
| 설명 | 필요한 상품을 담아보세요. |
| CTA | 상품 둘러보기 → `/` or `/categories` |
| aria | `장바구니가 비어 있습니다. 필요한 상품을 담아보세요.` |

**Code:** `CELLOH_EMPTY.cart`, `/join-cart` empty

---

### 검색 결과 없음

| Field | Copy |
|-------|------|
| 제목 | 찾는 상품이 아직 없어요 |
| 설명 | 다른 검색어로 다시 찾아보세요. |
| CTA | — or 홈으로 |
| aria | `검색 결과가 없습니다. 다른 검색어를 입력해 주세요.` |

**Code:** `CELLOH_EMPTY.search`, `EmptyState variant="search"`

---

### 상품 없음 (카테고리/컬렉션)

| Field | Copy |
|-------|------|
| 제목 | 아직 등록된 상품이 없어요 |
| 설명 | 첫 상품을 준비 중이에요. 곧 만나보실 수 있어요. |
| CTA | 다른 카테고리 보기 |
| aria | `등록된 상품이 없습니다.` |

Filter empty: "다른 필터를 선택해 보세요."

**Code:** `CELLOH_EMPTY.categoryProducts`

---

### 판매자 없음 / 판매자 상품 없음

| Field | Copy |
|-------|------|
| 제목 | 등록된 상품이 아직 없어요 |
| 설명 | 판매자의 첫 상품을 준비 중이에요. |
| CTA | 다른 판매자 보기 |
| aria | `판매자 상품이 아직 없습니다.` |

**Code:** `CELLOH_EMPTY.sellerProducts`, seller profile sections

---

### 리뷰 없음

| Field | Copy |
|-------|------|
| 제목 | 아직 리뷰가 없어요 |
| 설명 | 첫 번째 리뷰를 기다리고 있어요. |
| CTA | — |
| aria | `리뷰가 없습니다.` |

**Code:** `CELLOH_EMPTY.review`, PDP `EmptyState`

---

## Error & auth states

### 권한 없음

| Field | Copy |
|-------|------|
| 제목 | 접근 권한이 없어요 |
| 설명 | 필요한 권한이 있는 계정으로 다시 로그인해 주세요. |
| CTA | 로그인 → `/login` |
| aria | `접근 권한이 없습니다. 로그인이 필요합니다.` |

**Route:** `/unauthorized`  
**Code:** `CELLOH_ERRORS.permissionDenied*`

---

### 로그인 필요

| Field | Copy |
|-------|------|
| 제목 | 로그인이 필요해요 |
| 설명 | 계속하려면 먼저 로그인해 주세요. |
| CTA | 로그인 |
| aria | `로그인이 필요합니다.` |

**Code:** `CELLOH_ERRORS.loginRequired*`

---

### 결제 실패

| Field | Copy |
|-------|------|
| 제목 | 결제에 실패했어요 |
| 설명 | 결제수단을 확인하고 다시 시도해 주세요. |
| CTA | 다시 시도하기 / 주문 목록 |
| aria | `결제에 실패했습니다. 결제수단을 확인해 주세요.` |

**Route:** `/payment/fail`  
**Code:** `CELLOH_ERRORS.paymentFailed*`

---

### 네트워크 오류

| Field | Copy |
|-------|------|
| 제목 | 문제가 발생했어요 |
| 설명 | 네트워크 연결을 확인한 뒤 다시 시도해 주세요. |
| CTA | 다시 시도하기 |
| aria | `네트워크 오류가 발생했습니다. 연결을 확인해 주세요.` |

**Code:** `CELLOH_ERRORS.networkDescription`

---

### 상품 없음 (404)

| Field | Copy |
|-------|------|
| 제목 | 상품을 찾을 수 없어요 |
| 설명 | 다른 상품을 둘러보세요. |
| CTA | 홈으로 돌아가기 |
| aria | `상품을 찾을 수 없습니다.` |

**Code:** `CELLOH_ERRORS.productNotFound*`

---

### Generic error

| Field | Copy |
|-------|------|
| 제목 | 문제가 발생했어요 |
| 설명 | 잠시 후 다시 시도해 주세요. |
| CTA | 다시 시도하기 |
| aria | `오류가 발생했습니다. 잠시 후 다시 시도해 주세요.` |

**Code:** `CELLOH_ERRORS.generic*`

---

## Component usage

```tsx
<EmptyState
  title={CELLOH_EMPTY.cart.title}
  description={CELLOH_EMPTY.cart.description}
  actionLabel={CELLOH_BUTTONS.browseProducts}
  actionHref="/"
  variant="shopping"
/>
```

`EmptyState` uses `role="status"` and `aria-live="polite"` for screen readers.

---

## Tone rules

- No blame ("잘못 입력하셨습니다" → soften)
- Offer one clear next step
- Avoid jargon (PG, API) in customer copy
- Error colors documented in [CELLOH_COLOR_CONTRAST_NOTES.md](./CELLOH_COLOR_CONTRAST_NOTES.md)

**No new error handling logic in this task.**
