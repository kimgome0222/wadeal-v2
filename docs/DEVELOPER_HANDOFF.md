# Wadeal v2 — 개발자 핸드오프

> 마지막 업데이트: 2026-05-28  
> 신규 개발자 온보딩용 — 로컬 실행부터 배포·주의사항까지.

---

## 프로젝트 요약

| 항목 | 값 |
| --- | --- |
| 이름 | wadeal (wadeal-v2) |
| Stack | Next.js 16, React 19, TypeScript, Tailwind 3, Supabase, Toss Payments SDK |
| Package manager | npm |
| Node | 20.x 권장 |

문서 인덱스: [README.md](../README.md#documentation).

---

## 로컬 설정

### 1. Clone & install

```bash
git clone <repo-url> wadeal-v2
cd wadeal-v2
npm install
```

### 2. Environment

```bash
cp .env.local.example .env.local
```

`.env.local` 편집 — 최소 필수:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

### 3. Supabase migrations

**순서:** `supabase/migrations/` 파일명 prefix 순 (동번호는 파일명 사전순).  
상세: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md#migration-적용-순서).

**Supabase CLI (권장):**

```bash
supabase link --project-ref <project-ref>
supabase db push
```

**또는** Supabase Dashboard → SQL Editor에서 migration 파일을 **001 → 032** 순으로 실행.

### 4. Seed

```bash
supabase db execute --file supabase/seed.sql
```

또는 SQL Editor에 `supabase/seed.sql` 붙여넣기.  
가이드: [SEED_DATA.md](./SEED_DATA.md).

### 5. Auth (Kakao)

1. Supabase → Auth → Providers → Kakao
2. Redirect URLs: `http://localhost:3000/auth/callback`
3. Kakao Developers → Redirect URI: `https://<project>.supabase.co/auth/v1/callback`

상세: [kakao-auth-reconnect.md](./kakao-auth-reconnect.md).

### 6. Admin 사용자

SQL Editor:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

또는 개발 중 `NEXT_PUBLIC_ALLOW_DEMO_LOGIN=true` + 프로토타입 UID (`lib/database/types.ts`).

### 7. Run dev

```bash
npm run dev
```

→ http://localhost:3000

---

## 환경변수 전체 목록

템플릿: [`.env.local.example`](../.env.local.example)  
상세 설명: [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)

### 필수 (프로덕션)

| 변수 | 용도 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key (`sb_publishable_…`) |

### 권장

| 변수 | 용도 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | OG, sitemap, share origin |
| `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY` | 카카오톡 공유 |
| `REFERRAL_IP_SALT` | 초대 IP 해시 (미설정 시 기본값) |

### QA / 개발 전용

| 변수 | 용도 |
| --- | --- |
| `NEXT_PUBLIC_ALLOW_DEMO_LOGIN` | 프로덕션 프로토타입 로그인 (QA 후 제거) |
| `NEXT_PUBLIC_ALLOW_MOCK_DATA` | Supabase 없이 mock (dev only) |

### Toss Payments — 일반 결제

| 변수 | 용도 |
| --- | --- |
| `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY` | 결제 위젯 |
| `TOSS_PAYMENTS_SECRET_KEY` | 서버 confirm/cancel |
| `TOSS_PAYMENTS_WEBHOOK_SECRET` | Webhook HMAC |

### Toss Billing — 공동구매 자동결제

| 변수 | 용도 |
| --- | --- |
| `TOSS_SECRET_KEY` | Billing API secret |
| `TOSS_BILLING_MOCK` | `true` = mock billing/charge |
| `CRON_SECRET` | `/api/payments/billing/charge` Bearer |

### 미구현 (예정)

| 변수 | 용도 |
| --- | --- |
| `KAKAO_ALIMTALK_API_KEY` | 알림톡 |
| `KAKAO_ALIMTALK_SENDER_KEY` | |
| `KAKAO_ALIMTALK_TEMPLATE_ID` | |

### 사용하지 않음

| 변수 | 비고 |
| --- | --- |
| `SUPABASE_SERVICE_ROLE_KEY` | Wadeal 앱 코드에서 **미사용** |

### 자동 (설정 불필요)

`NODE_ENV`, `VERCEL_ENV`, `VERCEL_URL`, `NEXT_PUBLIC_APP_ENV`

---

## npm scripts

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | Next.js dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Production server (post-build) |
| `npm run lint` | ESLint (`next lint`) |

**테스트:** 별도 test runner 미구성 — QA는 [LAUNCH_QA_CHECKLIST.md](./LAUNCH_QA_CHECKLIST.md) 수동 체크.

---

## 디렉터리 가이드

```
app/           # Routes, pages, server actions, API
components/    # UI components
lib/           # Domain logic, data layer, auth, payments
supabase/      # migrations/, seed.sql
docs/          # Documentation
public/        # Static assets
```

아키텍처: [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 데이터 레이어

- **진입점:** `lib/data/index.ts`, `lib/services/deals.ts`
- **Mock vs Supabase:** `lib/env/runtime.ts` → `shouldUseMockData()`
- **타입:** `lib/database/types.ts`

프로덕션에서 mock은 **절대** 사용되지 않음.

---

## 배포 (Vercel)

1. GitHub repo 연결
2. Framework: Next.js (auto-detect)
3. Build: `npm run build`
4. Environment Variables — Production + Preview에 Supabase keys
5. Domains — custom domain + `NEXT_PUBLIC_SITE_URL`
6. Supabase Auth redirect — production callback URL 추가

**Webhook URL (Toss):** `https://<domain>/api/payments/toss/webhook`

**Cron (자동결제):** Vercel Cron → `POST /api/payments/billing/charge` + header `Authorization: Bearer ${CRON_SECRET}`

출시: [GO_LIVE_CHECKLIST.md](./GO_LIVE_CHECKLIST.md).

---

## 주요 개발 작업 패턴

| 작업 | 위치 |
| --- | --- |
| 새 catalog query | `lib/data/*.ts` |
| User mutation | `app/actions/*.ts` |
| Admin mutation | `app/actions/admin-*.ts` + activity log |
| DB schema change | `supabase/migrations/0xx_*.sql` + types update |
| Payment logic | `lib/payments/` |
| RLS-sensitive write | SECURITY DEFINER RPC in migration |

---

## 남은 작업 (Remaining work)

| 우선순위 | 항목 | 상태 |
| --- | --- | --- |
| P0 | Toss live PG (confirm, webhook, cancel) | UI/API 있음, live 키·심사 필요 |
| P0 | 프로덕션 Kakao OAuth | Supabase provider 설정 |
| P1 | Toss Billing real API | mock (`billing.ts` TODO) |
| P1 | 카카오 알림톡 | env·TODO only |
| P1 | Webhook signature 전면 검증 | partial TODO |
| P2 | Vercel Cron 자동결제 배치 | endpoint 있음, cron 미설정 |
| P2 | `error_logs` admin UI | action 있음, UI 제한적 |
| P2 | Identity verification real provider | mock provider |
| P3 | `user_notifications` migration 정리 | dead RPC reference |
| P3 | Recommendations engine | 미착수 |

로드맵: [ROADMAP.md](./ROADMAP.md).

---

## 주의사항 (Cautions)

1. **Service Role Key** — Vercel에 추가하지 말 것. RLS 설계 전제.
2. **Demo login** — `NEXT_PUBLIC_ALLOW_DEMO_LOGIN` 프로덕션 QA 후 제거.
3. **Triple product status** — `is_active`, `status`, `approval_status` 모두 확인.
4. **final_price** — 마감 전 NULL; finalize 전 결제 UI 금액 주의.
5. **billing_key** — 절대 클라이언트·로그 노출 금지.
6. **Migration order** — 동일 prefix 파일명 순서 중요 (예: 015_payments → 015_shipping).
7. **PG stub** — `processInstantPayment` 는 키 없으면 즉시 paid — **프로덕션 live 전 반드시 Toss 연동**.
8. **환불** — PG 미연동 시 DB만 변경; 실제 환불 수동.

---

## 문제 해결

| 증상 | 확인 |
| --- | --- |
| 빈 홈 | seed 실행, `approval_status=approved`, env keys |
| Admin 접근 거부 | `users.role`, demo login flag |
| 결제 위젯 실패 | `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY` |
| OAuth redirect loop | Supabase + Kakao redirect URL 일치 |
| Mock 데이터 | dev only; `NEXT_PUBLIC_ALLOW_MOCK_DATA` |

Dashboard: `/admin/dashboard` — env·DB 연결 상태.

---

## 관련 문서

| 문서 | 내용 |
| --- | --- |
| [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) | 비즈니스 개요 |
| [ORDER_PAYMENT_FLOW.md](./ORDER_PAYMENT_FLOW.md) | 결제 시퀀스 |
| [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) | 운영 |
| [PAYMENT_FLOW.md](./PAYMENT_FLOW.md) | payment_flow enum |
