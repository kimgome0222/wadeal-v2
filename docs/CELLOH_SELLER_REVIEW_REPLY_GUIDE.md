# CELLOH Seller Review Reply Guide

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Status:** Seller CS copy reference — **no reply logic changes**

**Related:** [CELLOH_REVIEW_UGC_POLICY.md](./CELLOH_REVIEW_UGC_POLICY.md), [CELLOH_CS_REPLY_TEMPLATES.md](./CELLOH_CS_REPLY_TEMPLATES.md)

**UI:** `/seller/reviews`, `/seller/reviews/[id]`, `SellerReviewReplyForm`

---

## Tone principles

| Do | Don't |
|----|-------|
| Thank the customer first | Blame the buyer |
| Acknowledge specific feedback | Copy-paste generic spam |
| Offer next step (CS, exchange) | Promise refunds outside policy |
| Keep it short (2–4 sentences) | Long defensive essays |
| Use "저희" / store name | Impersonate celloh platform |

---

## Template: 감사 답글 (positive review)

**When:** 4–5 stars, no complaint

> 소중한 후기 감사합니다. `{productName}`을(를) 만족스럽게 사용해 주셔서 기쁩니다. 앞으로도 좋은 상품으로 찾아뵙겠습니다.

---

## Template: 불만 리뷰 (service attitude)

**When:** Low stars, vague dissatisfaction

> 소중한 후기 감사합니다. 말씀해주신 부분은 상품·서비스 개선에 참고하겠습니다. 불편을 드려 죄송합니다. 추가로 도움이 필요하시면 판매자 문의 또는 celloh 고객센터로 연락 주세요.

---

## Template: 배송 문제

**When:** Late ship, damaged box (courier)

> 배송 과정에서 불편을 드려 죄송합니다. 확인 후 택배사/출고 상태를 점검하겠습니다. `{orderId}` 주문 건으로 문의 주시면 빠르게 안내드리겠습니다.

**Note:** Do not share other customers' order info in public reply.

---

## Template: 상품 불량

**When:** Defect, wrong item, quality issue

> 불편을 드려 정말 죄송합니다. `{productName}` 불량/오배송 건은 사진과 함께 고객센터 또는 주문 문의로 접수해 주시면 교환·환불 가능 여부를 안내드리겠습니다.

---

## Template: 교환/환불 안내

**When:** Customer asks return in review

> 리뷰 확인했습니다. 교환·환불은 celloh 및 판매자 정책에 따라 진행됩니다. `/policies/refund` 안내를 참고해 주시고, 마이페이지 주문 상세에서 문의 접수해 주시면 순서대로 도와드리겠습니다.

*(Public reply: avoid raw URL — say "환불·교환 정책 페이지" in production)*

---

## Forbidden expressions (금지 표현)

| Category | Examples |
|----------|----------|
| Blame | "구매자 잘못", "알아보고 사세요" |
| Off-platform | "카톡으로 연락", "010-xxxx", Instagram DM |
| Legal risk | "100% 환불 보장" (unverified) |
| Competitor | Naming other malls negatively |
| Personal data | Asking for card number, password |

---

## Privacy & contact rules

| Rule | Detail |
|------|--------|
| **개인정보 요청 금지** | No phone/email in public reply |
| **외부 연락 유도 금지** | All post-sale contact via celloh messaging / CS |
| **주문번호** | Mask in public reply; full ID in seller console only |

---

## Reply workflow (seller)

1. `/seller/reviews` — filter unanswered  
2. Open `/seller/reviews/[id]`  
3. Draft in `SellerReviewReplyForm`  
4. Save → `saveSellerReviewReplyAction`  
5. Hide mistake → `hideSellerReviewReplyAction`

**SLA target:** 2 business days (ops — not automated)

---

## Escalation

| Situation | Action |
|-----------|--------|
| Threats / hate | Do not reply publicly; flag admin |
| Reported review | Wait for `/admin/review-reports` outcome |
| Refund dispute | Route to CS template in [CELLOH_CS_REPLY_TEMPLATES.md](./CELLOH_CS_REPLY_TEMPLATES.md) |

---

## Quick copy bank

| Situation | One-liner |
|-----------|-----------|
| Thanks | 소중한 후기 감사합니다. |
| Apology | 불편을 드려 죄송합니다. |
| Improvement | 말씀해주신 부분은 개선에 참고하겠습니다. |
| Next step | 고객센터/주문 문의로 접수해 주시면 확인 후 안내드리겠습니다. |

**No seller reply logic changed in this task.**
