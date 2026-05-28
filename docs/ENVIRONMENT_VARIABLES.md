# Wadeal v2 환경변수

> 마지막 업데이트: 2026-05-28  
> 로컬 템플릿: `.env.local.example`  
> 런타임: `lib/env/runtime.ts` · `lib/supabase/config.ts`

---

## 필수 — Supabase

### `NEXT_PUBLIC_SUPABASE_URL`

- Supabase 프로젝트 URL (예: `https://ptbwemzxkmurwxbjaiwu.supabase.co`)
- 사용: `lib/supabase/config.ts`, middleware, SSR 클라이언트
- Vercel Production + Preview 모두 설정

### `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

- Supabase Publishable key (`sb_publishable_…`)
- 발급: Supabase → Settings → API Keys
- **이 프로젝트는 `ANON_KEY` 대신 `PUBLISHABLE_KEY` 이름 사용**

---

## 서버 전용 (Wadeal 앱 미사용)

### `SUPABASE_SERVICE_ROLE_KEY`

- Wadeal v2 **코드에서 사용하지 않음**
- Vercel에 추가하지 않음 (RLS + publishable key로 운영)

---

## 인증 / QA

### `NEXT_PUBLIC_ALLOW_DEMO_LOGIN`

- 프로덕션에서 프로토타입 로그인 허용
- 미설정 = 프로덕션 비활성 (권장)
- 개발 환경에서는 항상 허용
- **QA 후 반드시 제거**

### `NEXT_PUBLIC_ALLOW_MOCK_DATA`

- Supabase 없이 mock 강제 (개발만)
- 프로덕션에서는 무시됨

---

## 카카오

### `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY`

- 카카오 JS SDK (카카오톡 **공유**)
- 사용: `lib/share/kakao.ts`
- 로그인 OAuth는 Supabase Auth Provider에 설정 (Vercel env 아님)

자세히: [kakao-auth-reconnect.md](./kakao-auth-reconnect.md)

---

## 사이트 / 추적

### `NEXT_PUBLIC_SITE_URL`

- 공유·초대 링크 origin
- 사용: `lib/share/urls.ts`
- 미설정: `VERCEL_URL` 또는 localhost 폴백

### `REFERRAL_IP_SALT`

- 초대 IP 해시 salt (서버 전용)
- 사용: `lib/share/ip-hash.ts`

---

## 자동 (설정 불필요)

| 변수 | 용도 |
| --- | --- |
| `NODE_ENV` | production / development |
| `VERCEL_ENV` | Vercel 배포 환경 |
| `VERCEL_URL` | 배포 URL |
| `NEXT_PUBLIC_APP_ENV` | `next.config.ts`에서 주입 |

---

## PG / 자동결제 (공동구매 빌링키)

자세한 흐름: [PAYMENT_FLOW.md](./PAYMENT_FLOW.md)

### `TOSS_SECRET_KEY`

- Toss Payments Billing API 시크릿 (서버 전용)
- 사용: `lib/payments/toss/billing.ts`
- 미설정 + 개발: mock 빌링/자동결제

### `TOSS_BILLING_MOCK`

- `true`면 실 API 없이 mock `issueBillingKey` / `chargeWithBillingKey`
- 프로덕션에서 실 API 전 테스트용

### `CRON_SECRET`

- `/api/payments/billing/charge` 내부 호출 Bearer 토큰
- 미설정 시 production 외 환경에서만 charge API 허용

---

## 예정 — PG (일반 결제 위젯)

| 변수 | 용도 |
| --- | --- |
| `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY` | 결제 위젯 |
| `TOSS_PAYMENTS_SECRET_KEY` | 서버 승인·취소 |
| `TOSS_PAYMENTS_WEBHOOK_SECRET` | 웹훅 검증 |

대시보드는 `TOSS_PAYMENTS_CLIENT_KEY`, `TOSS_PAYMENTS_SECRET_KEY` 존재 여부만 표시.  
현재: `lib/payments/create-pending-payment.ts` — PG 없이 `ready` 레코드만 생성.

---

## 예정 — 카카오 알림톡 (미구현)

| 변수 | 용도 |
| --- | --- |
| `KAKAO_ALIMTALK_API_KEY` | API 인증 |
| `KAKAO_ALIMTALK_SENDER_KEY` | 발신 프로필 |
| `KAKAO_ALIMTALK_TEMPLATE_ID` | 템플릿 |

TODO: `lib/data/alerts.ts`, `lib/data/price-alerts.ts`, `components/alert-form.tsx`

---

## Vercel Production 예시

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY=<key>
NEXT_PUBLIC_SITE_URL=https://wadeal-v2.vercel.app
REFERRAL_IP_SALT=<random>
```

설정하지 않을 것: `SUPABASE_SERVICE_ROLE_KEY`, Kakao REST/Secret (Supabase에만)

---

## 확인

1. `/admin/dashboard` — env·Supabase 상태
2. `npm run build` — env 없어도 빌드 통과 (경고)
3. Vercel → Environment Variables
