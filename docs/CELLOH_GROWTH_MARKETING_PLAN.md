# CELLOH Growth & Marketing Plan (Draft)

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** Strategy doc — no ad spend or API integration in this task

---

## North star

**Seller-first discovery:** customers choose because they trust the seller and the story — not price alone.

Slogans: “누가 만들었는지 알고 사세요.” / “좋은 상품은 좋은 판매자에게서 시작됩니다.”

---

## First 100 sellers

| Tactic | Detail |
|--------|--------|
| Vertical focus | Food, living, beauty — strong storytellers |
| Onboarding | `/seller/apply`, white-glove first 20 |
| Incentive | 3-month fee-free (see revenue model draft) |
| Content | Seller story on PDP + `/sellers/[id]` |
| Social proof | “신규 입점” collection, `/collections/new-sellers` |
| Offline | Maker markets, Instagram DMs (ops) |

---

## First 1,000 customers

| Tactic | Detail |
|--------|--------|
| Referral | `/invite`, Kakao share (future) |
| First-purchase coupon | Mock FIRST5K |
| Today’s special | `/collections/today-special` |
| Trust UX | Seller card on PDP, reviews, policies |
| SEO | Category/collection pages |
| Retargeting | Email/Kakao (post-launch) |

---

## Channel mix

| Channel | Content |
|---------|---------|
| Instagram / TikTok | Seller behind-the-scenes, unboxing |
| Blog / Notion | Seller interviews, ranking methodology |
| Kakao | Referral, order/shipping alerts |
| In-app | Quick Menu, push (future) |

---

## In-product growth levers

| Lever | Route / component |
|-------|-------------------|
| 오늘의특가 | Home rail, daily refresh |
| 카테고리 랭킹 | `/collections/ranking` |
| 쿠폰세일 | Tier rail + `/join-cart` |
| 재구매 | `/collections/repurchase` |
| 장바구니 금액 맞추기 | `TierCouponFillRail`, progress bars |
| B마트식 담기 UX | +/stepper on cards, cart sheet |
| 마켓컬리식 신뢰 | Seller info, shipping summary, review policy |

---

## Review acquisition

- Prompt after delivery/confirm (`CELLOH_REVIEW_QNA_REPORT_POLICY.md`)  
- Photo review placeholder  
- Point incentive (placeholder — no accrual yet)  
- Seller response on `/seller/reviews`

---

## Retention

| Tactic | Implementation |
|--------|----------------|
| Reorder rail | Recent orders, repurchase collection |
| Membership | `/membership` (phase 2) |
| Following sellers | `/mypage/following-sellers` |
| Notifications | Order/shipping events |

---

## Metrics (KPI dashboard)

- DAU/MAU, conversion, AOV  
- Referral K-factor  
- Seller count, GMV per seller  
- Review rate, repurchase rate  

See [`CELLOH_ANALYTICS_KPI_PLAN.md`](./CELLOH_ANALYTICS_KPI_PLAN.md) and `/admin/dashboard` mock KPI cards.

---

## Related

| Doc | Topic |
|-----|-------|
| `CELLOH_PROMOTION_CALENDAR.md` | Weekly/seasonal ops |
| `CELLOH_RANKING_RECOMMENDATION_POLICY.md` | Ranking rules |
| `CELLOH_PROMOTION_OPERATIONS_PLAN.md` | Promotion catalog |
| `CELLOH_ANALYTICS_KPI_PLAN.md` | KPI & events |
| `CELLOH_LAUNCH_CHECKLIST.md` | Go-live gate |
| `CELLOH_ADMIN_OPERATIONS_CHECKLIST.md` | 추후 생성 |
