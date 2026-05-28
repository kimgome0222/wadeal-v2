# Work Queue Prompts Part 06

## W126 (L976, build_error, unknown)

디자인은 건드리지 말고, 정산/공급사/입점 판매자 구조를 상용화 기준으로 설계하고 구현해줘.

와딜은 실제 운영할 공동구매 커머스 플랫폼이다.
초기에는 직접 판매 중심이지만, 나중에는 공급사/입점 판매자 상품도 운영할 수 있어야 한다.

이번 작업 목표:
공급사, 판매자, 상품별 정산 구조를 준비한다.

요구사항:
1. suppliers 테이블 생성
   - id
   - name
   - business_number
   - contact_name
   - phone
   - email
   - bank_name
   - bank_account
   - bank_holder
   - status
   - created_at
   - updated_at

2. supplier status
   - active
   - paused
   - terminated

3. products/deals에 supplier_id 연결
   - nullable 가능
   - 직접 판매 상품은 null 또는 internal supplier

4. settlements 테이블 생성
   - id
   - supplier_id
   - deal_id/product_id
   - total_sales_amount
   - commission_rate
   - commission_amount
   - settlement_amount
   - status
   - settled_at
   - created_at
   - updated_at

5. settlement status
   - pending
   - confirmed
   - paid
   - cancelled

6. 공동구매 마감 후 정산 계산 가능
   - final_price 기준 총 판매금액
   - 수수료율 적용
   - 공급사 정산금 계산

7. 관리자 공급사 페이지
   - /admin/suppliers
   - 공급사 목록
   - 공급사 등록/수정
   - 상태 변경

8. 관리자 정산 페이지
   - /admin/settlements
   - 정산 목록
   - 상품별/공급사별 정산금
   - 상태 필터
   - 정산 확정
   - 지급 완료 처리

9. 유틸 함수 생성
   - calculateSettlement(dealId)
   - getSettlementStatusLabel
   - getSupplierStatusLabel

10. RLS 기준
   - 일반 사용자는 공급사/정산 정보 접근 불가
   - 관리자만 조회/수정 가능

11. Supabase migration SQL 생성

12. 기존 디자인/레이아웃 최대한 유지

13. npm run build 통과

---

## W127 (L979, build_error, unknown)

디자인은 건드리지 말고, 와딜 전체 코드의 보안/RLS/서버 검증을 상용화 기준으로 점검하고 보강해줘.

와딜은 실제 운영할 공동구매 커머스 플랫폼이다.
클라이언트 조작으로 가격, 주문상태, 결제상태, 관리자 권한이 바뀌면 안 된다.

이번 작업 목표:
전체 서비스의 보안, 권한, 서버 검증, RLS 정책을 점검하고 취약한 부분을 보완한다.

요구사항:
1. 관리자 권한 검증
   - users.role = 'admin' 기준
   - /admin/* 페이지 접근 제한
   - 관리자 서버 액션에서도 role 재검증
   - 클라이언트 UI 숨김만으로 권한 처리 금지

2. 주문/가격 검증
   - checkout/참여 시 클라이언트 가격 신뢰 금지
   - 서버에서 product/deal 재조회
   - price_tiers 기준 현재 가격 재계산
   - quantity 유효성 검사
   - final_price는 서버/관리자 마감 로직에서만 업데이트

3. 결제 검증
   - payment amount는 서버에서 계산
   - payment_status는 클라이언트에서 직접 변경 불가
   - payments 테이블 RLS 점검

4. 주문 상태 검증
   - 사용자는 본인 주문만 조회
   - 사용자는 허용된 액션만 가능
     - 구매확정
     - 취소/환불 요청
   - 주문상태/배송상태/결제상태 변경은 관리자 또는 서버만 가능

5. 리뷰 검증
   - 실제 구매확정 주문자만 리뷰 작성 가능
   - confirmed_at 기준 15일 이내
   - order_id 중복 리뷰 방지
   - rating 1~5 제한

6. 찜/카트/최근본
   - 본인 데이터만 조회/수정
   - product_id/deal_id 유효성 검사

7. 알림
   - 사용자는 본인 알림만 조회/읽음 처리
   - 알림 생성은 서버/관리자만 가능

8. 문의/환불
   - 사용자는 본인 문의만 조회/작성
   - 관리자 답변/상태변경은 admin만 가능
   - 취소/환불 가능 상태 서버 검증

9. 공급사/정산
   - 일반 사용자 접근 금지
   - 관리자만 조회/수정 가능

10. Supabase RLS 정책 전체 점검
   - users
   - products/deals
   - orders
   - payments
   - reviews
   - saved_deals/wishlists
   - cart/join_cart
   - notifications
   - support_tickets
   - suppliers
   - settlements

11. 서버 액션/route handler 점검
   - 민감한 DB 업데이트는 서버에서만
   - 에러 메시지는 사용자 친화적으로
   - 내부 에러/secret 노출 금지

12. 환경변수 점검
   - service role key가 클라이언트 번들에 노출되지 않게 확인
   - NEXT_PUBLIC_ 접두사는 공개 가능한 값만 사용

13. SQL migration 생성
   - 누락된 RLS enable
   - 정책 추가/수정
   - 필요한 check constraint 추가

14. 기존 디자인/레이아웃 변경 금지

15. npm run build 통과

---

## W128 (L982, build_error, unknown)

디자인은 건드리지 말고, 와딜의 성능/SEO/모바일 PWA 구조를 상용화 기준으로 개선해줘.

와딜은 실제 운영할 공동구매 커머스 플랫폼이다.
쿠팡/위메프 같은 쇼핑앱 경험을 웹앱으로 제공해야 한다.

이번 작업 목표:
페이지 속도, 검색 노출, 모바일 앱 같은 사용성을 개선한다.

요구사항:
1. 성능 최적화
   - 불필요한 client component 줄이기
   - 서버 컴포넌트로 가능한 영역 전환
   - 상품 목록 pagination 또는 load more 적용
   - 이미지 lazy loading
   - Next/Image 사용 가능한 곳 적용
   - 중복 Supabase query 정리

2. SEO
   - 상품 상세 metadata 동적 생성
   - title, description, openGraph 설정
   - 상품명/가격/이미지 기반 OG 태그
   - 검색/카테고리 페이지 metadata 설정
   - robots.txt, sitemap.xml 준비

3. 공유 최적화
   - 카카오톡/문자/링크 공유 시 상품 이미지와 설명이 잘 보이도록 OG 데이터 구성
   - 상품 상세 URL canonical 처리

4. 모바일 PWA 준비
   - manifest.json 추가 또는 정리
   - 앱 이름: 와딜
   - theme color 기존 디자인 기준 유지
   - 아이콘 경로 준비
   - 모바일 홈화면 추가 가능하게 설정

5. UX 성능
   - 로딩 skeleton
   - 빈 데이터 UI
   - 에러 UI
   - 재시도 버튼
   - checkout/order 같은 중요 페이지는 명확한 상태 표시

6. 접근성
   - 버튼 aria-label 보강
   - 이미지 alt 보강
   - form label 연결
   - 키보드 접근성 기본 점검

7. 안정성
   - not-found 페이지
   - error boundary
   - loading.tsx 필요한 라우트에 추가

8. 분석 준비
   - 나중에 GA/Meta Pixel 연결 가능하게 analytics util 구조 준비
   - 지금은 이벤트 함수만 만들어도 됨
   - trackEvent(name, payload)

9. 기존 디자인/레이아웃은 최대한 유지

10. npm run build 통과

---

## W129 (L985, git_deploy, unknown)

디자인은 건드리지 말고, 와딜의 운영 전 최종 QA와 출시 준비 체크리스트를 코드/문서 기준으로 정리해줘.

와딜은 실제 상용화할 공동구매 커머스 플랫폼이다.
출시 전에 기능, 보안, 결제, 주문, 관리자, 모바일 UX를 전체 점검해야 한다.

이번 작업 목표:
운영 전 최종 QA 체크리스트 문서와 필요한 코드 보완을 한다.

요구사항:
1. docs/LAUNCH_QA_CHECKLIST.md 생성
   아래 항목 포함:
   - 회원가입/로그인
   - 상품 목록
   - 상품 상세
   - 가격 단계제
   - 공동구매 참여
   - checkout
   - 주문내역
   - 결제 준비
   - 마감 처리
   - 배송/송장
   - 구매확정
   - 리뷰
   - 찜/최근본/카트
   - 검색/필터
   - 알림
   - 공유/초대
   - 고객센터
   - 관리자 상품관리
   - 관리자 주문관리
   - 관리자 리뷰관리
   - 관리자 정산관리
   - 보안/RLS
   - 모바일 반응형
   - SEO/PWA
   - Vercel 환경변수
   - Supabase RLS/Storage
   - 장애 대응

2. docs/ENVIRONMENT_VARIABLES.md 생성
   필요한 환경변수 정리:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY
   - NEXT_PUBLIC_ALLOW_DEMO_LOGIN
   - PG 관련 예정 변수
   - 알림톡 관련 예정 변수

3. docs/ADMIN_OPERATIONS.md 생성
   관리자 운영 매뉴얼:
   - 상품 등록
   - 가격 단계 입력
   - 공동구매 마감 처리
   - 주문 상태 변경
   - 배송 송장 입력
   - 리뷰/신고 처리
   - 문의 답변
   - 환불 요청 처리
   - 정산 확정

4. 코드 내 TODO/FIXME 점검
   - 실제 출시 전 위험한 TODO는 문서에 정리
   - mock/demo 관련 코드가 있으면 위치와 제거 여부 정리

5. 출시 전 위험 요소 정리
   - 실제 PG 미연동
   - 알림톡 미연동
   - 사업자 정보/약관/개인정보처리방침 필요
   - 환불/교환 정책 문서 필요
   - 고객센터 운영 시간 필요

6. /admin/dashboard 또는 관리자 홈에 “출시 준비 상태” 섹션 추가
   - 필수 환경변수 존재 여부
   - Supabase 연결 상태
   - 상품 수
   - 진행중 공동구매 수
   - 미처리 문의 수
   - 미처리 환불 요청 수

7. 기존 디자인/레이아웃은 최대한 유지

8. npm run build 통과

---

## W130 (L988, build_error, unknown)

디자인은 건드리지 말고, 와딜의 약관/개인정보처리방침/환불정책 페이지를 상용화 준비 기준으로 추가해줘.

와딜은 실제 운영할 공동구매 커머스 플랫폼이다.
법무 검토 전 초안 수준이지만, 서비스 화면에 필요한 기본 정책 페이지 구조를 만들어야 한다.

이번 작업 목표:
서비스 이용에 필요한 정책 페이지와 푸터 링크를 추가한다.

요구사항:
1. 정책 페이지 생성
   - /terms : 이용약관
   - /privacy : 개인정보처리방침
   - /refund-policy : 취소/환불/교환 정책
   - /commerce-policy : 공동구매 운영 정책

2. 각 페이지 내용은 초안 문구로 작성
   - 실제 법무 검토 필요 안내 주석 포함
   - 와딜 서비스 특성 반영
   - 공동구매 마감 후 최종 가격 확정 구조 설명
   - 배송/환불/취소 기준 설명

3. 푸터에 정책 링크 추가
   - 이용약관
   - 개인정보처리방침
   - 환불정책
   - 공동구매 운영정책
   - 고객센터

4. 회원가입/checkout/결제 전 화면에 약관 동의 구조 준비
   - 필수: 이용약관
   - 필수: 개인정보처리방침
   - 필수: 공동구매 가격 확정 방식 동의
   - 선택: 마케팅 수신 동의

5. user_consents 테이블 생성
   - id
   - user_id
   - terms_agreed_at
   - privacy_agreed_at
   - groupbuy_agreed_at
   - marketing_agreed_at nullable
   - created_at
   - updated_at

6. checkout 또는 참여하기 전
   - 필수 약관 동의 여부 확인
   - 미동의 시 동의 UI 표시
   - 동의 후 참여 가능

7. 관리자/문서 폴더에 정책 초안 문서도 추가
   - docs/TERMS_DRAFT.md
   - docs/PRIVACY_DRAFT.md
   - docs/REFUND_POLICY_DRAFT.md
   - docs/GROUPBUY_POLICY_DRAFT.md

8. RLS 기준
   - 사용자는 본인 consent만 조회/저장 가능
   - 관리자는 전체 조회 가능

9. Supabase migration SQL 생성

10. 기존 디자인/레이아웃 최대한 유지

11. npm run build 통과

---

## W131 (L991, build_error, unknown)

디자인은 건드리지 말고, 와딜의 약관/개인정보처리방침/환불정책 페이지를 상용화 준비 기준으로 추가해줘.

와딜은 실제 운영할 공동구매 커머스 플랫폼이다.
법무 검토 전 초안 수준이지만, 서비스 화면에 필요한 기본 정책 페이지 구조를 만들어야 한다.

이번 작업 목표:
서비스 이용에 필요한 정책 페이지와 푸터 링크를 추가한다.

요구사항:
1. 정책 페이지 생성
   - /terms : 이용약관
   - /privacy : 개인정보처리방침
   - /refund-policy : 취소/환불/교환 정책
   - /commerce-policy : 공동구매 운영 정책

2. 각 페이지 내용은 초안 문구로 작성
   - 실제 법무 검토 필요 안내 주석 포함
   - 와딜 서비스 특성 반영
   - 공동구매 마감 후 최종 가격 확정 구조 설명
   - 배송/환불/취소 기준 설명

3. 푸터에 정책 링크 추가
   - 이용약관
   - 개인정보처리방침
   - 환불정책
   - 공동구매 운영정책
   - 고객센터

4. 회원가입/checkout/결제 전 화면에 약관 동의 구조 준비
   - 필수: 이용약관
   - 필수: 개인정보처리방침
   - 필수: 공동구매 가격 확정 방식 동의
   - 선택: 마케팅 수신 동의

5. user_consents 테이블 생성
   - id
   - user_id
   - terms_agreed_at
   - privacy_agreed_at
   - groupbuy_agreed_at
   - marketing_agreed_at nullable
   - created_at
   - updated_at

6. checkout 또는 참여하기 전
   - 필수 약관 동의 여부 확인
   - 미동의 시 동의 UI 표시
   - 동의 후 참여 가능

7. 관리자/문서 폴더에 정책 초안 문서도 추가
   - docs/TERMS_DRAFT.md
   - docs/PRIVACY_DRAFT.md
   - docs/REFUND_POLICY_DRAFT.md
   - docs/GROUPBUY_POLICY_DRAFT.md

8. RLS 기준
   - 사용자는 본인 consent만 조회/저장 가능
   - 관리자는 전체 조회 가능

9. Supabase migration SQL 생성

10. 기존 디자인/레이아웃 최대한 유지

11. npm run build 통과

---

## W132 (L1025, build_error, unknown)

Cursor 입력용: 판매자 센터 기초 뼈대 구축 프롬프트
"와딜(Wadeal) 플랫폼의 '판매자 센터(/seller)'를 별도로 구축할 거야. 디자인은 깔끔한 관리자(Admin) 대시보드 스타일을 유지해 줘.

1. DB 권한 및 테이블 설정:

users 테이블의 role 컬럼을 사용하여 user, seller, admin 권한을 구분해 줘.

sellers 테이블 생성: id, user_id, company_name, business_number, status(pending_review/approved/rejected/suspended), bank_name, account_number, account_holder, created_at 컬럼 포함.

RLS 정책 설정: 판매자는 본인의 sellers 정보만 조회/수정할 수 있도록 설정해 줘.

2. 판매자 센터 전용 레이아웃 (/seller 경로):

기존 쇼핑몰 레이아웃과 분리된, 좌측 사이드바(LNB)가 포함된 관리자 전용 레이아웃을 만들어 줘.

사이드바 메뉴: [대시보드], [상품 관리], [주문/배송 관리], [정산 관리], [C/S 및 리뷰 관리], [설정].

3. 판매자 승인 플로우 뼈대:

판매자가 가입 신청을 하면 sellers.status를 pending_review로 저장해 줘.

판매자 센터의 기능(상품 관리 등) 접근 시, status가 approved가 아니면 '관리자 승인 대기 중입니다'라는 안내 화면으로 리다이렉트되게 해줘.

4. 관리자(Super Admin) 페이지 (/admin 경로):

와딜 본사 관리자만 접근 가능하도록 RLS를 설정하고, /admin/sellers 페이지에서 대기 중인 판매자의 사업자 정보를 보고 '승인' 또는 '반려' 버튼을 누를 수 있는 UI를 만들어 줘.

위 내용으로 Supabase migration SQL 생성 및 Next.js 라우트/컴포넌트 뼈대를 잡아줘. 기존 디자인 레이아웃을 깨지 않도록 주의하고, npm run build가 통과되도록 작성해 줘."

---

## W133 (L1049, build_error, unknown)

와딜은 실제 상용화할 커머스 플랫폼이다.

서비스에는 2가지 상품 유형이 존재한다.

1. 일반상품
- 쿠팡처럼 즉시결제
- 결제 완료 즉시 주문 확정

2. 공동구매상품
- 여러 명이 함께 참여
- 수량이 많아질수록 가격 하락
- 마감 후 최종 가격 확정
- 이후 결제 진행 또는 자동결제

이번 작업 목표:
일반상품과 공동구매상품의 결제 구조를 분리해서 실제 서비스 기준으로 구현한다.

요구사항:
1. product/deal 타입 추가
   - product_type:
     normal
     groupbuy

2. 일반상품(normal)
   - checkout 즉시 결제 가능
   - Toss Payments 연동 구조 준비
   - 카드결제
   - 카카오페이
   - 토스페이
   - 네이버페이
   - 휴대폰결제
   - 가상계좌(무통장입금)
   지원 가능하게 구조 작성

3. 공동구매(groupbuy)
   - 공동구매 참여
   - 예상가 표시
   - 마감 후 final_price 확정
   - 이후 결제 요청 또는 자동결제 가능 구조

4. 결제수단 구조 정리
   - payment_method:
     card
     kakaopay
     tosspay
     naverpay
     phone
     virtual_account

5. checkout 화면
   - 상품 타입에 따라 UI 분기
   - normal:
     즉시 결제
   - groupbuy:
     공동구매 참여
     예상 최종가 안내
     마감 후 결제 안내

6. payments/orders 로직 분리
   - normal:
     paid 즉시 주문 확정 가능
   - groupbuy:
     joined → confirmed → payment_ready → paid 흐름

7. Toss Payments 기준 구조 준비
   - payment widget 방식 고려
   - 결제수단별 UI 준비
   - provider/toss method 매핑 가능하게 작성

8. 관리자 상품 등록 화면
   - 일반상품 / 공동구매상품 선택 가능

9. 상품 목록/상세
   - 일반상품:
     일반 쇼핑몰 UI
   - 공동구매:
     가격 단계/진행률 UI

10. Supabase migration SQL 생성

11. 기존 디자인/레이아웃 최대한 유지

12. npm run build 통과

---

## W134 (L1057, build_error, unknown)

디자인은 건드리지 말고, 결제수단 선택 UI와 주문 흐름 분기를 상용화 기준으로 구현해줘.

와딜은 일반상품 즉시결제와 공동구매 참여형 결제를 모두 지원하는 커머스 플랫폼이다.

이번 작업 목표:
상품 타입에 따라 checkout 흐름을 분기하고, 카드/카카오페이/토스페이/네이버페이/휴대폰결제/무통장입금 결제수단을 선택할 수 있게 만든다.

요구사항:
1. checkout 화면에 결제수단 선택 영역 추가
   - 카드결제
   - 카카오페이
   - 토스페이
   - 네이버페이
   - 휴대폰결제
   - 무통장입금/가상계좌

2. payment_method 값
   - card
   - kakaopay
   - tosspay
   - naverpay
   - phone
   - virtual_account

3. 일반상품 normal 흐름
   - 결제수단 선택
   - 즉시 결제 요청
   - 결제 성공 시 order_status = confirmed
   - payment_status = paid
   - shipping_status = preparing

4. 공동구매 groupbuy 흐름
   - 참여 시 결제수단 선택 가능
   - 결제는 바로 하지 않음
   - order_status = joined
   - payment_status = ready
   - 마감 후 final_price 확정
   - payment_ready 상태에서 결제 요청 가능

5. 무통장입금/가상계좌
   - 일반상품: 가상계좌 발급 후 payment_status = waiting_deposit
   - 공동구매: 마감 후 가상계좌 발급 가능 구조
   - 입금 전 주문 상태와 입금 안내 표시

6. 결제 상태값 보강
   - ready
   - waiting_deposit
   - authorized
   - paid
   - failed
   - cancelled
   - refunded

7. orders/payments에 payment_method 저장
8. checkout 서버 액션에서 결제수단 유효성 검사
9. 클라이언트에서 가격/상태 조작 불가하게 서버에서 재계산
10. 마이페이지 주문 상세에 선택한 결제수단과 결제상태 표시
11. 관리자 주문 상세에도 결제수단 표시
12. 기존 디자인/레이아웃 최대한 유지
13. npm run build 통과

---

## W135 (L1063, build_error, unknown)

디자인은 건드리지 말고, 결제수단 선택 UI와 주문 흐름 분기를 상용화 기준으로 구현해줘.

와딜은 일반상품 즉시결제와 공동구매 참여형 결제를 모두 지원하는 커머스 플랫폼이다.

이번 작업 목표:
상품 타입에 따라 checkout 흐름을 분기하고, 카드/카카오페이/토스페이/네이버페이/휴대폰결제/무통장입금 결제수단을 선택할 수 있게 만든다.

요구사항:
1. checkout 화면에 결제수단 선택 영역 추가
   - 카드결제
   - 카카오페이
   - 토스페이
   - 네이버페이
   - 휴대폰결제
   - 무통장입금/가상계좌

2. payment_method 값
   - card
   - kakaopay
   - tosspay
   - naverpay
   - phone
   - virtual_account

3. 일반상품 normal 흐름
   - 결제수단 선택
   - 즉시 결제 요청
   - 결제 성공 시 order_status = confirmed
   - payment_status = paid
   - shipping_status = preparing

4. 공동구매 groupbuy 흐름
   - 참여 시 결제수단 선택 가능
   - 결제는 바로 하지 않음
   - order_status = joined
   - payment_status = ready
   - 마감 후 final_price 확정
   - payment_ready 상태에서 결제 요청 가능

5. 무통장입금/가상계좌
   - 일반상품: 가상계좌 발급 후 payment_status = waiting_deposit
   - 공동구매: 마감 후 가상계좌 발급 가능 구조
   - 입금 전 주문 상태와 입금 안내 표시

6. 결제 상태값 보강
   - ready
   - waiting_deposit
   - authorized
   - paid
   - failed
   - cancelled
   - refunded

7. orders/payments에 payment_method 저장
8. checkout 서버 액션에서 결제수단 유효성 검사
9. 클라이언트에서 가격/상태 조작 불가하게 서버에서 재계산
10. 마이페이지 주문 상세에 선택한 결제수단과 결제상태 표시
11. 관리자 주문 상세에도 결제수단 표시
12. 기존 디자인/레이아웃 최대한 유지
13. npm run build 통과

---

## W136 (L1067, build_error, unknown)

디자인은 건드리지 말고, 운영자 대시보드와 매출/주문 통계를 상용화 기준으로 구현해줘.

와딜은 실제 운영할 공동구매 커머스 플랫폼이다.

이번 작업 목표:
관리자가 서비스 현황, 매출, 주문, 공동구매 진행 상태를 한눈에 볼 수 있는 운영 대시보드를 만든다.

요구사항:
1. /admin/dashboard 페이지 생성 또는 개선

2. 핵심 지표 카드
   - 총 주문 수
   - 오늘 주문 수
   - 총 참여 수량
   - 총 예상 매출
   - 확정 매출
   - 환불 금액
   - 진행중 공동구매 수
   - 마감임박 공동구매 수

3. 공동구매 운영 지표
   - 진행중 상품
   - 마감된 상품
   - 목표 달성률
   - price_tier 달성 단계
   - 다음 단계까지 남은 수량

4. 주문 통계
   - 상태별 주문 수
   - 결제상태별 주문 수
   - 배송상태별 주문 수

5. 최근 주문 목록
   - 주문번호
   - 상품명
   - 구매자
   - 수량
   - 예상금액
   - 확정금액
   - 주문상태
   - 주문일

6. 인기 공동구매
   - 참여 수량순
   - 찜 수순
   - 공유 수순
   - 조회 수순

7. 기간 필터
   - 오늘
   - 7일
   - 30일
   - 전체

8. 관리자만 접근 가능
   - users.role = 'admin'

9. 서버에서 Supabase query로 집계
   - 클라이언트에서 임의 계산 최소화
   - 필요한 경우 admin stats 유틸 함수 분리

10. 빈 데이터/로딩/에러 상태 표시

11. 기존 관리자 디자인 톤 유지

12. npm run build 통과

---

## W137 (L1070, build_error, unknown)

디자인은 건드리지 말고, Toss Payments 결제위젯 실제 연결 구조를 상용화 기준으로 구현해줘.

와딜은 일반상품 즉시결제와 공동구매 마감 후 결제를 모두 지원한다.

이번 작업 목표:
카드, 카카오페이, 토스페이, 네이버페이, 휴대폰결제, 가상계좌 결제를 Toss Payments 결제위젯 기반으로 연결할 수 있게 만든다.

요구사항:
1. Toss Payments SDK 설치/연결
   - @tosspayments/tosspayments-sdk 사용 가능하면 적용
   - NEXT_PUBLIC_TOSS_CLIENT_KEY 사용

2. 결제 요청 페이지 생성
   - /payment/request/[orderId]

3. 결제 요청 전 서버 검증
   - 로그인 사용자 본인 주문인지 확인
   - order.final_price 또는 즉시결제 amount 서버에서 계산
   - 이미 결제된 주문 중복 결제 방지
   - payment_method 유효성 검사

4. Toss payment widget 렌더링
   - 선택 가능한 결제수단:
     card
     kakaopay
     tosspay
     naverpay
     phone
     virtual_account

5. 결제 성공 페이지
   - /payment/success
   - paymentKey, orderId, amount 수신
   - 서버 API로 승인 요청

6. 결제 실패 페이지
   - /payment/fail
   - 실패 사유 표시
   - 다시 결제하기 버튼

7. 결제 승인 API
   - POST /api/payments/toss/confirm
   - TOSS_SECRET_KEY 서버에서만 사용
   - Toss confirm API 호출
   - amount와 서버 계산 금액 일치 검증
   - 성공 시 payments 업데이트
   - orders.payment_status = paid
   - 일반상품이면 order_status = confirmed, shipping_status = preparing
   - 공동구매면 confirmed 상태 주문을 paid로 전환

8. 가상계좌 처리 구조
   - 가상계좌 발급 시 payment_status = waiting_deposit
   - Toss webhook으로 입금완료 처리할 수 있게 준비
   - /api/payments/toss/webhook 라우트 생성

9. 보안
   - 클라이언트 amount 신뢰 금지
   - secret key 노출 금지
   - 본인 주문만 결제 가능
   - 관리자 외 결제상태 임의변경 불가

10. payments.raw_response에 Toss 응답 저장
11. 에러/로딩/실패 UI는 기존 디자인 톤 유지
12. docs/PAYMENT_FLOW.md 업데이트
13. npm run build 통과

---

## W138 (L1073, build_error, unknown)

디자인은 건드리지 말고, Toss Payments webhook과 가상계좌 입금완료 처리 구조를 상용화 기준으로 구현해줘.

와딜은 카드/간편결제/휴대폰결제/가상계좌 결제를 지원하는 공동구매 커머스 플랫폼이다.

이번 작업 목표:
가상계좌 입금완료, 결제상태 변경, Toss webhook 수신 구조를 만든다.

요구사항:
1. Toss webhook route 생성
   - POST /api/payments/toss/webhook

2. webhook에서 처리할 이벤트 구조 준비
   - 결제 승인
   - 가상계좌 입금완료
   - 결제 취소
   - 환불
   - 결제 실패

3. webhook 보안
   - Toss webhook signature 검증 가능한 구조로 작성
   - 지금 signature 정보가 없으면 TODO 주석과 함께 서버 전용 검증 함수 분리
   - raw body 처리 가능하게 구현

4. 가상계좌 입금완료 처리
   - paymentKey 또는 orderId로 payments 조회
   - payment_status = paid
   - orders.payment_status = paid
   - 일반상품이면 shipping_status = preparing
   - paid_at 기록

5. 중복 webhook 방지
   - 이미 paid 처리된 payment는 중복 업데이트하지 않음
   - webhook_logs 테이블 생성
   - event_id 또는 payment_key + event_type 기준으로 중복 방지

6. webhook_logs 테이블
   - id
   - provider
   - event_type
   - event_id nullable
   - payment_key nullable
   - order_id nullable
   - raw_payload
   - processed_at
   - status
   - error_message
   - created_at

7. 결제 실패/취소/환불 이벤트 처리
   - payments.status 업데이트
   - orders.payment_status 업데이트
   - 필요한 경우 알림 생성

8. 사용자 알림 연동
   - 입금 완료
   - 결제 실패
   - 환불 완료
   알림 생성

9. 관리자 결제 로그 확인 가능하게 준비
   - /admin/payments 또는 주문 상세에서 webhook_logs 일부 표시

10. RLS/보안
   - webhook_logs는 관리자만 조회 가능
   - insert/update는 서버 라우트에서만 처리

11. Supabase migration SQL 생성

12. docs/PAYMENT_FLOW.md에 webhook 흐름 추가

13. 기존 디자인/레이아웃 최대한 유지

14. npm run build 통과

---

## W139 (L1076, build_error, unknown)

디자인은 건드리지 말고, 자동결제/빌링키 기능을 선택 기능으로 분리해서 상용화 기준으로 준비해줘.

와딜은 일반상품 즉시결제와 공동구매 마감 후 결제를 모두 지원한다.
즉시결제는 기본 결제 방식이고, 자동결제는 공동구매 참여 시 선택 가능한 결제예약 방식이다.

이번 작업 목표:
카드 자동결제/빌링키 구조를 공동구매용 선택 기능으로 준비한다.

요구사항:
1. saved_payment_methods 테이블 생성
   - id
   - user_id
   - provider
   - method
   - billing_key
   - card_company
   - card_last4
   - is_default
   - status
   - created_at
   - updated_at

2. saved_payment_methods status
   - active
   - inactive
   - expired
   - revoked

3. 공동구매 참여 시 결제 방식 선택
   - 마감 후 직접 결제
   - 카드 자동결제 예약

4. order/payment에 payment_flow 추가
   - instant
   - post_deadline_manual
   - post_deadline_auto

5. 자동결제 예약 흐름
   - 사용자가 카드 등록
   - billing_key 저장
   - 공동구매 마감 후 final_price 확정
   - billing_key로 자동 결제 시도
   - 성공 시 paid
   - 실패 시 payment_failed 알림 + 직접 결제 요청

6. Toss billing API 연결 가능한 구조 준비
   - 실제 API 호출 함수는 서버 전용
   - issueBillingKey()
   - chargeWithBillingKey()
   - revokeBillingKey()

7. 보안
   - billing_key는 클라이언트 노출 금지
   - saved_payment_methods 조회 시 카드사/뒤 4자리만 표시
   - 서버에서만 자동결제 실행
   - 본인 결제수단만 조회/삭제 가능

8. 마이페이지 결제수단 관리
   - 등록된 카드 목록
   - 기본 결제수단 설정
   - 삭제/비활성화

9. 공동구매 마감 처리 로직과 연결
   - payment_flow = post_deadline_auto 인 주문은 자동결제 시도
   - 실패 주문은 payment_status = failed 또는 payment_required
   - 사용자 알림 생성

10. 관리자 주문 상세
   - payment_flow 표시
   - 자동결제 성공/실패 여부 표시

11. Supabase migration SQL 생성

12. docs/PAYMENT_FLOW.md에 자동결제 옵션 흐름 추가

13. 기존 디자인/레이아웃 최대한 유지

14. npm run build 통과

---

## W140 (L1079, build_error, unknown)

디자인은 건드리지 말고, 실제 운영용 상품 데이터와 카테고리 시드 구조를 상용화 기준으로 정리해줘.

와딜은 일반상품 즉시결제와 공동구매 상품을 함께 운영하는 커머스 플랫폼이다.

이번 작업 목표:
테스트용 더미 데이터가 아니라 실제 운영에 가까운 상품/카테고리/가격단계 데이터를 준비한다. 참고용으로 쿠팡 카테고리를 똑같이 이용하면된다.

요구사항:
1. 카테고리 구조 정리
   예시:
   - 식품
   - 생활용품
   - 뷰티
   - 패션잡화
   - 반려동물
   - 육아
   - 디지털/가전
   - 지역특산물

2. categories 테이블 시드 파일 생성
   - name
   - slug
   - description
   - display_order
   - is_active

3. 상품 시드 데이터 생성
   - 일반상품 normal 예시
   - 공동구매 groupbuy 예시
   - 각 상품에 category_id 연결

4. 공동구매 상품에는 price_tiers 포함
   예:
   - 1개 이상 29,900원
   - 10개 이상 24,900원
   - 30개 이상 21,900원
   - 50개 이상 18,900원

5. 상품 상태값 정리
   - draft
   - active
   - ended
   - sold_out

6. 상품 데이터 필드 정리
   - product_type
   - name
   - slug
   - description
   - short_description
   - category_id
   - base_price
   - original_price
   - sale_price
   - price_tiers
   - main_image_url
   - detail_image_urls
   - stock_quantity
   - target_quantity
   - current_quantity
   - start_at
   - end_at
   - status

7. seed SQL 또는 script 생성
   - supabase/seed.sql 또는 scripts/seed-products.ts
   - 기존 데이터와 충돌하지 않게 upsert 구조 사용

8. 홈/검색/카테고리에서 시드 데이터가 정상 표시되게 확인

9. mock 데이터가 남아 있다면 위치 정리
   - 개발용 mock은 dev 전용으로 제한
   - production에서는 Supabase 데이터만 사용

10. docs/SEED_DATA.md 생성
   - 카테고리 추가 방법
   - 상품 추가 방법
   - 공동구매 가격단계 입력 방법
   - 시드 실행 방법

11. 기존 디자인/레이아웃 최대한 유지

12. npm run build 통과

---

## W141 (L1082, build_error, unknown)

디자인은 건드리지 말고, 운영자용 상품 등록 검수/승인 플로우를 상용화 기준으로 구현해줘.

와딜은 일반상품과 공동구매상품을 함께 운영하는 커머스 플랫폼이다.
나중에 공급사/입점 판매자가 상품을 등록할 수 있으므로, 상품은 바로 노출되지 않고 검수/승인 단계를 거쳐야 한다.

이번 작업 목표:
상품 등록 → 검수대기 → 승인/반려 → 노출 흐름을 만든다.

요구사항:
1. products/deals에 approval_status 추가
   - draft
   - pending_review
   - approved
   - rejected

2. 상품 노출 기준
   - status = active
   - approval_status = approved
   인 상품만 사용자 화면에 노출

3. 관리자 상품 관리에 검수 상태 표시
   - 전체
   - 임시저장
   - 검수대기
   - 승인
   - 반려

4. 관리자 검수 액션
   - 승인하기
   - 반려하기
   - 반려 사유 입력
   - 다시 검수요청 처리

5. 상품 등록/수정 시
   - 임시저장
   - 검수요청
   버튼 분리

6. rejected_reason 컬럼 추가

7. approved_at, approved_by 컬럼 추가

8. 상품 등록자가 있다면 created_by 또는 supplier_id와 연결

9. 승인/반려 시 알림 생성
   - 공급사/등록자에게 알림

10. RLS 기준
   - 일반 사용자는 approved + active 상품만 조회
   - 관리자는 전체 조회/수정 가능
   - 공급사 구조가 있으면 본인 상품만 조회/수정 가능

11. Supabase migration SQL 생성

12. 기존 디자인/레이아웃 최대한 유지

13. npm run build 통과

---

## W142 (L1085, build_error, unknown)

디자인은 건드리지 말고, 재고/품절/구매수량 제한 기능을 상용화 기준으로 구현해줘.

와딜은 일반상품 즉시결제와 공동구매 상품을 함께 운영하는 커머스 플랫폼이다.

이번 작업 목표:
상품별 재고, 품절, 최소/최대 구매수량, 공동구매 참여수량 제한을 안전하게 처리한다.

요구사항:
1. products/deals 재고 관련 컬럼 정리
   - stock_quantity
   - sold_quantity
   - min_order_quantity
   - max_order_quantity
   - per_user_limit
   - is_sold_out
   - sold_out_at

2. 일반상품 normal
   - stock_quantity 기준 구매 가능
   - 주문 성공 시 sold_quantity 증가
   - 재고 초과 구매 방지
   - 재고 0이면 sold_out 처리

3. 공동구매 groupbuy
   - target_quantity
   - current_quantity
   - max_quantity nullable
   - per_user_limit 적용
   - 공동구매 최대 수량 초과 참여 방지

4. checkout/참여 시 서버 검증
   - 클라이언트 수량 신뢰 금지
   - 최소 구매수량 확인
   - 최대 구매수량 확인
   - 1인당 구매 제한 확인
   - 재고/공동구매 가능수량 확인

5. 상품 상세에 표시
   - 남은 수량
   - 품절 여부
   - 1인당 구매 제한
   - 최소 주문 수량
   - 최대 주문 수량

6. 상품 카드에 표시
   - 품절 뱃지
   - 마감/품절 상태 구분

7. 관리자 상품 등록/수정에 추가
   - 재고 수량
   - 최소 주문수량
   - 최대 주문수량
   - 1인당 구매 제한
   - 공동구매 최대 수량

8. 동시 주문 방어
   - 서버 액션 또는 RPC에서 재고 차감 처리
   - 가능하면 Supabase SQL function으로 atomic update 준비
   - 재고 부족 시 에러 반환

9. 주문 취소/환불 시
   - 필요하면 sold_quantity 복구
   - 공동구매 current_quantity 복구 기준 정리

10. 유틸 함수 생성
   - validateOrderQuantity
   - canPurchaseProduct
   - getRemainingStock
   - isSoldOut

11. Supabase migration SQL 생성

12. 기존 디자인/레이아웃 최대한 유지

13. npm run build 통과

---

## W143 (L1088, build_error, unknown)

디자인은 건드리지 말고, 쿠폰/포인트/할인 정책을 상용화 기준으로 구현해줘.

와딜은 일반상품 즉시결제와 공동구매 상품을 함께 운영하는 커머스 플랫폼이다.

이번 작업 목표:
쿠폰, 포인트, 할인금액을 주문/결제 금액에 안전하게 반영할 수 있는 구조를 만든다.

요구사항:
1. coupons 테이블 생성
   - id
   - code
   - name
   - description
   - discount_type
   - discount_value
   - min_order_amount
   - max_discount_amount
   - starts_at
   - ends_at
   - usage_limit
   - per_user_limit
   - is_active
   - created_at
   - updated_at

2. coupon discount_type
   - fixed_amount
   - percentage
   - free_shipping

3. coupon_usages 테이블 생성
   - id
   - coupon_id
   - user_id
   - order_id
   - discount_amount
   - used_at

4. points 또는 user_points 테이블 생성
   - id
   - user_id
   - balance
   - created_at
   - updated_at

5. point_transactions 테이블 생성
   - id
   - user_id
   - order_id nullable
   - type
   - amount
   - reason
   - created_at

6. point transaction type
   - earn
   - use
   - refund
   - expire
   - adjust

7. checkout 화면
   - 쿠폰 코드 입력
   - 쿠폰 적용/해제
   - 포인트 사용 금액 입력
   - 주문금액
   - 쿠폰할인
   - 포인트사용
   - 최종결제금액 표시

8. 서버 검증
   - 쿠폰 유효기간 확인
   - 최소 주문금액 확인
   - 전체 사용횟수 확인
   - 사용자별 사용횟수 확인
   - 중복 사용 방지
   - 포인트 잔액 확인
   - 최종 결제금액 서버 계산

9. 일반상품 normal
   - 즉시결제 시 쿠폰/포인트 바로 차감
   - 결제 실패 시 포인트/쿠폰 사용 롤백

10. 공동구매 groupbuy
   - 참여 시 쿠폰/포인트 예약 가능
   - 마감 후 final_price 확정 시 최종 결제금액에 반영
   - final_price가 바뀌어도 할인 계산이 안전하게 되도록 처리

11. orders/payments에 금액 컬럼 정리
   - subtotal_amount
   - coupon_discount_amount
   - point_discount_amount
   - shipping_fee
   - final_payment_amount

12. 관리자 쿠폰 관리 페이지
   - /admin/coupons
   - 쿠폰 목록
   - 쿠폰 생성/수정
   - 활성/비활성
   - 사용횟수 확인

13. 마이페이지 포인트
   - 보유 포인트
   - 적립/사용 내역

14. RLS 기준
   - 사용자는 본인 포인트/쿠폰사용내역만 조회
   - 관리자는 전체 관리 가능
   - 쿠폰 적용은 서버에서만 확정

15. Supabase migration SQL 생성

16. 기존 디자인/레이아웃 최대한 유지

17. npm run build 통과

---

## W144 (L1091, build_error, unknown)

디자인은 건드리지 말고, 배송비/지역별 배송/제주·도서산간 추가비를 상용화 기준으로 구현해줘.

와딜은 실제 운영할 일반상품 + 공동구매 커머스 플랫폼이다.

이번 작업 목표:
상품별 배송비, 무료배송 조건, 지역별 추가 배송비를 주문금액에 안전하게 반영한다.

요구사항:
1. products/deals 배송 관련 컬럼 추가
   - shipping_fee
   - free_shipping_threshold
   - shipping_type
   - is_free_shipping
   - remote_area_extra_fee

2. shipping_type
   - paid
   - free
   - conditional_free

3. addresses 테이블에 지역 판별용 컬럼 정리
   - postal_code
   - address_line1
   - address_line2
   - region
   - is_remote_area

4. 배송비 계산 함수 생성
   - calculateShippingFee(product, address, subtotal)
   - 무료배송 조건 확인
   - 제주/도서산간 추가비 반영
   - 공동구매/일반상품 모두 대응

5. checkout 화면
   - 기본 배송비
   - 무료배송 조건
   - 제주/도서산간 추가비
   - 최종 배송비
   - 최종 결제금액 표시

6. 서버 검증
   - 클라이언트 배송비 신뢰 금지
   - 서버에서 주소/상품/수량 재조회
   - 배송비 재계산 후 주문 저장

7. 공동구매 groupbuy
   - 참여 시 예상 배송비 표시
   - 마감 후 final_price 확정 시 최종 결제금액에 배송비 반영

8. 일반상품 normal
   - 즉시결제 금액에 배송비 포함

9. 관리자 상품 등록/수정
   - 배송비 입력
   - 무료배송 여부
   - 무료배송 기준금액
   - 제주/도서산간 추가비 입력

10. 주문/결제 금액 컬럼과 연결
   - subtotal_amount
   - shipping_fee
   - remote_area_extra_fee
   - final_payment_amount

11. RLS/보안
   - 사용자는 본인 주소만 조회/수정
   - 배송비 계산은 서버에서만 확정

12. Supabase migration SQL 생성

13. 기존 디자인/레이아웃 최대한 유지

14. npm run build 통과

---

## W145 (L1094, build_error, unknown)

디자인은 건드리지 말고, 주소록/기본 배송지/배송 메모 기능을 상용화 기준으로 구현해줘.

와딜은 실제 운영할 일반상품 + 공동구매 커머스 플랫폼이다.

이번 작업 목표:
사용자가 배송지를 저장/관리하고, checkout에서 기본 배송지를 불러와 주문에 반영할 수 있게 만든다.

요구사항:
1. addresses 테이블 구조 정리
   - id
   - user_id
   - recipient_name
   - phone
   - postal_code
   - address_line1
   - address_line2
   - region
   - is_remote_area
   - delivery_memo
   - is_default
   - created_at
   - updated_at

2. 마이페이지 주소록
   - /mypage/addresses
   - 배송지 목록
   - 배송지 추가
   - 배송지 수정
   - 배송지 삭제
   - 기본 배송지 설정

3. checkout 화면
   - 기본 배송지 자동 선택
   - 배송지 변경 가능
   - 새 배송지 추가 가능
   - 배송 메모 입력/선택 가능

4. 배송 메모 기본 옵션
   - 문 앞에 놓아주세요
   - 경비실에 맡겨주세요
   - 택배함에 넣어주세요
   - 배송 전 연락주세요
   - 직접 입력

5. 서버 검증
   - 사용자는 본인 주소만 사용 가능
   - checkout 시 address_id가 본인 주소인지 검증
   - 배송비 계산 시 주소 기준으로 제주/도서산간 추가비 반영

6. 기본 배송지 처리
   - 새 기본 배송지 설정 시 기존 기본 배송지는 false 처리
   - 첫 배송지는 자동 기본 배송지로 설정

7. 주문 생성 시
   - 주문에 배송지 스냅샷 저장
   - recipient_name
   - phone
   - postal_code
   - address_line1
   - address_line2
   - delivery_memo
   - 주문 후 주소록이 바뀌어도 주문 배송지는 유지

8. RLS 기준
   - 사용자는 본인 주소만 조회/작성/수정/삭제 가능
   - 관리자는 주문 배송지 스냅샷만 확인 가능

9. Supabase migration SQL 생성

10. 기존 디자인/레이아웃 최대한 유지

11. npm run build 통과

---

## W146 (L1097, build_error, unknown)

디자인은 건드리지 말고, 휴대폰 본인인증/주문자 정보 검증 구조를 상용화 기준으로 준비해줘.

와딜은 실제 운영할 일반상품 + 공동구매 커머스 플랫폼이다.
결제, 배송, 환불, 고객센터 대응을 위해 주문자 정보 신뢰도가 필요하다.

이번 작업 목표:
휴대폰 본인인증 또는 최소한의 주문자 정보 검증 구조를 준비한다.

요구사항:
1. users/profiles 테이블에 인증 관련 컬럼 추가
   - phone
   - phone_verified_at
   - real_name
   - birth_date nullable
   - ci_hash nullable
   - di_hash nullable

2. 주문/checkout 전 검증
   - 이름
   - 휴대폰번호
   - 배송지
   필수 확인

3. 본인인증 상태
   - 미인증
   - 휴대폰 인증 완료
   - 본인인증 완료
   로 표시 가능하게 구조 준비

4. 인증 제공업체 연동 준비
   - NICE
   - PASS
   - Toss 본인확인
   같은 외부 인증 서비스 연결 가능하게 추상화

5. 지금은 실제 인증 API 미연동 상태이므로
   - verifyPhoneMock 또는 development 전용 인증 함수만 제공
   - production에서는 mock 인증 비활성화
   - 실제 인증 API 연결 전까지는 휴대폰 번호 입력/검증만 사용

6. 휴대폰번호 검증
   - 한국 휴대폰번호 형식 검증
   - 010으로 시작
   - 숫자만 저장 또는 정규화

7. 마이페이지 내 정보
   - 이름
   - 휴대폰번호
   - 인증 상태
   - 수정 기능

8. checkout 화면
   - 주문자 이름/휴대폰번호 확인
   - 미입력 시 주문 진행 불가
   - 인증 필요 안내 표시

9. 관리자 주문 상세
   - 주문자 이름
   - 휴대폰번호
   - 인증 여부 표시

10. 개인정보 보안
   - ci_hash/di_hash는 민감정보로 클라이언트에 노출하지 않음
   - 관리자 화면에도 필요한 정보만 표시
   - RLS 적용

11. Supabase migration SQL 생성

12. docs/IDENTITY_VERIFICATION.md 생성
   - 현재 구조
   - 추후 NICE/PASS/Toss 본인확인 연동 방법
   - production에서 mock 금지 안내

13. 기존 디자인/레이아웃 최대한 유지

14. npm run build 통과

---

## W147 (L1100, build_error, unknown)

디자인은 건드리지 말고, 사업자 정보/통신판매업 신고 정보/푸터 운영정보를 상용화 기준으로 추가해줘.

와딜은 실제 운영할 일반상품 + 공동구매 커머스 플랫폼이다.
쇼핑몰 운영을 위해 사업자 정보, 고객센터 정보, 통신판매업 정보, 정책 링크가 필요하다.

이번 작업 목표:
서비스 하단과 정책 페이지에 운영자 정보를 표시할 수 있는 구조를 만든다.

요구사항:
1. site_settings 또는 business_settings 테이블 생성
   - id
   - business_name
   - representative_name
   - business_number
   - mail_order_sales_number
   - business_address
   - customer_service_phone
   - customer_service_email
   - customer_service_hours
   - hosting_provider
   - privacy_manager_name
   - privacy_manager_email
   - bank_account_info nullable
   - created_at
   - updated_at

2. 관리자 설정 페이지 생성
   - /admin/settings/business
   - 사업자 정보 입력/수정
   - 고객센터 정보 입력/수정
   - 개인정보보호 책임자 정보 입력/수정

3. 푸터에 표시
   - 상호명
   - 대표자
   - 사업자등록번호
   - 통신판매업 신고번호
   - 사업장 주소
   - 고객센터 전화/이메일/운영시간
   - 이용약관
   - 개인정보처리방침
   - 환불정책
   - 공동구매 운영정책

4. 정보가 아직 없을 때
   - 관리자에게는 “사업자 정보를 입력해주세요” 안내
   - 일반 사용자 화면에는 빈 값으로 깨지지 않게 처리

5. 정책 페이지와 연결
   - /terms
   - /privacy
   - /refund-policy
   - /commerce-policy
   - /support

6. 관리자만 수정 가능
   - users.role = 'admin'

7. Supabase migration SQL 생성

8. 기존 디자인/레이아웃 최대한 유지

9. npm run build 통과

---

## W148 (L1103, build_error, unknown)

디자인은 건드리지 말고, 운영 로그/관리자 활동 기록 기능을 상용화 기준으로 구현해줘.

와딜은 실제 운영할 일반상품 + 공동구매 커머스 플랫폼이다.
관리자가 상품, 주문, 결제, 환불, 리뷰, 문의, 정산 정보를 수정할 수 있으므로 모든 주요 변경 이력을 기록해야 한다.

이번 작업 목표:
관리자 활동과 주요 데이터 변경 이력을 audit log로 남기는 구조를 만든다.

요구사항:
1. admin_activity_logs 테이블 생성
   - id
   - admin_user_id
   - action
   - target_type
   - target_id
   - before_data jsonb nullable
   - after_data jsonb nullable
   - ip_hash nullable
   - user_agent nullable
   - created_at

2. action 예시
   - product_create
   - product_update
   - product_approve
   - product_reject
   - order_status_update
   - payment_status_update
   - refund_update
   - shipping_update
   - review_hide
   - review_delete
   - support_reply
   - settlement_confirm
   - settlement_paid
   - business_settings_update

3. target_type 예시
   - product
   - order
   - payment
   - review
   - support_ticket
   - settlement
   - supplier
   - business_settings

4. 관리자 서버 액션에 로그 기록 추가
   - 상품 등록/수정/승인/반려
   - 주문 상태 변경
   - 배송 상태 변경
   - 결제/환불 상태 변경
   - 리뷰 숨김/삭제
   - 문의 답변
   - 정산 확정/지급완료
   - 사업자 정보 수정

5. 로그 생성 유틸 함수
   - createAdminActivityLog({
       adminUserId,
       action,
       targetType,
       targetId,
       beforeData,
       afterData
     })

6. 관리자 로그 페이지 생성
   - /admin/activity-logs
   - 최근 활동 목록
   - 관리자별 필터
   - action별 필터
   - target_type별 필터
   - 기간 필터

7. 로그 상세
   - 변경 전 데이터
   - 변경 후 데이터
   - 변경 시간
   - 관리자 정보

8. 보안
   - 일반 사용자 접근 불가
   - 관리자만 조회 가능
   - 로그는 수정/삭제 불가
   - 민감정보는 가능한 마스킹
   - billing_key, secret, ci_hash, di_hash 등은 저장하지 않음

9. RLS 정책
   - admin_activity_logs는 admin만 select 가능
   - insert는 서버 액션에서만 처리
   - update/delete 금지

10. Supabase migration SQL 생성

11. docs/ADMIN_AUDIT_LOGS.md 생성
   - 어떤 작업이 기록되는지
   - 민감정보 제외 기준
   - 운영 중 로그 확인 방법

12. 기존 디자인/레이아웃 최대한 유지

13. npm run build 통과

---

## W149 (L1106, build_error, unknown)

디자인은 건드리지 말고, 장애 대응/에러 로그/모니터링 구조를 상용화 기준으로 준비해줘.

와딜은 실제 운영할 일반상품 + 공동구매 커머스 플랫폼이다.
결제, 주문, 마감처리, 배송, 환불에서 장애가 발생하면 빠르게 파악하고 복구할 수 있어야 한다.

이번 작업 목표:
서비스 에러, 결제 실패, 마감 처리 실패, webhook 실패 등을 기록하고 관리자에서 확인할 수 있는 구조를 만든다.

요구사항:
1. error_logs 테이블 생성
   - id
   - level
   - source
   - message
   - stack nullable
   - user_id nullable
   - order_id nullable
   - payment_id nullable
   - deal_id/product_id nullable
   - metadata jsonb nullable
   - resolved_at nullable
   - created_at

2. level
   - info
   - warning
   - error
   - critical

3. source 예시
   - checkout
   - payment
   - webhook
   - finalize_deal
   - shipping
   - review
   - support
   - admin
   - auth

4. 서버 에러 기록 유틸 함수 생성
   - logError({
       level,
       source,
       message,
       error,
       userId,
       orderId,
       paymentId,
       productId,
       metadata
     })

5. 주요 실패 지점에 logError 적용
   - checkout 실패
   - 결제 승인 실패
   - Toss webhook 처리 실패
   - 공동구매 마감 처리 실패
   - 자동결제 실패
   - 배송상태 변경 실패
   - 환불 처리 실패
   - 관리자 액션 실패

6. 관리자 에러 로그 페이지
   - /admin/error-logs
   - level 필터
   - source 필터
   - 해결 여부 필터
   - 최근 에러 목록
   - 에러 상세 보기
   - 해결 처리 버튼

7. critical 에러 표시
   - 관리자 대시보드에 최근 critical/error 개수 표시
   - unresolved critical 있으면 경고 표시

8. 외부 모니터링 연결 준비
   - Sentry 연동 가능하게 구조 준비
   - 지금은 환경변수 없으면 비활성
   - SENTRY_DSN 문서화

9. 보안
   - 일반 사용자 접근 불가
   - 관리자만 조회 가능
   - secret key, billing_key, 개인정보 원문 저장 금지
   - 전화번호/주소/이름은 metadata에 저장하지 않도록 주의

10. RLS
   - error_logs는 관리자만 조회 가능
   - insert는 서버 액션/API route에서만

11. docs/ERROR_MONITORING.md 생성
   - 에러 로그 구조
   - critical 대응 방법
   - Sentry 연결 예정 방법
   - 결제/webhook 장애 확인 방법

12. 기존 디자인/레이아웃 최대한 유지

13. npm run build 통과

---

## W150 (L1109, git_deploy, unknown)

디자인은 건드리지 말고, 와딜의 오픈 직전 실제 운영 준비 체크리스트와 관리자 점검 화면을 상용화 기준으로 정리해줘.

와딜은 실제 운영할 일반상품 + 공동구매 커머스 플랫폼이다.

이번 작업 목표:
PG 심사, 사업자 정보, 도메인, 약관, 개인정보, 결제, 배송, 고객센터 등 실제 오픈 전 필수 준비사항을 점검할 수 있게 만든다.

요구사항:
1. docs/GO_LIVE_CHECKLIST.md 생성
   아래 항목 포함:
   - 사업자등록
   - 통신판매업 신고
   - 도메인 연결
   - SSL 적용
   - PG 계약/심사
   - Toss Payments 실결제 키 발급
   - 카카오페이/네이버페이 사용 가능 여부 확인
   - 휴대폰결제 사용 가능 여부 확인
   - 가상계좌 사용 가능 여부 확인
   - 개인정보처리방침
   - 이용약관
   - 환불/교환 정책
   - 공동구매 운영정책
   - 고객센터 전화/이메일
   - 배송/택배 계약
   - 제주·도서산간 배송비
   - 사업자 정보 푸터 표시
   - 관리자 계정 설정
   - Supabase RLS 확인
   - Vercel 환경변수 확인
   - Storage 버킷 공개/비공개 정책 확인
   - 결제 webhook URL 등록
   - 오류 로그/모니터링 확인

2. docs/PG_REVIEW_PREP.md 생성
   - PG 심사에 필요한 설명 정리
   - 와딜 결제 구조 설명
   - 일반상품 즉시결제
   - 공동구매 참여형 결제
   - 공동구매 마감 후 결제
   - 자동결제 옵션
   - 환불/취소 기준
   - 배송 흐름
   - 고객센터 정보

3. 관리자 대시보드에 “오픈 준비 상태” 섹션 추가
   - 사업자 정보 입력 여부
   - 정책 페이지 존재 여부
   - 상품 수
   - 진행중 상품 수
   - PG 환경변수 존재 여부
   - Toss webhook 설정 여부
   - Supabase 연결 상태
   - 미처리 문의 수
   - 미처리 환불 수
   - critical 에러 수

4. 오픈 상태 체크 유틸 함수 생성
   - getGoLiveReadiness()
   - 각 항목별 ready / warning / missing 반환

5. 관리자만 확인 가능

6. 기존 디자인/레이아웃 최대한 유지

7. npm run build 통과

---
