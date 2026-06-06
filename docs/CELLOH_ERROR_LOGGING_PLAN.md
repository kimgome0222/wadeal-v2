# CELLOH Error Logging Plan

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** Structure + policy — **no new log service integration in this task**

**Existing code:** `lib/monitoring/error-log.ts`, `lib/monitoring/error-log-shared.ts`, `/admin/error-logs`, `components/route-error-fallback.tsx`

---

## Error categories

### Client error (React boundary)

| Item | Value |
|------|-------|
| User message | "문제가 발생했어요. 잠시 후 다시 시도해 주세요." |
| UI | `RouteErrorFallback` — 다시 시도, 홈, 고객센터, 이전 페이지 |
| Internal log | `error.message`, `digest`, route, `userAgent` (hashed optional) |
| Source tag | `client` (future) |

### Server action error

| Item | Value |
|------|-------|
| User message | Action-specific toast or form error ("저장에 실패했어요") |
| Internal log | action name, error code, sanitized input keys |
| Source | `admin`, `checkout`, `support` |

### Checkout error

| Item | Value |
|------|-------|
| User message | "결제를 진행할 수 없어요. 장바구니를 확인해 주세요." |
| Internal log | order id, payment status, PG error code (no raw PG body) |
| Source | `checkout`, `payment` |

### Auth error

| Item | Value |
|------|-------|
| User message | "로그인이 필요해요" / "권한이 없어요" |
| Internal log | provider, error type — **no tokens** |
| Source | `auth` |

### Seller / admin permission error

| Item | Value |
|------|-------|
| User message | `/unauthorized` or `AdminAccessDenied` copy |
| Internal log | user id, route, required role |
| Source | `admin` |

### Image loading error

| Item | Value |
|------|-------|
| User message | Placeholder image (`/wadeal-wordmark.svg`) — silent to user |
| Internal log | image URL host, product slug — not full signed URL with token |
| Source | `client` (future) |

### Payment mock error

| Item | Value |
|------|-------|
| User message | "결제 테스트 환경 오류" (dev) / generic in prod |
| Internal log | mock flag, order id |
| Source | `payment` |

### Support form error

| Item | Value |
|------|-------|
| User message | "문의 접수에 실패했어요. 고객센터로 연락해 주세요." |
| Internal log | ticket type, user id — **no free-text PII in logs** |
| Source | `support` |

---

## Never log (redact in `sanitizeMetadata`)

| Data | Reason |
|------|--------|
| 카드번호, CVC, 결제비밀번호 | PCI |
| access_token, refresh_token | Session hijack |
| billing_key, payment_key, api secrets | PG security |
| 주민번호, CI/DI hash raw | Identity |
| Full shipping address, phone, email in metadata | PII |
| Toss `raw_response` | May contain PII |

Implemented patterns: `lib/monitoring/error-log.ts` — `SENSITIVE_KEY_PATTERN`, `PII_VALUE_PATTERNS`.

---

## Log record shape (Supabase `error_logs` — when enabled)

| Field | Example |
|-------|---------|
| level | info / warning / error / critical |
| source | checkout, payment, auth, … |
| message | Short operator-readable |
| metadata | Sanitized JSON |
| user_id | UUID or null |
| created_at | ISO timestamp |

Admin UI: `/admin/error-logs`  
**This task:** no DB/RLS changes.

---

## User-facing error UI (current)

| Component | Links |
|-----------|-------|
| `RouteErrorFallback` | 다시 시도, 홈, 고객센터, 이전 |
| `app/global-error.tsx` | 다시 시도, 홈, 고객센터 |
| `app/error.tsx`, `app/product/[id]/error.tsx` | Uses `RouteErrorFallback` |

---

## Future integrations (placeholder)

| Service | When |
|---------|------|
| Sentry | Production — `lib/monitoring/sentry.ts` stub exists |
| Supabase `error_logs` | Already migrated — enable in prod env |
| Slack/PagerDuty | Critical payment/webhook only |

---

## Related

- `docs/ERROR_MONITORING.md`
- `docs/CELLOH_OPERATIONS_RUNBOOK.md`
- `docs/CELLOH_SECRET_ENV_AUDIT.md`
