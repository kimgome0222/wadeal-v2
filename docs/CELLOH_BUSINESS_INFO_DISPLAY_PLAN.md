# CELLOH Business Info Display Plan

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** placeholder — **법무 확정 전**

**Code:** `lib/business-settings/shared.ts`, `components/site-footer-content.tsx`, `/admin/settings/business`

---

## Display fields (placeholder)

| Field | Key | Placeholder example | Status |
|-------|-----|---------------------|--------|
| 상호명 | `businessName` | `(TODO) celloh 주식회사` | admin 설정 |
| 대표자 | `representativeName` | `(TODO) 홍길동` | admin 설정 |
| 사업자등록번호 | `businessNumber` | `(TODO) 000-00-00000` | admin 설정 |
| 통신판매업 신고번호 | `mailOrderSalesNumber` | `(TODO) 제2026-서울-0000` | admin 설정 |
| 주소 | `businessAddress` | `(TODO) 서울특별시 …` | admin 설정 |
| 고객센터 전화 | `customerServicePhone` | `(TODO) 1588-0000` | admin 설정 |
| 고객센터 이메일 | `customerServiceEmail` | `(TODO) help@celloh.example` | admin 설정 |
| 운영시간 | `customerServiceHours` | `(TODO) 평일 09:00–18:00` | admin 설정 |
| 개인정보보호책임자 | `privacyManagerName` | `(TODO)` | admin / privacy policy |
| 개인정보 문의 이메일 | `privacyManagerEmail` | `(TODO) privacy@…` | privacy policy |
| 호스팅 제공자 | `hostingProvider` | `(TODO) AWS / Vercel 등` | admin 설정 |

---

## Policy links (live routes)

| Label | Route |
|-------|-------|
| 이용약관 | `/policies/terms` |
| 개인정보처리방침 | `/policies/privacy` |
| 전자상거래 안내 | `/policies/commerce` |
| 환불/교환 | `/policies/refund` |
| 배송 | `/policies/shipping` |
| 결제 | `/policies/payment` |

---

## UI placement

| Location | Content |
|----------|---------|
| `SiteFooter` | Business lines when configured; TODO notice when empty |
| `/mypage/settings` | Policy links + safe shopping + commerce |
| `/support` | CS contact + policy chips |
| `/policies/*` | Legal notice banner on every policy page |
| `/support/safe-shopping` | Safe purchase + policy links |

---

## Admin

- `/admin/settings/business` — form for business settings (existing)
- **No DB schema change** in this task

---

## TODO before launch

- [ ] Legal review of company info text
- [ ] Fill business settings in admin (or env-backed read)
- [ ] Match footer with 통신판매업 신고 실제 번호
- [ ] Privacy officer in `/policies/privacy`

---

## Related

- [CELLOH_SELLER_TRUST_MODEL.md](./CELLOH_SELLER_TRUST_MODEL.md)
- [CELLOH_SAFE_SHOPPING_GUIDE.md](./CELLOH_SAFE_SHOPPING_GUIDE.md)
