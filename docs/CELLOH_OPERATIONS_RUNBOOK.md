# CELLOH Operations Runbook

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** Daily/weekly ops + incident response — mock phase notes included

**Admin routes:** `/admin/dashboard`, `/admin/orders`, `/admin/refunds`, `/admin/support`, `/admin/sellers`, `/admin/product-requests`, `/admin/coupons`, `/admin/promotions`, `/admin/error-logs`

---

## Daily morning checklist

| Area | Check | Route / tool |
|------|-------|--------------|
| 주문 | New/paid/preparing counts | `/admin/orders` |
| 결제 실패 | Failed payments, webhooks | `/admin/payments`, error logs |
| 배송 지연 | Shipped not delivered > SLA | `/admin/orders`, seller orders |
| 문의 | Open / escalated tickets | `/admin/support` |
| 신고 | Review reports pending | `/admin/review-reports` |
| 판매자 입점 | Pending applications | `/admin/sellers` |
| 상품 검수 | Product requests queue | `/admin/product-requests` |
| 쿠폰 오류 | Usage anomalies | `/admin/coupons`, `/admin/promotions` |
| Error logs | Critical unresolved | `/admin/error-logs` |
| Smoke | Routes still 200 | `npm run qa:routes` (dev) |

Handoff template: `docs/CELLOH_MORNING_HANDOFF.md`

---

## Weekly checklist

| Area | Action |
|------|--------|
| 인기상품 | Review `/collections/popular`, ranking policy |
| 반품/환불 | `/admin/refunds` trend, policy compliance |
| 판매자 응답률 | Seller inquiries SLA |
| 리뷰 품질 | `/admin/reviews`, reports |
| 쿠폰 비용 | Tier + campaign mock → future finance report |
| 친구추천 부정 | `reward_pending` queue, referral policy |
| Build health | lint + build on `mobile-ui` |
| Secret scan | GitHub alerts |

---

## Incident response

### 결제 실패

1. Check `/admin/payments` + error logs (`source: payment`)  
2. Verify Toss webhook status (prod only)  
3. Customer message: "결제가 완료되지 않았어요. 잠시 후 다시 시도해 주세요."  
4. Escalate if PG outage

### 로그인 실패

1. OAuth redirect URLs, Supabase auth settings  
2. Check `auth` error logs — no token logging  
3. Customer: "로그인에 문제가 있어요. 고객센터로 문의해 주세요."

### 이미지 안 뜸

1. CDN/storage bucket policy  
2. `next/image` domain config  
3. Placeholder should show — if blank, check `ProductCardImage`  
4. Customer: auto fallback; no action if placeholder visible

### 장바구니 오류

1. Reproduce on `/join-cart`  
2. Guest vs logged-in cart paths  
3. Customer: "장바구니를 불러오지 못했어요. 새로고침 후 다시 시도해 주세요."

### 상품상세 오류

1. `/product/[id]/error.tsx` boundary  
2. Data source mock vs Supabase  
3. Customer: error boundary + 고객센터 link

### 관리자 접속 오류

1. `/admin/login`, role in `isAdminUser`  
2. Middleware redirect loop  
3. Use `/unauthorized` messaging

---

## Customer notice template (draft)

**제목:** [celloh] 서비스 이용 안내

안녕하세요, celloh입니다.  
현재 {결제/로그인/일부 페이지} 이용에 일시적인 문제가 발생했습니다.  
빠르게 복구 중이며, 이용에 불편을 드려 죄송합니다.  
문의: 고객센터 {/support/contact}  
— celloh 드림

---

## Seller notice template (draft)

**제목:** [celloh 판매자] {주문/정산/배송} 안내

안녕하세요, celloh 판매자센터입니다.  
{내용: 송장 입력 마감, 정산 일정, 시스템 점검 등}  
판매자센터: `/seller/notices`  
— celloh 드림

---

## Related docs

| Doc | Topic |
|-----|-------|
| `CELLOH_ORDER_STATE_MACHINE.md` | Order flows |
| `CELLOH_ERROR_LOGGING_PLAN.md` | Logging |
| `CELLOH_NOTIFICATION_TEMPLATES.md` | Alerts |
| `CELLOH_LAUNCH_CHECKLIST.md` | Go-live |
