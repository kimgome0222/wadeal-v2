# celloh v1 — 최종 캡처 & QA 보고서

> **용도:** 모든 개발·QA 단계 종료 후 **스크린샷 수집 + 보고서 작성**  
> **브랜드:** 사용자-facing **celloh** (KIBI DROP/EXCLUSIVE 등은 **v1 오픈 이후** 확장)  
> **관련:** [`MOBILE_UI_TREE.md`](./MOBILE_UI_TREE.md) · [`GO_LIVE_CHECKLIST.md`](./GO_LIVE_CHECKLIST.md) · [`qa-screenshots/README.md`](./qa-screenshots/README.md)

---

## 0️⃣ 캡처 전 준비 (5분)

```bash
# 빌드
npm run build

# dev 서버
npm run dev
# → http://127.0.0.1:3000 (또는 터미널에 표시된 포트)

# 스크린샷 폴더 생성 (날짜는 검수일)
mkdir -p docs/qa-screenshots/$(date +%Y-%m-%d)
```

| 항목 | 값 |
|------|-----|
| 브라우저 | Chrome (최신) |
| PC viewport | **1440 × 900** |
| 모바일 (앱 셸) | **430 × 932** ← celloh `max-w-[430px]` 기준 |
| 모바일 (보조) | **375 × 812** ← iPhone SE / 좁은 기기 |
| 테스트 URL | 로컬 또는 Vercel Preview/Production |
| 로그인 | 구매자 · 판매자 · 관리자 각 1계정 |

**캡처 팁:** DevTools → ⋮ → Capture screenshot (전체 페이지) 또는 `Cmd+Shift+P` → "Capture full size screenshot"

---

## 1️⃣ 캡처 대상 화면 & URL

### 홈 (`/`)

| 구역 | 확인 요소 | celloh 코드 매핑 |
|------|-----------|------------------|
| Header | 검색 · 알림 · 장바구니 | `components/header.tsx` |
| Hero | 카테고리 · 배너 · 신뢰 스트립 | `HomeCategoryIcons`, `CellohBrandBanner`, `HomeTrustStrip` |
| 레일 | 추천 → 인기 → 특가 → 전체 → 신규 | `components/home-catalog.tsx` |
| Footer | 회사·정책 링크 | `components/site-footer.tsx` |
| Bottom Nav | 홈·검색·찜·마이 | `components/app-bottom-navigation.tsx` |

> KIBI 템플릿의 "Drops / Featured Sellers" → celloh v1에서는 **특가 레일** · **신규 판매자 레일** · 검색 idle **추천 판매자**로 대응.

---

### 상품 상세 (`/product/{slug}`)

| 구역 | 확인 요소 |
|------|-----------|
| 갤러리 | `ProductImageGallery` |
| 요약 | 제목 · 가격(22px) · 찜 · trust lines |
| 판매자 | `ProductSellerPanel` → `/sellers/...` |
| 상세 이미지 | `ProductDetailVisualSection` |
| 스토리 | `SellerStorySection` (기본 접힘) |
| 탭/앵커 | 핵심정보 · 배송/환불 · 리뷰 · Q&A |
| 하단 | 비슷한 상품 · 최근 본 · sticky CTA |

**테스트 slug:** `1` 또는 카탈로그에 있는 실제 slug

---

### 판매자 페이지 (`/sellers/{id}`)

| 구역 | 확인 요소 |
|------|-----------|
| 배너 | 아바타 · 이름 · 인증 · 소개 |
| Trust | 평점 · 리뷰 · 판매 · 재구매 · 응답률 |
| CTA | 팔로우 · 상품 보기 · 문의 |
| 대표/전체 상품 | featured rail · 그리드 |
| 리뷰 · 스토리 | `SellerProfileReviewsSection`, `SellerStorySection` |

**테스트 URL:** `/sellers/celloh` · legacy `/sellers/celloh-셀러`

---

### 마이페이지

| 화면 | URL |
|------|-----|
| 대시 | `/mypage` |
| 주문 내역 | `/mypage/orders` |
| 찜 (관심 상품) | `/saved` |
| 리뷰 관리 | `/mypage/reviews` |
| 최근 본 | `/mypage/recent` |
| 쿠폰·포인트 | `/mypage/benefits` |
| 알림 | `/notifications` |
| 배송지 | `/mypage/addresses` |

---

### 장바구니 · 체크아웃 · 결제

| 화면 | URL |
|------|-----|
| 장바구니 | `/join-cart` |
| 상품 담기 | `/join/{slug}` |
| 주문서 | `/checkout/{joinId}` |
| Toss 결제 | `/payment/request/{orderId}` |
| 결제 성공/실패 | `/payment/success` · `/payment/fail` |

---

### 검색 (추가 권장)

| 화면 | URL |
|------|-----|
| Idle hub | `/search` |
| 결과 있음 | `/search?q=셀러` |
| 결과 없음 | `/search?q=__no_result__` |

---

## 2️⃣ 캡처 기록 체크리스트

> 캡처 후 **「문제 발견」·「비고」** 란을 실제 내용으로 채우세요.  
> **브랜드 컬러 (celloh):** White `#FFFFFF` · Ink `#1F2A24` · Border `#DDE8E2` · Primary `#2E5E4E` · Accent `#E28A3B` (강조 5% 이하)

| # | 화면 | 파일명 (예) | 브라우저/해상도 | ☐ 캡처 | 문제 발견 | 브랜드/색상 | 비고 |
|---|------|-------------|----------------|--------|-----------|-------------|------|
| 1 | 홈 | `01-home-pc-1440.png` | Chrome 1440px | ☐ | | Primary/Border 적용 | PC |
| 2 | 홈 | `02-home-mobile-430.png` | Chrome 430px | ☐ | | 동일 | 앱 셸 |
| 3 | 홈 | `02b-home-mobile-375.png` | Chrome 375px | ☐ | | 동일 | 보조 |
| 4 | 상품 상세 | `03-product-pc-1440.png` | Chrome 1440px | ☐ | | sticky bar | |
| 5 | 상품 상세 | `04-product-mobile-430.png` | Chrome 430px | ☐ | | CTA safe-area | |
| 6 | 판매자 | `05-seller-pc-1440.png` | Chrome 1440px | ☐ | | trust card | `/sellers/celloh` |
| 7 | 판매자 | `06-seller-mobile-430.png` | Chrome 430px | ☐ | | | |
| 8 | 검색 idle | `07-search-idle-430.png` | Chrome 430px | ☐ | | | |
| 9 | 검색 empty | `08-search-empty-430.png` | Chrome 430px | ☐ | | empty state | |
| 10 | 장바구니 | `09-join-cart-430.png` | Chrome 430px | ☐ | | | |
| 11 | 체크아웃 | `10-checkout-430.png` | Chrome 430px | ☐ | | 금액·버튼 | |
| 12 | 마이페이지 | `11-mypage-430.png` | Chrome 430px | ☐ | | | |
| 13 | 주문 내역 | `12-orders-430.png` | Chrome 430px | ☐ | | | 로그인 필요 |
| 14 | 찜 | `13-saved-430.png` | Chrome 430px | ☐ | | | |
| 15 | 결제 위젯 | `14-payment-toss-430.png` | Chrome 430px | ☐ | | Toss UI | 테스트 키 |

**발견 사항 메모 (캡처 후 작성):**

```txt
[날짜] [화면] [해상도]
- 
- 
```

---

## 3️⃣ 최종 QA 요약 체크리스트

| # | 항목 | ☐ PASS | ☐ FAIL | 메모 |
|---|------|--------|--------|------|
| 1 | `npm run build` 성공 | | | |
| 2 | PC(1440) / 모바일(430·375) 반응형 | | | |
| 3 | 상품 클릭 · 찜 · 장바구니 · 결제 | | | |
| 4 | 검색 / 필터 / 정렬 | | | |
| 5 | 판매자센터 / 관리자센터 핵심 기능 | | | |
| 6 | celloh 브랜드 컬러 적용 | | | ds 토큰 |
| 7 | 핑크 / 네온 / 올드 Wadeal 핫핑크 UI **없음** | | | |
| 8 | Empty / Loading / Error 상태 | | | |
| 9 | OAuth Google · Kakao | | | STEP 19 |
| 10 | Toss 결제 시나리오 | | | STEP 21 |
| 11 | UI 디자인 시스템 통일 (`ds` / `ui`) | | | |
| 12 | 모바일 버튼·카드·텍스트 clipping 없음 | | | 190px rail |

---

## 4️⃣ 보고서 작성 형식 (복사해서 채우기)

아래 블록을 복사 → `docs/QA_LAUNCH_REPORT_YYYY-MM-DD.md` 로 저장하거나 Notion에 붙여넣기.

---

### celloh v1 런칭 QA 보고서

**검수일:** YYYY-MM-DD  
**검수자:**  
**환경:** ☐ 로컬 ☐ Vercel Preview ☐ Production  
**URL:**  
**Git:** branch `_____` @ commit `_____`

---

#### 검수 화면 (스냅샷)

| 화면 | PC | 모바일 430 | 모바일 375 | 상태 |
|------|-----|------------|------------|------|
| 홈 | ☐ | ☐ | ☐ | |
| 상품 상세 | ☐ | ☐ | ☐ | |
| 판매자 페이지 | ☐ | ☐ | ☐ | |
| 검색 (idle / 결과 / empty) | — | ☐ | ☐ | |
| 마이페이지 | ☐ | ☐ | ☐ | |
| 장바구니 (`/join-cart`) | ☐ | ☐ | ☐ | |
| 체크아웃 | — | ☐ | ☐ | |
| Toss 결제 | — | ☐ | — | |

**스냅샷 경로:** `docs/qa-screenshots/YYYY-MM-DD/`

<!-- 아래에 이미지 링크 삽입 (§5 참고) -->

---

#### 발견 문제

| 분류 | 내용 | 심각도 |
|------|------|--------|
| 치명적 오류 | | P0 / P1 / P2 |
| UI 깨짐 | | |
| 모바일 문제 | | |
| 색상 불일치 | | |
| 문구 불일치 (celloh 카피) | | |
| 라우팅 / 404 | | |
| 데이터 / empty state | | |

---

#### 수정 내용 (이번 검수에서 반영)

| 파일 | 변경 내용 |
|------|-----------|
| `path/to/file.tsx` | |
| | |

---

#### 남은 작업

**반드시 수정 (런칭 blocker)**

- [ ] 
- [ ] 

**런칭 전 권장**

- [ ] 
- [ ] 

**나중에 고도화 (v1.1+)**

- [ ] KIBI DROP / EXCLUSIVE
- [ ] 브랜드·디자이너 입점
- [ ] 

---

#### 기능 유지 여부

| 기능 | ☐ 정상 | ☐ 이슈 | 비고 |
|------|--------|--------|------|
| 검색 | | | |
| 필터·정렬 | | | |
| 찜 (`/saved`) | | | |
| 장바구니 (`/join-cart`) | | | |
| 결제 (Toss) | | | |
| 주문 (`/mypage/orders`) | | | |
| 리뷰 | | | |
| 문의 (Q&A · support) | | | |
| 판매자센터 | | | |
| 관리자센터 | | | |

---

#### 브랜드 기준 준수 (celloh v1)

| 항목 | ☐ YES | ☐ NO | 비고 |
|------|-------|------|------|
| 핑크 / 핫핑크 UI 제거 | | | |
| 네온·그라데이션 과다 사용 없음 | | | |
| White + Ink `#1F2A24` + Border `#DDE8E2` | | | |
| Primary `#2E5E4E` · Accent `#E28A3B` (강조 ≤5%) | | | |
| 사용자-facing **celloh** 카피 (Wadeal/group-buy 잔재 없음) | | | |
| **KIBI** 브랜드 문구 UI **미노출** (v1 범위) | | | |
| 코드 식별자 `wadeal-*` / `WadealLogo` — **의도적 유지** | | | 리브랜드 범위 외 |

---

#### 빌드 · 배포

```txt
npm run build:  PASS / FAIL
Vercel deploy:  PASS / FAIL / N/A
OAuth:          PASS / FAIL / 미검
Toss:           PASS / FAIL / 미검
```

---

#### 최종 판정

☐ **런칭 가능** — P0 없음, STEP 25 YES 5/5  
☐ **조건부 런칭** — P1 ___건, 기한 ___  
☐ **런칭 보류** — P0 ___건

**서명 / 다음 액션:**

```txt

```

---

## 5️⃣ 스냅샷 Markdown 붙이기 형식

보고서 본문에 아래 블록을 복사하고 경로·캡션만 수정.

```markdown
## 홈

### PC (1440px)
![홈 PC](./qa-screenshots/2026-05-29/01-home-pc-1440.png)

### 모바일 (430px — 앱 셸)
![홈 모바일 430](./qa-screenshots/2026-05-29/02-home-mobile-430.png)

---

## 상품 상세

![상품 상세 모바일](./qa-screenshots/2026-05-29/04-product-mobile-430.png)

---

## 판매자 (`/sellers/celloh`)

![판매자 모바일](./qa-screenshots/2026-05-29/06-seller-mobile-430.png)

---

## 장바구니 · 체크아웃

| 장바구니 | 체크아웃 |
|----------|----------|
| ![join-cart](./qa-screenshots/2026-05-29/09-join-cart-430.png) | ![checkout](./qa-screenshots/2026-05-29/10-checkout-430.png) |
```

---

## 6️⃣ Cursor 실행 프롬프트 (캡처 후 이슈 수정)

```txt
docs/FINAL_CAPTURE_QA_REPORT.md §4 발견 문제 중 P0/P1만 수정해줘.
범위: UI만, 기능 삭제 금지, ds/ui 토큰 유지.
수정 후 npm run build.
보고서 §「수정 내용」표 형식으로 파일별 요약해줘.
```

```txt
캡처에서 홈 레일 카드 clipping 발견.
docs/MOBILE_UI_TREE.md STEP A 기준으로 app/globals.css 190px rail 확인·수정.
```

---

## 7️⃣ KIBI 템플릿 → celloh v1 매핑

| KIBI 체크리스트 용어 | celloh v1 실제 |
|---------------------|----------------|
| Drops | 특가 레일 (`specialPriceDeals`) |
| Featured Sellers | 신규 판매자 레일 + 검색 idle 추천 판매자 |
| White/Charcoal/Silver/Accent Red | White / Ink `#1F2A24` / Muted / Primary `#2E5E4E` + Coral accent |
| KIBI v1 런칭 | **celloh v1** 런칭 (KIBI는 post-launch) |

---

*마지막 업데이트: mobile-ui · celloh 430px shell*
