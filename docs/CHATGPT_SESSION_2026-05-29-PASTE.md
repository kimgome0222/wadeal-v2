# ChatGPT 붙여넣기 통합 — 2026-05-29 (오늘 작업)

> Wadeal v2 only · `~/Documents/wadeal-v2` · KIBI 분리  
> 출처: 사용자 ChatGPT 대화 전문 붙여넣기 + 로컬 코드 대조 (2026-05-29)

## 한 줄 요약

**순서:** Wadeal 상용화·안정화 → 관리자/판매자 운영 보강 QA → 3모드 QA → **celloh 2단계(토큰·로고·SEO만)** → 공동구매 제거는 **맨 나중**

---

## 공통 원칙 (모든 Cursor 지시문에 포함)

```
- Wadeal만. ~/Documents/wadeal-v2 에서 작업 (Documents 루트 git 금지)
- KIBI/kibi/키비/BUNTO/keyring 코드·로고 혼입 금지
- 기존 공동구매 컨셉·라우트·Supabase lib/data 구조 유지
- Cloud mock 라우트 덮어쓰기 금지 (/join-cart, /checkout/[id], /product/[id] 본편)
- 원격 DB migration 적용 금지 (파일 생성만 OK)
- push / Vercel 배포 — 사용자 지시 전 금지
- 각 작업 후 npm run build (실패 시 webpack: npx next build --webpack)
```

---

## 작업 순서 (ChatGPT + Cursor 합의)

| 순서 | 블록 | 내용 | 로컬 상태 |
|------|------|------|-----------|
| **A** | Cloud 17 + 쿠팡 UX | signup, 검색모달, checkout guard 등 | ✅ 구현됨, **미커밋** |
| **B** | 관리자 운영 | 카테고리/배너/기획전/쿠폰 | ✅ 세션 스토어 CRUD + 홈 배너 연동 (2026-05-29) |
| **C** | 판매자센터 | 대시보드/상품요청/주문/CS/정산 | ✅ KPI 보강 + 출금요청 UI (2026-05-29) |
| **D** | 안정화 | KIBI 제거·홈 복구·build·fallback | ✅ build PASS, kibi 0건 |
| **E** | 3모드 QA | buyer/seller/admin 권한·모바일 | ⬜ |
| **F** | celloh 1단계 | 영향 분석만 | ✅ `CELLOH_REBRAND_AUDIT.md` |
| **G** | celloh 2단계 | 토큰+로고+SEO만 | ⬜ **공동구매 제거 금지** |
| **H** | 정산 출금요청 | ChatGPT 33~38단계 | ✅ migration 049 파일 + 로컬 패턴 (원격 미적용) |
| **I** | 배포 | git commit, push, vercel | 🔒 사용자 지시 후 |

---

## A. Cloud 17 + Phase 1 (완료 — 커밋·검증만)

| 항목 | 파일/경로 |
|------|-----------|
| signup/username auth | `app/signup`, `app/actions/auth/signup.ts` |
| recovery | `app/forgot-*`, `app/reset-password` |
| withdrawal | `app/mypage/withdrawal` |
| checkout phone guard | `lib/auth/identity-guards.ts` |
| search modal | `components/search/search-panel.tsx` |
| invite/viral/admin search | `app/mypage/invite`, `app/admin/viral`, `app/admin/search` |
| migrations | `047_profile_usernames.sql`, `048_featured_search_terms.sql` |

**체크:** `docs/CLOUD17_REIMPLEMENT_2026-05-29.md`

---

## B. 관리자 — 카테고리/배너/이벤트/쿠폰 (ChatGPT 요청)

### 요구 vs 로컬

| 기능 | ChatGPT 요구 | 로컬 |
|------|-------------|------|
| 카테고리 CRUD·순서·숨김 | ✅ | `/admin/categories` + `lib/data/admin-commerce.ts` (fallback 위주) |
| 배너 CRUD·기간·모바일/PC | ✅ | `/admin/banners` + `app/actions/admin-commerce.ts` |
| 기획전 CRUD·연결상품 | ✅ | `/admin/events`, `/events` |
| 쿠폰 CRUD·정액/정률·기간 | ✅ | `/admin/coupons` + `lib/data/admin-coupons.ts` (풀 CRUD) |
| 홈↔배너 연결 | ✅ | `lib/data/admin-commerce.ts` → HeroBanner |
| 체크아웃↔쿠폰 | ✅ | `CheckoutDiscountSection` |
| admin 권한 | ✅ | `isAdminUser` + server actions |

### 아직 약한 점

- DB migration 전 **fallback 정적 데이터** 의존 (배너/카테고리/기획전)
- 카테고리 **노출 순서 드래그 UI** 미흡 가능
- 쿠폰 **특정회원/신규회원 발급** UI — 코드 확인 필요
- **이미지 업로드**는 URL 입력 수준 (Storage 연동 deferred)

---

## C. 판매자센터 강화 (ChatGPT 요청)

### 요구 vs 로컬

| 기능 | 로컬 경로 |
|------|-----------|
| 대시보드 KPI | `/seller/dashboard` |
| 상품 등록 요청 | `/seller/product-requests`, `/seller/products` |
| 주문·송장 | `/seller/orders`, `/seller/orders/[id]` |
| CS·리뷰 답글 | `/seller/support`, `/seller/reviews`, `/seller/cs-reviews` |
| 정산 | `/seller/finance/settlements` (`SellerSettlementsContent`) |
| 알림 | `/seller/notifications` |
| 권한 gate | `getSellerAccessContext`, pending/rejected/suspended pages |

### ChatGPT 33~38 정산 출금요청 — **로컬과 다름**

ChatGPT가 제안한 코드는 **그대로 붙이면 안 됨**:

- `createClient` / `requireSeller` / `settlements` 테이블 직접 — 로컬은 `seller-settlement-records`, `admin-seller-settlements.ts`, `seller-finance` actions 사용
- `payout_requested`, `payout_bank_name` 컬럼 — **로컬 migration에 없음**
- `requestPayout.ts`, `adminApprovePayout.ts` — **미생성**

**로컬에 있는 것:** `confirmSellerSettlementAction`, `adminConfirmSellerSettlementAction`, `adminMarkSellerSettlementPaidAction`, 알림 `notifySellerSettlementPaid`

**해야 할 것 (로컬 패턴으로):**

1. migration 파일: `settlements` 또는 `seller_settlement_records`에 payout 컬럼 (파일만)
2. `app/actions/seller-finance.ts` — 출금요청 action 추가
3. `app/actions/admin-seller-settlements.ts` — 승인/거절 (기존 확장)
4. `SellerSettlementsContent` — 계좌 입력 폼
5. `/admin/settlements` — payout_requested 목록 UI

---

## D. 안정화·KIBI·build (ChatGPT + 사용자 보고)

| 이슈 | 상태 |
|------|------|
| `notifySellerSettlementPaid` 중복 import | ✅ 현재 파일 1회 import만 (E005 해결된 것으로 보임) |
| KIBI 로고 헤더 혼입 | ✅ repo grep **kibi 없음** — 재발 시 `components/wadeal-logo.tsx` 확인 |
| 홈 상품 사라짐 / 찜→로그인 | ⬜ **QA 필요** (Supabase env·mock fallback) |
| Turbopack ENOENT | webpack 빌드 우회 가능 |
| Documents에서 git | ❌ 반드시 `wadeal-v2` 폴더 |
| Vercel 100MB | ✅ `.gitignore`에 backups/*.tar.gz, backups 폴더 없음 |
| 스플래시 안 뜸 | ⬜ `components/app-splash.tsx` QA |

---

## E. celloh 리브랜딩

### 1단계 — ✅ 완료

- `docs/CELLOH_REBRAND_AUDIT.md` (코드 수정 없음)

### 추가 제외 (오늘 ChatGPT 정본)

- 판매자 **스토리 피드 / 영상 피드 / 생산과정 필수** 제외
- **농산물 전용** 구조 제외
- (기존) 공동구매 팀 모집·100명 모집·빨간색 중심 제외

### 2단계 — **지금 할 차례 아님, 하려면 토큰만**

- Primary `#2E5E4E`, Accent `#E28A3B`, BG `#FFFFFF`
- `tailwind.config.ts`, `globals.css`, `lib/ui.ts`, `lib/seo/site.ts`
- `wadeal-logo.tsx`, wordmark, manifest, metadata
- **절대 금지:** group_buy 제거, join-cart/checkout 로직 변경, DB migration

---

## F. Git / 배포 루틴 (ChatGPT)

```bash
# 항상 먼저
cd ~/Documents/wadeal-v2

# 작업 끝
git add .
git commit -m "작업 내용 설명"

# (사용자 지시 후)
git push origin main

# 빌드 확인 (안정)
rm -rf .next
NODE_OPTIONS='--max-old-space-size=6144' npx next build --webpack

# (사용자 지시 후) Vercel
npx vercel --prod
```

**백업 zip (선택):**

```bash
cd ~/Documents
zip -r wadeal-backup-$(date +%Y%m%d).zip wadeal-v2 \
  -x "wadeal-v2/node_modules/*" -x "wadeal-v2/.next/*"
```

---

## Cursor 지시문 — Part 1: 상태 점검 + 미커밋 정리

```txt
Wadeal만. ~/Documents/wadeal-v2.

1. git status && npm run build
2. docs/CLOUD17_REIMPLEMENT_2026-05-29.md vs 실제 파일 대조
3. Cloud17 미커밋 변경사항 목록 출력 (커밋은 사용자 지시 전 하지 말 것)
4. grep -ri kibi . → 0건 확인
5. 홈(/) 상품 렌더링, 찜→로그인, 스플래시 동작 smoke 확인
6. notifySellerSettlementPaid 중복 import 없는지 app/actions/admin-seller-settlements.ts 확인
7. 결과를 docs/CHATGPT_SESSION_2026-05-29-PASTE.md 체크리스트에 반영
```

---

## Cursor 지시문 — Part 2: 관리자 운영 QA

```txt
Wadeal만. ~/Documents/wadeal-v2. 디자인 톤 유지.

목표: 관리자 카테고리/배너/기획전/쿠폰 상용화 수준 QA·보강.

확인:
- app/admin/categories, banners, events, coupons
- app/actions/admin-commerce.ts, app/actions/admin-coupons/*
- lib/data/admin-commerce.ts, lib/data/admin-coupons.ts
- 홈 HeroBanner ↔ admin 배너 연결
- /events ↔ admin events
- /mypage/benefits, checkout ↔ admin coupons

작업:
- admin-only 서버 액션 재검증
- DB 없을 때 fallback 안전 동작
- 쿠폰: 정액/정률/최소주문/기간/발급수 UI 누락 보강
- 카테고리: 노출순서·숨김 UI 보강 (가능 범위)
- build PASS

금지: 원격 DB, push, Vercel
```

---

## Cursor 지시문 — Part 3: 판매자센터 QA

```txt
Wadeal만. ~/Documents/wadeal-v2.

목표: 판매자센터 상용화 QA (ChatGPT 범위).

확인 경로:
- /seller/dashboard — KPI 카드
- /seller/product-requests — 승인/반려/재요청
- /seller/orders, /seller/orders/[id] — 송장·상태
- /seller/support, /seller/reviews — CS·답글
- /seller/finance/settlements — 정산 내역
- /seller/notifications

권한:
- pending/rejected/suspended → apply/pending/rejected/suspended
- approved seller만 주문/정산 접근

build PASS. push/Vercel/원격 DB 금지.
```

---

## Cursor 지시문 — Part 4: 정산 출금요청 (로컬 패턴)

```txt
Wadeal만. ChatGPT 33~38 코드는 복붙 금지 — 로컬 seller-settlement-records 패턴 사용.

1. supabase/migrations/049_seller_payout_request.sql (파일만):
   seller_settlement_records 또는 settlements에
   payout_bank_name, payout_account_number, payout_account_holder,
   payout_requested_at, payout_reject_reason, payout_rejected_at
2. app/actions/seller-finance.ts — requestSellerPayoutAction
3. app/actions/admin-seller-settlements.ts — approve/reject payout
4. components/seller-settlements-content.tsx — pending 시 계좌 입력 폼
5. app/admin/settlements — payout_requested 필터·승인 UI (기존 페이지 확장)
6. lib/notifications/seller-events — payout_requested/rejected/completed
7. npm run build

금지: createClient/requireSeller 새 패턴, 원격 DB apply, push, Vercel
```

---

## Cursor 지시문 — Part 5: 3모드 QA + 오픈 전

```txt
Wadeal만. docs/CHATGPT_TASK_QUEUE Phase 4 기준.

buyer / seller / admin 테스트 계정으로:
- 권한 분리 (타 역할 URL 접근 차단)
- 주문→타임라인→알림
- 리뷰: 구매자만, 15일, 중복방지
- 모바일 viewport smoke
- docs/PRE_DEPLOY_CHECKLIST.md, POST_DEPLOY_QA.md 항목 tick

결과: docs/QA_REPORT_YYYY-MM-DD.md (신규 또는 갱신)
build PASS
```

---

## Cursor 지시문 — Part 6: celloh 2단계 (Wadeal 안정화 **후**)

```txt
celloh 리브랜딩 2단계 — 토큰+로고+SEO만.

변경:
- tailwind.config.ts, app/globals.css, lib/ui.ts — #2E5E4E / #E28A3B / #FFFFFF
- components/wadeal-logo.tsx, public wordmark/icon — celloh 소문자
- lib/seo/site.ts, app/layout.tsx, manifest — celloh, www.celloh.co.kr, 슬로건

안전 문구만 Wadeal→celloh (공동구매 설명은 TODO 유지)

절대 금지:
- join/group_buy/price_tiers/checkout/join-cart 로직
- 라우트 삭제, DB migration, push, Vercel

npm run build 후 보고: 수정 파일, 남은 wadeal 문자열 수
```

---

## 새 채팅 재개용 (한 블록)

```txt
Wadeal 프로젝트 이어서 진행.

경로: ~/Documents/wadeal-v2 (Wadeal only, KIBI 금지)
정본: docs/CHATGPT_SESSION_2026-05-29-PASTE.md, docs/CHATGPT_TASK_QUEUE_2026-05-29.md

현재:
- Cloud 17 재구현 ✅ (미커밋)
- build PASS (Turbopack)
- celloh 1단계 분석 ✅ — 2단계는 토큰만, 공동구매 제거 금지
- 관리자/판매자 페이지 구조 ✅ — QA·정산출금요청 보강 필요

다음 Part 1부터: 상태 점검 → Part 2 관리자 QA → Part 3 판매자 QA
push/Vercel/원격 DB는 지시 전 금지.
각 작업 후 npm run build.
```

---

## 관련 문서

- `docs/CHATGPT_TASK_QUEUE_2026-05-29.md` — Phase 0~6 통합
- `docs/CLOUD17_REIMPLEMENT_2026-05-29.md`
- `docs/CELLOH_REBRAND_AUDIT.md`
- `docs/COUPANG_UX_ROADMAP.md`
- `docs/work-queue.json` — W001~W188, E005(B006) build 이슈
