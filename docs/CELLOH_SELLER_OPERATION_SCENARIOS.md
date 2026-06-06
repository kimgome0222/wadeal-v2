# CELLOH Seller Operation Scenarios

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** 판매자센터 QA — mock/local state 중심

**Related:** `docs/CELLOH_SELLER_ONBOARDING_GUIDE.md`, `docs/CELLOH_SELLER_MESSAGE_TEMPLATES.md`

---

## Scenario summary

| # | Scenario | Route | Status | Mock | DB needed (future) |
|---|----------|-------|--------|------|-------------------|
| 1 | 입점 신청 | `/seller/apply` | ✅ | ✅ form submit | applications table |
| 2 | 상품 등록 요청 | `/seller/products/new` | ✅ | ✅ | product_requests |
| 3 | 반려 후 수정 | `/seller/product-requests` | ✅ | ✅ badges | admin workflow |
| 4 | 주문 확인 | `/seller/orders` | ✅ | ✅ panel | orders read |
| 5 | 배송 처리 | `/seller/orders/[id]` | ✅ | ✅ local | tracking update |
| 6 | 문의 답변 | `/seller/inquiries` | ✅ | ✅ | Q&A DB |
| 7 | 리뷰 답글 | `/seller/reviews` | ✅ | ✅ | reviews reply |
| 8 | 정산 확인 | `/seller/finance/settlements` | ✅ | ✅ | settlements |
| 9 | 정책 위반 | `/seller/suspended`, `/seller/notices` | ✅ | partial | enforcement |

---

## 1. 입점 신청

| Item | Detail |
|------|--------|
| **Route** | `/seller/apply` → `/seller/pending` |
| **Required state** | 비로그인/미승인 seller |
| **Buttons** | 제출, 약관 동의 |
| **Mock** | `SellerOnboardingMockForm` — no DB |
| **Future** | 사업자 API, file upload, admin review |

**Priority:** P0 (flow), P2 (real approval)

---

## 2. 상품 등록 요청

| Item | Detail |
|------|--------|
| **Route** | `/seller/products/new` → `/seller/product-requests` |
| **Required state** | approved seller (or mock env) |
| **Buttons** | 검수 요청 submit |
| **Mock** | `SellerProductRequestMockForm` |
| **Future** | storage, admin `/admin/product-requests` |

**Priority:** P0

---

## 3. 상품 반려 후 수정

| Item | Detail |
|------|--------|
| **Route** | `/seller/product-requests` |
| **Status badges** | 작성중 / 검수요청 / 승인대기 / 반려 / 승인완료 |
| **Buttons** | 수정, 재신청 |
| **Mock** | `SellerProductRequestsMockList` |
| **Notification** | `product_rejected`, `product_approved` |

**Priority:** P1

---

## 4. 주문 확인

| Item | Detail |
|------|--------|
| **Route** | `/seller/orders` |
| **Buttons** | 주문 상세 |
| **Mock** | `SellerOrdersMockPanel` when empty |
| **Notification** | `new_order` |

**Priority:** P0

---

## 5. 배송 처리

| Item | Detail |
|------|--------|
| **Route** | `/seller/orders/[id]` |
| **Buttons** | 송장 등록, 택배사 |
| **Mock** | local state |
| **Future** | customer `shipping_started` notification |

**Priority:** P0

---

## 6. 문의 답변

| Item | Detail |
|------|--------|
| **Route** | `/seller/inquiries` (alias `/seller/questions`) |
| **SLA** | 48h (doc) |
| **Mock** | `SellerInquiriesMockPanel` |
| **Notification** | `new_inquiry`, `inquiry_sla_warning` |

**Priority:** P1

---

## 7. 리뷰 답글

| Item | Detail |
|------|--------|
| **Route** | `/seller/reviews`, `/seller/cs-reviews` |
| **Mock** | `SellerReviewsMockPanel` |
| **Notification** | `new_review` |

**Priority:** P2

---

## 8. 정산 확인

| Item | Detail |
|------|--------|
| **Route** | `/seller/finance/settlements` (redirect from `/seller/settlements`) |
| **Mock** | `SellerSettlementsMockPanel` |
| **Notification** | `settlement_confirmed`, `settlement_paid` |
| **Future** | real payout |

**Priority:** P1

---

## 9. 정책 위반 알림

| Item | Detail |
|------|--------|
| **Route** | `/seller/notices`, `/seller/policies`, `/seller/suspended` |
| **Mock** | notice list + policy cards |
| **Notification** | `policy_update` |
| **Future** | automated suspension |

**Priority:** P2

---

## Seller route smoke

```bash
# manual (dev server)
/seller/dashboard  /seller/apply  /seller/products/new
/seller/orders  /seller/inquiries  /seller/finance/settlements
/seller/help  /seller/policies
```

---

## Related

- [CELLOH_SELLER_CENTER_CHECKLIST.md](./CELLOH_SELLER_CENTER_CHECKLIST.md)
- [CELLOH_QA_SCENARIO_INDEX.md](./CELLOH_QA_SCENARIO_INDEX.md)
