# CELLOH Product Review Checklist

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** Admin ops draft — **no approval DB changes in this task**

**Related:** [CELLOH_STATUS_VALUES.md](./CELLOH_STATUS_VALUES.md), [CELLOH_REJECTION_REASON_TEMPLATES.md](./CELLOH_REJECTION_REASON_TEMPLATES.md), [CELLOH_PRODUCT_COPY_GUIDE.md](./CELLOH_PRODUCT_COPY_GUIDE.md)

**Code:** `lib/products/review-checklist.ts`, `components/admin-product-review-checklist.tsx`, `lib/data/category-review-rules.ts`

**Admin UI:** `/admin/products`, `/admin/product-requests`, `/admin/products/[id]/edit`

---

## Verdict options (판정)

| Verdict | Meaning | Typical next status |
|---------|---------|---------------------|
| **승인** | All required checks pass | `approved` → seller `published` |
| **수정 요청** | Fixable issues — resubmit | stays `review_requested` or `rejected` with reason |
| **반려** | Policy violation / prohibited | `rejected` |
| **보류** | Need external verify (cert, legal) | `review_requested` + internal note |

**Status flow:** `draft` → `review_requested` → `approved` | `rejected` → `published` | `hidden` | `sold_out`

See [CELLOH_STATUS_VALUES.md § Product lifecycle](./CELLOH_STATUS_VALUES.md#product-lifecycle).

---

## Checklist items

| # | Item | Pass criteria | Fail → |
|---|------|---------------|--------|
| 1 | **상품명 적절성** | No exaggeration, no prohibited terms, matches product | 수정/반려 |
| 2 | **대표 이미지 품질** | Clear, no watermark, not misleading, min resolution | 수정/반려 |
| 3 | **상세 이미지 품질** | Shows actual product; consistent with title | 수정 |
| 4 | **가격/원가/할인율** | Sale ≤ original; discount math correct; no fake “최저가” | 수정/반려 |
| 5 | **상품 설명 충실도** | Spec, size, quantity, material, usage | 수정 |
| 6 | **카테고리 적합성** | Correct category/sub; category rules met | 수정/반려 |
| 7 | **배송비/무료배송** | Fee or threshold stated; matches seller capability | 수정 |
| 8 | **교환/반품 정책** | Aligns with `/policies/refund`; category exceptions noted | 수정 |
| 9 | **원산지/제조사/인증** | Required for category (food, kids, electronics…) | 보류/반려 |
| 10 | **유통기한/소비기한** | Fresh/expiry products show dates or shelf-life info | 수정/반려 |
| 11 | **과장광고 표현** | No `100%`, `완치`, `최저가 보장`, etc. | 수정/반려 |
| 12 | **금지상품 여부** | Not in prohibited list | **반려** |
| 13 | **이미지 저작권** | No obvious stock theft / brand misuse | 반려/보류 |
| 14 | **개인정보 노출** | No phone, Kakao ID, external contact in description/images | 수정/반려 |
| 15 | **외부거래 유도** | No “direct pay”, “DM for price”, off-platform links | **반려** |

---

## Code checklist mapping (in-app)

| Doc item | `PRODUCT_REVIEW_CHECKLIST` key |
|----------|-------------------------------|
| 금지상품 | `prohibited_products_cleared` |
| 카테고리 | `category_requirements_met` |
| 인증/서류 | `required_documents_verified` |
| 과장광고 | `exaggerated_claims_checked` |
| 가격·재고·배송 | `price_stock_shipping_verified` |

All five keys are **requiredForApproval** in code.

---

## Category-specific rules

Source: `lib/data/category-review-rules.ts` — per-category `warningKeywords`, required fields.

| Category type | Extra watch |
|---------------|-------------|
| Food | expiry, origin, storage |
| Beauty/health | no medical claims |
| Kids | safety cert placeholder |
| Electronics | KC/인증 placeholder |

---

## Admin procedure

1. Open product in `/admin/products` or queue in `/admin/product-requests`  
2. Complete in-app checklist (`AdminProductReviewChecklist`)  
3. Cross-check this doc for items not in UI  
4. Choose verdict → apply status + rejection template if needed  
5. Log in activity (future) / internal note  

---

## Test routes after policy change

- `/admin/products?approval=pending_review`  
- `/admin/product-requests`  
- `/product/{slug}` (customer view after publish)

---

## Related

- [PROHIBITED_PRODUCTS.md](./PROHIBITED_PRODUCTS.md)  
- [SELLER_PRODUCT_COMPLIANCE.md](./SELLER_PRODUCT_COMPLIANCE.md)  
- [CELLOH_SELLER_ENFORCEMENT_POLICY.md](./CELLOH_SELLER_ENFORCEMENT_POLICY.md)
