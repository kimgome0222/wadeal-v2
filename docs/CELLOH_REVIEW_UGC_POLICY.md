# CELLOH Review & UGC Policy

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Status:** Operations draft — **no review DB / payout / moderation logic changes**

**Related:** [CELLOH_REVIEW_QNA_REPORT_POLICY.md](./CELLOH_REVIEW_QNA_REPORT_POLICY.md), [CELLOH_REVIEW_POLICY.md](./CELLOH_REVIEW_POLICY.md), `/policies/review`

**Code:** `lib/reviews/review-rules.ts`, `lib/reviews/review-report-reasons.ts`, `lib/data/reviews.ts`

---

## Purpose

Define who can write reviews, what content is allowed, how moderation works, and placeholder reward rules — to increase product trust without fake social proof.

---

## Eligibility

| Rule | Policy |
|------|--------|
| **구매자만 작성** | Logged-in user who purchased the SKU |
| **작성 시점** | `shipping_status=confirmed` (구매 확정) — delivered alone insufficient until confirmed |
| **작성 기간** | **15 days** after `confirmedAt` (`REVIEW_WINDOW_DAYS`) |
| **1주문 1리뷰** | One review per order line / product (policy TBD per variant) |

**Status codes:** `writable` · `completed` · `expired` · `awaiting_confirmation` — see `getReviewWriteStatus()`

---

## Photo reviews (사진 리뷰)

| Item | Standard |
|------|----------|
| Purpose | Show actual product received |
| Count | Max **5** images (`REVIEW_IMAGE_MAX_COUNT`) — mock uploader today |
| Content | Product only — no IDs, receipts with PII, unrelated ads |
| Moderation | Blur/remove on report; admin `/admin/review-reports` |
| Best review boost | Photo + verified purchase weighted in `getFeaturedBestReviews()` |

⏳ Production upload/storage — `lib/supabase/review-images-storage.ts` (not wired in overnight scope)

---

## Star rating (별점)

| Stars | Meaning |
|-------|---------|
| 1 | Very dissatisfied |
| 2 | Dissatisfied |
| 3 | Neutral |
| 4 | Satisfied |
| 5 | Very satisfied |

- Required on submit (default 5 in UI — user must change if unhappy)
- Average shown on PDP summary + product cards (mock fallback when no DB count)

---

## Best review selection (베스트 리뷰)

Scoring (mock UI — `lib/reviews/review-sort.ts`):

| Factor | Weight |
|--------|--------|
| Helpful likes | High |
| Star rating | Medium |
| Photo attached | Bonus |
| Verified purchase badge | Bonus |
| Top like count tie | `getBestReviewIds()` |

Featured section: max **3** reviews on PDP (`ReviewBestSection`)

---

## Seller reply (판매자 답글)

| Rule | Detail |
|------|--------|
| Who | Approved seller for the product |
| When | After review published |
| Tone | Polite, factual — see [CELLOH_SELLER_REVIEW_REPLY_GUIDE.md](./CELLOH_SELLER_REVIEW_REPLY_GUIDE.md) |
| Edit/delete | Seller can hide reply; admin can remove |
| SLA | Encourage response within **2 business days** (ops target) |

**UI:** `/seller/reviews/[id]`, `SellerReviewReplyForm`

---

## Edit / delete (수정·삭제)

| Actor | Action |
|-------|--------|
| **Author** | Edit rating/text within window (if implemented); delete own review |
| **Seller** | Reply only — not delete buyer review |
| **Admin** | Hide, delete, restore — `/admin/reviews` |
| **After report** | Content frozen pending review (placeholder) |

**Code:** `submitReviewUpdateAction`, `submitReviewDeleteAction` on PDP `ReviewCard`

---

## Report (신고)

| Item | Policy |
|------|--------|
| Who | Any logged-in user (not own review spam) |
| How | In-card report modal on PDP; general `/reports` mock form |
| Reasons | `REVIEW_REPORT_REASONS` — spam, abuse, false, privacy, etc. |
| Queue | `/admin/review-reports` |
| Outcome | Hide review, warn seller/buyer, no action |

⏳ Auto-enforcement not implemented — manual admin queue

---

## Prohibited content

| Category | Examples | Action |
|----------|----------|--------|
| **허위/대가성** | Paid review, uncompensated fake | Remove + seller sanction |
| **개인정보** | Phone, address, full name | Mask/remove |
| **욕설/비방** | Hate, harassment | Remove + warn |
| **광고성** | External links, competitor promo | Remove |
| **관 irrelevant** | Wrong product, shipping rant only | Redirect to CS ticket |

**Legal:** Align with `/policies/review` and [CELLOH_SELLER_ENFORCEMENT_POLICY.md](./CELLOH_SELLER_ENFORCEMENT_POLICY.md)

---

## Rewards placeholder (포인트/쿠폰)

| Event | Reward (placeholder) | Status |
|-------|---------------------|--------|
| Text review | TBD points | ❌ not auto-granted |
| Photo review | TBD bonus points | ❌ not auto-granted |
| Best review pick | TBD coupon | ❌ manual ops |

See [CELLOH_COUPON_POINT_POLICY.md](./CELLOH_COUPON_POINT_POLICY.md) — **no payout implementation in this task**

---

## UI routes (reference)

| Surface | Route |
|---------|-------|
| PDP reviews | `/product/[id]` → `#product-reviews` |
| Policy | `/policies/review` |
| Mypage hub | `/mypage/reviews` |
| Report | `/reports` (`/support/report` redirects) |
| Seller | `/seller/reviews`, `/seller/cs-reviews` |
| Admin | `/admin/reviews`, `/admin/review-reports` |

---

## Hold items

- Real review persistence enforcement at scale
- Automated paid-review detection
- Point/coupon accrual on submit
- ML toxicity filter

**No review save logic, payout, or report processing changed in this task.**
