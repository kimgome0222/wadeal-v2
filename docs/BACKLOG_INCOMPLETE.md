# BACKLOG INCOMPLETE (505 items)

> 2026-05-27 · `docs/work-queue.json` → `backlog_incomplete[]`

| 구분 | 개수 |
|---|---|
| 채팅 user_query (W001~) | 188 |
| 기능/모듈 백로그 | 504 |
| **합계 추적 가능** | **692** |

## ID 접두사별

| prefix | count | 설명 |
|---|---|---|
| B | 6 | 인프라·git·deploy·database 블로커 |
| E | 7 | 알려진 에러 |
| PF | 6 | Push 실패 복구 (W007·W170·W173·W175–177) |
| N | 10 | 알림 기능 백로그 |
| S | 10 | 판매자 기능 백로그 |
| A | 10 | 관리자 기능 백로그 |
| P | 8 | 결제 기능 백로그 (레거시 P00x) |
| M | 10 | 마이페이지 백로그 |
| D | 10 | 문서·프로덕션 백로그 |
| V | 34 | 모듈 검증 (레거시) |
| G | 8 | 서브에이전트 작업 |
| MG | 46 | Migration 적용·검증 (파일별) |
| AP | 24 | Admin 페이지 검증 |
| SP | 16 | Seller 페이지 검증 |
| CP | 45 | 고객 페이지 검증 |
| AC | 31 | Server Action 검증 |
| LD | 52 | lib/data 모듈 검증 |
| API | 6 | API Route 검증 |
| NT | 40 | 알림 타입 연동 |
| RLS | 25 | RLS 정책 검증 |
| PAY | 46 | 결제 플로우 단계 |
| LP | 31 | lib/payments 모듈 검증 |
| LN | 10 | lib/notifications 모듈 검증 |
| LA | 13 | lib/auth 모듈 검증 |

## 영역별 (area)

| area | count |
|---|---|
| verification | 143 |
| payment | 90 |
| notifications | 61 |
| database | 47 |
| security | 40 |
| admin | 34 |
| mypage | 31 |
| seller | 31 |
| git | 9 |
| error | 7 |
| docs | 5 |
| prod | 4 |
| build | 1 |
| deploy | 1 |
| infra | 1 |

## 접두사별 목록 (lookup)

### B (6)

| ID | Status | Area | Title |
|---|---|---|---|
| B001 | failed | infra | npm run build 통과 |
| B002 | pending | git | unstaged 변경 정리 커밋 |
| B003 | failed | git | git push origin main |
| B004 | pending | deploy | npx vercel --prod |
| B005 | pending | database | Supabase migration 004-038 원격 적용 |
| B006 | unknown | build | notifySellerSettlementPaid 중복 확인 |

### E (7)

| ID | Status | Area | Title |
|---|---|---|---|
| E001 | failed | error | npm run build 미통과 |
| E002 | failed | error | admin-products ProductRow insert 필드 |
| E003 | failed | error | git push 실패 |
| E004 | failed | error | npx vercel --prod 보류 |
| E005 | failed | error | notifySellerSettlementPaid 중복 (사용자 보고) |
| E006 | failed | error | Supabase migration 원격 미적용 |
| E007 | failed | error | admin-products.ts MM 상태 |

### PF (7)

| ID | Status | Area | Title |
|---|---|---|---|
| PF001 | failed | git | Push 실패 복구: W007 |
| PF002 | failed | git | Push 실패 복구: W170 |
| PF003 | failed | git | Push 실패 복구: W173 |
| PF004 | failed | git | Push 실패 복구: W175 |
| PF005 | failed | git | Push 실패 복구: W176 |
| PF006 | failed | git | Push 실패 복구: W177 |
### N (10)

| ID | Status | Area | Title |
|---|---|---|---|
| N001 | pending | notifications | migration 038 원격 적용 |
| N002 | pending | notifications | new_product_question 연동 |
| N003 | pending | notifications | new_review 연동 |
| N004 | pending | notifications | seller_notice_published 연동 |
| N005 | pending | notifications | product_change_request admin |
| N006 | pending | notifications | settlement_pending admin |
| N007 | pending | notifications | prohibited_keyword_detected |
| N008 | pending | notifications | 알림 unread count UI 분리 검증 |
| N009 | pending | notifications | RLS 알림 정책 검증 |
| N010 | partial | notifications | 알림 통합 build+통합테스트 |

### S (10)

| ID | Status | Area | Title |
|---|---|---|---|
| S001 | pending | seller | /seller/reviews 리뷰 답글 |
| S002 | pending | seller | seller_notices 공지/자료실 |
| S003 | pending | seller | 입점 심사 체크리스트 |
| S004 | pending | seller | 금지상품/카테고리 검수 |
| S005 | pending | seller | 판매자 analytics 대시보드 |
| S006 | partial | seller | 판매자 정산 finance E2E |
| S007 | partial | seller | 판매자 송장 등록 E2E |
| S008 | partial | seller | 판매자 상품 검수 요청 |
| S009 | partial | seller | 판매자 onboarding 재신청 |
| S010 | partial | seller | /seller/notifications 검증 |

### A (10)

| ID | Status | Area | Title |
|---|---|---|---|
| A001 | pending | admin | Admin 주문 취소/환불/부분환불 UI |
| A002 | partial | admin | Admin orders [id] 액션 연결 |
| A003 | partial | admin | Admin settlements 판매자 정산 |
| A004 | partial | admin | Admin notifications 센터 |
| A005 | partial | admin | Admin product approval queue |
| A006 | partial | admin | Admin support escalated |
| A007 | partial | admin | Admin error logs 모니터링 |
| A008 | partial | admin | Admin sellers 입점 관리 |
| A009 | partial | admin | Admin review reports 처리 |
| A010 | partial | admin | Admin go-live checklist UI |

### P (8)

| ID | Status | Area | Title |
|---|---|---|---|
| P001 | pending | payment | Toss webhook secret 검증 |
| P002 | pending | payment | PAYMENT_STATUS_CHANGED Query API |
| P003 | pending | payment | Toss billing key 실연동 |
| P004 | partial | payment | 가상계좌 webhook E2E |
| P005 | partial | payment | 자동결제 post_deadline |
| P006 | partial | payment | payment_webhook_failed admin |
| P007 | partial | payment | 일반상품 즉시결제 checkout |
| P008 | partial | payment | 공동구매 마감 후 결제 |

### M (10)

| ID | Status | Area | Title |
|---|---|---|---|
| M001 | pending | mypage | Mypage 소셜 로그인 UX |
| M002 | pending | mypage | Mypage 클레임/취소환불 UX |
| M003 | pending | mypage | Mypage 페이지네이션 |
| M004 | pending | mypage | Mypage 휴대폰 인증 |
| M005 | partial | mypage | 고객 알림 /notifications |
| M006 | partial | mypage | 찜 saved_deals Supabase |
| M007 | partial | mypage | 최근본 recent_views DB |
| M008 | partial | mypage | join_cart DB |
| M009 | partial | mypage | support 문의/환불 |
| M010 | partial | mypage | identity verification |

### D (10)

| ID | Status | Area | Title |
|---|---|---|---|
| D001 | pending | docs | PROJECT_OVERVIEW 갱신 |
| D002 | pending | docs | DEVELOPER_HANDOFF 갱신 |
| D003 | partial | docs | GO_LIVE_CHECKLIST 실행 |
| D004 | partial | docs | MVP_SCOPE 확정 |
| D005 | partial | docs | PG 심사 준비 |
| D006 | partial | prod | production mock 차단 검증 |
| D007 | partial | prod | DEMO_LOGIN 프로덕션 차단 |
| D008 | partial | security | RLS 019 전체 검증 |
| D009 | pending | prod | PWA/SEO 개선 |
| D010 | partial | prod | 약관/개인정보/환불정책 |

### V (34)

| ID | Status | Area | Title |
|---|---|---|---|
| V001 | unknown | verification | 모듈 검증: checkout |
| V002 | unknown | verification | 모듈 검증: orders |
| V003 | unknown | verification | 모듈 검증: payments |
| V004 | unknown | verification | 모듈 검증: coupons |
| V005 | unknown | verification | 모듈 검증: points |
| V006 | unknown | verification | 모듈 검증: addresses |
| V007 | unknown | verification | 모듈 검증: shipping |
| V008 | unknown | verification | 모듈 검증: products |
| V009 | unknown | verification | 모듈 검증: deals |
| V010 | unknown | verification | 모듈 검증: price_tiers |
| V011 | unknown | verification | 모듈 검증: reviews |
| V012 | unknown | verification | 모듈 검증: support |
| V013 | unknown | verification | 모듈 검증: settlements |
| V014 | unknown | verification | 모듈 검증: suppliers |
| V015 | unknown | verification | 모듈 검증: sellers |
| V016 | unknown | verification | 모듈 검증: admin_dashboard |
| V017 | unknown | verification | 모듈 검증: admin_products |
| V018 | unknown | verification | 모듈 검증: admin_orders |
| V019 | unknown | verification | 모듈 검증: admin_coupons |
| V020 | unknown | verification | 모듈 검증: admin_settlements |
| V021 | unknown | verification | 모듈 검증: admin_support |
| V022 | unknown | verification | 모듈 검증: admin_reviews |
| V023 | unknown | verification | 모듈 검증: share_referral |
| V024 | unknown | verification | 모듈 검증: consents |
| V025 | unknown | verification | 모듈 검증: notification_settings |
| V026 | unknown | verification | 모듈 검증: saved_payment_methods |
| V027 | unknown | verification | 모듈 검증: webhook_logs |
| V028 | unknown | verification | 모듈 검증: error_logs |
| V029 | unknown | verification | 모듈 검증: activity_logs |
| V030 | unknown | verification | 모듈 검증: business_settings |
| V031 | unknown | verification | 모듈 검증: identity_verification |
| V032 | unknown | verification | 모듈 검증: seller_finance |
| V033 | unknown | verification | 모듈 검증: seller_orders |
| V034 | unknown | verification | 모듈 검증: tracking |

### G (8)

| ID | Status | Area | Title |
|---|---|---|---|
| G001 | partial | security | Security RLS audit harden |
| G002 | pending | mypage | Mypage 4 UX subagent |
| G003 | pending | seller | Seller reviews subagent |
| G004 | pending | seller | Seller notices subagent |
| G005 | pending | seller | Onboarding review subagent |
| G006 | pending | seller | Prohibited products subagent |
| G007 | partial | notifications | Unified notifications subagent |
| G008 | partial | seller | Settlement records subagent |

### MG (46)

| ID | Status | Area | Title |
|---|---|---|---|
| MG001 | pending | database | Migration 적용·검증: 001_initial_schema |
| MG002 | pending | database | Migration 적용·검증: 002_price_alerts_notify_columns |
| MG003 | pending | database | Migration 적용·검증: 003_price_alerts_kakao_notify_status |
| MG004 | partial | database | Migration 적용·검증: 004_alerts_table |
| MG005 | partial | database | Migration 적용·검증: 005_orders_table |
| MG006 | partial | database | Migration 적용·검증: 006_reviews_table |
| MG007 | partial | database | Migration 적용·검증: 007_review_reports_table |
| MG008 | partial | database | Migration 적용·검증: 008_admin_likes_report_status |
| MG009 | partial | database | Migration 적용·검증: 009_production_rls |
| MG010 | partial | database | Migration 적용·검증: 010_admin_products |
| MG011 | partial | database | Migration 적용·검증: 011_admin_orders_management |
| MG012 | partial | database | Migration 적용·검증: 012_product_images_storage |
| MG013 | partial | database | Migration 적용·검증: 013_price_tiers_jsonb |
| MG014 | partial | database | Migration 적용·검증: 014_order_status_system |
| MG015 | partial | database | Migration 적용·검증: 015_payments_table |
| MG016 | partial | database | Migration 적용·검증: 015_shipping_confirmation_flow |
| MG017 | partial | database | Migration 적용·검증: 016_reviews_production_system |
| MG018 | partial | database | Migration 적용·검증: 016_search_categories |
| MG019 | partial | database | Migration 적용·검증: 016_wishlist_recent_views_join_cart |
| MG020 | partial | database | Migration 적용·검증: 017_notifications_table |
| MG021 | partial | database | Migration 적용·검증: 017_review_images_storage |
| MG022 | partial | database | Migration 적용·검증: 017_share_referral_system |
| MG023 | partial | database | Migration 적용·검증: 018_suppliers_settlements |
| MG024 | partial | database | Migration 적용·검증: 018_support_tickets |
| MG025 | partial | database | Migration 적용·검증: 019_security_rls_hardening |
| MG026 | partial | database | Migration 적용·검증: 019_user_consents |
| MG027 | partial | database | Migration 적용·검증: 020_sellers_center |
| MG028 | partial | database | Migration 적용·검증: 021_product_payment_methods |
| MG029 | partial | database | Migration 적용·검증: 022_catalog_seed_columns |
| MG030 | partial | database | Migration 적용·검증: 022_webhook_logs |
| MG031 | partial | database | Migration 적용·검증: 023_saved_payment_methods |
| MG032 | partial | database | Migration 적용·검증: 024_product_approval |
| MG033 | partial | database | Migration 적용·검증: 025_inventory_limits |
| MG034 | partial | database | Migration 적용·검증: 026_coupons_points |
| MG035 | partial | database | Migration 적용·검증: 028_addresses_delivery |
| MG036 | partial | database | Migration 적용·검증: 029_identity_verification |
| MG037 | partial | database | Migration 적용·검증: 029_shipping_fees |
| MG038 | partial | database | Migration 적용·검증: 030_business_settings |
| MG039 | partial | database | Migration 적용·검증: 031_admin_activity_logs |
| MG040 | partial | database | Migration 적용·검증: 032_error_logs |
| MG041 | partial | database | Migration 적용·검증: 033_mypage_profile_fields |
| MG042 | partial | database | Migration 적용·검증: 034_seller_onboarding_reviews |
| MG043 | partial | database | Migration 적용·검증: 035_notifications_role_target |
| MG044 | partial | database | Migration 적용·검증: 036_seller_settlement_records |
| MG045 | partial | database | Migration 적용·검증: 037_shipping_tracking |
| MG046 | partial | database | Migration 적용·검증: 038_notifications_unified |

### AP (24)

| ID | Status | Area | Title |
|---|---|---|---|
| AP001 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/activity-logs |
| AP002 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/coupons/[id]/edit |
| AP003 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/coupons/new |
| AP004 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/coupons |
| AP005 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/dashboard |
| AP006 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/error-logs |
| AP007 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/go-live-readiness |
| AP008 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/notifications |
| AP009 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/orders |
| AP010 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/payments |
| AP011 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/products/[id]/edit |
| AP012 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/products/new |
| AP013 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/products |
| AP014 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/review-reports |
| AP015 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/reviews |
| AP016 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/sellers |
| AP017 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/settings/business |
| AP018 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/settlements/[id] |
| AP019 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/settlements |
| AP020 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/suppliers/[id]/edit |
| AP021 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/suppliers/new |
| AP022 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/suppliers |
| AP023 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/support/[id] |
| AP024 | pending | admin | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/admin/support |

### SP (16)

| ID | Status | Area | Title |
|---|---|---|---|
| SP001 | pending | seller | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/seller/apply |
| SP002 | pending | seller | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/seller/cs-reviews |
| SP003 | pending | seller | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/seller/dashboard |
| SP004 | pending | seller | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/seller/finance/billing |
| SP005 | pending | seller | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/seller/finance/settlements |
| SP006 | pending | seller | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/seller/notifications |
| SP007 | pending | seller | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/seller/orders/[id] |
| SP008 | pending | seller | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/seller/orders |
| SP009 | pending | seller | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/seller |
| SP010 | pending | seller | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/seller/pending |
| SP011 | pending | seller | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/seller/products |
| SP012 | pending | seller | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/seller/rejected |
| SP013 | pending | seller | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/seller/settings/account |
| SP014 | pending | seller | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/seller/settings |
| SP015 | pending | seller | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/seller/settlements |
| SP016 | pending | seller | 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/seller/suspended |

### CP (45)

| ID | Status | Area | Title |
|---|---|---|---|
| CP001 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/alert/[id] |
| CP002 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/category/[slug] |
| CP003 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/checkout/[id] |
| CP004 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/commerce-policy |
| CP005 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/join-cart |
| CP006 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/join-complete |
| CP007 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/join/[id] |
| CP008 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/login |
| CP009 | pending | mypage | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/mypage/address/new |
| CP010 | pending | mypage | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/mypage/address |
| CP011 | pending | mypage | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/mypage/addresses/[id]/edit |
| CP012 | pending | mypage | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/mypage/addresses/new |
| CP013 | pending | mypage | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/mypage/addresses |
| CP014 | pending | mypage | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/mypage/alerts |
| CP015 | pending | mypage | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/mypage/benefits |
| CP016 | pending | mypage | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/mypage/groupbuys |
| CP017 | pending | mypage | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/mypage/notification-settings |
| CP018 | pending | mypage | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/mypage/orders |
| CP019 | pending | mypage | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/mypage |
| CP020 | pending | mypage | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/mypage/participating |
| CP021 | pending | mypage | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/mypage/payment/new |
| CP022 | pending | mypage | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/mypage/payment |
| CP023 | pending | mypage | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/mypage/points |
| CP024 | pending | mypage | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/mypage/profile |
| CP025 | pending | mypage | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/mypage/recent |
| CP026 | pending | mypage | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/mypage/reviews |
| CP027 | pending | mypage | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/mypage/settings |
| CP028 | pending | mypage | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/mypage/support |
| CP029 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/notifications |
| CP030 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/orders/[id] |
| CP031 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app |
| CP032 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/payment/fail |
| CP033 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/payment/request/[orderId] |
| CP034 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/payment/success |
| CP035 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/privacy |
| CP036 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/product/[id] |
| CP037 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/refund-policy |
| CP038 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/saved |
| CP039 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/search |
| CP040 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/share/[id] |
| CP041 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/support/[id] |
| CP042 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/support/new |
| CP043 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/support |
| CP044 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/terms |
| CP045 | pending | verification | 고객 페이지 검증: /Users/kimgana/Documents/wadeal-v2/app/unauthorized |

### AC (31)

| ID | Status | Area | Title |
|---|---|---|---|
| AC001 | pending | verification | Server Action 검증: addresses |
| AC002 | pending | verification | Server Action 검증: admin-business-settings |
| AC003 | pending | verification | Server Action 검증: admin-coupons |
| AC004 | pending | verification | Server Action 검증: admin-deals |
| AC005 | pending | verification | Server Action 검증: admin-error-logs |
| AC006 | pending | verification | Server Action 검증: admin-product-images |
| AC007 | pending | verification | Server Action 검증: admin-products |
| AC008 | pending | verification | Server Action 검증: admin-reviews |
| AC009 | pending | verification | Server Action 검증: admin-seller-settlements |
| AC010 | pending | verification | Server Action 검증: admin-sellers |
| AC011 | pending | verification | Server Action 검증: admin-settlements |
| AC012 | pending | verification | Server Action 검증: admin-suppliers |
| AC013 | pending | verification | Server Action 검증: auth |
| AC014 | pending | verification | Server Action 검증: consents |
| AC015 | pending | verification | Server Action 검증: data |
| AC016 | pending | verification | Server Action 검증: discounts |
| AC017 | pending | verification | Server Action 검증: join-cart |
| AC018 | pending | verification | Server Action 검증: notification-settings |
| AC019 | pending | verification | Server Action 검증: notifications |
| AC020 | pending | verification | Server Action 검증: order-claims |
| AC021 | pending | verification | Server Action 검증: payments |
| AC022 | pending | verification | Server Action 검증: profile |
| AC023 | pending | verification | Server Action 검증: recent-views |
| AC024 | pending | verification | Server Action 검증: registerTrackingNumber |
| AC025 | pending | verification | Server Action 검증: review-images |
| AC026 | pending | verification | Server Action 검증: saved-payment-methods |
| AC027 | pending | verification | Server Action 검증: seller-finance |
| AC028 | pending | verification | Server Action 검증: seller |
| AC029 | pending | verification | Server Action 검증: settings |
| AC030 | pending | verification | Server Action 검증: share |
| AC031 | pending | verification | Server Action 검증: support |

### LD (52)

| ID | Status | Area | Title |
|---|---|---|---|
| LD001 | pending | verification | lib/data 모듈 검증: adapter |
| LD002 | pending | verification | lib/data 모듈 검증: addresses |
| LD003 | pending | verification | lib/data 모듈 검증: admin-activity-logs-shared |
| LD004 | pending | verification | lib/data 모듈 검증: admin-activity-logs |
| LD005 | pending | verification | lib/data 모듈 검증: admin-coupons |
| LD006 | pending | verification | lib/data 모듈 검증: admin-error-logs-shared |
| LD007 | pending | verification | lib/data 모듈 검증: admin-error-logs |
| LD008 | pending | verification | lib/data 모듈 검증: admin-notifications |
| LD009 | pending | verification | lib/data 모듈 검증: admin-orders |
| LD010 | pending | verification | lib/data 모듈 검증: admin-payments |
| LD011 | partial | verification | lib/data 모듈 검증: admin-products |
| LD012 | pending | verification | lib/data 모듈 검증: admin-reviews |
| LD013 | pending | verification | lib/data 모듈 검증: admin-stats-shared |
| LD014 | pending | verification | lib/data 모듈 검증: admin-stats |
| LD015 | pending | verification | lib/data 모듈 검증: alert-options |
| LD016 | pending | verification | lib/data 모듈 검증: alerts |
| LD017 | pending | verification | lib/data 모듈 검증: benefits |
| LD018 | pending | verification | lib/data 모듈 검증: business-settings |
| LD019 | pending | verification | lib/data 모듈 검증: categories |
| LD020 | pending | verification | lib/data 모듈 검증: deals |
| LD021 | pending | verification | lib/data 모듈 검증: index |
| LD022 | pending | verification | lib/data 모듈 검증: inventory |
| LD023 | pending | verification | lib/data 모듈 검증: join-cart |
| LD024 | pending | verification | lib/data 모듈 검증: mypage-dashboard |
| LD025 | pending | verification | lib/data 모듈 검증: notification-settings |
| LD026 | pending | verification | lib/data 모듈 검증: notifications |
| LD027 | pending | verification | lib/data 모듈 검증: orders |
| LD028 | partial | verification | lib/data 모듈 검증: payments |
| LD029 | pending | verification | lib/data 모듈 검증: price-alerts |
| LD030 | pending | verification | lib/data 모듈 검증: product-approval |
| LD031 | pending | verification | lib/data 모듈 검증: product-shipping |
| LD032 | pending | verification | lib/data 모듈 검증: profile |
| LD033 | pending | verification | lib/data 모듈 검증: recent-views |
| LD034 | pending | verification | lib/data 모듈 검증: review-likes |
| LD035 | pending | verification | lib/data 모듈 검증: review-reports |
| LD036 | pending | verification | lib/data 모듈 검증: reviews |
| LD037 | pending | verification | lib/data 모듈 검증: saved-deals |
| LD038 | pending | verification | lib/data 모듈 검증: saved-payment-methods |
| LD039 | pending | verification | lib/data 모듈 검증: search |
| LD040 | partial | verification | lib/data 모듈 검증: seller-billings |
| LD041 | pending | verification | lib/data 모듈 검증: seller-notifications |
| LD042 | pending | verification | lib/data 모듈 검증: seller-orders |
| LD043 | partial | verification | lib/data 모듈 검증: seller-settlement-records |
| LD044 | pending | verification | lib/data 모듈 검증: sellers |
| LD045 | pending | verification | lib/data 모듈 검증: settlements |
| LD046 | pending | verification | lib/data 모듈 검증: source |
| LD047 | pending | verification | lib/data 모듈 검증: suppliers |
| LD048 | pending | verification | lib/data 모듈 검증: support-tickets |
| LD049 | pending | verification | lib/data 모듈 검증: user-address |
| LD050 | pending | verification | lib/data 모듈 검증: user-consents |
| LD051 | pending | verification | lib/data 모듈 검증: user-payment |
| LD052 | pending | verification | lib/data 모듈 검증: users |

### API (6)

| ID | Status | Area | Title |
|---|---|---|---|
| API001 | partial | payment | API Route 검증: /api/Users/kimgana/Documents/wadeal-v2/app/payments/billing/[id] |
| API002 | partial | payment | API Route 검증: /api/Users/kimgana/Documents/wadeal-v2/app/payments/billing/charge |
| API003 | partial | payment | API Route 검증: /api/Users/kimgana/Documents/wadeal-v2/app/payments/billing/issue |
| API004 | partial | payment | API Route 검증: /api/Users/kimgana/Documents/wadeal-v2/app/payments/toss/confirm |
| API005 | partial | payment | API Route 검증: /api/Users/kimgana/Documents/wadeal-v2/app/payments/toss/webhook |
| API006 | pending | verification | API Route 검증: /api/Users/kimgana/Documents/wadeal-v2/app/tracking/update |

### NT (40)

| ID | Status | Area | Title |
|---|---|---|---|
| NT001 | pending | notifications | 알림 타입 연동: order_confirmed |
| NT002 | pending | notifications | 알림 타입 연동: payment_ready |
| NT003 | pending | notifications | 알림 타입 연동: payment_paid |
| NT004 | pending | notifications | 알림 타입 연동: payment_failed |
| NT005 | pending | notifications | 알림 타입 연동: payment_deposit_completed |
| NT006 | pending | notifications | 알림 타입 연동: shipping_started |
| NT007 | pending | notifications | 알림 타입 연동: shipping_delivered |
| NT008 | pending | notifications | 알림 타입 연동: review_available |
| NT009 | pending | notifications | 알림 타입 연동: refund_updated |
| NT010 | pending | notifications | 알림 타입 연동: support_reply |
| NT011 | pending | notifications | 알림 타입 연동: support_resolved |
| NT012 | pending | notifications | 알림 타입 연동: deal_deadline_soon |
| NT013 | pending | notifications | 알림 타입 연동: price_tier_reached |
| NT014 | pending | notifications | 알림 타입 연동: next_tier_soon |
| NT015 | pending | notifications | 알림 타입 연동: seller_application_approved |
| NT016 | pending | notifications | 알림 타입 연동: seller_application_rejected |
| NT017 | pending | notifications | 알림 타입 연동: seller_approved |
| NT018 | pending | notifications | 알림 타입 연동: seller_rejected |
| NT019 | pending | notifications | 알림 타입 연동: product_request_approved |
| NT020 | pending | notifications | 알림 타입 연동: product_request_rejected |
| NT021 | pending | notifications | 알림 타입 연동: product_approved |
| NT022 | pending | notifications | 알림 타입 연동: product_rejected |
| NT023 | pending | notifications | 알림 타입 연동: product_changes_requested |
| NT024 | pending | notifications | 알림 타입 연동: new_order_received |
| NT025 | pending | notifications | 알림 타입 연동: shipping_required |
| NT026 | pending | notifications | 알림 타입 연동: new_product_question |
| NT027 | pending | notifications | 알림 타입 연동: new_review |
| NT028 | pending | notifications | 알림 타입 연동: settlement_confirmed |
| NT029 | pending | notifications | 알림 타입 연동: settlement_ready |
| NT030 | pending | notifications | 알림 타입 연동: settlement_paid |
| NT031 | pending | notifications | 알림 타입 연동: seller_notice_published |
| NT032 | pending | notifications | 알림 타입 연동: new_seller_application |
| NT033 | pending | notifications | 알림 타입 연동: new_product_request |
| NT034 | pending | notifications | 알림 타입 연동: product_change_request |
| NT035 | pending | notifications | 알림 타입 연동: refund_request |
| NT036 | pending | notifications | 알림 타입 연동: escalated_support_ticket |
| NT037 | pending | notifications | 알림 타입 연동: payment_webhook_failed |
| NT038 | pending | notifications | 알림 타입 연동: critical_error |
| NT039 | pending | notifications | 알림 타입 연동: settlement_pending |
| NT040 | pending | notifications | 알림 타입 연동: prohibited_keyword_detected |

### RLS (25)

| ID | Status | Area | Title |
|---|---|---|---|
| RLS001 | partial | security | RLS 검증: 카탈로그 RLS |
| RLS002 | partial | security | RLS 검증: 참여·알림 RLS |
| RLS003 | partial | security | RLS 검증: 주문 RLS |
| RLS004 | partial | security | RLS 검증: 결제 RLS |
| RLS005 | partial | security | RLS 검증: 리뷰 RLS |
| RLS006 | partial | security | RLS 검증: 찜·최근본·장바구니 RLS |
| RLS007 | partial | security | RLS 검증: 배송지 RLS |
| RLS008 | partial | security | RLS 검증: 사용자·프로필 RLS |
| RLS009 | partial | security | RLS 검증: 쿠폰·포인트 RLS |
| RLS010 | partial | security | RLS 검증: 고객센터 RLS |
| RLS011 | partial | security | RLS 검증: 판매자 RLS |
| RLS012 | partial | security | RLS 검증: 공급사·정산 RLS |
| RLS013 | partial | security | RLS 검증: 판매자 정산기록 RLS |
| RLS014 | partial | security | RLS 검증: 알림 RLS |
| RLS015 | partial | security | RLS 검증: 관리자 로그 RLS |
| RLS016 | partial | security | RLS 검증: 사업자 설정 RLS |
| RLS017 | partial | security | RLS 검증: 공유·추천 RLS |
| RLS018 | partial | security | RLS 검증: 검색 RLS |
| RLS019 | partial | security | RLS 검증: 상품 이미지 Storage RLS |
| RLS020 | partial | security | RLS 검증: 리뷰 이미지 Storage RLS |
| RLS021 | partial | security | RLS 검증: 019 security hardening 전체 |
| RLS022 | partial | security | RLS 검증: 009 production RLS |
| RLS023 | partial | security | RLS 검증: service_role 우회 경로 |
| RLS024 | partial | security | RLS 검증: anon public SELECT 정책 |
| RLS025 | partial | security | RLS 검증: 역할 간 데이터 격리 |

### PAY (46)

| ID | Status | Area | Title |
|---|---|---|---|
| PAY001 | pending | payment | 결제 플로우: Toss webhook 서명 검증 |
| PAY002 | pending | payment | 결제 플로우: Webhook 이벤트 파싱 |
| PAY003 | pending | payment | 결제 플로우: Webhook process-webhook |
| PAY004 | pending | payment | 결제 플로우: Handler: payment-approved |
| PAY005 | pending | payment | 결제 플로우: Handler: payment-failed |
| PAY006 | pending | payment | 결제 플로우: Handler: payment-cancelled |
| PAY007 | pending | payment | 결제 플로우: Handler: deposit-completed |
| PAY008 | pending | payment | 결제 플로우: Handler: refund-completed |
| PAY009 | pending | payment | 결제 플로우: Webhook 로그 기록 |
| PAY010 | pending | payment | 결제 플로우: API POST /api/payments/toss/webhook |
| PAY011 | pending | payment | 결제 플로우: API POST /api/payments/toss/confirm |
| PAY012 | partial | payment | 결제 플로우: apply-confirm-result |
| PAY013 | pending | payment | 결제 플로우: Toss client 요청 |
| PAY014 | pending | payment | 결제 플로우: Toss env 설정 |
| PAY015 | pending | payment | 결제 플로우: validate-order-payment |
| PAY016 | pending | payment | 결제 플로우: create-pending-payment |
| PAY017 | pending | payment | 결제 플로우: process-instant-payment |
| PAY018 | pending | payment | 결제 플로우: prepare-payment-after-finalize |
| PAY019 | pending | payment | 결제 플로우: sync-order-payment-status |
| PAY020 | pending | payment | 결제 플로우: update-payment-status |
| PAY021 | pending | payment | 결제 플로우: can-pay-order 가드 |
| PAY022 | pending | payment | 결제 플로우: payment-status 라벨 |
| PAY023 | pending | payment | 결제 플로우: payment-methods 매핑 |
| PAY024 | pending | payment | 결제 플로우: payment-flow instant |
| PAY025 | pending | payment | 결제 플로우: payment-flow post_deadline_manual |
| PAY026 | pending | payment | 결제 플로우: payment-flow post_deadline_auto |
| PAY027 | pending | payment | 결제 플로우: auto-charge 자동결제 |
| PAY028 | pending | payment | 결제 플로우: Toss billing issue |
| PAY029 | pending | payment | 결제 플로우: API POST /api/payments/billing/issue |
| PAY030 | pending | payment | 결제 플로우: API POST /api/payments/billing/charge |
| PAY031 | pending | payment | 결제 플로우: API /api/payments/billing/[id] |
| PAY032 | pending | payment | 결제 플로우: saved payment methods |
| PAY033 | pending | payment | 결제 플로우: E2E 즉시결제 checkout |
| PAY034 | pending | payment | 결제 플로우: E2E 결제 success/fail |
| PAY035 | pending | payment | 결제 플로우: E2E 가상계좌 입금 |
| PAY036 | pending | payment | 결제 플로우: E2E 공동구매 마감 후 결제 |
| PAY037 | pending | payment | 결제 플로우: E2E billing key 등록 |
| PAY038 | pending | payment | 결제 플로우: payment_webhook_failed 알림 |
| PAY039 | pending | payment | 결제 플로우: Query API PAYMENT_STATUS_CHANGED |
| PAY040 | pending | payment | 결제 플로우: 환불·부분환불 webhook |
| PAY041 | pending | payment | 결제 플로우: admin payments UI |
| PAY042 | pending | payment | 결제 플로우: display 금액 포맷 |
| PAY043 | pending | payment | 결제 플로우: toss amount 계산 |
| PAY044 | pending | payment | 결제 플로우: toss map-method |
| PAY045 | pending | payment | 결제 플로우: server action payments.ts |
| PAY046 | pending | payment | 결제 플로우: server action saved-payment-methods |

### LP (31)

| ID | Status | Area | Title |
|---|---|---|---|
| LP001 | pending | payment | lib/payments 모듈 검증: auto-charge |
| LP002 | pending | payment | lib/payments 모듈 검증: can-pay-order |
| LP003 | pending | payment | lib/payments 모듈 검증: create-pending-payment |
| LP004 | pending | payment | lib/payments 모듈 검증: display |
| LP005 | pending | payment | lib/payments 모듈 검증: index |
| LP006 | pending | payment | lib/payments 모듈 검증: payment-flow |
| LP007 | pending | payment | lib/payments 모듈 검증: payment-methods |
| LP008 | pending | payment | lib/payments 모듈 검증: payment-status |
| LP009 | pending | payment | lib/payments 모듈 검증: prepare-payment-after-finalize |
| LP010 | pending | payment | lib/payments 모듈 검증: process-instant-payment |
| LP011 | pending | payment | lib/payments 모듈 검증: sync-order-payment-status |
| LP012 | pending | payment | lib/payments 모듈 검증: amount |
| LP013 | partial | payment | lib/payments 모듈 검증: apply-confirm-result |
| LP014 | pending | payment | lib/payments 모듈 검증: billing |
| LP015 | pending | payment | lib/payments 모듈 검증: client |
| LP016 | pending | payment | lib/payments 모듈 검증: env |
| LP017 | pending | payment | lib/payments 모듈 검증: map-method |
| LP018 | pending | payment | lib/payments 모듈 검증: types |
| LP019 | pending | payment | lib/payments 모듈 검증: validate-order-payment |
| LP020 | pending | payment | lib/payments 모듈 검증: deposit-completed |
| LP021 | pending | payment | lib/payments 모듈 검증: payment-approved |
| LP022 | pending | payment | lib/payments 모듈 검증: payment-cancelled |
| LP023 | pending | payment | lib/payments 모듈 검증: payment-failed |
| LP024 | pending | payment | lib/payments 모듈 검증: refund-completed |
| LP025 | pending | payment | lib/payments 모듈 검증: shared |
| LP026 | pending | payment | lib/payments 모듈 검증: parse-event |
| LP027 | pending | payment | lib/payments 모듈 검증: process-webhook |
| LP028 | pending | payment | lib/payments 모듈 검증: verify-signature |
| LP029 | pending | payment | lib/payments 모듈 검증: webhook-logs |
| LP030 | pending | payment | lib/payments 모듈 검증: types |
| LP031 | pending | payment | lib/payments 모듈 검증: update-payment-status |

### LN (10)

| ID | Status | Area | Title |
|---|---|---|---|
| LN001 | pending | notifications | lib/notifications 모듈 검증: admin-events |
| LN002 | pending | notifications | lib/notifications 모듈 검증: create |
| LN003 | pending | notifications | lib/notifications 모듈 검증: deadline |
| LN004 | pending | notifications | lib/notifications 모듈 검증: index |
| LN005 | pending | notifications | lib/notifications 모듈 검증: order-events |
| LN006 | pending | notifications | lib/notifications 모듈 검증: price-tier |
| LN007 | pending | notifications | lib/notifications 모듈 검증: seller-events |
| LN008 | pending | notifications | lib/notifications 모듈 검증: support-events |
| LN009 | pending | notifications | lib/notifications 모듈 검증: unified |
| LN010 | pending | notifications | lib/notifications 모듈 검증: webhook-events |

### LA (13)

| ID | Status | Area | Title |
|---|---|---|---|
| LA001 | pending | security | lib/auth 모듈 검증: access |
| LA002 | pending | security | lib/auth 모듈 검증: admin-access |
| LA003 | pending | security | lib/auth 모듈 검증: auth-provider |
| LA004 | pending | security | lib/auth 모듈 검증: prototype-session |
| LA005 | pending | security | lib/auth 모듈 검증: require-seller |
| LA006 | pending | security | lib/auth 모듈 검증: role-nav |
| LA007 | pending | security | lib/auth 모듈 검증: safe-redirect |
| LA008 | pending | security | lib/auth 모듈 검증: seller-access |
| LA009 | pending | security | lib/auth 모듈 검증: seller-route-guard |
| LA010 | pending | security | lib/auth 모듈 검증: server-session |
| LA011 | pending | security | lib/auth 모듈 검증: supabase-oauth |
| LA012 | pending | security | lib/auth 모듈 검증: sync-user-profile |
| LA013 | pending | security | lib/auth 모듈 검증: user-display |
