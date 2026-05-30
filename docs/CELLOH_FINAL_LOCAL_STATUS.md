# CELLOH 최종 로컬 작업 상태

**작성일:** 2026-05-30  
**브랜치:** `mobile-ui` · **push 보류**

## 요약

**P0 Cart Flow + Home Layout + Category Duplication Fix** 완료 — 장바구니 아이콘 `/join-cart` 복구, PDP 구매하기 last-look 분리, 홈 쿠폰 배너 조건부 표시, 카테고리 하위 chip 중복 제거, 메인 섹션/rail 유지. lint/build PASS. **commit/push 하지 않음.**

## P0 수정 (2026-05-30, Cart Flow)

| 항목 | 상태 |
|------|------|
| cart icon → `/join-cart` (header/bottom/PDP) | ✅ |
| PDP 구매하기 → last-look sheet | ✅ |
| PDP 장바구니 → add-to-cart sheet | ✅ |
| Add-to-cart / Last-look 역할 분리 | ✅ |
| 홈 Goal Banner subtotal>0 조건부 | ✅ |
| CategorySubNav slug별 하위만 + emoji | ✅ |
| 홈 섹션 순서 / 2.5 rail | ✅ |
| lint / build | ✅ PASS |

## P0 수정 (2026-05-30, Header Sticky)

| 항목 | 상태 |
|------|------|
| sticky header z-[70] + category bar | ✅ |
| overflow-x-hidden sticky 부모 분리 | ✅ |
| HomeCommerceSwipeShell 제거 | ✅ |
| Hero / Quick Menu spacing | ✅ |

## Route (최종)

| 진입 | 목적지 |
|------|--------|
| 장바구니 아이콘 (header/bottom/PDP) | `/join-cart` |
| PDP **구매하기** | last-look sheet → **결제하기** → `/checkout/{slug}` 또는 `/join-cart` |
| PDP **장바구니** | add-to-cart sheet → `/join-cart` (바로가기) |
| `/cart-preview` | 직접 URL 접근 전용 (last-look page) |

## 누적 변경

- seller rail / category chip / PDP fixed CTA / join-cart promo / seller review rail
- P0 Header Sticky: app-buyer-layout, app-buyer-chrome, app-sticky-header, home-catalog
- P0 Cart Flow: cart-preview-trigger, cart-preview-sheet-context, product-detail-purchase-bar, category-sub-nav, bottom-navigation, home-commerce-goal-banner

**마지막 commit:** `673045a ui: CELLOH B-Mart UX full integration verification`

## 남은 P3

- SavedProductCard stepper
- logged-in cart vs guest localStorage dual sync
- 알림 DB 연동

**commit/push 하지 않음.**
