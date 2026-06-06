# CELLOH Review / Q&A / Report Policy

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Code:** `lib/reviews/review-rules.ts`, `lib/support/ticket-rules.ts`, `lib/reports/*`

---

## Reviews

### Eligibility (`lib/reviews/review-rules.ts`)

| Rule | Value |
|------|-------|
| Writer | Purchaser only (logged-in) |
| Timing | After `shipping_status=confirmed` OR delivered + confirmedAt |
| Window | **15 days** (`REVIEW_WINDOW_DAYS`) |
| Status | `writable`, `completed`, `expired`, `awaiting_confirmation` |

### Content

| Item | Policy |
|------|--------|
| Rating | 1–5 stars |
| Text | Required min length TBD |
| Photos | Placeholder uploader on write form |
| Points | Accrual placeholder — see coupon/point policy |

### Moderation

| Action | Trigger |
|--------|---------|
| 신고 | User report via `/reports` |
| 숨김 | Admin `/admin/review-reports` |
| 삭제 | Admin + seller dispute |

**Prohibited:** 욕설, 개인정보, 광고, 허위/조작

### UI routes

| Surface | Route | Status |
|---------|-------|--------|
| PDP reviews | `/product/[id]` inline section | ✅ |
| Policy notice | → `/policies/review` | ✅ |
| Mypage reviews | `/mypage/reviews` | ✅ tabs |
| Seller reviews | `/seller/reviews`, `/seller/cs-reviews` | ✅ |
| Admin | `/admin/reviews`, `/admin/review-reports` | ✅ |

---

## Product Q&A (문의)

### Types (`lib/support/ticket-rules.ts`)

`product`, `order`, `payment`, `shipping`, `refund`, `exchange`, `cancel`, `account`, `other`

### Product inquiry flow

| State | Customer | Seller |
|-------|----------|--------|
| 답변 대기 | Ticket `open` | `/seller/questions` |
| 답변 완료 | `answered` / `resolved` | Reply posted |
| 비공개 | `isPrivate` flag placeholder | — |

**Escalated:** `refund`, `cancel`, `exchange` → admin queue

### UI

| Route | Implementation |
|-------|----------------|
| PDP Q&A tab | ⏳ `ProductDetailTabs` built but unused on PDP |
| `/support/new` | Real ticket (auth) |
| `/support/contact` | Mock form |
| `/mypage/support` | User tickets |

---

## Reports (신고)

**Targets:** `product`, `review`, `seller`, `comment`  
**Route:** `/reports` — mock form, no backend persistence  
**Admin:** `/admin/review-reports` for review reports

### Processing states (placeholder)

| Status | Action |
|--------|--------|
| 접수 | Mock submit |
| 검토 중 | Admin queue |
| 조치 완료 | Hide content / warn seller |
| 기각 | No violation |

---

## Support ticket statuses

`open` → `in_progress` → `answered` → `resolved` → `closed`

Mock tickets in `lib/support/mock-customer-support-data.ts` use Korean labels: `received`, `in_progress`, `answered`

---

## Related docs

- `docs/CELLOH_REVIEW_POLICY.md` (summary)
- `/policies/review`
- `docs/CELLOH_CUSTOMER_SUPPORT_PLAN.md`
