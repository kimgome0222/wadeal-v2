# Admin Audit Logs

Production admin activity logging for wadeal-v2. All major admin mutations are recorded in the immutable `admin_activity_logs` table and can be reviewed at `/admin/activity-logs`.

## Overview

- **Table:** `admin_activity_logs`
- **UI:** `/admin/activity-logs` (admin read-only)
- **Write path:** Server actions only via `createAdminActivityLog()`
- **Immutability:** Database triggers block `UPDATE` and `DELETE`

## Logged actions

| Action | Description | Target type |
|--------|-------------|-------------|
| `product_create` | New product created | `product` |
| `product_update` | Product/deal fields updated | `product` |
| `product_approve` | Product approved for sale | `product` |
| `product_reject` | Product rejected with reason | `product` |
| `order_status_update` | Order status changed | `order` |
| `payment_status_update` | Payment status changed | `order` or `payment` |
| `refund_update` | Refund processed | `order` or `payment` |
| `shipping_update` | Shipping status / tracking updated | `order` |
| `review_hide` | Review hidden | `review` |
| `review_delete` | Review deleted | `review` |
| `support_reply` | Support ticket admin reply | `support_ticket` |
| `settlement_confirm` | Settlement confirmed | `settlement` |
| `settlement_paid` | Settlement marked paid | `settlement` |
| `business_settings_update` | Business/legal settings updated | `business_settings` |

## Instrumented server actions

- `app/actions/admin-products.ts` — create, update, approve, reject
- `app/actions/data.ts` — `updateAdminOrderAction`
- `app/actions/payments.ts` — `updatePaymentStatusAction`, `syncOrderPaymentStatusAction`
- `app/actions/admin-reviews.ts` — hide, delete
- `app/actions/support.ts` — `adminReplySupportTicketAction`
- `app/actions/admin-settlements.ts` — confirm, mark paid
- `app/actions/admin-business-settings.ts` — business settings update

## Sensitive field exclusion

`sanitizeLogData()` strips these keys (exact or substring match) before insert:

- `billing_key`
- `secret` / `client_secret`
- `ci_hash` / `di_hash`
- `password`
- `token` / `access_token` / `refresh_token`
- `payment_key`
- `raw_response`
- `api_key` / `private_key`

**Never stored:** billing keys, secrets, CI/DI hashes, tokens, payment keys, raw PSP responses.

## Request metadata

Each log may include:

- `ip_hash` — SHA-256 of client IP with `REFERRAL_IP_SALT` (same helper as referral visits)
- `user_agent` — truncated to 512 characters

## RLS policies

Migration: `031_admin_activity_logs.sql`

- **SELECT:** admins only (`users.role = 'admin'`)
- **INSERT:** admins only (server action session)
- **UPDATE/DELETE:** denied by trigger

## Reviewing logs in production

1. Sign in as an admin user.
2. Open **활동 로그** in the admin nav (`/admin/activity-logs`).
3. Filter by admin, action, target type, or date range.
4. Expand a row to view `before_data` / `after_data`, timestamp, admin identity, and IP hash prefix.
5. Use the target link to open the related admin page.

For incident response, query Supabase directly:

```sql
SELECT id, admin_user_id, action, target_type, target_id, created_at
FROM admin_activity_logs
WHERE created_at >= now() - interval '24 hours'
ORDER BY created_at DESC;
```

## Adding new log points

```typescript
import { ADMIN_ACTIONS, ADMIN_TARGET_TYPES } from "@/lib/admin/activity-log";
import { logAdminAction } from "@/lib/admin/log-admin-action";

await logAdminAction({
  adminUserId: user.id,
  action: ADMIN_ACTIONS.PRODUCT_UPDATE,
  targetType: ADMIN_TARGET_TYPES.PRODUCT,
  targetId: productId,
  beforeData: sanitizeLogData(before),
  afterData: sanitizeLogData(after),
});
```

Always capture **before** state before the mutation and sanitize both snapshots.
