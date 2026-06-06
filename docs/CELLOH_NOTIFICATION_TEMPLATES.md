# CELLOH Notification Templates (Index)

**Date:** 2026-05-29 (updated)  
**Branch:** `mobile-ui`  
**Scope:** Template spec — **no send implementation**

This file is the **index**. Detailed templates live in role-specific docs + mock constants.

---

## Documentation

| Doc | Audience |
|-----|----------|
| [CELLOH_CUSTOMER_MESSAGE_TEMPLATES.md](./CELLOH_CUSTOMER_MESSAGE_TEMPLATES.md) | Buyer (17 templates) |
| [CELLOH_SELLER_MESSAGE_TEMPLATES.md](./CELLOH_SELLER_MESSAGE_TEMPLATES.md) | Seller (15 templates) |
| [CELLOH_ADMIN_MESSAGE_TEMPLATES.md](./CELLOH_ADMIN_MESSAGE_TEMPLATES.md) | Admin (11 templates) |

---

## Mock constants

`lib/notifications/message-templates.ts`

- `customerTemplates`
- `sellerTemplates`
- `adminTemplates`
- `renderMessageTemplate()` — placeholder replace, no send

---

## Implementation status

| Item | Status |
|------|--------|
| In-app create | ✅ `lib/notifications/create.ts` |
| Order/support events | ✅ `order-events.ts`, `support-events.ts` |
| Email/Kakao/SMS send | ⏳ future |
| User prefs | ✅ `/mypage/notification-settings` |
| Notification center UI | ✅ `/notifications` |

---

## Channels (placeholder)

`in_app` · `email` · `kakao` · `sms` · `push`

---

## Related

- `lib/notifications/types.ts`
- `docs/CELLOH_ORDER_STATE_MACHINE.md`
- `docs/CELLOH_UX_WRITING_GUIDE.md`
