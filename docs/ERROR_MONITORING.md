# Error monitoring

Production error logging for Wadeal operations: database audit trail, admin review UI, and optional Sentry forwarding.

## Database: `error_logs`

Migration: `supabase/migrations/032_error_logs.sql`

| Column | Type | Notes |
|--------|------|--------|
| `id` | UUID | Primary key |
| `level` | TEXT | `info`, `warning`, `error`, `critical` |
| `source` | TEXT | e.g. `checkout`, `payment`, `webhook`, `finalize_deal`, `shipping`, `admin` |
| `message` | TEXT | Human-readable summary (no PII) |
| `stack` | TEXT | Optional stack trace |
| `user_id` | UUID | Optional |
| `order_id` | UUID | Optional |
| `payment_id` | UUID | Optional |
| `deal_id` | UUID | Optional |
| `product_id` | TEXT | Product slug when relevant |
| `metadata` | JSONB | Sanitized context (no secrets / PII) |
| `resolved_at` | TIMESTAMPTZ | Set when an admin marks resolved |
| `created_at` | TIMESTAMPTZ | Insert time |

### RLS

- **SELECT**: admins only (`public.is_admin_user`)
- **UPDATE**: admins only (for `resolved_at`)
- **INSERT**: server-side only via `SUPABASE_SERVICE_ROLE_KEY` (no client insert policy)
- **DELETE**: denied

Indexes: `level`, `source`, `created_at`, `resolved_at`, partial index for unresolved critical rows.

## `logError` utility

```ts
import { logError } from "@/lib/monitoring/error-log";

await logError({
  level: "error",
  source: "payment",
  message: "Payment confirm failed",
  error: caughtError,
  userId: user.id,
  orderId,
  paymentId,
  productId: "wd-example-001",
  metadata: { step: "confirm", code: "AMOUNT_MISMATCH" },
});
```

- Persists via service-role Supabase client
- `sanitizeMetadata()` strips billing keys, tokens, phone, address, names, etc.
- `error` / `critical` levels also call Sentry when configured

### Resolve (admin)

```ts
import { resolveErrorLog } from "@/lib/monitoring/error-log";
// or server action: resolveErrorLogAction(logId)
```

## Admin UI

- **List / filters**: `/admin/error-logs` — level, source, resolved status
- **Dashboard**: `/admin/dashboard` — unresolved critical count, 24h error count, warning banner
- **Nav**: “에러 로그” in admin navigation

## Sentry (optional)

Set in server environment (Vercel / `.env.local`):

```bash
SENTRY_DSN=https://example@o0.ingest.sentry.io/0
# Optional:
# SENTRY_DEBUG=true
```

- `lib/monitoring/sentry.ts` — `initSentry()`, `captureException()`
- Enabled only when `SENTRY_DSN` is set
- Requires `@sentry/nextjs` package to be installed for real delivery; without the SDK, DSN is ignored after a one-time dev notice
- No DSN → no external calls (safe for local / staging)

## Instrumented failure points

| Area | Source | Trigger |
|------|--------|---------|
| Checkout | `checkout` | Order insert / checkout action `save_failed` |
| Payment confirm | `payment` | Toss confirm API or apply result failure |
| Webhook | `webhook` | Signature failure, handler failure, unhandled exception |
| Group-buy finalize | `finalize_deal` | Deal/order/payment prep errors during `finalizeDeal` |
| Auto-pay | `payment` | `handleAutoChargeFailure` after billing charge failure |
| Billing API | `payment` | `chargeWithBillingKey` not configured / not implemented |
| Shipping / refund | `shipping` / `payment` | `updateAdminOrder` DB failure |
| Admin actions | `admin` | Finalize deal failure, product create failure, order update failure |

## Critical incident checklist

1. Open **운영 대시보드** — check unresolved critical count and banner.
2. Open **에러 로그** — filter `critical` + `미해결`.
3. Note `order_id` / `payment_id` / `product_id` and use linked admin pages.
4. Cross-check **결제 / 웹훅** webhook logs for the same time window.
5. Fix root cause; mark log **해결 처리** when mitigated.
6. If `SENTRY_DSN` is set, confirm the event in Sentry and assign owner.

## Payment / webhook troubleshooting

1. **Confirm failures** — filter `source=payment`, check `metadata.paymentKeyPrefix` and order id.
2. **Webhook failures** — filter `source=webhook`; compare with `webhook_logs` status `failed`.
3. **Auto-charge after finalize** — filter `finalize_deal` then `payment` with `flow: post_deadline_auto`.
4. Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in production (required for inserts).
5. Never log full payment keys, billing keys, or customer PII in `metadata`.

## Related docs

- [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) — `SENTRY_DSN`, `SUPABASE_SERVICE_ROLE_KEY`
- [PAYMENT_FLOW.md](./PAYMENT_FLOW.md) — Toss confirm / webhook flow
