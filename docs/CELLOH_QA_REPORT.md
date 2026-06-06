# celloh — 사용자 동선 · 성능 · 모바일 · 배포 전 QA 보고

> 작성일: 2026-05-29  
> 기준 브랜치: `main` @ `f85b10b` + QA 후속 7파일 (미커밋)  
> 관련: [`CELLOH_FINAL_REPORT.md`](./CELLOH_FINAL_REPORT.md)

---

## 1. 실제 사용자 동선 QA

**시나리오:** 홈 → 상품 클릭 → 상세 → 찜 → 장바구니 → 로그인 → 주문서 → 결제 → 주문내역 → 리뷰

| 단계 | 경로 | 상태 | 이슈 |
|------|------|------|------|
| 홈 | `/` | ✅ | 하단 nav에 장바구니 없음 (헤더 `/join-cart`만) |
| 상품 클릭 | `/product/{slug}` | ✅ | DealCard stretched link |
| 상세 | 탭·판매자 패널·CTA | ✅ | 리뷰/Q&A hash → 탭 연동 **수정됨** (미커밋) |
| 찜 | `SaveDealButton` → `/saved` | ⚠️ | 비로그인 → login redirect OK. 실패 시 토스트 없음 |
| 장바구니 | `/join-cart` | ⚠️ | 담기는 로그인 필요. SubHeader back → `/mypage` (홈 유입 시 어색) |
| 로그인 | `/login?next=` | ⚠️ | Supabase 미설정 시 소셜/아이디 불가. 데모 로그인만 가능 |
| 주문서 | `/checkout/{slug}` | ⚠️ | 프로필·주소·동의 미완료 시 결제 버튼 disabled |
| 결제 | `/payment/request/{orderId}` | 🔴 | `NEXT_PUBLIC_TOSS_CLIENT_KEY` 없으면 결제 불가 |
| 주문내역 | `/mypage/orders` | ✅ | 로그인 필수 |
| 리뷰 | `?review=true#product-reviews` | ✅ | 탭 `initialTab` + hash **수정됨** (미커밋) |

### 막히는 곳 (P0~P1)

- **Toss 미설정** → 일반 상품 결제 완료 불가
- **Supabase 미설정** → 실제 로그인/DB 불가 (mock·localStorage만)
- **체크아웃 사전조건** → 이름·주소·약관 동의 전 주문 완료 불가

### 클릭 · HTML

- Link+button 중첩 없음
- 로그인: 네이버/Apple/삼성 `준비 중` disabled (의도)
- 동의 체크 전 소셜 버튼 disabled (의도)

### 로딩 skeleton

| 있음 | 없음 |
|------|------|
| `/`, `/product`, `/checkout`, `/saved`, `/search` | `/join-cart`, `/join`, `/login`, `/payment/request`, `/mypage/orders` |

- `app/error.tsx` 없음 → 런타임 에러 Next 기본 화면

### 에러 메시지

- ✅ checkout, payment, join-cart, login OAuth
- ⚠️ 찜 실패 조용함, 알림 게스트 empty (로그인 CTA 없음)

### 모바일 (375px)

- ✅ 상세 sticky CTA overflow → `flex-wrap` 수정 (미커밋)
- ⚠️ 상세 탭 4분할 라벨 밀림 가능
- ⚠️ 체크아웃 긴 폼 + sticky footer → 스크롤 많음

---

## 2. 성능 점검

### 적용됨 (미커밋)

| 파일 | 조치 |
|------|------|
| `app/page.tsx` | 서버 fetch `Promise.all` 병렬화 |
| `components/home-category-icons.tsx` | `"use client"` 제거 |
| `components/hero-banner.tsx` | `unoptimized` 제거, `sizes`·`alt` |

### 추후 개선 (기능 유지)

| 우선순위 | 파일 | 내용 |
|----------|------|------|
| P0 | `home-catalog.tsx` | server shell + 검색만 client 분리 |
| P1 | `save-deal-button.tsx` | 카드당 listener → 공유 subscriber (~36장) |
| P1 | `app/page.tsx` | 섹션 간 slug dedupe |
| P2 | `recent-deals-section.tsx` | `dynamic(..., { ssr: false })` |
| P2 | `app-splash.tsx` | 재방문 skip / 시간 단축 |
| P3 | `force-dynamic` | 캐시 가능 영역 분리 |

### 확인됨

- `getAllActiveDeals()` 1회 + `cache()` — 중복 fetch 없음
- 홈 이미지: `next/image` only
- rail 첫 2장 `priority` 미적용 (선택)

---

## 3. 모바일 최종 점검 (375px, `max-w-[480px]`)

| 화면 | 터치 타겟 | 레이아웃 | 비고 |
|------|-----------|----------|------|
| 홈 | ✅ | ✅ | 헤더 검색+장바구니 좁음 |
| 상품상세 | ✅ | ✅ | 탭 4분할 라벨 주의 |
| 장바구니 | ✅ | ✅ | back → mypage |
| 로그인 | ✅ | ✅ | 동의 전 disabled |
| 마이페이지 | ✅ | ✅ | 로그인 필수 |

**손가락 QA 권장:** 홈 카드 → 상세 팔로우·찜 → CTA 장바구니/구매 → join-cart → login → checkout → (Toss 키 시) 결제 → 주문내역 → 리뷰 링크

---

## 4. 배포 전 체크

### 코드/레포

| 항목 | 상태 |
|------|------|
| `npm run build` | PASS (`f85b10b`) |
| celloh UI | 커밋됨 |
| 리뷰/Q&A 딥링크·홈 perf | **미커밋 7파일** |
| Supabase migration | 레포 확인 필요 |
| seller_follows 등 DB | mock → TODO |
| Route middleware auth | 일부 mock/fallback |

### 대시보드만 (코드 수정 없음)

**Supabase**
- URL, anon/publishable key, service role
- Kakao OAuth provider
- RLS, Storage, Migration 030+

**OAuth (Kakao Developers)**
- Redirect: `{SUPABASE_URL}/auth/v1/callback`
- → Supabase dashboard에만 등록 (`docs/kakao-auth-reconnect.md`)

**Toss**
- `NEXT_PUBLIC_TOSS_CLIENT_KEY`, `TOSS_SECRET_KEY`, `TOSS_WEBHOOK_SECRET`
- Webhook: `{SITE_URL}/api/payments/toss/webhook`
- test 결제 → confirm → refund E2E

**Vercel**
- Production env (`.env.local.example` 참고)
- `NEXT_PUBLIC_SITE_URL`
- Preview ≠ Production env

**도메인**
- DNS → Vercel
- Supabase/Kakao/Toss redirect에 production 도메인
- `robots.txt` / `sitemap.xml`

### 배포 게이트 (전부 true 전까지 배포 금지)

1. Vercel production env  
2. Supabase migration + RLS + storage  
3. Toss test-mode E2E  
4. Kakao production OAuth (로그인 스코프 시)  
5. 결제 1건 + 환불 1건 수동 검증  
6. clean tree `npm run build` PASS  

---

## 5. QA 후속 수정 파일 (미커밋)

```
app/page.tsx
app/product/[id]/page.tsx
components/product-detail-tabs.tsx
components/product-detail-cta.tsx
components/add-to-join-cart-button.tsx
components/home-category-icons.tsx
components/hero-banner.tsx
```

---

*Cursor Agent QA 보고 — 2026-05-29*
