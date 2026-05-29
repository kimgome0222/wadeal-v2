# celloh — 정적 코드 검토 보고

> 검토일: 2026-05-29  
> 방법: `npx tsc --noEmit` (build 미실행) · import/패턴 grep · 수동 구조 검토  
> 기준: `f85b10b` + QA·정적검토 후속 수정

---

## 검증 결과 요약

| 항목 | 결과 |
|------|------|
| TypeScript (`tsc --noEmit`) | **PASS (0 errors)** |
| `npm run build` | **미실행** (요청대로) |
| import / 경로 | **오류 없음** |
| 수정 반영 | **완료** (아래 P0~P1) |

---

## 1. 발견 문제 · 수정안 · 처리

### P0 — HTML / 클릭 (수정 완료)

| # | 문제 | 파일 | 수정 |
|---|------|------|------|
| 1 | `Link` 안에 `button`(저장·팔로우·판매자 모달) — invalid HTML, 클릭 간섭 | `deal-card-featured.tsx` | `deal-card.tsx`와 동일 **stretched link** 패턴 |
| 2 | 동일 | `home-recommended-deal-card.tsx` | stretched link + `z-10` 인터랙티브 영역 |

### P1 — 미연결 컴포넌트 / dead code (수정 완료)

| # | 문제 | 파일 | 수정 |
|---|------|------|------|
| 3 | 홈 판매자 캐러셀 4종 import 없음 | `home-featured/popular/trusted/new-sellers-section.tsx` | `home-catalog.tsx` + `app/page.tsx`에 **연결** |
| 4 | `AuthLoginPromptInline` 미사용 | `auth-login-prompt-inline.tsx` | `mypage/following-sellers/page.tsx` 게스트 UI |
| 5 | `ProductRailSkeleton` 미사용 | `ui-skeleton-card.tsx` | `app/loading.tsx` 홈 skeleton |
| 6 | 미사용 import | `product-detail-bottom-sections.tsx` | `ReactNode` import 제거 |
| 7 | 중복 wrapper | `seller-trust-score.tsx` vs `SellerTrustScoreCard` | `seller-detail-content.tsx` → Card 직접 사용 |

### P1 — 탭 / hydration (수정 완료)

| # | 문제 | 파일 | 수정 |
|---|------|------|------|
| 8 | `#product-reviews` hash 시 탭 미전환 | `product-detail-tabs.tsx` | `initialTab` + mount `useEffect` hash 처리 |
| 9 | `useEffect([initialTab])` 불필요 re-run | `product-detail-tabs.tsx` | hash 전용 `useEffect([])` 분리, `initialTab`은 `useState` 초기값 |

### P2 — 잔존 (보고만, 기능 유지)

| # | 문제 | 위치 | 권장 |
|---|------|------|------|
| 10 | hash-only 딥링크 시 SSR=상품설명 탭 → client 전환 flash | `product-detail-tabs.tsx` | mount 후 탭 전환 (현재). 필요 시 URL query `?tab=reviews` 추가 |
| 11 | `FollowSellerButton` / `SaveDealButton` localStorage hydration | client components | `null`/`aria-busy` 패턴 유지 (follow는 적용됨) |
| 12 | `home-catalog.tsx` 전체 `"use client"` | 홈 JS bundle | server shell + 검색 island 분리 (성능) |
| 13 | `SellerTrustScore` wrapper 파일 | `seller-trust-score.tsx` | deprecated re-export 유지 또는 추후 삭제 (현재 import 0) |
| 14 | `lib/sellers/trust-profile.ts` | deprecated re-export | 하위 호환, `seller-trust-profile.ts`가 canonical |
| 15 | `key={index}` skeleton | `ui-skeleton-card.tsx`, `deal-card-skeleton.tsx` | 정적 skeleton — 허용 |
| 16 | mock `deals` catalog 참조 | `mypage-following-sellers-content.tsx` | `buildSellerProfilesFromDeals(mockDeals)` — **TODO(DB)** 팔로우 API 연동 시 교체 |

---

## 2. 항목별 점검 결과

### TypeScript 오류
- **0건** (`tsc --noEmit` 2회 PASS)

### import / 경로 오류
- `@/` alias 전체 — tsc 통과
- `lib/sellers/types.ts` — SellerRecord + SellerProfile 병합 정상
- `lib/search/query.ts` — `shouldUseMockData` import 정상

### 사용하지 않는 변수 / import
- **수정:** `product-detail-bottom-sections.tsx` `ReactNode`
- **잔존:** ESLint 미설정 (`next lint` 스크립트 경로 오류) — tsc만으로 unused local 미검출

### 컴포넌트 참조
- **수정:** 6개 orphan 컴포넌트 홈·마이페이지·loading 연결
- **정상:** `CategoryPopularSellers`, `SearchSellerResults`, ops panels 등 기존 참조 OK

### hydration
- 팔로우: `following: null` + `hydrated` (OK)
- 탭 hash: client-only `useEffect` (의도적 flash P2)
- `HomeCategoryIcons`: client parent import → client bundle 포함 (오류 아님)

### React key
- 판매자/상품 리스트: `seller.id`, `deal.slug`, `tab.id` 사용 — **OK**
- skeleton: `index` — 정적 목록, **허용**

### 누락 props
- `ProductDetailBottomSections`: `qnaCount` — page에서 전달 OK
- `HomeCatalog`: seller props 추가 후 page에서 전달 OK
- `deal-catalog-toolbar`: `highTrustSeller` collapsed + expanded 모두 OK

### mock 데이터 참조
- `getMockSellerReviews`, `buildSellerTrustProfile`, `follow-storage` — 의도적 mock, `SellerMockDataNote` UI 안내
- `mypage-following-sellers`: `mockDeals`로 프로필 enrich — DB 전 TODO

### 중복 컴포넌트
- `SellerTrustScore` → Card wrapper: **detail에서 Card 직접 사용으로 정리**
- `trust-profile.ts` / `seller-trust-profile.ts`: deprecated re-export (삭제 안 함)

---

## 3. 이번 검토에서 수정한 파일

```
app/page.tsx
app/loading.tsx
app/mypage/following-sellers/page.tsx
components/deal-card-featured.tsx
components/home-recommended-deal-card.tsx
components/home-catalog.tsx
components/product-detail-bottom-sections.tsx
components/product-detail-tabs.tsx
components/seller-detail-content.tsx
```

(이전 QA 수정 7파일 포함 시 총 16파일 미커밋)

---

## 4. mock / DB 연동 (변경 없음)

정적 검토 범위에서 mock 로직 **삭제하지 않음**. DB TODO는 [`CELLOH_FINAL_REPORT.md`](./CELLOH_FINAL_REPORT.md) §4 참고.

---

## 5. 다음 단계

1. `npm run build` — CSS `@apply group` 등 빌드 전용 이슈 최종 확인  
2. 미커밋 16파일 커밋  
3. P2 성능 (`home-catalog` server split) — 별도 PR  

---

*Cursor Agent 정적 코드 검토 — 2026-05-29*
