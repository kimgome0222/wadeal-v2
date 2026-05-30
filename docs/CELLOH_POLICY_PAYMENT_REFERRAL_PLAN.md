# CELLOH Policy / Payment / Referral Plan

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** 운영 초안 + UI/문서 구조 (법무 검토 필요)

## Summary

상용화 전 필요한 정책 페이지, 동의 UI, 결제 mock 안내, 친구추천 mock, 멤버십 mock, 판매자 정책, footer/마이페이지 정책 링크를 추가했습니다. **DB·PG 실연동·법률 확정본은 포함하지 않습니다.**

## Policy Routes (`/policies/*`)

| Route | Title |
|-------|-------|
| `/policies/privacy` | 개인정보처리방침 |
| `/policies/terms` | 이용약관 |
| `/policies/commerce` | 전자상거래 안내 |
| `/policies/refund` | 환불/교환 |
| `/policies/shipping` | 배송 정책 |
| `/policies/payment` | 결제 정책 |
| `/policies/marketing` | 마케팅 수신 |
| `/policies/referral` | 친구추천 |
| `/policies/seller` | 판매자 정책 |
| `/policies/youth` | 청소년 보호 |
| `/policies/membership` | 멤버십 안내 |

Legacy redirects: `/privacy`, `/terms`, `/commerce-policy`, `/refund-policy`, `/marketing-terms`, `/finance-terms` → `/policies/*`

## Files Created / Modified

| Area | Files |
|------|-------|
| Policy content | `lib/policies/content.ts`, `lib/policies/registry.ts` |
| Policy pages | `app/policies/[slug]/page.tsx`, legacy redirects |
| Consent UI | `components/user-consent-form.tsx`, `lib/consents/types.ts` |
| Checkout | `components/checkout/payment-policy-notice.tsx`, `checkout-consent-section.tsx` |
| Referral mock | `lib/referral/mock-referral-status.ts`, `components/referral/referral-invite-panel.tsx` |
| Invite/Membership | `app/invite/page.tsx`, `app/membership/page.tsx`, `app/mypage/referrals/page.tsx` |
| Links | `components/policies/policy-links-section.tsx`, `site-footer-content.tsx`, `mypage-settings-content.tsx` |
| Payment fail | `app/payment/fail/page.tsx` |
| Seller | `app/seller/policies/page.tsx` → `/policies/seller` link |
| Notifications | `mypage-notification-settings-content.tsx` |

## Privacy / Consent Structure

**개인정보처리방침 초안 포함:**
- 수집 항목 (가입, 주문, PG 정보, 문의, 로그/쿠키)
- 목적, 보유기간, 제3자 제공, 처리위탁 (TODO 업체명)
- 이용자 권리, 파기, 만 14세, 쿠키, 고지/변경
- 보호책임자 placeholder
- **카드번호/CVC/결제비밀번호 미저장 명시**

**동의 UI (`UserConsentForm`):**
- 필수: 이용약관, 개인정보, 만 14세, 전자상거래, (checkout) 주문·환불·배송
- 선택: 마케팅, 개인화 추천
- 전체 동의, 필수 미동의 시 진행 불가
- 각 항목 → `/policies/*` 링크

## Payment Mock Scope

- `PaymentPolicyNotice` on checkout
- 결제수단 UI: 카드, 카카오페이, 토스페이, 무통장, 셀로페이 mock
- **실제 PG API 호출 없음**, env key 추가 없음
- `/payment/fail` — 재시도/결제수단 변경 안내

## Referral Mock Scope

- `/invite` — public mock panel
- `/mypage/invite`, `/mypage/referrals` — logged-in invite + stats
- Mock: 초대코드, 링크 복사, 카카오 공유 placeholder, 초대 현황 3건
- 혜택 초안: 가입 3,000원 / 첫구매 3,000원
- **실제 쿠pon DB 지급 없음** — `coupons`/`referrals` 테이블 설계 필요 (문서화)

## Membership Mock

- `/membership` — 혜택 카드 + `/policies/membership`
- 정기결제/자동결제 **미구현**

## Pre-Launch Checklist

- [ ] 법무 검토 (약관·개인정보·마케팅·청소년)
- [ ] 개인정보처리방침 확정 (책임자·연락처·위탁업체)
- [ ] PG 계약/심사 (Toss Payments 등)
- [ ] 통신판매업/사업자정보 footer 표시 확정
- [ ] coupons / referrals DB 설계 및 RLS
- [ ] 주문/환불/배송 운영 프로세스 확정
- [ ] 멤버십 정기결제 법무·PG 검토

## Push

Not performed.
