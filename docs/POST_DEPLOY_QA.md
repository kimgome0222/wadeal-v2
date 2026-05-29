# Wadeal Post-Deploy QA

## Deployment URL

- Production deployment URL: https://wadeal-v2-879rzws66-kimgome0222-2396s-projects.vercel.app
- Source: GitHub deployment status for commit `dc2c6ee`
- Deployment state: success in GitHub/Vercel deployment status
- Runtime access state: blocked by Vercel authentication protection

## Access check

All checked paths returned HTTP 401 `Authentication Required` from Vercel.
This means production deployment exists, but public user QA cannot proceed until
Vercel Deployment Protection / authentication is disabled or a bypass token is
provided.

### Checked paths

| Area | Path | Result |
| --- | --- | --- |
| Home | `/` | 401 |
| Search | `/search?q=감귤` | 401 |
| Categories | `/categories` | 401 |
| Category detail | `/category/fresh-food` | 401 |
| Product detail | `/products/jeju-tangerine-3kg` | 401 |
| Mypage | `/mypage` | 401 |
| Cart | `/cart` | 401 |
| Checkout | `/checkout` | 401 |
| Order complete | `/order/complete` | 401 |
| Order detail | `/orders/WD202605290128` | 401 |
| Payment success/fail | `/payments/success`, `/payments/fail` | 401 |
| Seller center | `/seller`, `/seller/orders`, `/seller/support` | 401 |
| Admin center | `/admin`, `/admin/orders`, `/admin/coupons` | 401 |
| Buyer events | `/events` | 401 |

## Buyer real-user QA

Status: BLOCKED by HTTP 401.

Planned but not executable from public URL:

- 회원가입/로그인
- 상품 검색
- 상품 상세 확인
- 장바구니 담기
- 주문 진행
- 주문내역 확인
- 취소/환불 요청
- 리뷰 작성 가능 조건 확인
- 문의 작성
- 찜/최근 본 상품 확인

Local/build fallback status from pre-deploy QA remains PASS, but production user
flow is not validated until the deployment is publicly accessible.

## Seller real-user QA

Status: BLOCKED by HTTP 401.

Planned but not executable from public URL:

- 판매자 로그인
- 판매자 승인 상태 확인
- 상품 등록 요청
- 주문 확인
- 송장 입력
- 문의 답변
- 리뷰 답글
- 정산 내역
- 판매자 알림

## Admin real-user QA

Status: BLOCKED by HTTP 401.

Planned but not executable from public URL:

- 관리자 로그인
- 상품 승인/반려
- 판매자 승인/반려
- 주문 관리
- 환불 승인/반려
- 카테고리 관리
- 배너/이벤트 관리
- 쿠폰 관리
- 고객센터 관리
- 정산 관리

## Mobile QA

Status: BLOCKED by HTTP 401.

Checked iPhone User-Agent against these routes and all returned 401:

- `/`
- `/products/jeju-tangerine-3kg`
- `/cart`
- `/checkout`
- `/mypage`
- `/seller`
- `/admin`

Mobile layout remains build-verified only. Real visual QA requires access to the
protected deployment or a public production URL.

## Operational risks

| Risk | Status |
| --- | --- |
| Vercel deployment protection | MUST FIX - production URL returns 401 |
| Toss live payment | Deferred / not E2E verified |
| Toss refund API | Deferred / not E2E verified |
| Toss webhook secret | Deferred / not verified |
| Kakao production OAuth | Deferred / not configured |
| Kakao 알림 발송 | Deferred / not configured |
| Supabase RLS | Deferred / not verified |
| Storage upload | Deferred / not E2E verified |
| Vercel env | Unknown from this environment |

## Bugs found

1. Production deployment is not publicly accessible: every route returns Vercel
   401 Authentication Required.

## Verdict

- Deployment creation: SUCCESS
- Public access QA: FAIL / BLOCKED
- Buyer/seller/admin production flow QA: NOT EXECUTABLE until Vercel access is opened
- Open readiness: NOT READY

## Required next action

Disable Vercel Deployment Protection for the production deployment or provide a
valid Vercel bypass/auth method, then rerun this QA checklist against the public URL.
