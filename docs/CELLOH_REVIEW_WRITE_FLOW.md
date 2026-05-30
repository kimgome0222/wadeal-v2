# CELLOH Review Write Flow

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Status:** UX flow reference — **no upload/payout implementation**

**Related:** [CELLOH_REVIEW_UGC_POLICY.md](./CELLOH_REVIEW_UGC_POLICY.md), [CELLOH_REVIEW_DISPLAY_RULES.md](./CELLOH_REVIEW_DISPLAY_RULES.md)

**Code:** `components/mypage-reviews-content.tsx`, `components/product-reviews-section.tsx`, `lib/mypage/review-hub-data.ts`

---

## Entry points

| Path | Route | When |
|------|-------|------|
| **마이페이지 → 나의 리뷰** | `/mypage/reviews` | Primary hub |
| **PDP 후기 탭** | `/product/[id]#product-reviews` | Direct write if eligible |
| **Order complete nudge** | notification `review_available` (future) | Post confirm |

---

## Mypage tabs

| Tab | Label | Content |
|-----|-------|---------|
| `writable` | 작성 가능 | Orders with `getReviewWriteStatus === writable` |
| `written` | 작성 완료 | Submitted reviews with link to product |
| `expired` | 기간 만료 (mock) | Expired / awaiting items for transparency |

**Header copy:** "구매 확정 후 15일 이내에 리뷰를 작성할 수 있어요."  
**Policy link:** `/policies/review`

---

## Writable item card

Each item shows:

- Product name + thumbnail
- Order date / confirm date
- Deadline string from `formatReviewDeadline(order)`
- CTA → PDP reviews with write form open (or inline link)

**Status badges:** green (writable), orange (deadline soon — future), gray (completed/expired)

---

## Write form (PDP)

Shown when `canWriteReview && writeStatus === writable`.

### Steps

1. **작성 전 안내** — `ProductReviewPolicyNotice` (eligibility, 15-day window, prohibited content)
2. **별점 선택** — 1–5 tap stars (default 5)
3. **텍스트 입력** — textarea, min length TBD at launch
4. **사진 첨부 (placeholder)** — file input → `uploadReviewImageAction` mock path; max 5 images
5. **상품 옵션 표시** — product name + deal title (variant/options TBD)
6. **Submit** — `submitReviewAction` → success message → refresh

### Blocked states

| Status | User message |
|--------|--------------|
| `awaiting_confirmation` | 구매 확정 후 작성 가능 |
| `expired` | 작성 기간이 지났어요 |
| `completed` | 이미 작성한 리뷰 |
| Not logged in | Login gate (no form) |

---

## After submit

| Item | Behavior (today) |
|------|------------------|
| UI feedback | Success banner on PDP |
| List refresh | `router.refresh()` |
| **포인트 지급** | ⏳ placeholder copy only — **not implemented** |
| **쿠폰 지급** | ⏳ placeholder — photo review bonus TBD |

Example placeholder (do not show as guaranteed):

> 리뷰 작성 혜택은 운영 정책에 따라 지급될 예정이에요.

---

## Edit / delete (author)

From `ReviewCard` on PDP when `currentUserId === review.userId`:

- **수정** — inline edit rating + text → `submitReviewUpdateAction`
- **삭제** — confirm modal → `submitReviewDeleteAction`

Window: same 15-day policy as write (enforce on server at launch)

---

## Forbidden in this task

- ❌ Real file upload to production bucket wiring
- ❌ Real points/coupon grant on submit
- ❌ New write route outside existing PDP/mypage flow

---

## QA checklist

- [ ] `/mypage/reviews` — three tabs render
- [ ] `/product/1` — reviews section, sort chips, photo filter
- [ ] Policy link `/policies/review` — 200
- [ ] Write form hidden when not eligible
- [ ] Photo upload shows error gracefully (mock)

**Routes verified in build:** `/mypage/reviews`, `/product/[id]`, `/policies/review`
