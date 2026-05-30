# CELLOH Promotion Operations Plan

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** Mock UI + ops docs — **no coupon issuance, no payment discount changes, no DB**

**Code:** `lib/promotions/*`, `lib/home/collection-data.ts`, `/admin/promotions`, `/mypage/coupons`

---

## Promotion catalog (summary)

| Promotion | Purpose | Exposure | Selection | Discount | Coupon | Cycle | Admin review | End condition |
|-----------|---------|----------|-----------|----------|--------|-------|--------------|---------------|
| 오늘의특가 | Daily urgency | Home rail, Quick Menu, `/collections/today-special` | Special price deals from catalog mock | Tier/listed price | Optional | Daily reset | ⏳ | Day end |
| 마감세일 | Close-out urgency | Home, Quick Menu, collection | `endingSoonDeals` | Listed price | Optional ending coupon mock | Daily 23:59 copy | ✅ copy review | Timer / sold out |
| 주말특가 | Weekend spike | Home, Quick Menu | `weekendDeals` | Listed price | Weekend coupon mock | Fri–Sun | ✅ | Weekend end |
| 쿠폰세일 | Coupon-driven basket | Home, Quick Menu, join-cart tier rail | `couponDeals` + mock coupon badge | Mock coupon price display | ✅ tier + product | Ongoing | ✅ | Campaign end |
| 셀로단독특가 | Exclusive assortment | Home Only Celloh rail | `onlyCellohDeals` | Bundle/exclusive mock | Rare | Rolling | ✅ seller SKU | Stock / campaign |
| 오늘의 최저가 | Price discovery | Home, `/collections/lowest` | 7-day mock lowest | Display only | No | Daily refresh mock | ✅ **no price guarantee** | Daily |
| 재구매율 높은 상품 | Social proof | Home, collection | Repurchase mock algo | None | Repurchase coupon optional | Weekly | ⏳ | Algorithm refresh |
| 카테고리 랭킹 | Category discovery | Home ranking, `/collections/ranking` | Popularity mock | None | No | Hourly mock | ⏳ | — |
| 셀로쿠폰 | Branded coupon event | Quick Menu, collection | Same as coupon deals | Mock coupon price | ✅ | Campaign | ✅ | Budget / date |
| 셀로 멤버십 | Subscription perks | `/membership`, Quick Menu | N/A (benefits page) | Membership coupons mock | ✅ planned | Monthly | ✅ legal/PG | Launch gate |
| 지인초대 혜택 | Acquisition | `/invite`, Quick Menu | Referral code | Signup + first purchase coupons mock | ✅ mock only | Always-on | ✅ fraud rules | Policy change |
| 신규 입점 판매자 | Seller launch | Home showcase, `/collections/new-sellers` | `NEW_SELLER_SHOWCASE` | None | Optional welcome | 30-day window | ✅ seller onboarding | Period end |
| 라이브커머스 | Future channel | `/collections/live` | Placeholder + recommended | TBD | TBD | Event-based | ✅ | Pre-launch hidden |

---

## Promotion details

### 오늘의특가

| Field | Detail |
|-------|--------|
| 목적 | 일일 구매 긴급감·재방문 유도 |
| 노출 위치 | 홈 rail, Quick Menu, `/collections/today-special` |
| 상품 선정 기준 | mock catalog `specialPriceDeals` · 운영팀 일일 선정 (future) |
| 할인 방식 | 기존 판매가 대비 특가 표시 |
| 쿠폰 적용 | 선택 (tier 쿠폰 병행 가능) |
| 운영 주기 | 매일 00:00–23:59 |
| 관리자 검수 | ⏳ SKU·마진 검수 (future `/admin/promotions`) |
| 종료 조건 | 당일 종료 · 품절 시 카드 숨김 |

### 마감세일

| Field | Detail |
|-------|--------|
| 목적 | 마감 임박 구매 전환 |
| 노출 위치 | 홈 rail, Quick Menu, `/collections/ending-sale` |
| 상품 선정 기준 | `endingSoonDeals` mock |
| 할인 방식 | 마감 특가가 |
| 쿠폰 적용 | `LASTCALL5` 마감세일 쿠폰 mock |
| 운영 주기 | 일별 · 문구 "오늘 밤 11:59까지" |
| 관리자 검수 | ✅ 카피·종료 시각 검수 |
| 종료 조건 | 설정 시각 · 품절 |

### 주말특가

| Field | Detail |
|-------|--------|
| 목적 | 주말 트래픽·매출 집중 |
| 노출 위치 | 홈 rail, Quick Menu, `/collections/weekend-special` |
| 상품 선정 기준 | `weekendDeals` |
| 할인 방식 | 주말 한정가 |
| 쿠폰 적용 | `WEEKEND7` mock |
| 운영 주기 | 금–일 (mock 가정) |
| 관리자 검수 | ✅ |
| 종료 조건 | 주말 종료 |

### 쿠폰세일

| Field | Detail |
|-------|--------|
| 목적 | 쿠폰 적용가로 장바구니 확대 |
| 노출 위치 | 홈, Quick Menu, `/collections/coupon-sale`, join-cart tier rail |
| 상품 선정 기준 | `couponDeals` + 쿠폰 badge |
| 할인 방식 | mock 쿠폰가 표시 |
| 쿠폰 적용 | ✅ tier + 상품 쿠폰 |
| 운영 주기 | 상시·캠페인 |
| 관리자 검수 | ✅ |
| 종료 조건 | 캠페인 종료 · 예산 소진 |

### 셀로단독특가

| Field | Detail |
|-------|--------|
| 목적 | celloh 전용 구성·차별화 |
| 노출 위치 | 홈 Only Celloh rail, `/collections/only-celloh` |
| 상품 선정 기준 | `onlyCellohDeals` · 판매자 단독 SKU |
| 할인 방식 | 번들·단독 구성 mock |
| 쿠폰 적용 | 드물게 |
| 운영 주기 | 롤링 |
| 관리자 검수 | ✅ 판매자·법무 |
| 종료 조건 | 재고·캠페인 |

### 오늘의 최저가

| Field | Detail |
|-------|--------|
| 목적 | 가격 탐색·비교 쇼핑 |
| 노출 위치 | 홈, `/collections/lowest` |
| 상품 선정 기준 | 7일 mock 최저가 알고리즘 |
| 할인 방식 | 표시만 (가격 보장 없음) |
| 쿠폰 적용 | 없음 |
| 운영 주기 | 일별 refresh mock |
| 관리자 검수 | ✅ **최저가 보장 문구 금지** |
| 종료 조건 | 일별 갱신 |

### 재구매율 높은 상품

| Field | Detail |
|-------|--------|
| 목적 | 신뢰·재구매 유도 |
| 노출 위치 | 홈, `/collections/repurchase` |
| 상품 선정 기준 | mock 재구매율 seed |
| 할인 방식 | 없음 (재구매 쿠폰 optional) |
| 쿠폰 적용 | `REBUY2K` optional |
| 운영 주기 | 주간 |
| 관리자 검수 | ⏳ |
| 종료 조건 | 알고리즘 갱신 |

### 카테고리 랭킹

| Field | Detail |
|-------|--------|
| 목적 | 카테고리별 발견 |
| 노출 위치 | 홈 ranking, `/collections/ranking` |
| 상품 선정 기준 | 인기 mock |
| 할인 방식 | 없음 |
| 쿠폰 적용 | 없음 |
| 운영 주기 | 시간별 mock |
| 관리자 검수 | ⏳ |
| 종료 조건 | — |

### 셀로쿠폰

| Field | Detail |
|-------|--------|
| 목적 | 브랜드 쿠폰 이벤트 |
| 노출 위치 | Quick Menu, `/collections/celloh-coupon` |
| 상품 선정 기준 | 쿠폰 적용 가능 SKU |
| 할인 방식 | mock 쿠폰가 |
| 쿠폰 적용 | ✅ |
| 운영 주기 | 캠페인 |
| 관리자 검수 | ✅ |
| 종료 조건 | 예산·기간 |

### 셀로 멤버십 혜택

| Field | Detail |
|-------|--------|
| 목적 | 구독·LTV |
| 노출 위치 | `/membership`, Quick Menu |
| 상품 선정 기준 | N/A (혜택 페이지) |
| 할인 방식 | 멤버십 쿠폰·특가 mock |
| 쿠폰 적용 | ✅ (준비 중) |
| 운영 주기 | 월 구독 (future) |
| 관리자 검수 | ✅ PG·법무 |
| 종료 조건 | 서비스 런칭 게이트 |

### 지인초대 혜택

| Field | Detail |
|-------|--------|
| 목적 | 신규 유저 획득 |
| 노출 위치 | `/invite`, Quick Menu, `/mypage/invite` |
| 상품 선정 기준 | referral code |
| 할인 방식 | 가입·첫구매 쿠폰 mock |
| 쿠폰 적용 | ✅ mock only |
| 운영 주기 | 상시 |
| 관리자 검수 | ✅ 부정이용 규칙 |
| 종료 조건 | 정책 변경 |

### 신규 입점 판매자 기획전

| Field | Detail |
|-------|--------|
| 목적 | 신규 판매자 노출 |
| 노출 위치 | 홈 showcase, `/collections/new-sellers` |
| 상품 선정 기준 | `NEW_SELLER_SHOWCASE` |
| 할인 방식 | 없음 (welcome 쿠폰 optional) |
| 쿠폰 적용 | optional |
| 운영 주기 | 입점 후 30일 |
| 관리자 검수 | ✅ 온보딩 |
| 종료 조건 | 기간 만료 |

### 라이브커머스 (준비 중)

| Field | Detail |
|-------|--------|
| 목적 | 실시간 커머스 채널 |
| 노출 위치 | `/collections/live` (hidden admin status) |
| 상품 선정 기준 | placeholder + 추천상품 |
| 할인 방식 | TBD |
| 쿠폰 적용 | TBD |
| 운영 주기 | 이벤트 |
| 관리자 검수 | ✅ pre-launch |
| 종료 조건 | 런칭 전 숨김 |

---

## Admin operations

| Route | Status |
|-------|--------|
| `/admin/promotions` | ✅ Mock list (예정/진행중/종료/숨김) |
| `/admin/coupons` | ✅ DB or mock fallback |
| `/admin/events` | ✅ Existing 기획전 (Supabase when configured) |

Mock promotion fields: name, period, product count, coupon flag, placements, preview link.

---

## Coupon types (mock catalog)

See `lib/promotions/mock-coupon-catalog.ts`:

- 장바구니 금액 (tier TIER30K)
- 상품 (FOOD10)
- 친구추천 (INVITE3K)
- 멤버십 (MEMSHIP-FREE — scheduled)
- 첫구매 (FIRST5K)
- 재구매 (REBUY2K)
- 주말 (WEEKEND7)
- 마감세일 (LASTCALL5)

Attributes: discount, min order, max discount, validity, categories, products, stackable, issuance/usage counts, status.

---

## Buyer touchpoints

| Surface | Link |
|---------|------|
| Join cart tier auto-apply | `/join-cart` + `JoinCartCouponNotice` |
| Mypage coupon wallet mock | `/mypage/coupons`, `/mypage/benefits` |
| Policy | `docs/CELLOH_COUPON_POINT_POLICY.md`, `/policies/payment` |

---

## Constraints (this task)

- ❌ Real coupon DB issuance
- ❌ Payment discount logic changes
- ❌ Point accrual
- ✅ Mock UI, docs, admin preview

---

## Related

- `docs/CELLOH_PROMOTION_DISPLAY_RULES.md`
- `docs/CELLOH_REFERRAL_REWARD_POLICY.md`
- `docs/CELLOH_COUPON_POINT_POLICY.md`
