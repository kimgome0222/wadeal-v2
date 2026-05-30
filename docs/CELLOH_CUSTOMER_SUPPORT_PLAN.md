# CELLOH Customer Support Plan

**Date:** 2026-05-29  
**Branch:** `mobile-ui`

## 고객센터 구조

```
/support                    고객센터 홈 (검색, 빠른 도움말, TOP10 FAQ, 공지, 운영시간)
/support/faq                FAQ 전체 (accordion, category tabs, search)
/support/contact            1:1 문의 mock 폼
/support/tickets            문의 내역 (mock + 로그인 시 실제 티켓)
/support/tickets/new        → /support/contact
/support/notices            공지 목록
/support/notices/[id]       공지 상세
/support/payment            주문/결제 FAQ
/support/shipping           배송 FAQ
/support/refund             취소/환불 FAQ
/support/coupons            쿠폰/포인트 FAQ
/support/referral           친구추천 FAQ
/support/report             → /reports
/reports                    신고 mock 폼
/notices                    → /support/notices
/support/new                (로그인) 기존 DB 연동 1:1 문의
/support/[id]               (로그인) 실제 문의 상세
/mypage/support             마이페이지 문의 허브
```

## FAQ 카테고리

| ID | 라벨 | Route |
|----|------|-------|
| order | 주문/결제 | `/support/payment` |
| shipping | 배송 | `/support/shipping` |
| refund | 취소/환불 | `/support/refund` |
| coupon | 쿠폰/포인트 | `/support/coupons` |
| referral | 친구추천 | `/support/referral` |
| member | 회원/로그인 | `/support/faq?category=member` |
| seller | 판매자/상품 | `/support/faq?category=seller` |

Mock 데이터: `lib/support/mock-customer-support-data.ts`

## 문의 처리 프로세스 (mock → 상용)

1. 고객이 `/support/contact` 또는 `/support/new`(로그인)에서 문의 접수
2. mock: 접수번호 생성, local state만 — DB/알림 없음
3. 상용 시: `support_tickets` 저장 → admin `/admin/support` 배정 → `support_replies` 답변
4. 상태: 접수 → 확인중 → 답변완료

## 신고 처리 프로세스 (mock → 상용)

1. `/reports`에서 대상 유형·사유·상세 입력
2. mock: 접수번호만 표시, DB 저장 없음
3. 상용 시: `reports` 테이블 + admin 신고 관리 큐
4. 사유: 허위광고, 부적절 상품, 욕설, 개인정보, 리뷰조작, 기타

## 공지 운영 기준

- 카테고리: 배송, 쿠폰, 이벤트, 정책, 시스템
- 중요 공지 `important` badge
- mock 5건 in `SUPPORT_NOTICES`
- 상용 시 `notices` 테이블 + CMS/admin CRUD

## Mock Components

| Component | Purpose |
|-----------|---------|
| `CustomerSupportHome` | 고객센터 홈 |
| `FaqAccordionPanel` | FAQ accordion + search + tabs |
| `SupportContactMockForm` | 1:1 문의 mock |
| `SupportTicketsMockPanel` | 문의 내역 mock |
| `SupportReportMockForm` | 신고 mock |
| `SupportNoticesMockList` | 공지 list/detail |

## 실제 DB 필요 테이블 (상용화 시)

| Table | Purpose |
|-------|---------|
| `support_tickets` | 1:1 문의 본문, 유형, 상태, user_id, order_id |
| `support_replies` | 관리자/판매자 답변 |
| `reports` | 신고 접수 (target_type, reason, reporter_id) |
| `notices` | 공지 (title, category, important, published_at) |
| `attachments` | 문의/신고 첨부 (storage path, ticket_id/report_id) |

## Constraints

- No DB/RLS changes in this task
- No actual ticket/report persistence on mock routes
- No notification dispatch
- Public routes exempt from auth in `middleware.ts`

## Push

Not performed.
