# CELLOH Color Contrast Notes

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Status:** Design reference — verify WCAG AA before launch

**Related:** [CELLOH_DESIGN_SYSTEM.md](./CELLOH_DESIGN_SYSTEM.md), [CELLOH_ACCESSIBILITY_CHECKLIST.md](./CELLOH_ACCESSIBILITY_CHECKLIST.md)

**Code:** `app/globals.css`, `lib/design-system.ts`, `tailwind.config.ts`

---

## Brand colors

| Token | Hex | Usage |
|-------|-----|-------|
| **Primary green** | `#2E5E4E` | Buttons, links, brand accents |
| **Accent orange** | `#E28A3B` | Discount %, urgency, coupon banners |
| **Background** | `#FFFFFF` | Page, cards |
| **Surface** | `#F5F7F6` | Sections, chips idle |
| **Border** | `#E8ECEA` | Lines, inputs |

---

## Text on backgrounds

| Combination | Role | Guideline |
|-------------|------|-----------|
| `#2E5E4E` on `#FFFFFF` | Links, labels | ✅ Primary text link |
| `#FFFFFF` on `#2E5E4E` | Primary buttons | ✅ **Preferred primary CTA** |
| `#111111` on `#FFFFFF` | Body, titles | ✅ Main content |
| `#666666` on `#FFFFFF` | Secondary, meta | ⚠️ Use for non-critical; verify AA |
| `#999999` on `#FFFFFF` | Disabled, hint | Disabled/inactive only — not body |
| `#E28A3B` on `#FFF4E8` | Coupon banner | Accent emphasis — verify contrast |
| `#666666` below 12px | Captions | **Avoid** for essential info |

### Rule

- **Primary green `#2E5E4E` → pair with white text** on filled buttons and badges.
- **Do not** use green text on orange backgrounds or vice versa for long copy.

---

## Accent orange `#E28A3B`

| Use | Don't use |
|-----|-----------|
| Discount rate, tier progress | Primary paragraph text |
| Coupon / free-ship hints | Error messages (TBD) |
| Urgency labels (마감세일) | Large blocks of body copy |

---

## Gray text caution

| Level | Hex | When |
|-------|-----|------|
| Secondary | `#666666` | Review meta, shipping notes, card sublines |
| Muted / disabled | `#999999` | Sold out, disabled buttons, strikethrough original price companion |
| Tab inactive | `wadeal-muted` | Inactive tabs — must still meet AA on white |

**Avoid:** Critical actions or legal text in `#999` only.

---

## Product price colors

| Element | Color | Notes |
|---------|-------|-------|
| Sale price | `#111111` bold | Primary numeric focus |
| Discount % | `#E28A3B` | Accent — not sole price indicator |
| Original (strikethrough) | `#999999` | Must also show sale price |
| Coupon applied | `#E28A3B` | Secondary line under price |

**Accessibility:** Never convey price/discount by color alone — always show numbers.

---

## Error / warning (placeholder)

| State | Current | Launch |
|-------|---------|--------|
| Error text | `#E28A3B` or red TBD | **추후 확정** — WCAG AA required |
| Warning banner | `#FFF4E8` bg | Keep dark text `#111` on tint |
| Success | `#2E5E4E` | Prefer icon + text |

---

## Focus & states

| State | Visual |
|-------|--------|
| Focus ring | `ring-wadeal-red/20` or brand green at 25% |
| Active press | `active:scale-[0.99]` — motion only, not color-only |
| Selected chip | Green fill + **white text** |

---

## Verification checklist (pre-launch)

- [ ] Primary button white-on-green passes AA (large text OK, normal text verify)
- [ ] `#666` meta at 12–13px on white passes AA for essential info
- [ ] Disabled `#999` not used for required labels
- [ ] Discount badge readable in sunlight (manual device test)
- [ ] Dark mode — **not in scope** for v1

**No CSS token changes in this task.**
