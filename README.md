# Wadeal v2

수량 기반 단계 할인 **공동구매** 와 **일반 즉시구매** 를 제공하는 커머스 플랫폼입니다.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS · Supabase (Postgres, Auth, Storage) · Toss Payments

---

## Quick start

```bash
npm install
cp .env.local.example .env.local
# Edit .env.local — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

npm run dev    # http://localhost:3000
npm run build  # production build
npm run start  # serve production build
npm run lint   # ESLint
```

### Supabase setup

1. Apply migrations in order: `supabase/migrations/001` → `032` ([migration order](./docs/DATABASE_SCHEMA.md#migration-적용-순서))
2. Run seed: `supabase db execute --file supabase/seed.sql` ([SEED_DATA.md](./docs/SEED_DATA.md))
3. Configure Kakao OAuth in Supabase + redirect URLs ([kakao-auth-reconnect.md](./docs/kakao-auth-reconnect.md))
4. Grant admin: `UPDATE users SET role = 'admin' WHERE …`

Full onboarding: [DEVELOPER_HANDOFF.md](./docs/DEVELOPER_HANDOFF.md).

---

## Documentation

### Core

| Document | Description |
| --- | --- |
| [PROJECT_OVERVIEW.md](./docs/PROJECT_OVERVIEW.md) | Service overview, product types, operations |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | App Router, Supabase, auth, RLS, deployment |
| [DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md) | Tables, columns, migrations |
| [ORDER_PAYMENT_FLOW.md](./docs/ORDER_PAYMENT_FLOW.md) | Instant pay, group buy, refunds, shipping |
| [ADMIN_GUIDE.md](./docs/ADMIN_GUIDE.md) | Admin console guide |
| [DEVELOPER_HANDOFF.md](./docs/DEVELOPER_HANDOFF.md) | Local setup, env, deploy, cautions |
| [ROADMAP.md](./docs/ROADMAP.md) | MVP → live payments → future phases |

### Operations & launch

| Document | Description |
| --- | --- |
| [ADMIN_OPERATIONS.md](./docs/ADMIN_OPERATIONS.md) | Daily admin operations |
| [GO_LIVE_CHECKLIST.md](./docs/GO_LIVE_CHECKLIST.md) | Production go-live checklist |
| [LAUNCH_QA_CHECKLIST.md](./docs/LAUNCH_QA_CHECKLIST.md) | QA test checklist |
| [PG_REVIEW_PREP.md](./docs/PG_REVIEW_PREP.md) | PG merchant review prep |
| [ENVIRONMENT_VARIABLES.md](./docs/ENVIRONMENT_VARIABLES.md) | All environment variables |
| [SEED_DATA.md](./docs/SEED_DATA.md) | Catalog seed guide |
| [PAYMENT_FLOW.md](./docs/PAYMENT_FLOW.md) | payment_flow enum & billing API |
| [ADMIN_AUDIT_LOGS.md](./docs/ADMIN_AUDIT_LOGS.md) | Admin activity logging |

### Policy drafts

[TERMS_DRAFT.md](./docs/TERMS_DRAFT.md) · [PRIVACY_DRAFT.md](./docs/PRIVACY_DRAFT.md) · [REFUND_POLICY_DRAFT.md](./docs/REFUND_POLICY_DRAFT.md) · [GROUPBUY_POLICY_DRAFT.md](./docs/GROUPBUY_POLICY_DRAFT.md)

---

## Project structure

```
app/           Next.js App Router (pages, actions, API)
components/    React UI
lib/           Domain logic, data layer, payments, auth
supabase/      SQL migrations & seed
docs/          Documentation
```

---

## Warnings

> **Production payments are not live by default.** Without Toss live keys, checkout uses stub/mock paths that mark orders as paid. Configure PG before accepting real money.

> **Do not set `SUPABASE_SERVICE_ROLE_KEY` in Vercel.** The app runs on publishable key + RLS.

> **Remove `NEXT_PUBLIC_ALLOW_DEMO_LOGIN` after QA** on production.

> **Apply all 40 migrations** (through `032_error_logs.sql`) before seeding.

---

## Admin & seller

| Role | Entry |
| --- | --- |
| Admin | `/admin/dashboard` — requires `users.role = 'admin'` |
| Seller | `/seller/dashboard` — requires approved seller profile |
| Launch readiness | `/admin/go-live-readiness` |

---

## License

Private — All rights reserved.
