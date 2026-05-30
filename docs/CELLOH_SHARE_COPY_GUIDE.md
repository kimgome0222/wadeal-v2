# CELLOH Share Copy Guide

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Status:** Copy reference — **no share API or env changes**

**Related:** [CELLOH_DOMAIN_DEPLOYMENT_PREP.md](./CELLOH_DOMAIN_DEPLOYMENT_PREP.md), `lib/seo/site.ts`, `lib/share/urls.ts`

**Tone:** 담백·신뢰. 과장·허위 할인 표현 금지 ([CELLOH_UX_WRITING_GUIDE.md](./CELLOH_UX_WRITING_GUIDE.md))

---

## Default metadata (Open Graph / link preview)

| Field | Copy |
|-------|------|
| **title** | celloh |
| **description** | 누가 만들었는지 알고 사세요. 좋은 상품은 좋은 판매자에게서 시작됩니다. |
| **siteName** | celloh |
| **locale** | ko_KR |
| **url (placeholder)** | https://www.celloh.co.kr |
| **image** | `/icons/icon-512.svg` (existing asset) |

---

## Share scenarios

### 홈 공유

| Channel | Copy |
|---------|------|
| **한 줄** | celloh에서 좋은 판매자와 상품을 만나보세요. |
| **긴 문구** | 누가 만들었는지 알고 사세요. celloh에서 판매자 이야기와 함께 상품을 만나보세요. |
| **OG title** | celloh |
| **OG description** | 누가 만들었는지 알고 사세요. 좋은 상품은 좋은 판매자에게서 시작됩니다. |

**URL:** `https://www.celloh.co.kr/` (placeholder)

---

### 상품 공유

| Channel | Copy |
|---------|------|
| **한 줄** | 이 상품, 판매자 정보까지 보고 구매해보세요. |
| **템플릿** | `{productName}` — celloh에서 판매자 `{sellerName}`의 상품을 확인해 보세요. |
| **OG title** | `{productName}` |
| **OG description** | `{productName}` · 현재 예상가 {price}. 누가 만들었는지 알고 사세요. |
| **OG image** | Product image (fallback: brand icon) |

**URL:** `buildShareUrl(productSlug)` — optional `?ref=` for referral

**Code:** `lib/share/urls.ts`, `buildProductMetadata()`

---

### 판매자 공유

| Channel | Copy |
|---------|------|
| **한 줄** | 이 판매자의 이야기와 상품을 celloh에서 만나보세요. |
| **템플릿** | `{sellerName}` — {tagline or subtitle} |
| **OG title** | `{sellerName} \| celloh 판매자` |
| **OG type** | profile |

**URL:** `/sellers/{id}`

---

### 컬렉션 공유

| Channel | Copy |
|---------|------|
| **한 줄** | celloh에서 엄선한 `{collectionTitle}` 모음을 확인해 보세요. |
| **템플릿** | `{collectionDescription}` · 누가 만들었는지 알고 사세요. |
| **OG title** | `{collectionTitle}` |

**URL:** `/collections/{slug}`

---

### 지인초대 공유

| Channel | Copy |
|---------|------|
| **한 줄** | 친구와 함께 celloh 혜택을 받아보세요. |
| **긴 문구** | celloh에 초대합니다. 가입하고 첫 구매 혜택을 확인해 보세요. (지급 조건은 정책 참고) |
| **CTA** | 초대 링크로 가입하기 |

**URL:** `buildInviteUrl(referralCode)` → `/?ref={code}`

**Policy:** [CELLOH_REFERRAL_REWARD_POLICY.md](./CELLOH_REFERRAL_REWARD_POLICY.md) — mock "예정" copy only until launch

---

### 쿠폰 공유

| Channel | Copy |
|---------|------|
| **한 줄** | celloh 장바구니 혜택 — 금액 구간별 할인을 확인해 보세요. |
| **tier 예시** | 3만원 이상 3천원 · 5만원 이상 5천원 (mock tier) |
| **주의** | "즉시 지급" 등 확정 전 표현 지양 |

**URL:** `/support/coupons`, `/mypage/coupons`, `/invite`

---

## Platform-specific notes

| Platform | Tip |
|----------|-----|
| Kakao | Title ≤ 40 chars; use product image when available |
| iOS Messages | OG image 1.91:1 preferred long-term; icon OK for MVP |
| Instagram DM | Link preview uses OG tags |
| Copy paste | Include URL on second line |

---

## Do not use

- "최저가 보장" (unless verified)
- Fake urgency countdown in share text
- Competitor names in official share templates

---

## Code map

| Feature | File |
|---------|------|
| Site copy constants | `lib/seo/site.ts` → `siteConfig` |
| Product OG | `buildProductMetadata()` |
| Share URLs | `lib/share/urls.ts` |
| Referral copy | `lib/referral/mock-referral-status.ts` |

**No share send implementation in this task.**
