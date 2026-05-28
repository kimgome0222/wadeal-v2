# Wadeal v2 출시(Go-Live) 체크리스트

> 마지막 업데이트: 2026-05-28  
> 자동 점검: [`/admin/dashboard`](/admin/dashboard) · [`/admin/go-live-readiness`](/admin/go-live-readiness)  
> MVP 범위·릴리스: [MVP_SCOPE.md](./MVP_SCOPE.md) · [RELEASE_PLAN.md](./RELEASE_PLAN.md) · [TODO_AUDIT.md](./TODO_AUDIT.md)  
> PG 심사용 설명: [PG_REVIEW_PREP.md](./PG_REVIEW_PREP.md)  
> 결제 흐름: [PAYMENT_FLOW.md](./PAYMENT_FLOW.md)  
> 환경변수: [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)  
> QA: [LAUNCH_QA_CHECKLIST.md](./LAUNCH_QA_CHECKLIST.md)

---

## 사용 방법

1. **자동 점검** — 관리자 대시보드 **「MVP 출시 준비」**(기능 범위) · **「오픈 준비 상태」**(운영·PG) 섹션을 확인합니다.
2. **수동 체크** — 아래 항목을 담당 팀과 함께 `[ ]` → `[x]` 로 진행합니다.
3. **PG 심사** — [PG_REVIEW_PREP.md](./PG_REVIEW_PREP.md)를 PG사에 제출·설명 자료로 활용합니다.

| 상태 | 의미 |
| --- | --- |
| 완료 (ready) | 출시 기준 충족 |
| 주의 (warning) | 출시 가능하나 보완 권장 |
| 미완료 (missing) | 출시 전 필수 조치 |

---

## 1. 사업자·법적 요건

| # | 항목 | 담당 | 체크 | 비고 |
| --- | --- | --- | --- | --- |
| 1.1 | 사업자등록증 취득 | 경영·법무 | [ ] | `/admin/settings/business`에 상호·대표·등록번호 입력 |
| 1.2 | 통신판매업 신고 | 경영·법무 | [ ] | 신고번호 입력, PG 심사 시 제출 |
| 1.3 | 사업자 정보 푸터 표시 | 개발·운영 | [ ] | `SiteFooter` — 사업자·CS 정보 노출 확인 |
| 1.4 | 호스팅 사업자 표기 | 개발·운영 | [ ] | business_settings.hosting_provider (Vercel 등) |
| 1.5 | 개인정보 보호책임자 | 법무 | [ ] | privacy_manager_name / email 입력 |

---

## 2. 도메인·인프라

| # | 항목 | 담당 | 체크 | 비고 |
| --- | --- | --- | --- | --- |
| 2.1 | 프로덕션 도메인 연결 | 인프라 | [ ] | Vercel → Domains → 커스텀 도메인 |
| 2.2 | SSL(TLS) 적용 | 인프라 | [ ] | Vercel 자동 HTTPS, HSTS 필요 시 설정 |
| 2.3 | `NEXT_PUBLIC_SITE_URL` 설정 | 개발 | [ ] | 공유·OG·sitemap origin |
| 2.4 | Supabase Auth Redirect URL | 개발 | [ ] | `https://{domain}/auth/callback` 등록 |
| 2.5 | 카카오 OAuth Redirect URI | 개발 | [ ] | Supabase callback URL과 일치 |
| 2.6 | Vercel Production 환경변수 | 개발 | [ ] | [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) 전체 |
| 2.7 | `NEXT_PUBLIC_ALLOW_DEMO_LOGIN` 비활성 | 개발 | [ ] | 프로덕션 QA 후 반드시 제거 |
| 2.8 | `NEXT_PUBLIC_ALLOW_MOCK_DATA` 미사용 | 개발 | [ ] | 프로덕션 mock 차단 확인 |

---

## 3. PG(토스페이먼츠) 계약·심사

| # | 항목 | 담당 | 체크 | 비고 |
| --- | --- | --- | --- | --- |
| 3.1 | PG 가맹점 계약 | 경영·재무 | [ ] | 토스페이먼츠 가맹점 신청 |
| 3.2 | PG 심사 서류 제출 | 경영·운영 | [ ] | [PG_REVIEW_PREP.md](./PG_REVIEW_PREP.md) 참고 |
| 3.3 | 실결제 Client Key 발급 | 개발 | [ ] | `NEXT_PUBLIC_TOSS_CLIENT_KEY` (live) |
| 3.4 | 실결제 Secret Key 발급 | 개발 | [ ] | `TOSS_SECRET_KEY` — **서버 전용** |
| 3.5 | 결제위젯 variantKey 설정 | 개발·PG | [ ] | CARD, KAKAOPAY, NAVERPAY 등 — [PAYMENT_FLOW.md](./PAYMENT_FLOW.md) |
| 3.6 | 카카오페이 사용 가능 여부 | PG | [ ] | 토스 어드민 + PG 계약 범위 확인 |
| 3.7 | 네이버페이 사용 가능 여부 | PG | [ ] | 동일 |
| 3.8 | 휴대폰 결제 사용 가능 여부 | PG | [ ] | MOBILE_PHONE variant |
| 3.9 | 가상계좌 사용 가능 여부 | PG | [ ] | 입금 웹훅·`SUPABASE_SERVICE_ROLE_KEY` 필요 |
| 3.10 | 결제 webhook URL 등록 | 개발 | [ ] | `POST https://{domain}/api/payments/toss/webhook` |
| 3.11 | `TOSS_WEBHOOK_SECRET` 설정 | 개발 | [ ] | payout/seller 웹훅 HMAC (해당 시) |
| 3.12 | 테스트 결제 → 실결제 전환 | QA | [ ] | test key 제거, live key만 Production |

---

## 4. 정책·약관 페이지

| # | 항목 | 경로 | 담당 | 체크 | 비고 |
| --- | --- | --- | --- | --- | --- |
| 4.1 | 이용약관 | `/terms` | 법무 | [ ] | [TERMS_DRAFT.md](./TERMS_DRAFT.md) 법무 검토 |
| 4.2 | 개인정보처리방침 | `/privacy` | 법무 | [ ] | [PRIVACY_DRAFT.md](./PRIVACY_DRAFT.md) |
| 4.3 | 환불·교환 정책 | `/refund-policy` | 법무·CS | [ ] | [REFUND_POLICY_DRAFT.md](./REFUND_POLICY_DRAFT.md) |
| 4.4 | 공동구매 운영정책 | `/commerce-policy` | 운영 | [ ] | [GROUPBUY_POLICY_DRAFT.md](./GROUPBUY_POLICY_DRAFT.md) |
| 4.5 | 체크아웃·회원가입 동의 연동 | — | 개발 | [ ] | 필수 약관 동의 UI |
| 4.6 | PG 심사용 URL 목록 정리 | — | 운영 | [ ] | PG_REVIEW_PREP § URL |

---

## 5. 고객센터·CS

| # | 항목 | 담당 | 체크 | 비고 |
| --- | --- | --- | --- | --- |
| 5.1 | 고객센터 전화번호 | CS | [ ] | business_settings.customer_service_phone |
| 5.2 | 고객센터 이메일 | CS | [ ] | customer_service_email |
| 5.3 | 운영 시간 안내 | CS | [ ] | customer_service_hours |
| 5.4 | 1:1 문의(`/support`) 운영 | CS | [ ] | `/admin/support` 미처리 0건 목표 |
| 5.5 | 환불 요청 처리 프로세스 | CS·재무 | [ ] | `/admin/orders` 환불 대기 처리 |

---

## 6. 배송·물류

| # | 항목 | 담당 | 체크 | 비고 |
| --- | --- | --- | --- | --- |
| 6.1 | 택배사 계약 | 물류 | [ ] | CJ·롯데 등 |
| 6.2 | 송장 입력·배송 상태 변경 | 운영 | [ ] | `/admin/orders` |
| 6.3 | 제주·도서산간 추가 배송비 정책 | 운영 | [ ] | 상품·정책 페이지 명시 |
| 6.4 | 배송 소요일·출고지 안내 | 운영 | [ ] | 상품 상세·배송 안내 |
| 6.5 | 공동구매 마감 후 출고 일정 | 운영 | [ ] | commerce-policy·알림 문구 |

---

## 7. 상품·운영 데이터

| # | 항목 | 담당 | 체크 | 비고 |
| --- | --- | --- | --- | --- |
| 7.1 | 출시 상품 등록 | MD·운영 | [ ] | `/admin/products` |
| 7.2 | 활성 상품(`is_active`) 1개 이상 | 운영 | [ ] | 대시보드 자동 점검 |
| 7.3 | 가격 단계(tier) 설정 | MD | [ ] | 공동구매 필수 |
| 7.4 | 상품 이미지·설명 QA | MD | [ ] | Storage 또는 URL |
| 7.5 | 공급사·정산 설정 | 재무 | [ ] | `/admin/suppliers`, `/admin/settlements` |

---

## 8. 관리자·보안

| # | 항목 | 담당 | 체크 | 비고 |
| --- | --- | --- | --- | --- |
| 8.1 | 관리자 계정 `users.role = admin` | 개발 | [ ] | Supabase users 테이블 |
| 8.2 | 비관리자 `/admin/*` 차단 | 개발 | [ ] | AdminAccessDenied 확인 |
| 8.3 | Supabase RLS 정책 검토 | 개발 | [ ] | `supabase/migrations/*_rls_*` |
| 8.4 | Storage 버킷 공개/비공개 | 개발 | [ ] | 상품 이미지 public, 민감 파일 private |
| 8.5 | `SUPABASE_SERVICE_ROLE_KEY` 서버 전용 | 개발 | [ ] | 웹훅·백그라운드만, 클라이언트 노출 금지 |
| 8.6 | `REFERRAL_IP_SALT` 프로덕션 설정 | 개발 | [ ] | 초대 IP 해시 |

---

## 9. 모니터링·장애 대응

| # | 항목 | 담당 | 체크 | 비고 |
| --- | --- | --- | --- | --- |
| 9.1 | Vercel 로그·알림 | 인프라 | [ ] | 결제·웹훅 5xx 알림 |
| 9.2 | `webhook_logs` 모니터링 | 개발 | [ ] | `/admin/payments` failed 건 |
| 9.3 | 치명적 오류 로그 (`error_logs`) | 개발 | [ ] | 테이블 구성 시 대시보드 연동 |
| 9.4 | 결제 실패·환불 SLA | CS | [ ] | `/payment/fail` 재시도 안내 |
| 9.5 | 롤백·배포 절차 | 개발 | [ ] | Vercel instant rollback |

---

## 10. 출시 직전 최종 확인

| # | 항목 | 담당 | 체크 |
| --- | --- | --- | --- |
| 10.1 | [LAUNCH_QA_CHECKLIST.md](./LAUNCH_QA_CHECKLIST.md) 전 항목 | QA | [ ] |
| 10.2 | 대시보드 **오픈 준비 상태** 미완료 0건 (또는 승인된 예외) | PM | [ ] |
| 10.3 | 실결제 소액 테스트 (카드·간편·가상계좌 각 1회) | QA | [ ] |
| 10.4 | 공동구매 마감 → 결제 → 배송 E2E | QA | [ ] |
| 10.5 | 데모 로그인·mock 데이터 프로덕션 OFF | 개발 | [ ] |

---

## 자동 점검 항목 (코드)

`lib/admin/go-live-readiness.ts` → `getGoLiveReadiness()`:

| ID | 라벨 | ready 조건 |
| --- | --- | --- |
| `business-info` | 사업자 정보 | 상호·등록번호·통신판매업 번호 입력 |
| `policy-pages` | 정책 페이지 | terms, privacy, refund-policy, commerce-policy |
| `pg-env` | PG 결제 키 | Client + Secret Key |
| `supabase` | Supabase 연결 | DB 쿼리 성공 |
| `products` | 등록 상품 | 활성 상품 ≥ 1 |
| `toss-webhook` | 토스 웹훅 | 시크릿 또는 webhook_logs 존재 |
| `support-tickets` | 미처리 문의 | 0건 |
| `refunds` | 환불 요청 대기 | 0건 |
| `critical-errors` | 치명적 오류 | 미해결 0건 (error_logs) |

---

## 담당 팀 연락 (템플릿)

| 영역 | 담당 | 연락처 |
| --- | --- | --- |
| 개발 | | |
| 인프라 | | |
| PG·재무 | | |
| 법무 | | |
| CS·운영 | | |
| MD | | |

> 출시 D-7 / D-3 / D-Day 미팅에서 위 체크리스트 진행률을 공유하세요.
