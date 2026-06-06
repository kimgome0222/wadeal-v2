# Wadeal v2 — ChatGPT 작업 재개 핸드오프

> 생성: 2026-05-29 · HEAD 기준 전체 현황 정리

## 프로젝트

| 항목 | 값 |
|------|-----|
| 경로 | `/Users/kimgana/Documents/wadeal-v2` |
| 스택 | Next.js · Supabase · Toss Payments · Kakao OAuth |
| 컨셉 | 공동구매(모일수록 할인) · 쿠팡형 UX · 화이트/블랙/레드 |
| 정본 | `docs/work-queue.json`, `docs/START.md`, `docs/DEFERRED_ISSUES.md` |
| ChatGPT 통합 큐 | `docs/CHATGPT_TASK_QUEUE_2026-05-29.md` |

## 재개 명령

```
시작 — docs/START.md 우선순위대로. 각 작업 끝 npm run build. push/vercel/원격 DB는 마지막.
```

## 현재 상태

| 항목 | 상태 |
|------|------|
| 브랜치 | `main` |
| origin 대비 | unpushed commits (push ❌ HTTPS 인증) |
| `npm run build` | **PASS** |
| Supabase 030–045 | applied (038 알림, 044 Storage — 사용자 확인) |
| 046 categories | 선택 적용 (앱은 정적 catalog fallback) |

---

## 완료된 작업

### MVP / 데이터
- 홈 → 상품 → join → checkout → join-complete 전체 클릭 흐름
- Supabase 카탈로그 (`products`, `group_buy_deals`, `price_tiers`) + mock fallback
- migrations 001–046 (파일), `reset_and_seed.sql`

### 인증 / 마이페이지
- 카카오 커스텀 OAuth (profile_nickname/image only, KOE205 회피)
- `/mypage/profile` 쿠팡형 개인정보, 배송지·주문·알림·찜
- 가격 알림 DB 저장 → `/mypage/alerts`
- 닉네임/카카오 이름 표시 (UUID 아님)

### 홈 / 검색 / 카탈로그
- Wadeal 워드마크, Pretendard, 세션 스플래시
- 2단 헤더 + 검색창 + 카테고리 아이콘 (가로 스크롤)
- `/search`, `/category/[slug]` 필터·하위 카테고리
- `/categories` 전체 카테고리 보기 (2026-05-29 추가)
- deal card skeleton, sort bar, lazy loading 개선

### Buyer / Seller / Admin
- 주문·환불요청·배송·구매확정·리뷰·고객센터
- 판매자 입점·상품·주문·공지·정산·리뷰답글
- 관리자 상품/주문/환불/입점심사/정산/migration 체커

### 알림 / QA
- 038 알림 통합, RPC/컬럼 폴백, mock success 제거
- Post-DB QA 통과 (`docs/QA_REPORT_2026-05-29.md`)
- KIBI/구 앱 코드 잔존 없음

---

## 진행 중 / 최근 작업

- 쿠팡 UX 로드맵: 카테고리 전체 보기 ✅, skeleton/lazy ✅
- 남음: 상품상세 탭, 장바구니 뱃지, 체크아웃 요약, PWA splash
- S003 입점 심사, S004 금지상품 검수 (로컬 진행 중)

---

## 미완성 (692건 추적)

| 구분 | 건수 |
|------|------|
| W001~W188 | 188 |
| backlog_incomplete | 504 |
| 외부 지연 (backlog) | 172 |
| 로컬 가능 (backlog) | 332 |
| 외부 지연 (W) | 58 |
| 로컬 가능 (W) | 130 |

### 부분완료 기능
- Toss 실결제/실환불 live — deferred
- Kakao 가격 알림 발송 — DB만, UI "준비 중"
- Kakao OAuth 프로덕션 — deferred
- 쿠폰함 UI — "준비 중"
- 리뷰 좋아요 — localStorage
- seller-documents/settlement-files — E2E 수동 QA 필요

### 재개 우선순위
1. Q-BUILD ✅
2. Q-DOABLE-BACKLOG (N002~N010, S001~S004 등)
3. W001~188 (로컬 가능)
4. Q-EXTERNAL-AUTH-LAST (push, Vercel, Toss, Kakao)

---

## 오류 / 블로커

| ID | 문제 | 해결 |
|----|------|------|
| B003/E003 | git push HTTPS auth 실패 | `gh auth login` 또는 SSH |
| B004/E004 | Vercel prod | push 후 `npx vercel --prod` |
| AUTH-001 | Kakao OAuth prod | Redirect URI + Supabase provider |
| PAY-001 | Toss live | `TOSS_SECRET_KEY` + cancel API |
| W007,W170,W173,W175-177 | push 실패 | B003과 동일 |

### must-fix (출시 전)
- `lib/payments/toss/webhook/process-webhook.ts` — webhook secret 검증
- `verify-signature.ts` — Payment Query API 재검증

---

## 백업 / 복구

```bash
git tag -l 'backup-*'
git checkout backup-2026-05-29-handoff

# tarball 복원
tar -xzf ~/Documents/wadeal-backups/wadeal-v2-2026-05-29-handoff.tar.gz -C ~/Documents/
```

## ChatGPT 프롬프트 (복붙)

```
Wadeal v2 작업 재개. 경로 ~/Documents/wadeal-v2.
build PASS. Supabase 030-045 applied.
완료: MVP flow, Supabase, Kakao OAuth local, mypage, search/category, buyer/seller/admin.
미완: work-queue 692건, Toss live, Kakao prod, git push blocked.
우선순위: docs/START.md — Q-DOABLE-BACKLOG → W001~188 → Q-EXTERNAL-AUTH-LAST.
각 작업 후 npm run build. push/vercel/원격 DB는 마지막.
```
