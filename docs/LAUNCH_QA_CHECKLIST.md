# Wadeal v2 출시 QA 체크리스트

> 마지막 업데이트: 2026-05-28  
> 관리자 대시보드: `/admin/dashboard`  
> 환경변수 상세: [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)  
> 운영 매뉴얼: [ADMIN_OPERATIONS.md](./ADMIN_OPERATIONS.md)

---

## 1. 회원가입 / 로그인

- [ ] 카카오 OAuth 로그인 정상 동작 (Supabase Auth → Kakao)
- [ ] 로그인 후 `/auth/callback` 리다이렉트 정상
- [ ] 로그아웃 후 보호 페이지 접근 시 `/login?next=…` 이동
- [ ] 프로덕션에서 `NEXT_PUBLIC_ALLOW_DEMO_LOGIN` 비활성화 확인
- [ ] 데모 로그인 사용 시 QA 완료 후 즉시 비활성화
- [ ] 신규 사용자 프로필 동기화 (`users` 테이블 row 생성)
- [ ] 관리자 계정 `users.role = 'admin'` 설정 확인
- [ ] 비관리자 `/admin/*` 접근 시 접근 거부 화면 표시

## 2. 상품 목록 / 상세

- [ ] 홈 메인·카테고리·검색 결과에 상품 카드 노출
- [ ] 상품 이미지·가격·뱃지·마감일 표시 정확
- [ ] `/product/[id]` 상세 페이지 로딩·404 처리
- [ ] 상품 이미지 갤러리·상세 설명·배송 안내 표시
- [ ] 비활성 상품(`is_active=false`) 목록 미노출
- [ ] Supabase 미설정 시 mock 데이터 미사용 (프로덕션)

## 3. 가격 단계제

- [ ] 참여 인원별 가격 단계 UI 표시
- [ ] 현재 참여 인원·다음 단계까지 남은 인원 표시
- [ ] 최저가·할인율 계산 정확
- [ ] 관리자 상품 등록 시 `price_tiers` JSON 저장 확인
- [ ] 마감 후 최종 단가(`final_price`) 반영 확인

## 4. 공동구매 참여

- [ ] 로그인 사용자 참여(join) 성공
- [ ] 마감·취소된 딜 참여 차단
- [ ] 참여 후 참여 인원 수 증가
- [ ] `/join/[id]` · `/join-cart` · `/join-complete` 플로우 정상
- [ ] 참여 시 주문(`orders`)·결제 준비(`payments`) 레코드 생성

## 5. Checkout

- [ ] `/checkout/[id]` 접근 시 로그인 필수
- [ ] 배송지·결제 수단 정보 표시
- [ ] 참여 금액·수량·단가 요약 정확
- [ ] checkout 완료 버튼 동작

## 6. 주문 내역

- [ ] `/mypage/orders` 참여·확정 주문 목록
- [ ] `/mypage/participating` 진행 중 공동구매
- [ ] 주문 상태 라벨(참여완료·결제대기·배송중 등) 정확
- [ ] 주문 상세에서 송장·배송 상태 확인

## 7. 결제 준비

- [ ] 참여 시 `payments` 레코드 `ready` 상태 생성
- [ ] 마감 처리 후 결제 금액 확정 (`preparePaymentAfterFinalize`)
- [ ] 결제 상태 UI(결제대기·결제완료·환불 등) 정확
- [ ] **PG(토스페이먼츠 등) 실연동 미완료 — 아래 출시 리스크 참고**

## 8. 마감 처리

- [ ] 관리자 상품 수정 화면에서 공동구매 마감 버튼 동작
- [ ] 마감 시 최종 단가 계산·주문 `final_price` 업데이트
- [ ] 마감 후 딜 상태 `closed` 전환
- [ ] 정산 레코드 자동 생성 확인
- [ ] 마감 후 참여 불가 확인

## 9. 배송 / 송장

- [ ] 관리자 주문 관리에서 택배사·송장번호 입력
- [ ] `shipping_status` 변경: none → preparing → shipped → delivered
- [ ] 발송·배송완료 일시 기록
- [ ] 사용자 주문 내역에 송장 정보 표시

## 10. 구매 확정

- [ ] 배송완료 후 구매 확정 가능
- [ ] `confirmed_at` 기록
- [ ] 확정 후 리뷰 작성 가능 조건 충족

## 11. 리뷰

- [ ] 구매 확정 주문에 한해 리뷰 작성
- [ ] 별점·텍스트·이미지 업로드
- [ ] 상품 상세 리뷰 목록·정렬(최신·별점)
- [ ] 리뷰 좋아요 동작
- [ ] 관리자 리뷰 숨김·삭제 처리 (`/admin/reviews`)
- [ ] 신고 리뷰 처리 (`/admin/review-reports`)

## 12. 찜 / 최근 본 / 카트

- [ ] `/saved` 찜 목록 추가·삭제
- [ ] `/mypage/recent` 최근 본 상품
- [ ] `/join-cart` 공동구매 카트 담기·일괄 참여
- [ ] 로그인 사용자별 데이터 Supabase 저장

## 13. 검색 / 필터

- [ ] `/search` 키워드 검색 결과
- [ ] 카테고리 필터 (`/category/[slug]`)
- [ ] 정렬·빈 결과 안내 UI
- [ ] Supabase search 쿼리 정상

## 14. 알림

- [ ] `/notifications` 알림 목록
- [ ] 가격 단계 달성·마감 임박·주문 이벤트 알림 생성
- [ ] 읽음 처리
- [ ] 가격 알림(`/mypage/alerts`) 등록·삭제

## 15. 공유 / 초대

- [ ] 상품 공유 버튼 (카카오톡 — `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY` 필요)
- [ ] `/share/[id]` 초대 링크·리퍼럴 코드
- [ ] 공유·방문 로그 Supabase 저장
- [ ] 마이페이지 공유 통계 표시

## 16. 고객센터

- [ ] 문의 유형별 티켓 생성 (상품·주문·배송·환불 등)
- [ ] 사용자 문의 내역 조회
- [ ] 주문 취소·환불 요청 (`cancel_reason`, `refund_requested_at`)
- [ ] 관리자 문의 답변·상태 변경 (대시보드 미처리 건수 확인)

## 17. 관리자 — 상품

- [ ] `/admin/products` 목록·등록·수정
- [ ] `/admin/products/new` 신규 상품
- [ ] 이미지 업로드 (Supabase Storage)
- [ ] 가격 단계·마감일·카테고리 입력
- [ ] 공동구매 마감 처리

## 18. 관리자 — 주문

- [ ] `/admin/orders` 전체 주문 조회
- [ ] 상태 필터(참여·결제·배송·확정·취소·환불)
- [ ] 주문·결제·배송 상태 수정
- [ ] 관리자 메모 저장

## 19. 관리자 — 리뷰 / 신고

- [ ] `/admin/reviews` 리뷰 목록·숨김·복구
- [ ] `/admin/review-reports` 신고 접수·처리

## 20. 관리자 — 정산 / 공급사

- [ ] `/admin/settlements` 정산 목록·상태 필터
- [ ] `/admin/settlements/[id]` 정산 상세·확정
- [ ] `/admin/suppliers` 공급사 등록·수정

## 21. 보안 / RLS

- [ ] Supabase RLS 정책 적용 (`009_production_rls.sql` 등)
- [ ] 사용자는 본인 주문·리뷰·알림만 조회
- [ ] 관리자 전용 테이블/함수 서버 액션에서 권한 검증
- [ ] Service Role Key가 클라이언트에 노출되지 않음
- [ ] Storage 버킷 정책(상품·리뷰 이미지) 확인

## 22. 모바일 반응형

- [ ] 480px 기준 레이아웃 (`max-w-[480px]`)
- [ ] 하단 네비게이션 터치 영역
- [ ] iOS safe-area 하단 여백
- [ ] 주요 폼·버튼 모바일에서 사용 가능

## 23. SEO / PWA

- [ ] `<html lang="ko">` 설정
- [ ] 페이지 `title`·`description` 메타데이터
- [ ] OG 태그(필요 시 추가) — **현재 기본 메타만 존재**
- [ ] PWA manifest·service worker — **미구현, 출시 전 결정 필요**
- [ ] robots.txt / sitemap — **확인 필요**

## 24. Vercel 환경변수

- [ ] Production·Preview 환경에 Supabase URL·Publishable Key 설정
- [ ] `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY` (공유 기능)
- [ ] `NEXT_PUBLIC_SITE_URL` (공유 링크)
- [ ] `REFERRAL_IP_SALT` (초대 추적, 선택)
- [ ] 프로덕션에서 `NEXT_PUBLIC_ALLOW_DEMO_LOGIN` 미설정
- [ ] `/admin/dashboard`에서 필수 env 녹색 확인

## 25. Supabase RLS / Storage

- [ ] 마이그레이션 전체 적용 (`supabase/migrations/`)
- [ ] `products`, `group_buy_deals`, `orders`, `payments` RLS
- [ ] `product-images`, `review-images` Storage 버킷
- [ ] Kakao OAuth Provider·Redirect URL 설정
- [ ] 관리자 `users.role = 'admin'` 계정 생성

## 26. 장애 대응

- [ ] Supabase 장애 시 사용자-facing 에러 메시지 확인
- [ ] Vercel 배포 롤백 절차 문서화
- [ ] PG·알림톡 장애 시 CS 안내 문구 준비
- [ ] `/admin/dashboard` 미처리 문의·환불 건수 모니터링
- [ ] 로그 확인 경로 (Vercel Functions · Supabase Logs)

---

## 출시 리스크 (Launch Risks)

### 미연동 / 미구현

| 항목 | 상태 | 영향 |
| --- | --- | --- |
| PG (토스페이먼츠 등) | **미연동** | 실결제 불가. 결제 레코드는 `ready` 상태만 생성 |
| 카카오 알림톡 | **미연동** | 가격 알림·마감 알림은 앱 내 알림만 |
| 카카오톡 공유 SDK | env 필요 | `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY` 없으면 공유 실패 |

### 법무 / 정책 (출시 전 필수)

- [ ] 사업자 정보 (상호·대표·사업자등록번호·통신판매업 신고)
- [ ] 이용약관 페이지
- [ ] 개인정보처리방침 페이지
- [ ] 환불·교환 정책 페이지
- [ ] 고객센터 운영 시간·연락처 공개

### 프로덕션 설정 주의

- [ ] `NEXT_PUBLIC_ALLOW_DEMO_LOGIN=true` 프로덕션 사용 금지 (QA 후 즉시 해제)
- [ ] `NEXT_PUBLIC_ALLOW_MOCK_DATA` 프로덕션에서 무시됨 — Supabase 필수
- [ ] 데모 결제·mock 주문 ID(`mock-admin-order-*`) 프로덕션 DB에 없어야 함

---

## TODO / FIXME / Mock 코드 감사

### FIXME / TODO (코드 주석)

| 위치 | 내용 | 출시 리스크 |
| --- | --- | --- |
| `components/alert-form.tsx:76` | 카카오톡 메시지 API 연동 | **중** — 가격 알림톡 미발송 |
| `lib/data/alerts.ts:160` | 목표가 도달 시 알림톡 발송 | **중** |
| `lib/data/price-alerts.ts:130` | `kakao_notify_status` 알림톡 | **중** |
| `lib/reviews/local-review-likes.ts:1` | `review_likes` Supabase 테이블 교체 | **낮** — localStorage 폴백 |

### `shouldUseMockData()` 사용 (프로덕션 항상 false)

| 파일 | 프로덕션 안전 |
| --- | --- |
| `lib/services/deals.ts`, `lib/data/admin-*`, `lib/data/orders.ts` | ✅ |
| `lib/data/payments.ts`, `lib/data/settlements.ts`, `lib/data/support-tickets.ts` | ✅ |
| `lib/data/alerts.ts`, `lib/data/notifications.ts`, `lib/data/saved-deals.ts` | ✅ |
| `lib/data/recent-views.ts`, `lib/data/join-cart.ts`, `lib/data/search.ts` | ✅ |
| `lib/data/user-address.ts`, `lib/data/user-payment.ts` | ⚠️ localStorage/mock 테이블 폴백 |

### Mock / Demo 코드

| 위치 | 프로덕션 |
| --- | --- |
| `lib/deals.ts` | Supabase 설정 시 미사용 |
| `lib/mock-storage.ts` | Supabase 우선 |
| `NEXT_PUBLIC_ALLOW_DEMO_LOGIN` | **QA 후 비활성화** |

---

## 출시 Go / No-Go 기준 (권장)

**Go:** Supabase·RLS·카카오 로그인·E2E QA·법무 페이지·대시보드 env 녹색

**No-Go:** PG 필수인데 미연동, 프로덕션 데모 로그인, RLS 미적용, CS 프로세스 없음
