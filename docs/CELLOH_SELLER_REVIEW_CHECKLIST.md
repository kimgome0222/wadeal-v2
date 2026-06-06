# CELLOH Seller Review Checklist

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** Admin ops draft — **no seller status changes in this task**

**Related:** [CELLOH_STATUS_VALUES.md](./CELLOH_STATUS_VALUES.md), [CELLOH_REJECTION_REASON_TEMPLATES.md](./CELLOH_REJECTION_REASON_TEMPLATES.md), [CELLOH_SELLER_ONBOARDING_GUIDE.md](./CELLOH_SELLER_ONBOARDING_GUIDE.md)

**Code:** `lib/sellers/review-checklist.ts`, `components/admin-seller-review-form.tsx`

**Admin UI:** `/admin/sellers`, `/admin/sellers/[id]/review`

---

## Verdict options (판정)

| Verdict | Meaning | Typical next status |
|---------|---------|---------------------|
| **승인** | All checks pass | `approved` |
| **보완 요청** | Missing docs / fixable info | `reviewing` or `applied` + message |
| **반려** | Policy violation, fraud risk | `rejected` |
| **보류** | Legal/cert verification pending | `reviewing` + internal hold |

**Status flow:** `applied` → `reviewing` → `approved` | `rejected` → (ops) `suspended`

See [CELLOH_STATUS_VALUES.md § Seller lifecycle](./CELLOH_STATUS_VALUES.md#seller-lifecycle).

**Code mapping:** DB may use `pending_review` — map to `reviewing` / `applied` in docs.

---

## Checklist items

| # | Item | Pass criteria | Fail → |
|---|------|---------------|--------|
| 1 | **판매자명/상호명** | Matches business registration; no impersonation | 보완/반려 |
| 2 | **사업자등록 정보** | Valid format; matches document | 보완/반려 |
| 3 | **통신판매업 신고** | Number provided or exemption documented | 보완/보류 |
| 4 | **담당자 연락처** | Reachable email/phone for CS | 보완 |
| 5 | **정산 계좌** | Account holder matches business (placeholder verify) | 보완 |
| 6 | **판매 카테고리** | Allowed categories only; no prohibited verticals | 반려 |
| 7 | **판매자 소개글** | No exaggeration; no off-platform contact | 보완/반려 |
| 8 | **대표 상품** | Sample listing meets product checklist quality | 보완 |
| 9 | **CS 응대 가능** | Stated hours / response SLA acceptable | 보완 |
| 10 | **배송 처리 가능** | Shipping method & region stated | 보완 |
| 11 | **금지상품 위험** | No history/ intent to sell prohibited goods | 반려 |
| 12 | **외부 거래 유도** | No “카톡 주문”, direct payment bypass | **반려** |
| 13 | **리뷰/평판** | No fraud pattern (placeholder — mock era) | 보류 |

---

## Code checklist mapping (in-app)

| Doc item | `SELLER_REVIEW_CHECKLIST` key |
|----------|------------------------------|
| 사업자번호 | `business_number_provided` |
| 대표자명 | `representative_name_provided` |
| 정산 계좌 | `settlement_account_provided` |
| 사업자등록증 | `business_registration_document` |
| 카테고리 | `category_confirmed` |
| 금지상품 | `prohibited_products_cleared` |
| 배송 | `shipping_capability_confirmed` |
| CS | `cs_capability_confirmed` |
| 정산 검증 | `settlement_info_verified` |
| 약관 동의 | `policy_agreement_confirmed` |

---

## Documents to verify (placeholder)

| Document | Status |
|----------|--------|
| 사업자등록증 | URL in seller profile / admin review |
| 통신판매업 신고증 | optional upload — TBD |
| 통장 사본 | settlement verify — TBD |

---

## Admin procedure

1. `/admin/sellers` — pending queue  
2. Open `/admin/sellers/[id]/review`  
3. Complete checklist toggles + document review  
4. Approve / reject with [CELLOH_REJECTION_REASON_TEMPLATES.md](./CELLOH_REJECTION_REASON_TEMPLATES.md)  
5. Seller sees status on `/seller/pending`, `/seller/rejected`, `/seller/dashboard`

---

## Post-approval monitoring

| Signal | Action |
|--------|--------|
| High refund rate | warning → `suspended` review |
| Policy violation listing | product reject + seller strike |
| CS SLA breach | admin notice |

See [CELLOH_SELLER_ENFORCEMENT_POLICY.md](./CELLOH_SELLER_ENFORCEMENT_POLICY.md)

---

## Test routes

- `/admin/sellers`  
- `/admin/sellers/{id}/review`  
- `/sellers/moon-fruit` (public profile after approve)

---

## Related

- [CELLOH_PRODUCT_REVIEW_CHECKLIST.md](./CELLOH_PRODUCT_REVIEW_CHECKLIST.md)  
- [CELLOH_BUSINESS_INFO_DISPLAY_PLAN.md](./CELLOH_BUSINESS_INFO_DISPLAY_PLAN.md)
