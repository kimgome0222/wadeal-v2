# Wadeal v2 릴리스 계획

> 마지막 업데이트: 2026-05-28  
> MVP 범위: [MVP_SCOPE.md](./MVP_SCOPE.md)  
> TODO 감사: [TODO_AUDIT.md](./TODO_AUDIT.md)  
> 자동 점검: `/admin/dashboard` (MVP 출시 준비 · 오픈 준비 상태)

---

## 개요

| Phase | 명칭 | 목표 | 대표 기간(가이드) |
| --- | --- | --- | --- |
| 1 | Internal testing | 기능·RLS·결제 스테이징 검증 | 1–2주 |
| 2 | Friends beta | 소수 실사용·CS·정책 피드백 | 2–3주 |
| 3 | PG review / live payment test | 토스 심사·실결제·웹훅 | 2–4주 |
| 4 | Small product launch | 단일·소수 SKU 소프트 런치 | 1–2주 |
| 5 | Official launch | 공개 트래픽·운영 정상화 | — |

각 Phase 완료 조건은 [MVP_SCOPE.md](./MVP_SCOPE.md)의 **done** 항목과 대시보드 자동 점검을 기준으로 합니다.

---

## Phase 1: Internal testing (내부 테스트)

**목표:** 개발·운영·QA가 스테이징에서 E2E 플로우를 깨지 않음을 확인합니다.

### 체크리스트

- [ ] Supabase 스테이징 프로젝트에 마이그레이션 전체 적용 (`009`, `019` 포함) — [MVP_SCOPE § 보안·RLS](./MVP_SCOPE.md#인프라보안)
- [ ] `NEXT_PUBLIC_SUPABASE_*` · 서비스 롤·RLS 정책 검증
- [ ] 카카오 로그인 E2E (회원가입·재로그인·로그아웃) — [MVP_SCOPE § 인증](./MVP_SCOPE.md#인증회원)
- [ ] 상품 목록 → 상세 → 체크아웃 → (스테이징) 결제 — [MVP_SCOPE § 결제·주문](./MVP_SCOPE.md#결제주문)
- [ ] 공동구매 참여 → 확정 → 결제 요청 플로우 — `finalize-deal`, join-complete
- [ ] 관리자: 상품 등록·주문 조회·공동구매 확정 — [MVP_SCOPE § 운영](./MVP_SCOPE.md#운영관리자)
- [ ] 문의 티켓 생성·관리자 처리 — support/admin
- [ ] [TODO_AUDIT.md](./TODO_AUDIT.md) **must-fix** 2건 대응 계획 수립 (웹훅·secret)
- [ ] 대시보드 **MVP 출시 준비** 미완료 0 또는 documented exception
- [ ] [LAUNCH_QA_CHECKLIST.md](./LAUNCH_QA_CHECKLIST.md) 핵심 시나리오 1회 이상

**Exit criteria:** 내부 Go, 치명적 버그 0, mock/demo 프로덕션 비활성화 계획 확정.

---

## Phase 2: Friends beta (지인 베타)

**목표:** 실제 사용자 10–50명 규모로 UX·CS·정책 문구를 검증합니다.

### 체크리스트

- [ ] 베타 전용 상품 1–3개 활성 (`active-products` 대시보드 녹색)
- [ ] 이용약관·개인정보·환불·공동구매 정책 URL 공유 — [MVP_SCOPE § 법무](./MVP_SCOPE.md#법무푸터)
- [ ] 사업자·통신판매업 정보 푸터 노출 QA — `/admin/settings/business`
- [ ] 리뷰 작성·신고·관리자 검수 — [MVP_SCOPE § 리뷰 partial](./MVP_SCOPE.md#고객-경험)
- [ ] 인앱 알림 센터 동작 (푸시 없음 안내) — [MVP_SCOPE post-beta § 푸시](./MVP_SCOPE.md#베타-이후-post-beta)
- [ ] 가격 알림: 인앱/DB만 동작, 알림톡 미발송 기대치 공유 — [TODO_AUDIT post-launch](./TODO_AUDIT.md#알림톡-베타-이후)
- [ ] CS 응대 매뉴얼 (환불·배송·공동구매 미달) — [REFUND_POLICY_DRAFT.md](./REFUND_POLICY_DRAFT.md)
- [ ] 베타 피드백 수집 채널 (폼·카톡·노션)

**Exit criteria:** 베타 NPS/이탈 사유 정리, Phase 3 PG 심사 자료 초안 완료.

---

## Phase 3: PG review / live payment test

**목표:** 토스페이먼츠 심사 통과 및 프로덕션 실결제·웹훅 안정화.

### 체크리스트

- [ ] `NEXT_PUBLIC_TOSS_CLIENT_KEY` · `TOSS_SECRET_KEY` 프로덕션 키 — [PG_REVIEW_PREP.md](./PG_REVIEW_PREP.md)
- [ ] 결제창·승인 API·실패/성공 리다이렉트 E2E — [PAYMENT_FLOW.md](./PAYMENT_FLOW.md)
- [ ] `/api/payments/toss/webhook` URL PG 콘솔 등록 · `TOSS_WEBHOOK_SECRET` — [TODO_AUDIT must-fix](./TODO_AUDIT.md#must-fix-before-launch)
- [ ] 소액 실결제 → 주문·결제 상태·환불 시나리오 1건
- [ ] **오픈 준비 상태** PG·웹훅·미처리 문의·환불 대기 점검 — `/admin/dashboard`
- [ ] `TOSS_BILLING_MOCK` 프로덕션 **false** (자동결제는 베타 이후) — [MVP_SCOPE post-beta](./MVP_SCOPE.md#베타-이후-post-beta)
- [ ] PG 심사용 캡처·정책 URL·테스트 계정 제출

**Exit criteria:** PG 승인, 실결제 3건 이상 성공, 웹훅 로그·에러 로그 critical 0.

---

## Phase 4: Small product launch (소규모 상품 런치)

**목표:** SKU·재고·배송을 제한한 채 실운영 매출을 검증합니다.

### 체크리스트

- [ ] 런치 SKU 재고·티어·마감일 설정 — admin products
- [ ] 배송·교환 정책 고지·리드타임 — product shipping info
- [ ] 일반 즉시결제 + 공동구매 1건 이상 동시 운영 — [MVP_SCOPE MVP 필수](./MVP_SCOPE.md#mvp-필수-must-have-for-launch)
- [ ] 정산: 수동·스프레드시트 프로세스 — [MVP_SCOPE deferred § 정산](./MVP_SCOPE.md#보류주의-deferred--caution)
- [ ] 일일 운영 루틴: 주문·문의·환불·에러 로그 — `/admin/dashboard`, `/admin/error-logs`
- [ ] **MVP 출시 준비** 필수 기능 진행률 ≥ 90% (리스크 항목 documented)

**Exit criteria:** 1주 무중단 주문·배송·CS, 환불 1건 이상 처리 검증.

---

## Phase 5: Official launch (정식 오픈)

**목표:** 공개 마케팅·트래픽 확대 및 베타 이후 로드맵 착수.

### 체크리스트

- [ ] `NEXT_PUBLIC_ALLOW_DEMO_LOGIN` 프로덕션 **off**
- [ ] `NEXT_PUBLIC_SITE_URL` · SEO · `robots.ts` / `sitemap.ts`
- [ ] [GO_LIVE_CHECKLIST.md](./GO_LIVE_CHECKLIST.md) 전체 Go
- [ ] 모니터링: critical error 알림·담당자 온콜
- [ ] 베타 이후 백로그 우선순위 확정 — [MVP_SCOPE post-beta](./MVP_SCOPE.md#베타-이후-post-beta)
  - 알림톡 · 빌링 실 API · 추천 · 정산 자동화 · 푸시
- [ ] [TODO_AUDIT.md](./TODO_AUDIT.md) 분기별 재실행

**Exit criteria:** 공개 Go-Live 선언, 72시간 critical 인시던트 없음, KPI 대시보드 주간 리뷰.

---

## Phase ↔ MVP 매핑 (빠른 참조)

| MVP_SCOPE 영역 | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 |
| --- | --- | --- | --- | --- | --- |
| 인증·상품·체크아웃 | ● | ● | ○ | ○ | ○ |
| 토스 PG·웹훅 | ● | ○ | ● | ● | ○ |
| 관리자·확정 | ● | ○ | ○ | ● | ○ |
| 정책·사업자 | ○ | ● | ● | ○ | ● |
| RLS·배포 | ● | ○ | ○ | ○ | ● |
| 알림톡·빌링·추천 | — | — | — | — | △ (post-beta) |

● = 필수 검증 · ○ = 해당 Phase에서 완료 · △ = 정식 오픈 후 로드맵

---

## 운영 연락

릴리스 게이트 회의 시 다음을 화면에 고정합니다.

1. `/admin/dashboard` — **MVP 출시 준비** (기능)  
2. `/admin/dashboard` — **오픈 준비 상태** (운영·PG)  
3. 본 문서 Phase Exit criteria
