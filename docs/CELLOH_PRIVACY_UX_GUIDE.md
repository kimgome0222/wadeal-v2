# CELLOH Privacy UX Guide

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Status:** Input/display/consent UX reference — **no storage logic changes**

**Related:** [CELLOH_DATA_MASKING_RULES.md](./CELLOH_DATA_MASKING_RULES.md), [CELLOH_CONSENT_ITEMS.md](./CELLOH_CONSENT_ITEMS.md), [CELLOH_PRIVACY_REVIEW_CHECKLIST.md](./CELLOH_PRIVACY_REVIEW_CHECKLIST.md)

**Code:** `components/signup-form.tsx`, `components/user-consent-form.tsx`, `components/checkout-consent-section.tsx`, `lib/policies/content.ts`

---

## 개인정보 입력 화면

| Route | 화면 | 수집 항목 | 필수/선택 |
|-------|------|-----------|-----------|
| `/signup` | 회원가입 | 아이디, 비밀번호, 실명, 휴대폰 본인인증 | 아이디·비밀번호·실명·본인인증 **필수** |
| `/login` | 로그인 | 아이디/소셜, 비밀번호 + 약관 동의 | 로그인 **필수**, 마케팅 **선택** |
| `/checkout/[id]` | 주문·결제 | 배송지, 주문자, 결제수단, 약관 | 배송지·결제·필수 약관 **필수** |
| `/mypage/profile`, `/mypage/account` | 프로필 | 이름, 연락처, 닉네임 등 | 서비스 이용에 필요한 항목만 |
| `/mypage/addresses` | 배송지 | 수령인, 연락처, 주소 | 배송 시 **필수** |
| `/mypage/payment`, `/mypage/payment/new` | 결제수단 | 카드 mock 입력 (PG 연동 전) | 자동결제 예약 시 **필수** |
| `/support/contact` | 1:1 문의 (mock) | 문의 내용, 연락처 | 연락처·동의 **필수**, 주문번호 **선택** |
| `/seller/apply` | 판매자 입점 | 사업자·정산 정보, 서류(placeholder) | 사업자 정보 **필수**, 서류 **추후** |

**Note:** `/mypage/payment-methods` → 실제 route는 `/mypage/payment`.

---

## 동의가 필요한 시점

| 시점 | 필수 동의 | 선택 동의 |
|------|-----------|-----------|
| 최초 로그인/가입 | 이용약관, 개인정보, 만 14세, 전자상거래·가격 | 마케팅, 개인화 추천 |
| 첫 결제(미동의 사용자) | + 주문·환불·배송 정책 | — |
| 결제수단 등록 | 자동결제·빌링 등록 | — |
| 1:1 문의 | 개인정보 수집·이용 (문의 처리) | — |
| 판매자 입점 (mock) | 판매자 약관, 정산, 심사, 개인정보 | — |

상세: [CELLOH_CONSENT_ITEMS.md](./CELLOH_CONSENT_ITEMS.md)

---

## 고객 안내 문구 (톤)

| 상황 | 문구 예 |
|------|---------|
| 회원가입 본인인증 | 주민등록번호는 저장하지 않으며, 인증 결과값만 저장합니다. |
| 결제 mock | celloh는 카드번호·CVC·결제비밀번호를 저장하지 않아요. |
| PG 처리 | 결제 승인은 PG사를 통해 처리됩니다. |
| 결제 실패 | 결제수단을 확인하고 다시 시도해 주세요. |
| mock 폼 | mock UI — 실제 DB 저장 없음 (문의·mock 입점) |
| 서류 업로드 | placeholder — 실제 업로드·검증 연동 전 |

**Code:** `lib/copy/ux-writing.ts` → `CELLOH_ERRORS.paymentFailed*`

---

## 마스킹 기준

목록·타인 노출 시 적용. **본인 마이페이지**에서는 전체 표시 가능.

| 항목 | 기준 | Code |
|------|------|------|
| 이름 | `김*나` (2자: `김*`) | `maskAuthorName` in `lib/reviews/review-rules.ts` |
| 전화번호 | `010-****-1234` | 문서 기준 — UI 적용 추후 |
| 이메일 | `ga***@domain.com` | 리뷰 작성자 fallback |
| 주소 | 목록: 시/구, 상세: 주문 상세만 | `addresses-book-content` (본인 전체) |
| 계좌 | `****1234` | 판매자 정산 표시 시 |
| 카드 | `**** **** **** 1234` | `saved-payment-methods-content` |

상세: [CELLOH_DATA_MASKING_RULES.md](./CELLOH_DATA_MASKING_RULES.md)

---

## 저장하면 안 되는 정보

| 금지 | 이유 |
|------|------|
| 카드번호 전체 | PCI·PG 위탁 |
| CVC/CVV | 일회성 인증 |
| 카드 비밀번호 | PG만 처리 |
| 주민등록번호 | 본인인증 대행사 결과값만 |
| 결제비밀번호(간편결제) | mock UI — 실제 저장 금지 |

**Code:** `lib/celloh-pay/types.ts` — `UI mock — 실제 카드번호/CVC/비밀번호 저장 금지`

---

## 결제정보 처리 원칙

1. **celloh는 카드번호/CVC를 직접 저장하지 않습니다.**
2. **결제 승인은 PG사(Toss Payments 등)를 통해 처리합니다.**
3. 자동결제 예약 시 **빌링키·카드 뒤 4자리**만 서버 저장 (mock: `cardLast4`).
4. **셀로페이·간편결제·결제비밀번호**는 mock UI — 오픈 전 PG·보안 검토 필수.
5. 결제 실패 시: 결제수단 확인 + 재시도 CTA.

**UI:** `components/checkout/payment-policy-notice.tsx`, `/payment/fail`, `components/payment-setup-form.tsx`

---

## 판매자 서류 업로드 주의

| 항목 | 현재 | 운영 시 |
|------|------|---------|
| 사업자등록증 | placeholder (mock form) | 암호화 저장, 접근 권한 제한 |
| 통신판매업 신고 | placeholder | 법무 검토 후 보관 기간 명시 |
| mock 입점 폼 | DB 저장 없음 | 실제 form은 `SellerApplicationForm` → DB |

**주의:** placeholder UI에 "실제 업로드 없음" 명시. 운영 시 개인정보·영업비밀 서류는 최소 접근·암호화·보관 기간 정책 필요.

---

## 점검 체크리스트 (수동)

- [ ] placeholder에 실명/전화번호 하드코딩 없음
- [ ] signup/login/checkout에 필수 동의 checkbox
- [ ] 결제 화면에 PG·비저장 안내
- [ ] mock 폼에 "DB 저장 없음" 표시
- [ ] `/policies/privacy` 링크 동의 항목에서 열림

**No storage logic changed in this task.**
