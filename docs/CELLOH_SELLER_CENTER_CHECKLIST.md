# CELLOH Seller Center Checklist

**Date:** 2026-05-29  
**Branch:** `mobile-ui`

## Route Status

| Route | Status | Notes |
|-------|--------|-------|
| `/seller` | ✅ | → `/seller/dashboard` redirect |
| `/seller/dashboard` | ✅ | mock summary when !approved or mock env |
| `/seller/apply` | ✅ | DB form + mock onboarding form |
| `/seller/products` | ✅ | existing |
| `/seller/products/new` | ✅ | mock product form in mock env |
| `/seller/product-requests` | ✅ | mock list when empty |
| `/seller/orders` | ✅ | mock orders panel when empty |
| `/seller/reviews` | ✅ | mock reviews when empty |
| `/seller/inquiries` | ✅ | mock inquiries when empty |
| `/seller/questions` | ✅ | → `/seller/inquiries` |
| `/seller/cs-reviews` | ✅ | hub + mock when empty |
| `/seller/support` | ✅ | links to policies/notices |
| `/seller/settlements` | ✅ | → `/seller/finance/settlements` |
| `/seller/finance/settlements` | ✅ | mock when no records |
| `/seller/policies` | ✅ | guides + `/policies/*` links |
| `/seller/profile` | ✅ | → `/seller/settings` |
| `/seller/notices` | ✅ | existing |
| `/policies/seller` | ✅ | policy document |

## Mock Components

| Component | Purpose |
|-----------|---------|
| `SellerOnboardingMockForm` | 입점 신청 (no DB) |
| `SellerProductRequestMockForm` | 상품 등록 요청 |
| `SellerDashboardMockSummary` | 대시보드 summary cards |
| `SellerOrdersMockPanel` | 주문/배송 local state |
| `SellerReviewsMockPanel` | 리뷰 답글 mock |
| `SellerInquiriesMockPanel` | 문의 답변 mock |
| `SellerSettlementsMockPanel` | 정산 내역 mock |
| `SellerProductRequestsMockList` | 검수 상태 mock |

## Sidebar Menu

대시보드 · 입점 신청 · 상품 요청 · 등록 내역 · 주문/배송 · 문의·리뷰 · 정산 · 정책 · 공지 · 알림 · 설정

## Constraints Respected

- No DB schema/RLS changes
- No actual settlement processing
- No business verification API
- No file upload logic changes
- Mock/local state only

## Push

Not performed.
