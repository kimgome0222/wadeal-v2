# Wadeal v2 TODO / FIXME 감사

> 마지막 업데이트: 2026-05-28  
> 검색 패턴: `TODO`, `FIXME`, `HACK`, `XXX` (`.ts`, `.tsx`, `.sql`, `.md`)  
> 관련: [MVP_SCOPE.md](./MVP_SCOPE.md) · [LAUNCH_QA_CHECKLIST.md](./LAUNCH_QA_CHECKLIST.md)

---

## 요약

| 구분 | 건수 |
| --- | --- |
| **애플리케이션 코드** (`.ts` / `.tsx`) | 11 |
| **SQL 마이그레이션** (운영 가이드 주석) | 4 |
| **문서** (참조·중복 목록) | 2 |

### 출시 전 must-fix vs post-launch

| 분류 | 건수 | high | medium | low |
| --- | --- | --- | --- | --- |
| **must-fix before launch** | 2 | 2 | 0 | 0 |
| **post-launch OK** | 9 | 0 | 3 | 6 |

> must-fix: 프로덕션 결제·웹훅 무결성. post-launch: 알림톡·빌링 실 API·리뷰 좋아요 DB 등.

---

## must-fix before launch

### 1. 웹훅 시크릿 검증 보강

| 필드 | 값 |
| --- | --- |
| **파일** | `lib/payments/toss/webhook/process-webhook.ts:37` |
| **내용** | `TODO: Require secret match once PG confirm flow stores payment.secret in raw_response.` |
| **리스크** | **high** |
| **이유** | 결제 상태 변경 웹훅 위·변조 시 주문·결제 불일치 가능 |
| **조치** | confirm 시 `payment.secret` 저장 후 DEPOSIT_CALLBACK·상태 웹훅에서 secret 대조 또는 Payment Query API 재검증 |

```37:37:lib/payments/toss/webhook/process-webhook.ts
    // TODO: Require secret match once PG confirm flow stores payment.secret in raw_response.
```

### 2. 일반 결제 웹훅 서명 한계

| 필드 | 값 |
| --- | --- |
| **파일** | `lib/payments/toss/webhook/verify-signature.ts:28-31` |
| **내용** | `PAYMENT_STATUS_CHANGED` 등은 HMAC 헤더 없음 — Query API·secret 필드로 검증 필요 |
| **리스크** | **high** |
| **이유** | 서명만으로는 전체 웹훅 커버 불가; PG 심사·운영 시 검증 방식 문서화 필요 |
| **조치** | [PAYMENT_FLOW.md](./PAYMENT_FLOW.md)·PG 콘솔 설정과 함께 idempotent confirm + Query API 패턴 유지 |

```28:31:lib/payments/toss/webhook/verify-signature.ts
 * TODO: General payment webhooks (PAYMENT_STATUS_CHANGED, DEPOSIT_CALLBACK) do not
 * include tosspayments-webhook-signature. Verify those via Payment Query API or
 * DEPOSIT_CALLBACK `secret` field instead. Set TOSS_PAYMENTS_WEBHOOK_SECRET when
```

---

## post-launch OK

### 결제·빌링 (베타 이후)

| 파일 | 줄 | 내용 | 리스크 | 분류 |
| --- | --- | --- | --- | --- |
| `lib/payments/toss/billing.ts` | 57 | Issue billing key API | medium | post-launch |
| `lib/payments/toss/billing.ts` | 77 | Real Billing API integration | medium | post-launch |
| `lib/payments/toss/billing.ts` | 87 | Charge billing API | medium | post-launch |
| `lib/payments/toss/billing.ts` | 119 | Charge API 구현 | medium | post-launch |
| `lib/payments/toss/billing.ts` | 129 | Revoke billing API | low | post-launch |
| `lib/payments/toss/billing.ts` | 141 | Revoke API 구현 | low | post-launch |

MVP 즉시 결제는 `client.ts` confirm 경로로 충족. 빌링·자동결제는 [MVP_SCOPE.md](./MVP_SCOPE.md) 베타 이후.

### 알림톡 (베타 이후)

| 파일 | 줄 | 내용 | 리스크 | 분류 |
| --- | --- | --- | --- | --- |
| `lib/data/alerts.ts` | 160 | 목표가 도달 시 카카오 알림톡 발송 | medium | post-launch |
| `lib/data/price-alerts.ts` | 130 | `kakao_notify_status` 알림톡 | medium | post-launch |
| `components/alert-form.tsx` | 76 | 저장 후 알림톡 연동 | medium | post-launch |

### 리뷰·데이터 (낮은 우선순위)

| 파일 | 줄 | 내용 | 리스크 | 분류 |
| --- | --- | --- | --- | --- |
| `lib/reviews/local-review-likes.ts` | 1 | `review_likes` Supabase 테이블 전환 | low | post-launch |

### SQL 마이그레이션 (가이드 주석, 코드 결함 아님)

| 파일 | 줄 | 내용 | 리스크 | 분류 |
| --- | --- | --- | --- | --- |
| `supabase/migrations/004_alerts_table.sql` | 2 | SQL Editor 실행 안내 | low | post-launch |
| `supabase/migrations/005_orders_table.sql` | 19 | RLS 정책 적용 안내 | low | post-launch |
| `supabase/migrations/006_reviews_table.sql` | 18 | RLS 정책 적용 안내 | low | post-launch |
| `supabase/migrations/007_review_reports_table.sql` | 15 | RLS 정책 적용 안내 | low | post-launch |

프로덕션에서는 `009`·`019` 마이그레이션 적용으로 대체.

### 문서 내 TODO 참조 (중복)

| 파일 | 비고 |
| --- | --- |
| `docs/ENVIRONMENT_VARIABLES.md:131` | 알림톡 관련 파일 목록 |
| `docs/LAUNCH_QA_CHECKLIST.md:234+` | 이전 감사 스냅샷 — 본 문서가 정본 |

---

## Mock / 데모 코드 (TODO 아님, 출시 주의)

| 항목 | 프로덕션 영향 | 조치 |
| --- | --- | --- |
| `shouldUseMockData()` | 프로덕션 항상 `false` | QA만 mock 허용 |
| `NEXT_PUBLIC_ALLOW_DEMO_LOGIN` | 프로덕션 로그인 우회 | 출시 전 비활성화 |
| `TOSS_BILLING_MOCK` | 가짜 빌링 승인 | 실결제 전 해제 |
| `lib/mock-storage.ts` | Supabase 미설정 시 localStorage | env 필수 |

---

## 재감사 방법

```bash
rg 'TODO|FIXME|HACK|XXX' --glob '*.{ts,tsx,sql,md}' -n
```

감사 결과 변경 시 본 문서와 `getMvpReadiness()` 리스크 항목을 함께 갱신하세요.
