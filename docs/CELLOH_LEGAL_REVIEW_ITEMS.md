# CELLOH Legal Review Items

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** ⚠️ **법무·개인정보 검토용 초안 목록 — 확정 문구 아님**

**Purpose:** 정식 오픈 전 법무/개인정보/PG 심사에 넘길 문구·정책 위치를 정리하고, 확정 전 placeholder와 담당 확인 필요 여부를 표시합니다.

**Related:** `lib/policies/content.ts`, `CELLOH_BUSINESS_INFO_DISPLAY_PLAN.md`, `CELLOH_PG_REVIEW_PREP.md`

---

## Legend

| Column | Meaning |
|--------|---------|
| **법무 확인** | ✅ 필수 / 🔶 권장 / — 참고 |
| **Impl** | ✅ UI 있음 / 🔶 mock / ⏳ 미구현 |

---

## 1. 이용약관

| | |
|---|---|
| **위치** | `/policies/terms`, `/terms` (redirect), `lib/policies/content.ts` → `TERMS_POLICY` |
| **검토 이유** | 서비스 정의·셀러 상품·구매 예약·책임 제한 조항 — 실제 거래 모델과 일치 여부 |
| **Placeholder** | `LEGAL_NOTICE`: "운영 초안 · 정식 오픈 전 법무·개인정보 보호 검토 필요" |
| **법무 확인** | ✅ 필수 |

**TODO:** 셀러 상품/구매 예약 용어가 최종 BM과 일치하는지, 분쟁·중재 조항, 준거법·관할

---

## 2. 개인정보처리방침

| | |
|---|---|
| **위치** | `/policies/privacy`, `/privacy`, `PRIVACY_POLICY` |
| **검토 이유** | 수집 항목·위탁·제3자·행태정보·아동·파기 — 실제 수집·처리와 불일치 위험 |
| **Placeholder** | PG사 `(TODO: 계약 후 확정)`, 개인정보보호책임자 `(TODO)`, `privacy@celloh.example` |
| **법무 확인** | ✅ 필수 |

**TODO:** 위탁 업체명 확정, 보유 기간 법령별 표, 국외 이전 여부

---

## 3. 전자상거래 안내

| | |
|---|---|
| **위치** | `/policies/commerce`, `/commerce-policy`, `GROUPBUY_POLICY` |
| **검토 이유** | 통신판매 중개/직판 여부, 사업자 정보 표시 의무, 거래기록 보존 |
| **Placeholder** | 사업자 정보 `(TODO: 운영 확정 후 게시)`, 보존 기간 `(TODO: 법무 확정)` |
| **법무 확인** | ✅ 필수 |

---

## 4. 환불/교환/취소

| | |
|---|---|
| **위치** | `/policies/refund`, `/refund-policy`, `/support/refund`, `REFUND_POLICY` |
| **검토 이유** | 전자상거래법·소비자분쟁해결기준, 단순변심·신선식품 제한, 환불 기간 |
| **Placeholder** | 반품 제한 카테고리 `(TODO: 확정)`, PG별 환불 3~7일 `(TODO)` |
| **법무 확인** | ✅ 필수 |

**주의:** "즉시환불" 표현 사용 금지 — 실제 PG·운영 SLA 확정 전

---

## 5. 배송정책

| | |
|---|---|
| **위치** | `/policies/shipping`, `/support/shipping`, `SHIPPING_POLICY` |
| **검토 이유** | 배송비·무료배송 기준·도서산간·배송지 변경 — 상품별 상이 고지 |
| **Placeholder** | 기본 배송비 `(TODO)`, 도서산간 금액 `(TODO)` |
| **법무 확인** | ✅ 필수 |

**주의:** "당일배송"·"내일 도착" 등 확정 배송 약속 — 실제 물류 체계 전 금지 (UI mock 수정 완료)

---

## 6. 결제정책

| | |
|---|---|
| **위치** | `/policies/payment`, `/support/payment`, `FINANCE_POLICY`, `components/checkout/payment-policy-notice.tsx` |
| **검토 이유** | PG 위탁 고지, 카드정보 미저장, 셀로페이 mock 구분, 결제 실패·취소 |
| **Placeholder** | Toss Payments 등 PG `(검토 중)`, 셀로페이 mock 명시 |
| **법무 확인** | ✅ 필수 + PG 심사 |

---

## 7. 쿠폰/포인트

| | |
|---|---|
| **위치** | `/policies/coupon`, `/support/coupons`, `CELLOH_COUPON_POINT_POLICY.md`, `/mypage/coupons` |
| **검토 이유** | 할인 조건·중복·환불 시 회수·유효기간·오남용 — 프로모션법·표시광고법 |
| **Placeholder** | Tier mock, 환불 시 쿠폰 복원 `(placeholder)` |
| **법무 확인** | ✅ 필수 |

---

## 8. 친구추천

| | |
|---|---|
| **위치** | `/policies/referral`, `/invite`, `/mypage/invite`, `REFERRAL_POLICY` |
| **검토 이유** | 리워드 지급 조건·한도·부정이용·이벤트 변경·고지 방법 |
| **Placeholder** | 3,000원 쿠폰 (mock), 월 한도 `(TODO)` |
| **법무 확인** | ✅ 필수 |

---

## 9. 멤버십

| | |
|---|---|
| **위치** | `/policies/membership`, `/membership`, `MEMBERSHIP_POLICY` in `content.ts` |
| **검토 이유** | 정기결제·자동갱신·해지·환불 — 전자금융거래법·약관 규제 |
| **Placeholder** | 월 구독 가격 `(운영 확정)`, 혜택 mock |
| **법무 확인** | ✅ 필수 + PG 정기결제 심사 |

---

## 10. 판매자 입점

| | |
|---|---|
| **위치** | `/policies/seller`, `/seller/apply`, `SELLER_POLICY` |
| **검토 이유** | 입점 심사·금지상품·과장광고·패널티 — 중개 플랫폼 책임 범위 |
| **Placeholder** | 정산 주기 `(TODO)`, 패널티 기준 `(TODO)` |
| **법무 확인** | ✅ 필수 |

---

## 11. 판매자 정산

| | |
|---|---|
| **위치** | `/seller/settlements`, `/seller/finance/settlements`, seller policy §3 |
| **검토 이유** | 정산 주기·수수료·보류·분쟁 — 세무·전자상거래 중개 의무 |
| **Placeholder** | 월 1~2회 `(예시)`, mock 정산 UI |
| **법무 확인** | ✅ 필수 |

---

## 12. 리뷰/신고

| | |
|---|---|
| **위치** | `/policies/review`, `/support/report`, `REVIEW_POLICY`, `CELLOH_REVIEW_QNA_REPORT_POLICY.md` |
| **검토 이유** | 작성 자격·수정·삭제·허위 리뷰·신고 처리 — 표시광고·명예훼손 |
| **Placeholder** | 포토 리뷰 혜택 `(placeholder)` |
| **법무 확인** | 🔶 권장 |

---

## 13. 미성년자

| | |
|---|---|
| **위치** | `/policies/youth`, `YOUTH_POLICY`, signup age gate |
| **검토 이유** | 만 14세 미만 가입 제한·유해정보 — 아동·청소년 보호 |
| **Placeholder** | 유해정보 기준 `(TODO: 상세)` |
| **법무 확인** | ✅ 필수 |

---

## 14. 마케팅 수신

| | |
|---|---|
| **위치** | `/marketing-terms`, signup checkbox, `/mypage/notification-settings` |
| **검토 이유** | 선택 동의·철회·야간 발송·문자/알림톡 — 정보통신망법 |
| **Placeholder** | 마케팅 약관 초안 |
| **법무 확인** | ✅ 필수 |

---

## 15. 알림 발송

| | |
|---|---|
| **위치** | `CELLOH_NOTIFICATION_TEMPLATES.md`, `lib/notifications/message-templates.ts` |
| **검토 이유** | 광고성 vs 정보성 구분, 수신 동의, 발신자 표시 |
| **Placeholder** | 카카오/알림톡 `(TODO: 계약)` |
| **법무 확인** | 🔶 권장 |

---

## Cross-cutting placeholders

| Item | Location | Action |
|------|----------|--------|
| 사업자등록번호 | `lib/business-settings/shared.ts`, footer | admin 입력 후 법무 확인 |
| 통신판매업 신고번호 | same | same |
| 고객센터 전화 | `(TODO) 1588-0000` | 실제 번호 전 교체 |
| 개인정보보호책임자 | privacy policy §11 | 성명·연락처 확정 |
| PG 계약사 | privacy §5, payment policy | 계약 후 명시 |

---

## Internal vs customer-facing

| Surface | Approach |
|---------|----------|
| `/policies/*` | `legalNotice` 배너 유지 (약관 페이지는 초안 고지 적절) |
| `/invite`, `/membership` | 고객 UI에서 "법무 검토" 문구 제거 → "운영 정책에 따라 달라질 수 있어요" |
| Checkout mock | `PaymentPolicyNotice` — mock·PG 안내 유지 (결제 맥락에서 필요) |
| Footer | `(TODO)` 표시 when business info empty |

---

## Related

- [CELLOH_PG_REVIEW_PREP.md](./CELLOH_PG_REVIEW_PREP.md)
- [CELLOH_PRIVACY_REVIEW_CHECKLIST.md](./CELLOH_PRIVACY_REVIEW_CHECKLIST.md)
- [CELLOH_REFERRAL_COUPON_LEGAL_CHECK.md](./CELLOH_REFERRAL_COUPON_LEGAL_CHECK.md)
- [CELLOH_DATA_RETENTION_PLAN.md](./CELLOH_DATA_RETENTION_PLAN.md)
