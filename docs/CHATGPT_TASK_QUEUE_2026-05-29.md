# ChatGPT 작업 큐 통합 — 2026-05-29

> Wadeal v2 only · `~/Documents/wadeal-v2` · KIBI 분리  
> 출처: ChatGPT 공유 대화 2건 (로그인 없이 본문 미노출 → Cursor/과거 세션 붙여넣기 + `work-queue.json` 교차 확인)

| # | 출처 | 제목 |
|---|------|------|
| 1 | [Wadeal 프로젝트 상태 점검](https://chatgpt.com/share/6a198463-5f68-83a8-8649-80f175a29fd1) | 배포 안정화 · Cloud 17 · 쿠팡형 UX |
| 2 | [와딜 프로젝트 진행](https://chatgpt.com/share/6a198564-0fc8-83a3-af7c-2c218cd370fd) | 상용화 · 7차 안정화 · 3모드 QA |
| 3 | **오늘 붙여넣기** | 관리자/판매자 운영 · celloh · 정산출금 · KIBI/build 이슈 |

**상세 (Part 1~6 Cursor 지시문):** `docs/CHATGPT_SESSION_2026-05-29-PASTE.md`

## 공통 원칙 (두 대화 공통)

```
경로: ~/Documents/wadeal-v2 (Documents 루트 git 금지)
Wadeal만 — KIBI/kibi/키비/BUNTO/keyring 흔적 제거·혼입 금지
기존 라우트·데이터 구조·디자인 톤(화이트/블랙/레드) 최대 유지
Cloud mock 라우트(/cart, /checkout/page, /products/[slug]) 덮어쓰기 금지
로컬 본편: /join-cart, /checkout/[id], /product/[id], Supabase lib/data
각 작업 후 npm run build
push / Vercel / 원격 DB migration 적용 — 사용자 지시 전 금지
외부 인증·실결제·Provider — docs/EXTERNAL_AUTH_DEFERRED.md (마지막)
```

## 재개 명령

```
시작 — docs/CHATGPT_TASK_QUEUE_2026-05-29.md Phase 순서대로.
각 작업 끝 npm run build. push/vercel/원격 DB는 마지막.
```

---

## Phase 0 — 배포·인프라 안정화 (대화 1)

| # | 작업 | 상태 |
|---|------|------|
| 0.1 | `cd ~/Documents/wadeal-v2` + git status/log | ✅ |
| 0.2 | `backups/*.tar.gz` 프로젝트 밖 + `.gitignore` | ⚠️ 확인 필요 |
| 0.3 | Turbopack ENOENT → webpack 우회 또는 빌드 안정화 | ✅ 로컬 Turbopack PASS |
| 0.4 | Vercel env (Supabase/Toss/SITE_URL/Kakao) | 🔒 지시 후 |
| 0.5 | buyer/seller/admin 3계정 권한 QA | ⬜ |
| 0.6 | Supabase RLS 전체 점검 | ⬜ |
| 0.7 | 오픈 전 체크리스트 (`PRE_DEPLOY`, `POST_DEPLOY_QA`, `OPEN_CHECKLIST`) | ⬜ |

### Kakao OAuth (대화 2 — env 메모)

- Supabase Auth Kakao **아님** → 전용 Kakao OAuth (`/auth/kakao/callback`)
- scope: `profile_nickname`, `profile_image` only
- 테스트: **wadeal-test** 앱 / 운영: wadeal 앱 (심사 후)
- 서버 전용: `KAKAO_REST_API_KEY`, `KAKAO_CLIENT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`
- Redirect: `http://localhost:3000/auth/kakao/callback`, `https://wadeal-v2.vercel.app/auth/kakao/callback`

---

## Phase 1 — Cloud 17 선별 재구현 (대화 1)

| 작업 | 상태 | 비고 |
|------|------|------|
| `/signup` + 아이디 로그인 | ✅ | 미커밋 |
| `/forgot-username`, `/forgot-password`, `/reset-password` | ✅ | |
| `/mypage/security`, `/mypage/withdrawal` | ✅ | |
| 본인인증 checkout guard | ✅ | `lib/auth/identity-guards.ts` |
| 검색 모달/자동완성 | ✅ | `search-panel`, `search-box` |
| `/mypage/invite`, `/admin/viral`, `/admin/search` | ✅ | |
| `/marketing-terms` | ✅ | |
| migration 047, 048 | ✅ 파일만 | 원격 미적용 |
| 결제수단 7종 UI 보강 | ⬜ | Toss 연동은 있음 |
| Auth E2E (Google/Kakao Provider) | 🔒 | deferred |

상세: `docs/CLOUD17_REIMPLEMENT_2026-05-29.md`

---

## Phase 2.5 — 관리자 운영 (오늘 ChatGPT)

| 작업 | 상태 |
|------|------|
| `/admin/categories` 상·하위, 순서, 숨김 | ⚠️ fallback + UI QA |
| `/admin/banners` CRUD·기간·디바이스 | ⚠️ URL 입력 수준 |
| `/admin/events` + `/events` | ✅ 구조 있음 |
| `/admin/coupons` 정액/정률/기간 | ✅ 풀 CRUD |
| 홈·체크아웃·마이페이지 연결 | ⚠️ QA |

## Phase 2.6 — 판매자센터 (오늘 ChatGPT)

| 작업 | 상태 |
|------|------|
| 대시보드 KPI | ✅ 구조 |
| 상품 등록 요청·검수 | ✅ |
| 주문·송장·상태 | ✅ |
| CS·리뷰 답글 | ✅ |
| 정산 내역 | ✅ `/seller/finance/settlements` |
| **출금요청→관리자 승인/거절** | ⬜ ChatGPT 33~38, **로컬 미구현** |
| seller 알림 | ✅ |

## Phase 2.7 — celloh (오늘 ChatGPT)

| 단계 | 상태 |
|------|------|
| 1단계 영향 분석 | ✅ `CELLOH_REBRAND_AUDIT.md` |
| 2단계 토큰+로고+SEO | ⬜ **Wadeal 안정화 후** |
| 공동구매 제거 | ❌ **지금 하지 말 것** (XL) |

추가 제외: 스토리/영상 피드, 농산물 전용, 생산과정 필수

---

## Phase 2 — 쿠팡형 UX (대화 1 + 2)

| 작업 | 상태 |
|------|------|
| 상/하위 카테고리 + `/categories` | ✅ |
| `/search` 필터·정렬 (인기/가격/리뷰/신상) | ✅ |
| `/category/[slug]` 하위 탭·가격필터 | ✅ |
| 홈 2단 헤더 + 장바구니 뱃지 | ✅ |
| 상품 상세 탭 (설명/배송·교환/리뷰) | ✅ |
| 검색 모달 (최근/인기/자동완성) | ✅ |
| 체크아웃·주문완료 쿠팡형 요약 | ⬜ **다음** |
| 홈 로고/워드마크 퀄리티 (쿠팡·오늘의집 참고) | ⚠️ ChatGPT 피드백 |
| 카테고리/필터 아이콘 크기 조정 | ⚠️ ChatGPT 피드백 |

로드맵: `docs/COUPANG_UX_ROADMAP.md`

---

## Phase 3 — 7차 안정화 / 오픈 전 (대화 2 핵심)

ChatGPT **「기능 추가보다 안정화 우선」** 단계.

### 3.1 빌드·타입·브랜딩

- [ ] `npm run build` + `npx next build --webpack` 둘 다 PASS
- [ ] import/type/unused/broken route 정리
- [ ] KIBI/kibi/키비/BUNTO/keyring/figure 잔존 검색·제거
- [ ] Wadeal 브랜딩 통일 (헤더 워드마크)

### 3.2 DB fallback 방어

테이블 없어도 앱이 죽지 않게 (`[]` / `null` / default):

- `business_settings`, `notifications`, `refunds`, `seller_settlements`, `seller_product_requests`

### 3.3 홈·흐름 복구 점검

- 메인딜 / 인기 공동구매 / join CTA / wishlist redirect / product cards / category links
- loading · empty · error skeleton (홈, 상품, 주문, mypage, seller, admin, notifications, support, reviews)

### 3.4 seller/admin·알림·타임라인

- seller status routing (pending/rejected/suspended)
- admin unauthorized handling
- notifications unread + fallback
- order_timelines (paid/shipped/delivered/refund) fallback

### 3.5 출시 전 코드 정리 (W 출시 전 정리)

- production mock/demo login 비활성 (`NEXT_PUBLIC_ALLOW_DEMO_LOGIN=false`)
- console.log 민감정보 제거 → `logError` / activity logs
- TODO/FIXME → `docs/TODO_AUDIT.md` 분류
- env 방어 (server secret 클라이언트 노출 금지)
- `docs/GO_LIVE_CHECKLIST.md`, `docs/MVP_SCOPE.md` 반영

---

## Phase 4 — 3모드 통합 QA (대화 2 — 전체 점검)

**원칙:** 없으면 생성, 있으면 중복 생성 금지, mock 성공으로 숨기지 말 것, 권한 검증 필수.

### 4.1 구매자 라우트

`/`, `/login`, `/product/[id]`, `/join/[id]`, `/checkout/[id]`, `/payment/*`, `/mypage/*`, `/notifications`, `/saved`, `/support/*`

기능: 로그인 redirect, 참여·주문·결제, 배송지, 결제수단 UI, 주문/타임라인, 취소·환불, 리뷰, 찜, 최근본, 쿠폰/포인트, 알림 read/unread, CS 문의

### 4.2 판매자 라우트

`/seller/apply`, `/seller/dashboard`, `/seller/products`, `/seller/orders`, `/seller/reviews`, `/seller/settlements`, `/seller/support`, `/seller/notices` …

기능: 입점·서류·정산계좌, status gate, 상품 등록 요청·검수, 송장·배송상태, 리뷰 답글, 정산

### 4.3 관리자 라우트

상품/판매자 승인, 주문/환불, 카테고리/배너/기획전/쿠폰, 신고 리뷰, 정산, activity/error logs

### 4.4 DB 적용 후 연결 확인 (SQL 적용 완료 전제 QA)

`business_settings`, `notifications`, `seller_notices`, `seller_documents`, `seller_review_checks`, `category_review_rules`, `product_review_checklists`, `seller_product_requests`, `seller_settlements`, `order_timelines`, `refunds`

---

## Phase 5 — 상용화 기능 묶음 (대화 2 · work-queue W 영역)

디자인 변경 금지 · Supabase 실연동 · `npm run build` 통과.

| 영역 | ChatGPT 요청 요약 | 로컬 대략 |
|------|-------------------|-----------|
| 공동구매 마감 처리 | 마감·가격 확정·알림 | ✅ 구조 있음, QA |
| PG/Toss | 위젯·webhook·가상계좌·빌링키 | ✅ API, 🔒 live |
| 배송/송장/구매확정 | tracking API | ✅ |
| 리뷰/별점 | 조건·신고·블라인드 | ✅, QA |
| 찜/최근본/참여함 | saved, recent, join-cart | ✅ |
| 검색/카테고리/필터 | 쿠팡형 sort/filter | ✅ |
| 알림 | 마감·티어·배송 | ✅ 038 |
| 공유/초대/바이럴 | share, referral, invite | ✅ |
| CS/환불 | support, order-claims, admin/refunds | ✅ |
| 정산/입점 | sellers, settlements | ✅ |
| 보안/RLS | server 검증, admin guard | ⬜ QA |
| SEO/PWA | manifest, sitemap, og | ✅ 파일, QA |
| 약관/정책 | terms, privacy, refund, finance, marketing | ✅ |
| 마이페이지 쿠팡형 | 대시보드·스텝per·계정허브 | ✅ 대부분 |
| 입점 심사·금지상품 | S003/S004, PROHIBITED docs | ⚠️ partial |
| 운영 대시보드/통계 | admin dashboard | ✅ |
| 재고/품절/구매한도 | inventory | ✅ |
| 쿠폰/포인트/배송비 | discounts, shipping fee | ✅ |
| 본인인증/주문자 검증 | phone_verified, identity-guards | ✅ guard |
| 사업자/푸터 운영정보 | business_settings | ✅ |
| 에러로그/모니터링 | admin error-logs | ✅ |
| Go-live readiness | `/admin/go-live-readiness` | ✅ |

전체 692건: `docs/work-queue.json`, `docs/BACKLOG_INCOMPLETE.md`

---

## Phase 6 — celloh 리브랜딩 (대화 1 · **코드 수정 전**)

1단계 분석만 완료 → `docs/CELLOH_REBRAND_AUDIT.md`

**순서:** Phase 1~5 (Wadeal 상용화) 완료 후 2단계(토큰·문구) → 3단계(판매자 신뢰 UX) → 4단계(공동구매 UI 축소)

---

## 지금 Cursor에 넣을 다음 지시문

```txt
Wadeal만. ~/Documents/wadeal-v2.

1. docs/CHATGPT_TASK_QUEUE_2026-05-29.md Phase 2 잔여:
   - 체크아웃·주문완료 쿠팡형 요약 UI
2. Phase 3:
   - backups/*.tar.gz 외부 이동 + .gitignore
   - webpack build 확인
   - KIBI 잔존 grep
3. Phase 4:
   - buyer/seller/admin 3계정 smoke QA (문서화)
4. Cloud17 + Phase1 미커밋 변경사항 정리 (커밋은 사용자 지시 시)
5. migration 047/048 원격 적용은 사용자 지시 전 파일만
6. 각 작업 후 npm run build
```

---

## 관련 문서

| 파일 | 용도 |
|------|------|
| `docs/START.md` | 재개 우선순위 (Q-BUILD → backlog → external last) |
| `docs/work-queue.json` | W001~W188 + backlog 692건 |
| `docs/CLOUD17_REIMPLEMENT_2026-05-29.md` | Cloud 17 재구현 결과 |
| `docs/PHASE1_CHECKPOINT_2026-05-29.md` | Phase 1 체크포인트 |
| `docs/COUPANG_UX_ROADMAP.md` | 쿠팡형 UX |
| `docs/CELLOH_REBRAND_AUDIT.md` | celloh 1단계 분석 |
| `docs/EXTERNAL_AUTH_DEFERRED.md` | push/Vercel/Provider 지연 항목 |
