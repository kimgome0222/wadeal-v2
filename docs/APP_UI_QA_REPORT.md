# CELLOH 앱 UI 2차 고도화 QA 리포트

**브랜치:** `mobile-ui`  
**작업일:** 2026-05-30  
**범위:** 공통 앱 레이아웃 · 마이셀로 · 검색 · 카테고리 · 알림 · 내정보 관리

---

## 수정 파일 (16)

| 파일 | 변경 요약 |
|------|-----------|
| `app/page.tsx` | `AppBuyerLayout` 적용, 중복 헤더 제거 |
| `app/search/page.tsx` | 공통 앱 크롬 + 검색 idle/결과 분기 |
| `app/categories/page.tsx` | `CategoriesSplitView` + 공통 레이아웃 |
| `app/mypage/page.tsx` | 공통 레이아웃, 마이셀로 콘텐츠 |
| `app/mypage/settings/page.tsx` | 내정보 관리 앱형 UI, 레이아웃 |
| `app/join-cart/page.tsx` | 공통 레이아웃 |
| `app/notifications/page.tsx` | 공통 레이아웃 + 탭 필터 |
| `components/home-catalog.tsx` | 상단 Header 제거 (크롬으로 통합) |
| `components/bottom-navigation.tsx` | 5탭(홈/카테고리/검색/마이셀로/장바구니), z-index·불투명 |
| `components/icons.tsx` | `MenuIcon` 추가 |
| `components/mypage-page-content.tsx` | 로그인 전/후 마이셀로 분기 |
| `components/mypage-settings-content.tsx` | 쿠팡형 내정보 관리 섹션 |
| `components/notifications-list.tsx` | 카테고리 탭 필터 연동 |
| `components/search/search-idle-hub.tsx` | 급상승 검색어 섹션 추가 |
| `lib/design-system.ts` | 하단 탭 z-index/shadow |
| `middleware.ts` | `/mypage`, `/notifications`, `/join-cart` 게스트 접근 허용 |

---

## 신규 파일 (11)

| 파일 | 역할 |
|------|------|
| `components/app-buyer-layout.tsx` | 탭 루트 공통 레이아웃 래퍼 |
| `components/app-buyer-chrome.tsx` | sticky 헤더 + 검색 + 카테고리 바 |
| `components/app-sticky-header.tsx` | 로고 · 찜 · 알림 |
| `components/app-category-bar.tsx` | 마켓컬리형 sticky 카테고리 칩 |
| `components/mypage-cello-login.tsx` | 마이셀로 비로그인 유도 |
| `components/mypage-cello-logged-in.tsx` | 마이셀로 로그인 후 대시보드 |
| `components/categories-split-view.tsx` | 쿠팡형 좌/우 카테고리 |
| `components/notifications-app-tabs.tsx` | 알림 8탭 필터 |
| `components/search-trending-section.tsx` | 급상승 검색어 1~10위 UI |
| `lib/app/category-bar-items.ts` | 카테고리 바 항목 정의 |
| `lib/search/trending-search-terms.ts` | 급상승 검색어 mock (1시간 로테이션) |

---

## 앱 UI 변경점

### 상단 헤더
- sticky, 흰색 배경, z-40
- 좌: CELLOH 로고 / 우: 찜(`/saved`), 알림(`/notifications`)
- 로그인·회원가입·마이·장바구니 상단 버튼 제거

### 검색창 + 카테고리 바
- 헤더 아래 검색창 (포커스 시 `/search` 이동)
- 마켓컬리형 가로 스크롤 카테고리 칩 (초록 `#2E5E4E`, sticky)
- 전체/식품/생활/뷰티/패션/디지털/반려동물/혜택/판매자소식

### 하단 탭바
- 5탭: 홈 · 카테고리(≡) · 검색 · 마이셀로 · 장바구니
- `z-[60]`, 흰색 불투명, safe-area, 그림자
- 경로: `/`, `/categories`, `/search`, `/mypage`, `/join-cart`

### 마이셀로
- **비로그인:** "로그인이 필요해요" + OAuth/셀로 아이디 로그인 (네이버 준비중)
- **로그인:** 이름·설정, 요약 카드, 빠른 메뉴, 쿠팡형 텍스트 메뉴, 로그아웃

### 내정보 관리 (`/mypage/settings`)
- 프로필 아이콘 + 이름
- 회원 정보 / 수령인 정보 / 멤버십 / 계정 설정 / 기타 섹션
- 기존 비밀번호 변경·로그아웃 기능 유지

### 검색
- 최근·추천·인기 검색어 + **급상승 검색어 1~10위** (mock, 1시간 단위)

### 카테고리
- 좌측 카테고리 목록 + 우측 하위 링크 (쿠팡형 split view)
- 혜택/기획전 섹션 포함

### 알림
- 탭: 전체/주문배송/찜/판매자소식/재입고/혜택/리뷰/고객센터
- 데이터 없을 때 empty state 유지

---

## HTTP 테스트 결과 (localhost:3000)

| 경로 | HTTP | 비고 |
|------|------|------|
| `/` | 200 | PASS |
| `/search` | 200 | PASS |
| `/categories` | 200 | PASS |
| `/notifications` | 200 | PASS (게스트 empty) |
| `/join-cart` | 200 | PASS (게스트 로그인 유도) |
| `/mypage` | 200 | PASS (게스트 로그인 유도) |
| `/product/1` | 200 | PASS |
| `/sellers/celloh` | 200 | PASS |
| `/seller` | 307 | → seller/login (기존 동작) |
| `/seller/dashboard` | 307 | → seller/login (기존 동작) |

---

## lint / build

```
npm run lint  → PASS (tsc --noEmit)
npm run build → PASS (Next.js 16.2.6)
```

---

## 유지한 기능 / 제약 준수

- KIBI 미접근
- DB schema 변경 없음
- OAuth / Toss 로직 변경 없음
- 기존 route 전부 유지
- SEO metadata 수정 없음
- 기능 삭제 없음 (판매자/관리자 role 링크, 로그아웃 등 유지)

---

## 남은 이슈

1. **네이버 로그인** — 버튼 disabled (준비중), 기존 OAuth 미연동
2. **최근 주문 / 자주 구매 상품** — 가로 스크롤 상품 카드는 데이터 연동 전 empty/요약 텍스트 상태
3. **일부 메뉴** — 선물함, 구독서비스, 체험단, 대량주문 등 `준비중` meta 표시
4. **급상승 검색어** — mock 함수 (1시간 로테이션), 실시간 서버 연동 없음
5. **알림 재입고 탭** — 타입 매핑 empty, 필터 시 empty state
6. **상품 상세·카테고리 서브 페이지** — 탭 루트 외 페이지는 기존 `SubHeader` 레이아웃 유지 (의도적 최소 범위)
7. **middleware** — `/mypage` 루트·알림·장바구니만 게스트 허용, `/mypage/*` 하위는 로그인 필수 유지

---

## git status (작업 완료 시점)

수정 16 + 신규 11 (미커밋). `docs/QA_REPORT_FINAL.md`는 별도 QA 문서로 untracked.

**커밋/푸시:** 사용자 요청에 따라 수행하지 않음.
