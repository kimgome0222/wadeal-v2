# Work Queue Prompts Part 07

## W151 (L1112, git_deploy, unknown)

디자인은 건드리지 말고, 와딜 전체 서비스 구조를 문서화하고 개발 인수인계 문서를 상용화 기준으로 작성해줘.

와딜은 실제 운영할 일반상품 + 공동구매 커머스 플랫폼이다.
일반상품 즉시결제와 공동구매 수량별 가격 단계제를 모두 지원한다.

이번 작업 목표:
현재 코드베이스의 기능, DB, 결제, 주문, 관리자, 운영 구조를 문서화한다.

요구사항:
1. docs/PROJECT_OVERVIEW.md 생성
   - 와딜 서비스 개요
   - 일반상품 구조
   - 공동구매 상품 구조
   - 수량 구간별 가격제
   - 결제 방식
   - 관리자 기능
   - 운영 흐름

2. docs/ARCHITECTURE.md 생성
   - Next.js App Router 구조
   - Supabase 구조
   - 서버 액션/API route 구조
   - 인증/권한 구조
   - RLS 기준
   - Storage 구조
   - Vercel 배포 구조

3. docs/DATABASE_SCHEMA.md 생성
   - users/profiles
   - products/deals
   - categories
   - orders
   - payments
   - reviews
   - addresses
   - notifications
   - support_tickets
   - suppliers
   - settlements
   - coupons/points
   - admin_activity_logs
   - error_logs
   주요 컬럼과 역할 정리

4. docs/ORDER_PAYMENT_FLOW.md 생성
   - 일반상품 즉시결제 흐름
   - 공동구매 참여 흐름
   - 마감 후 final_price 확정
   - Toss 결제위젯
   - 가상계좌
   - 자동결제 옵션
   - 환불/취소
   - 배송 전환 흐름

5. docs/ADMIN_GUIDE.md 생성
   - 상품 등록
   - 가격 단계 입력
   - 상품 승인/반려
   - 주문 관리
   - 결제 상태 확인
   - 배송 송장 입력
   - 리뷰 관리
   - 문의 답변
   - 정산 관리
   - 오픈 준비 상태 확인

6. docs/DEVELOPER_HANDOFF.md 생성
   - 로컬 실행 방법
   - 환경변수
   - Supabase migration 실행 순서
   - seed 실행 방법
   - build/test 방법
   - 배포 방법
   - 남은 작업
   - 주의사항

7. docs/ROADMAP.md 생성
   - MVP
   - 베타 오픈
   - 실결제 오픈
   - 앱화/PWA
   - 공급사 입점
   - 자동결제 고도화
   - 알림톡/푸시
   - 추천/랭킹/개인화

8. 코드 내 README 업데이트
   - 프로젝트 설명
   - 실행 방법
   - 주요 문서 링크
   - 주의사항

9. 기존 디자인/레이아웃 변경 금지

10. npm run build 통과

---

## W152 (L1114, git_deploy, unknown)

디자인은 건드리지 말고, 와딜의 남은 TODO를 정리하고 MVP 출시 범위를 확정하는 문서를 만들어줘.

와딜은 실제 운영할 일반상품 + 공동구매 커머스 플랫폼이다.
기능이 많아졌으므로 첫 출시 버전에서 반드시 필요한 기능과 나중에 할 기능을 분리해야 한다.

이번 작업 목표:
MVP 출시 범위, 베타 이후 작업, 보류 기능을 명확히 정리한다.

요구사항:
1. docs/MVP_SCOPE.md 생성

2. MVP 필수 기능으로 분류
   - 로그인/회원
   - 상품 목록/상세
   - 일반상품 즉시결제 구조
   - 공동구매 상품 참여
   - 수량 구간별 가격제
   - checkout
   - 주문내역
   - 배송지
   - 결제수단 선택
   - Toss 결제 준비 구조
   - 관리자 상품관리
   - 관리자 주문관리
   - 공동구매 마감처리
   - 리뷰 기본 구조
   - 고객센터 문의
   - 약관/개인정보/환불정책
   - 사업자 정보/푸터
   - 보안/RLS
   - Vercel/Supabase 배포

3. 베타 이후 기능으로 분류
   - 자동결제/빌링키 고도화
   - 알림톡
   - 앱푸시
   - 공급사 입점
   - 정산 자동화
   - 추천/랭킹
   - 쿠폰/포인트 고도화
   - 친구초대 리워드
   - 검색 로그 기반 인기검색어
   - 리뷰 이미지 고도화

4. 보류 또는 주의 기능으로 분류
   - 무리한 자동결제
   - 복잡한 공급사 정산
   - 과도한 프로모션/포인트
   - 미검증 외부 API 다중 연동
   - 운영 전 불필요한 대규모 기능

5. docs/TODO_AUDIT.md 생성
   - 코드 내 TODO/FIXME 목록 정리
   - 출시 전 반드시 해결할 TODO
   - 출시 후 처리 가능한 TODO
   - 위험도 high/medium/low 분류

6. docs/RELEASE_PLAN.md 생성
   - 1단계: 내부 테스트
   - 2단계: 지인 베타
   - 3단계: PG 심사/실결제 테스트
   - 4단계: 소량 상품 오픈
   - 5단계: 정식 오픈

7. 관리자 대시보드에 MVP 준비 상태 요약 추가
   - 필수 기능 완료 여부
   - 미완료 항목
   - 출시 위험 항목

8. 기존 디자인/레이아웃 변경 금지

9. npm run build 통과

---

## W153 (L1117, build_error, unknown)

디자인은 건드리지 말고, 와딜의 출시 전 코드 정리와 안정화 작업을 상용화 기준으로 진행해줘.

와딜은 실제 운영할 일반상품 + 공동구매 커머스 플랫폼이다.
이제 기능을 더 추가하기보다 MVP 출시를 위해 코드 품질, 안정성, 불필요 기능, 위험 요소를 정리해야 한다.

이번 작업 목표:
출시 전 코드베이스를 안정화하고, 불필요하거나 위험한 임시 코드를 정리한다.

요구사항:
1. mock/demo 코드 점검
   - production에서 mock 데이터 사용 금지
   - demo login은 production 기본 비활성
   - NEXT_PUBLIC_ALLOW_DEMO_LOGIN=false 기준 확인
   - mock fallback 제거 또는 dev 전용 처리

2. console.log/debug 코드 정리
   - 민감정보 출력 금지
   - 결제/주문/사용자 정보 로그 제거
   - 필요한 로그는 logError/admin_activity_logs로 대체

3. TODO/FIXME 정리
   - 위험도 높은 TODO는 docs/TODO_AUDIT.md에 반영
   - 출시 전 해결할 것과 출시 후 처리할 것 분리

4. 사용하지 않는 파일/컴포넌트 점검
   - 미사용 import 제거
   - 미사용 component 제거 또는 docs에 보류 사유 기록
   - 중복 유틸 함수 정리

5. 타입 안정성 강화
   - any 최소화
   - order/payment/product/review 타입 정리
   - price_tiers 타입 명확화
   - payment_status/order_status/shipping_status union type 정리

6. 에러 처리 통일
   - 서버 액션 실패 응답 형식 통일
   - 사용자에게 보여줄 메시지와 내부 로그 메시지 분리
   - try/catch 누락된 핵심 액션 보강

7. 빌드 안정성
   - npm run lint 가능하면 통과
   - npm run build 통과
   - TypeScript 에러 제거

8. 환경변수 방어
   - 필수 env 누락 시 관리자 대시보드에서 경고
   - 클라이언트에서 server secret 접근 금지
   - NEXT_PUBLIC_ 변수만 클라이언트 사용

9. Supabase query 정리
   - 반복 query 유틸화
   - 관리자 권한 확인 함수 통일
   - 사용자 본인 데이터 조회 함수 통일

10. 문서 업데이트
   - docs/DEVELOPER_HANDOFF.md
   - docs/MVP_SCOPE.md
   - docs/GO_LIVE_CHECKLIST.md
   에 정리 결과 반영

11. 기존 디자인/레이아웃 변경 금지

12. npm run build 통과

---

## W154 (L1120, build_error, unknown)

🛒 이커머스 마이페이지 핵심 구성 요소
1. 상단 대시보드 (사용자 요약 정보)

프로필: 사용자 이름(닉네임) 및 현재 회원 등급

혜택 요약: 보유 포인트(적립금), 사용 가능한 쿠폰 수, 장바구니 담긴 상품 수

Cursor 프롬프트 팁: "마이페이지 상단에 들어갈 대시보드 UI를 만들어줘. 사용자 이름, 등급, 포인트, 쿠폰 개수가 카드 형태로 나란히 보이게 해줘."

2. 주문/배송 조회 (가장 중요한 영역)

배송 상태 스텝: 결제완료 ➔ 상품준비중 ➔ 배송중 ➔ 배송완료 (아이콘과 함께 건수를 표시)

최근 주문 내역: 최근 주문한 상품 목록 조회 버튼 및 리스트 일부 노출

Cursor 프롬프트 팁: "진행 중인 주문 상태를 4단계(결제완료, 상품준비중, 배송중, 배송완료)로 보여주는 스텝퍼(Stepper) UI 컴포넌트를 만들어줘."

3. 나의 활동 내역

관심 상품: 찜한 상품 (위시리스트), 최근 본 상품

게시물 관리: 내가 작성한 상품 리뷰, 상품 문의(Q&A) 내역

4. 개인정보 및 계정 설정

회원정보 수정: 비밀번호 변경, 이메일/연락처 변경

배송지 관리: 기본 배송지 설정, 새로운 배송지 추가/수정/삭제

결제 수단 관리: 등록된 간편 결제 카드 및 계좌 관리

알림 설정: 푸시 알림, 이메일, SMS 마케팅 수신 동의 여부

기타: 로그아웃, 회원탈퇴  디자인은 건드리지 말고, 로그인 후 마이페이지/계정관리/개인정보 영역을 쿠팡·위메프 같은 커머스 앱 기준으로 상용화 수준으로 보강해줘.

와딜은 실제 운영할 일반상품 + 공동구매 커머스 플랫폼이다.
로그인 후 사용자가 상단에서 본인 계정을 확인하고, 계정/주소/결제수단/구매내역/알림/문의/리뷰 등을 관리할 수 있어야 한다.

이번 작업 목표:
마이페이지와 내 정보 관리 구조를 실제 쇼핑몰 앱 수준으로 정리한다.

요구사항:
1. 로그인 후 헤더 상단 또는 마이페이지 상단에 사용자 정보 표시
   - 닉네임 또는 이름
   - 이메일 또는 카카오 계정 표시 가능하면 표시
   - 회원 등급 placeholder
   - 알림 뱃지
   - 클릭 시 /mypage 로 이동

2. /mypage 메인 개선
   - 사용자 프로필 카드
   - 주문/배송 요약
   - 공동구매 참여중
   - 결제 대기
   - 배송중
   - 리뷰 작성 가능
   - 쿠폰/포인트
   - 최근 본 상품
   - 찜한 상품
   - 고객센터 바로가기

3. 내 정보 관리 페이지 생성
   - /mypage/profile
   - 이름
   - 닉네임
   - 이메일
   - 휴대폰번호
   - 생년월일
   - 성별 optional
   - 마케팅 수신 동의
   - 개인정보 수정

4. 개인정보 보안
   - 생년월일은 birth_date로 저장
   - 휴대폰번호는 정규화해서 저장
   - ci_hash/di_hash 같은 민감 인증값은 화면에 노출 금지
   - 사용자는 본인 정보만 조회/수정 가능
   - 관리자는 필요한 최소 정보만 조회

5. 주소지 관리
   - /mypage/addresses
   - 배송지 목록
   - 기본 배송지 설정
   - 배송지 추가/수정/삭제
   - 수령인
   - 휴대폰번호
   - 우편번호
   - 주소
   - 상세주소
   - 배송메모

6. 카드/결제수단 관리
   - /mypage/payment-methods
   - 등록된 결제수단 목록
   - 카드사
   - 카드 끝 4자리
   - 기본 결제수단 설정
   - 삭제/비활성화
   - billing_key는 절대 화면/클라이언트에 노출 금지
   - 실제 카드 등록 API는 Toss billing 구조와 연결 가능하게 준비
   - 아직 미연동이면 “준비 중” 또는 “결제 시 등록” 안내

7. 구매내역
   - /mypage/orders
   - 일반상품 주문
   - 공동구매 참여 주문
   - 주문상태
   - 결제상태
   - 배송상태
   - 주문 상세 이동
   - 송장번호/배송조회
   - 구매확정
   - 리뷰 작성

8. 공동구매 참여내역
   - /mypage/groupbuys
   - 참여중
   - 마감됨
   - 결제대기
   - 결제완료
   - 최종가 확정
   - 다음 가격 단계까지 남은 수량

9. 리뷰 관리
   - /mypage/reviews
   - 작성 가능한 리뷰
   - 작성한 리뷰
   - 작성기한 만료 리뷰

10. 쿠폰/포인트
   - /mypage/benefits
   - 보유 쿠폰
   - 사용 가능 쿠폰
   - 포인트 잔액
   - 포인트 사용/적립 내역

11. 알림 설정
   - /mypage/notification-settings
   - 공동구매 마감 알림
   - 가격 단계 달성 알림
   - 주문/배송 알림
   - 마케팅 알림
   - 카카오/이메일/앱푸시 확장 가능한 구조

12. 고객센터/문의내역
   - /mypage/support
   - 내 문의 목록
   - 문의 상세
   - 답변 상태
   - 새 문의 작성

13. 계정 설정
   - /mypage/settings
   - 비밀번호/소셜로그인 안내
   - 로그아웃
   - 회원탈퇴
   - 개인정보 다운로드 placeholder
   - 마케팅 동의 변경

14. 회원탈퇴 구조
   - 바로 hard delete 하지 말고 withdrawal_requested_at, status 처리
   - 주문/결제/정산 기록은 법적 보관 필요 안내
   - 개인정보는 탈퇴 후 마스킹/비식별화 가능하게 구조 준비

15. DB/migration 보강
   - profiles/users에 필요한 컬럼 추가
   - birth_date
   - phone
   - phone_verified_at
   - gender nullable
   - marketing_agreed_at nullable
   - withdrawal_requested_at nullable
   - account_status active/withdrawal_requested/withdrawn/suspended

16. RLS
   - 사용자는 본인 profile만 조회/수정 가능
   - 주소/결제수단/주문/리뷰/문의/알림설정은 본인 것만 접근 가능
   - billing_key, ci_hash, di_hash는 클라이언트 select 금지 또는 별도 보안 처리

17. 기존 디자인/레이아웃 최대한 유지
   - 현재 잡아둔 디자인 톤 변경 금지
   - 필요한 페이지만 추가/정리

18. npm run build 통과

---

## W155 (L1123, payment, unknown)

subagent-ba773159-6bd4-47cc-80a9-82852fdfea2e subagent-c4ced15a-34e6-47e2-924c-93d753756fd9 subagent-c4ced15a-34e6-47e2-924c-93d753756fd9 다만, 실제 '쿠팡'이나 '위메프'처럼 운영되는 찐 상용 앱의 디테일을 살리기 위해 Cursor가 스스로 알아서 챙기기 힘든 예외 처리와 UX 디테일 4가지를 보충해 주시면 더욱 완벽해집니다.

💡 마이페이지 구현 시 추가로 보충하면 좋은 4가지
1. 소셜 로그인(카카오/네이버 등) 사용자 예외 처리

이유: 이메일 가입자는 계정 설정에서 '비밀번호 변경'이 필요하지만, 카카오/구글 등으로 가입한 유저는 비밀번호를 변경할 수 없습니다.

보충 내용: "계정 설정(/mypage/settings)에서 현재 로그인된 유저가 소셜 로그인 유저인지 판별하여, 소셜 유저에게는 비밀번호 변경 폼 대신 '카카오(또는 연동된 소셜) 계정으로 로그인 중입니다'라는 안내 문구를 띄워줘."

2. 주문 취소 / 교환 / 반품 (클레임 관리) 버튼

이유: 구매내역에 '구매확정', '리뷰작성', '배송조회'는 명시되어 있지만, 커머스에서 가장 빈번하게 일어나는 CS인 취소/반품이 빠져있습니다.

보충 내용: "주문내역(/mypage/orders)에서 배송 전 상태(결제완료/상품준비중)일 때는 '주문 취소' 버튼을, 배송완료 상태일 때는 구매확정 버튼과 함께 '교환/반품 신청' 버튼이 보이도록 UI와 빈 함수 처리를 해줘."

3. 데이터 페이징(Pagination) 또는 무한 스크롤

이유: 구매내역, 포인트 사용 내역, 알림 목록 등은 상용화 시 데이터가 끝없이 쌓입니다. 한 번에 불러오면 로딩 속도 저하(성능 이슈)가 발생합니다.

보충 내용: "마이페이지 하위의 모든 리스트(구매내역, 리뷰, 포인트, 문의내역 등)는 한 번에 10개씩만 불러오도록 페이지네이션(Pagination)이나 무한 스크롤(Load more) 구조를 기본으로 적용해 줘."

4. 본인인증(휴대폰 인증) 흐름 대비

이유: DB 설계에 phone_verified_at은 잘 넣으셨지만, 실제 사용자가 내 정보에서 번호를 바꿀 때의 프로세스 언급이 없습니다.

보충 내용: "개인정보 수정(/mypage/profile)에서 휴대폰 번호를 변경할 때는 단순 입력이 아니라, '인증번호 발송' 및 '인증 확인' 버튼이 있는 UI로 구성해 줘. 실제 SMS API는 나중에 붙일 테니 껍데기 함수만 만들어둬."

---

## W156 (L1126, build_error, unknown)

Cursor 복사/붙여넣기용 프롬프트
"지금까지 구현한 마이페이지 및 계정 관리 로직은 그대로 유지하면서, 실제 상용 쇼핑몰 수준의 디테일을 위해 아래 4가지 예외 처리와 UI를 추가해 줘. 기존 디자인 레이아웃이 깨지지 않게 주의해 줘.

소셜 로그인 유저 예외 처리: 계정 설정(/mypage/settings)의 '비밀번호 변경' 영역에서, 현재 로그인한 유저가 소셜 로그인(카카오, 네이버 등) 가입자인지 판별해 줘. 소셜 유저라면 비밀번호 변경 폼 대신 '카카오(또는 연동된 소셜) 계정으로 로그인 중입니다'라는 텍스트 안내만 띄워줘.

주문 클레임(취소/교환/반품) 버튼 추가: 주문 내역(/mypage/orders)에서 배송 상태에 따라 버튼을 다르게 노출해 줘.

결제완료/상품준비중 상태: '주문 취소' 버튼 노출

배송완료 상태: 구매확정/리뷰작성 버튼과 함께 '교환/반품 신청' 버튼 노출

(버튼 클릭 시 작동할 빈 함수 껍데기만 먼저 만들어둬)

리스트 페이지네이션(Pagination) 적용: 마이페이지 하위의 데이터 리스트(구매내역, 작성한 리뷰, 포인트 내역, 문의 내역 등)는 한 번에 10개씩만 불러오도록 무한 스크롤(또는 페이지네이션) UI와 로직을 기본으로 적용해 줘.

휴대폰 본인인증 UI 껍데기 추가: 개인정보 수정(/mypage/profile) 페이지에서 휴대폰 번호를 변경할 때 단순 텍스트 입력이 아니라, 번호 입력 칸 옆에 '인증번호 발송' 버튼과 '인증번호 확인' 입력란이 나타나는 UI 흐름을 만들어 줘. (실제 SMS API는 나중에 붙일 예정이니 프론트엔드 상태값 관리와 UI만 구현할 것)

작업 완료 후 npm run build가 완벽하게 통과하는지 확인해 줘."

---

## W157 (L1131, build_error, unknown)

판매자 센터(Seller Center) 구축 전략
현재 프로젝트 구조 안에서 다음과 같이 라우트를 나누어 구축하는 것이 가장 효율적입니다.

/ (일반 화면): 구매자용 (지금까지 만든 쇼핑몰)

/seller (판매자 센터): 입점 판매자용 (상품 등록 요청, 주문 확인, C/S, 정산)

/admin (총괄 관리자): 와딜 본사용 (전체 승인, 전체 매출, 정산 지급 처리)

이렇게 나누기 위해 가장 먼저 해야 할 일은 '권한(Role) 분리'와 '판매자 전용 레이아웃'을 잡는 것입니다. 이 작업 역시 Cursor가 꼬이지 않도록 단계를 나누어 요청하는 것이 좋습니다.

🛠️ 판매자 센터 구축을 위한 1단계 프롬프트 (기반 다지기)
가장 먼저 DB의 권한 구조를 세팅하고, 판매자 센터의 빈 껍데기(레이아웃)를 만들어야 합니다. 아래 프롬프트를 복사해서 Cursor에 입력해 보세요.

"와딜(Wadeal) 플랫폼에 입점 판매자를 위한 '판매자 센터(/seller)'를 별도로 구축하려고 해. 디자인은 심플하고 전문적인 대시보드(Admin) 스타일로 구성해 줘.

DB 권한 및 테이블 설정:

users 또는 profiles 테이블에 role 컬럼을 추가하고 user, seller, admin으로 구분해 줘.

판매자 정보를 담을 sellers 테이블을 생성해 줘. (컬럼: id, user_id, company_name, business_number, status, created_at 등)

판매자는 본인의 데이터만 볼 수 있도록 RLS(Row Level Security) 정책을 작성해 줘.

판매자 센터 레이아웃 구성:

/seller 경로에 접속했을 때 일반 쇼핑몰 헤더가 아닌, 좌측 사이드바(LNB)가 있는 대시보드 레이아웃(layout.tsx)을 만들어 줘.

사이드바 메뉴 구조 (빈 페이지로 연결되게 뼈대만):

홈 (대시보드 요약)

상품 관리 (상품 등록 요청, 내 상품 목록)

주문/배송 관리 (신규 주문, 발송 처리)

C/S 관리 (고객 문의, 리뷰 관리)

정산 관리 (정산 예정 금액, 완료 내역)

기존 코드가 깨지지 않게 주의하고, npm run build가 통과되도록 뼈대를 잡아줘."

---

## W158 (L1138, build_error, unknown)

Cursor 복사/붙여넣기용 프롬프트
"디자인 톤은 깔끔한 관리자/대시보드 스타일(Tailwind 기반)로 유지하면서, 와딜의 입점 판매자 가입 승인 플로우와 상품 등록 검수 시스템을 상용화 기준으로 구현해 줘.

다음 비즈니스 로직과 예외 처리가 반영되어야 해:

1. 판매자 가입 및 승인 프로세스 (/seller/register 및 DB)

sellers 테이블의 status 컬럼을 pending_review(검수대기), approved(승인완료), rejected(반려), suspended(정지)로 관리해 줘.

판매자 가입 신청 시 사업자등록증 파일(Storage 연동 대비), 대표자명, 사업자번호 등을 입력받고 상태를 pending_review로 저장해 줘.

권한 제약: status가 approved가 된 판매자만 판매자 센터의 기능(상품 등록, 주문 조회 등)을 정상 이용할 수 있게 해줘. 승인 대기 중일 때는 '관리자 승인 대기 중입니다' 안내 화면을 띄워줘.

2. 상품 등록 및 검수 프로세스 (/seller/products)

판매자가 새 상품(일반/공동구매)을 등록하거나 이미지를 업로드하더라도 바로 일반 사용자 화면에 노출되지 않도록 처리해 줘.

products 테이블의 approval_status 컬럼을 draft(임시저장), pending_review(검수요청), approved(승인완료), rejected(반려)로 관리해 줘.

일반 홈 화면이나 검색 결과에서는 오직 approval_status = 'approved'이고 status = 'active'인 상품만 select 되도록 RLS 및 쿼리를 수정해 줘.

3. 판매자 자율 C/S 및 리뷰 답글 권한 (/seller/cs, /seller/reviews)

상품 등록과 달리, 고객의 상품 문의(Q&A) 답변 작성 및 구매확정 리뷰의 답글(댓글) 작성은 와딜 본사의 승인 없이 판매자가 자유롭게 실시간으로 등록/수정할 수 있어야 해.

review_replies 또는 support_answers 테이블을 생성하거나 기존 구조를 보강하고, 본인 상품에 달린 문의/리뷰에 대해서만 판매자가 자율적으로 C/S 처리를 할 수 있도록 RLS 정책을 세팅해 줘.

4. 총괄 관리자(Super Admin) 검수 화면 (/admin/verification)

와딜 본사 관리자만 접근할 수 있는 페이지를 만들어서 아래 기능을 처리해 줘.

판매자 승인 관리: 대기 중인 판매자 서류 확인 후 '승인' 또는 '반려(반려 사유 입력)' 기능

상품 등록 검수: 판매자가 요청한 상품 상세 정보 및 이미지 검수 후 '승인' 또는 '반려(반려 사유 입력)' 기능

위 요구사항에 맞는 Supabase Migration SQL을 생성하고, 파일 뼈대를 잡은 후 npm run build가 완벽하게 통과하는지 확인해 줘."

💡 개발 진행 시 참고할 디자인/UX 포인트
사이드바 메뉴 활성화: 판매자 가입 승인이 나기 전까지는 사이드바의 '상품 관리', '주문 관리' 메뉴를 클릭할 수 없도록 비활성화(Disable) 및 자물쇠 아이콘 처리를 해두는 것이 보안과 UX 측면에서 안전합니다.

알림 톡/메일 기능 연동 대비: 와딜 본사 관리자가 판매자 승인을 하거나 상품을 반려할 때, 판매자에게 알림이 가도록 createNotification 함수를 트리거하는 로직을 미리 심어두면 나중에 카카오 알림톡을 붙이기 편합니다.

---

## W159 (L1142, build_error, unknown)

💡 판매자 센터에 추가로 보충해야 할 4가지 기능
1. 판매자 전용 통계 대시보드 (Seller Analytics)

이유: 판매자가 로그인했을 때 가장 먼저 보고 싶은 건 "내 상품이 얼마나 팔렸고, 얼마를 벌었나"입니다. 총괄 관리자(Admin)가 보는 전체 통계와는 별개로, 해당 판매자의 상품에 대한 지표만 보여주는 메인 대시보드가 필요합니다.

추가할 내용: 오늘 들어온 신규 주문 건수, 이번 달 누적 판매액, 답변을 기다리는 C/S 문의 건수, 마감 임박한 공동구매 건수를 보여주는 요약 위젯.

2. 스토어(브랜드) 및 배송/반품지 설정

이유: 판매자마다 출고지(상품을 발송하는 곳)와 반품지(교환/환불 시 물건을 받을 곳), 그리고 고객센터 연락처가 다릅니다. 이게 세팅되어야 고객 화면에 '판매자 정보'를 정확히 띄울 수 있습니다.

추가할 내용: /seller/settings 페이지를 만들어서 브랜드 로고, 스토어명, 기본 출고지/반품지 주소, 판매자 C/S 전화번호를 설정할 수 있는 기능.

3. 판매자용 정산 내역 조회

이유: 와딜(본사)에서 정산금을 입금해주기 전에, 판매자가 "이번 달에 얼마를 정산받을 예정인지" 미리 확인할 수 있어야 CS 마찰이 줄어듭니다.

추가할 내용: /seller/settlements 페이지를 만들어서 '정산 예정 금액'과 '지급 완료 금액'을 리스트로 확인하는 기능.

4. 상태 변경 알림 (Notification)

이유: 본사 관리자가 상품을 '반려'하거나 '승인'했을 때, 판매자가 사이트에 들어오지 않아도 알 수 있어야 합니다.

추가할 내용: 관리자가 승인/반려 처리를 할 때, 해당 판매자 계정으로 인앱 알림(Notification)이 생성되도록 로직 추가 (추후 알림톡 연동을 위한 대비).

이 내용들을 커서(Cursor)에 바로 입력해서 보완하실 수 있도록 추가 프롬프트를 만들어 드릴게요. 그대로 복사해서 넣어보세요.

📋 Cursor 복사/붙여넣기용 보충 프롬프트
"앞서 만든 판매자 센터 구조에 실제 상용 서비스(쿠팡 윙, 스마트스토어) 수준의 필수 기능을 4가지 더 보완해 줘. 기존 레이아웃이나 RLS 정책이 깨지지 않게 주의해.

판매자 메인 대시보드 (/seller/dashboard): 판매자가 로그인하면 본인 상품에 대한 지표만 보이게 해줘. (오늘 신규 주문 건수, 이번 달 예상 매출액, 답변 대기 중인 문의 건수, 현재 진행 중인 공동구매 현황 등)

스토어 및 배송지 설정 (/seller/settings): sellers 테이블에 스토어명(브랜드명), 고객센터 연락처, 출고지 주소, 반품지 주소를 저장할 수 있는 컬럼을 추가하고, 이를 수정할 수 있는 UI 폼을 만들어 줘.

판매자 정산 조회 (/seller/settlements): 판매자가 자신의 완료된 주문을 바탕으로 '정산 예정 금액'과 '지급 완료 금액'을 확인할 수 있는 조회용 리스트 페이지를 만들어 줘. (정산 데이터는 settlements 테이블 기반으로 본인 것만 조회)

관리자 승인/반려 알림 연동: 총괄 관리자가 판매자 가입을 승인/반려하거나, 상품 등록을 승인/반려할 때 notifications 테이블을 통해 해당 판매자에게 인앱 알림이 생성되도록 로직을 추가해 줘. (이메일/알림톡 확장을 위한 뼈대 포함)

작업 완료 후 npm run build가 에러 없이 통과하는지 확인해 줘."

---

## W160 (L1145, build_error, unknown)

Cursor 복사/붙여넣기용 '판매자 재무/정보 세부 관리' 프롬프트
"앞서 구축한 판매자 센터(/seller)에 실제 상용 쇼핑몰 수준의 '재무 및 판매자 정보 관리' 디테일을 추가해 줘. 기존 레이아웃이나 RLS 정책이 깨지지 않게 주의하고, 아래 세부 기능들을 구현해 줘.

1. 판매자 개인정보 및 계좌 연결 (/seller/settings/profile, /seller/settings/account)

sellers 테이블에 정산 대금 입금을 위한 계좌 정보 컬럼(bank_name, account_number, account_holder)을 추가해 줘.

판매자 개인정보/사업자 정보 수정 폼과 함께, '결제대금 계좌 연결' UI를 구현해 줘. 계좌번호 입력 시 예금주를 확인하는 껍데기 함수(추후 API 연동 대비)도 만들어 둬.

2. 수수료 및 정산/입금 확인창 (/seller/finance/settlements)

기존 정산 조회 페이지를 고도화해 줘.

단순히 얼마를 받는지가 아니라, [총 판매 금액 - 플랫폼 판매 수수료 - 혜택/쿠폰 부담금 = 최종 입금액] 형태로 세부 내역이 명확히 보이는 영수증 형태의 UI를 추가해 줘.

본사에서 정산금을 입금 완료했을 때 판매자가 확인할 수 있는 '입금 완료(Deposit Confirmed)' 상태 뱃지와 확인창을 만들어 줘.

3. 광고비 결제 및 청구 관리 (/seller/finance/billing)

판매자가 와딜 플랫폼 내에서 광고를 집행할 경우를 대비해 seller_billings 테이블을 생성해 줘. (컬럼: id, seller_id, type(ad_fee, extra_charge 등), amount, status, due_date, paid_at).

판매자가 청구된 광고비를 확인하고 결제(신용카드 등)할 수 있는 UI와 내역 리스트를 만들어 줘. (결제 버튼 클릭 시 Toss Payments 연동을 위한 빈 함수 연결)

위 데이터 구조 변경을 위한 Supabase Migration SQL을 생성하고, UI 로직을 반영한 뒤 npm run build가 완벽히 통과하는지 확인해 줘."

---

## W161 (L1147, notifications, unknown)

새 파일 생성:

app/admin/notifications/page.tsx

아래 코드 붙여넣기.

import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function AdminNotificationsPage() {
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("role_target", "admin")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">관리자 알림센터</h1>

      <div className="mt-6 space-y-3">
        {notifications?.map((item) => (
          <div key={item.id} className="rounded-2xl border bg-white p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-gray-500">{item.message}</p>
                <p className="mt-2 text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleString("ko-KR")}
                </p>
              </div>

              {item.link_url && (
                <Link
                  href={item.link_url}
                  className="rounded-xl border px-3 py-2 text-sm"
                >
                  보기
                </Link>
              )}
            </div>
          </div>
        ))}

        {!notifications?.length && (
          <div className="rounded-2xl border bg-white p-10 text-center text-gray-500">
            아직 관리자 알림이 없습니다.
          </div>
        )}
      </div>
    </main>
  );
}
[CURSOR] 관리자 메뉴 추가
{
  label: "알림센터",
  href: "/admin/notifications",
}

---

## W162 (L1165, seller, unknown)

CURSOR: 관리자 주문상세 페이지에서 액션 연결

파일 열기:

app/admin/orders/[id]/page.tsx

맨 위 import 추가:

import { adminApproveCancelOrder } from "@/app/actions/adminApproveCancelOrder";
import { adminApproveRefundOrder } from "@/app/actions/adminApproveRefundOrder";
import { adminRejectRefundOrder } from "@/app/actions/adminRejectRefundOrder";
22단계 — CURSOR: 관리자 취소 승인 버튼 UI

주문 정보 영역 아래쯤 추가.

{order.order_status === "cancel_requested" && (
  <div className="border rounded-xl p-4 mt-6">
    <h3 className="font-semibold text-lg mb-3">
      취소 요청 처리
    </h3>

    <div className="mb-3 text-sm text-zinc-600">
      사유: {order.cancel_reason || "-"}
    </div>

    <form
      action={async () => {
        "use server";
        await adminApproveCancelOrder(order.id);
      }}
    >
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        주문 취소 승인
      </button>
    </form>
  </div>
)}
23단계 — CURSOR: 관리자 환불 승인/거절 UI

아래 이어서 추가.

{order.order_status === "refund_requested" && (
  <div className="border rounded-xl p-4 mt-6">
    <h3 className="font-semibold text-lg mb-3">
      환불 요청 처리
    </h3>

    <div className="mb-3 text-sm text-zinc-600">
      사유: {order.refund_reason || "-"}
    </div>

    <div className="flex gap-3">
      <form
        action={async () => {
          "use server";
          await adminApproveRefundOrder(order.id);
        }}
      >
        <button
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          전체 환불 승인
        </button>
      </form>

      <form
        action={async () => {
          "use server";
          await adminRejectRefundOrder(
            order.id,
            "환불 조건 불충족"
          );
        }}
      >
        <button
          className="border px-4 py-2 rounded-lg"
        >
          환불 거절
        </button>
      </form>
    </div>
  </div>
)}
24단계 — CURSOR: 관리자 부분환불 UI 컴포넌트 생성

파일 생성:

components/admin/AdminPartialRefundForm.tsx

붙여넣기:

"use client";

import { useState, useTransition } from "react";
import { adminApprovePartialRefundOrder } from "@/app/actions/adminApprovePartialRefundOrder";

type Props = {
  orderId: string;
  items: any[];
};

export default function AdminPartialRefundForm({
  orderId,
  items,
}: Props) {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [pending, startTransition] = useTransition();

  const toggleItem = (itemId: string, quantity: number) => {
    const exists = selectedItems.find(
      (item) => item.orderItemId === itemId
    );

    if (exists) {
      setSelectedItems((prev) =>
        prev.filter((item) => item.orderItemId !== itemId)
      );
    } else {
      setSelectedItems((prev) => [
        ...prev,
        {
          orderItemId: itemId,
          quantity,
        },
      ]);
    }
  };

  const handleRefund = () => {
    if (selectedItems.length === 0) {
      alert("환불 상품을 선택해주세요.");
      return;
    }

    startTransition(async () => {
      try {
        await adminApprovePartialRefundOrder(
          orderId,
          selectedItems,
          "관리자 부분환불"
        );

        alert("부분환불 완료");
        location.reload();
      } catch (err: any) {
        alert(err.message);
      }
    });
  };

  return (
    <div className="border rounded-xl p-4 mt-6">
      <h3 className="font-semibold text-lg mb-4">
        부분환불 처리
      </h3>

      <div className="space-y-3">
        {items.map((item) => {
          const remainQuantity =
            Number(item.quantity || 0) -
            Number(item.refund_quantity || 0);

          if (remainQuantity <= 0) return null;

          return (
            <label
              key={item.id}
              className="flex items-center justify-between border rounded-lg p-3 cursor-pointer"
            >
              <div>
                <div className="font-medium">
                  {item.products?.name}
                </div>

                <div className="text-sm text-zinc-500">
                  구매수량: {item.quantity}
                </div>

                <div className="text-sm text-zinc-500">
                  환불가능: {remainQuantity}
                </div>
              </div>

              <input
                type="checkbox"
                onChange={() =>
                  toggleItem(item.id, remainQuantity)
                }
              />
            </label>
          );
        })}
      </div>

      <button
        onClick={handleRefund}
        disabled={pending}
        className="mt-4 bg-black text-white px-4 py-2 rounded-lg"
      >
        부분환불 승인
      </button>
    </div>
  );
}
25단계 — CURSOR: 관리자 주문상세 페이지에 부분환불 컴포넌트 연결

파일:

app/admin/orders/[id]/page.tsx

맨 위 import 추가:

import AdminPartialRefundForm from "@/components/admin/AdminPartialRefundForm";

그리고 order 조회 아래에 추가:

const { data: orderItems } = await supabase
  .from("order_items")
  .select(`
    *,
    products (
      name
    )
  `)
  .eq("order_id", order.id);

그리고 페이지 하단쯤 추가:

{orderItems && orderItems.length > 0 && (
  <AdminPartialRefundForm
    orderId={order.id}
    items={orderItems}
  />
)}

여기까지 하면 관리자 페이지에서:

전체 취소 승인
전체 환불 승인
환불 거절
부분환불 승인

전부 실제 동작함.

다음은:

판매자 정산 시스템
정산 보류
환불 발생 시 정산 차감
정산 파일 업로드
정산 상태 자동화

---

## W163 (L1172, build_error, unknown)

1번 방식(자동 차감 정산)을 위한 시스템 보완 포인트
1번 방식을 채택하시려면 DB와 비즈니스 로직에 다음 구조를 추가해야 합니다.

정산 명세서 자동 생성 (settlement_records 테이블):

판매 매출 - (플랫폼 수수료 + 광고비 + 기타 비용) = 최종 지급액 공식을 매 정산 주기(예: 매월 1일~말일)마다 자동으로 계산하여 레코드를 생성해야 합니다.

공제 항목 관리:

판매자가 광고를 집행하거나 추가 비용이 발생할 때마다, 즉시 차감하는 것이 아니라 '정산 대상 비용'으로 분류하여 대기 상태(pending_deduction)로 쌓아두어야 합니다.

최종 확인 UI:

정산 주기 종료 후 판매자가 판매자 센터에서 "이번 달 정산 상세 내역(차감 내역 포함)"을 보고 "확인 완료(Confirm)" 버튼을 누르면 그때 지급 처리가 시작되는 구조가 필요합니다.

🛠️ Cursor용 보충 프롬프트 (자동 차감 정산 및 통합 관리)
이미 진행 중인 판매자 센터에 이 기능을 녹여내기 위해 아래 내용을 추가하세요.

"와딜 판매자 센터에 '정산금 자동 차감 시스템'을 포함한 재무 통합 기능을 구현해 줘.

정산 로직 고도화 (/seller/finance/settlements): >    - 정산 시 '판매 총액'에서 '플랫폼 수수료'와 '집행된 광고비/기타비용'을 자동으로 차감하여 '최종 입금 예정액'을 계산하는 로직을 서버 단에 추가해 줘.

판매자가 자신의 정산 내역 페이지에서 [매출 항목], [수수료 항목], [광고비 차감 항목]이 상세히 나열된 리스트를 볼 수 있게 해줘.

비용 관리 및 결제 대기 (/seller/finance/billing): >    - 광고비 등 판매자가 플랫폼에 지불해야 할 금액을 '즉시 결제'하거나, '다음 정산 시 차감'하도록 선택할 수 있는 옵션 구조를 만들어 줘. (차감 선택 시 해당 금액을 pending_deduction으로 flag 변경)

입금 계좌 연결 및 관리 (/seller/settings/account):

정산금을 받을 계좌 정보를 등록하고, 계좌번호 인증(형식 검증) 기능을 추가해 줘.

관리자가 입금 완료 처리를 하면, 판매자 화면에 '입금 완료' 뱃지와 함께 입금 영수증을 다운로드할 수 있는 뼈대를 마련해 줘.

관리자 정산 승인 (/admin/settlements): >    - 관리자가 판매자별 정산 내역을 한눈에 보고, '정산 확정' 버튼을 누르면 자동으로 정산 상태가 paid로 변경되며 판매자에게 알림이 가도록 연동해 줘.

기존 데이터 구조와 RLS를 해치지 않으면서 이 재무 흐름이 자연스럽게 연결되게 구현하고, npm run build가 통과하는지 확인해 줘."

---

## W164 (L1195, seller, unknown)

CURSOR: 택배사 상수 파일 생성

파일 생성:

lib/shipping/couriers.ts
export const COURIERS = [
  {
    code: "cj",
    name: "CJ대한통운",
  },
  {
    code: "lotte",
    name: "롯데택배",
  },
  {
    code: "hanjin",
    name: "한진택배",
  },
  {
    code: "logen",
    name: "로젠택배",
  },
  {
    code: "epost",
    name: "우체국택배",
  },
];
88단계 — CURSOR: 판매자 송장 등록 액션 생성

파일 생성:

app/actions/registerTrackingNumber.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { requireSeller } from "@/lib/auth/requireSeller";
import { revalidatePath } from "next/cache";
import { COURIERS } from "@/lib/shipping/couriers";

export async function registerTrackingNumber(
  orderId: string,
  formData: FormData
) {
  const seller = await requireSeller();

  const supabase = await createClient();

  const courierCode = String(formData.get("courierCode") || "");
  const trackingNumber = String(formData.get("trackingNumber") || "");

  if (!courierCode || !trackingNumber) {
    throw new Error("택배사와 송장번호를 입력해주세요.");
  }

  const courier = COURIERS.find(
    (item) => item.code === courierCode
  );

  if (!courier) {
    throw new Error("지원하지 않는 택배사입니다.");
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("seller_id", seller.id)
    .single();

  if (orderError || !order) {
    throw new Error("주문 정보를 찾을 수 없습니다.");
  }

  const { error } = await supabase
    .from("orders")
    .update({
      courier_code: courier.code,
      courier_name: courier.name,
      tracking_number: trackingNumber,
      order_status: "shipping",
      shipped_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    throw new Error("송장 등록 실패");
  }

  await supabase.from("order_timelines").insert({
    order_id: orderId,
    status: "shipping",
    title: "배송 시작",
    description: `${courier.name} / ${trackingNumber}`,
  });

  await supabase.from("notifications").insert({
    user_id: order.user_id,
    type: "shipping_started",
    title: "상품 배송 시작",
    message: `${courier.name} 송장이 등록되었습니다.`,
    link_url: `/orders/${orderId}`,
  });

  revalidatePath(`/seller/orders/${orderId}`);
  revalidatePath(`/orders/${orderId}`);

  return { success: true };
}
89단계 — CURSOR: 판매자 주문상세 송장 등록 UI

파일:

app/seller/orders/[id]/page.tsx

상단 import 추가:

import { registerTrackingNumber } from "@/app/actions/registerTrackingNumber";
import { COURIERS } from "@/lib/shipping/couriers";

그리고 배송 전 상태에서 추가:

{order.order_status === "paid" && (
  <form
    action={registerTrackingNumber.bind(null, order.id)}
    className="border rounded-xl p-4 mt-6 space-y-3"
  >
    <h3 className="font-semibold">
      송장 등록
    </h3>

    <select
      name="courierCode"
      className="border rounded-lg px-3 py-2 w-full"
    >
      <option value="">
        택배사 선택
      </option>

      {COURIERS.map((courier) => (
        <option
          key={courier.code}
          value={courier.code}
        >
          {courier.name}
        </option>
      ))}
    </select>

    <input
      name="trackingNumber"
      placeholder="송장번호 입력"
      className="border rounded-lg px-3 py-2 w-full"
    />

    <button
      className="bg-black text-white px-4 py-2 rounded-lg"
    >
      배송 시작
    </button>
  </form>
)}
90단계 — CURSOR: 고객 주문상세 배송정보 UI

파일:

app/orders/[id]/page.tsx

배송 정보 영역 추가.

{order.courier_name && order.tracking_number && (
  <div className="border rounded-xl p-4 mt-6">
    <h3 className="font-semibold mb-3">
      배송 정보
    </h3>

    <div className="space-y-2 text-sm">
      <div>
        택배사: {order.courier_name}
      </div>

      <div>
        송장번호: {order.tracking_number}
      </div>

      {order.shipped_at && (
        <div>
          발송일:
          {" "}
          {new Date(order.shipped_at).toLocaleString("ko-KR")}
        </div>
      )}
    </div>
  </div>
)}
91단계 — CURSOR: 배송추적 API 뼈대 생성

파일 생성:

app/api/tracking/update/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("order_status", "shipping")
    .not("tracking_number", "is", null);

  for (const order of orders || []) {
    /*
      여기에:
      스마트택배 API
      SweetTracker API
      17TRACK API
      붙이면 된다.
    */

    await supabase
      .from("orders")
      .update({
        tracking_last_checked_at:
          new Date().toISOString(),
      })
      .eq("id", order.id);
  }

  return NextResponse.json({
    success: true,
  });
}

---

## W165 (L1207, build_error, unknown)

디자인은 건드리지 말고, 판매자센터 리뷰 답글/평점 관리 화면을 상용화 기준으로 구현해줘.

와딜은 고객, 판매자, 관리자 3가지 권한이 있는 일반상품 + 공동구매 커머스 플랫폼이다.
판매자는 본인 상품의 리뷰를 확인하고 답글을 작성할 수 있지만, 리뷰 삭제/숨김/제재는 관리자만 가능해야 한다.

이번 작업 목표:
판매자가 본인 상품 리뷰를 확인하고 답글을 작성할 수 있는 리뷰 관리 기능을 만든다.

요구사항:
1. /seller/reviews 페이지 생성
   - 본인 상품 리뷰만 목록 표시

2. 리뷰 목록 항목
   - 상품명
   - 별점
   - 리뷰 내용 일부
   - 작성자 일부 마스킹
   - 구매확정 리뷰 여부
   - 작성일
   - 답글 여부

3. 필터
   - 전체
   - 별점 5점
   - 별점 4점
   - 별점 3점 이하
   - 답글 미작성
   - 답글 작성완료
   - 신고된 리뷰

4. /seller/reviews/[id] 상세 페이지
   - 리뷰 상세
   - 리뷰 이미지
   - 주문/상품 기본 정보
   - 기존 판매자 답글
   - 답글 작성/수정

5. seller_review_replies 테이블 사용
   - id
   - seller_id
   - review_id
   - reply_content
   - status
   - created_at
   - updated_at

6. 답글 상태
   - visible
   - hidden
   - deleted

7. 판매자 가능 권한
   - 본인 상품 리뷰 조회
   - 답글 작성
   - 답글 수정
   - 본인 답글 삭제 요청 또는 숨김 처리

8. 판매자 불가 권한
   - 리뷰 삭제
   - 리뷰 숨김
   - 리뷰 평점 수정
   - 다른 판매자 상품 리뷰 조회
   - 신고 처리 최종 결정

9. 관리자 리뷰 관리와 연결
   - /admin/reviews 에서 판매자 답글 확인 가능
   - 부적절한 판매자 답글 숨김 처리 가능
   - 신고된 리뷰는 관리자만 최종 처리

10. 리뷰 통계
   - 평균 별점
   - 리뷰 수
   - 답글 미작성 수
   - 낮은 평점 리뷰 수

11. 알림
   - 판매자가 답글 작성 시 구매자에게 알림
   - 낮은 평점 리뷰 발생 시 판매자에게 알림 가능 구조

12. RLS
   - 판매자는 본인 seller_id 상품 리뷰만 조회
   - 판매자는 본인 seller_id로만 답글 작성
   - 사용자는 visible 리뷰/답글 조회 가능
   - 관리자는 전체 조회/관리 가능

13. 활동 로그
   - seller_review_reply_create
   - seller_review_reply_update
   - admin_review_reply_hide

14. 에러 처리
   - 권한 없음
   - 이미 삭제/숨김된 리뷰
   - 빈 답글
   - 본인 상품 리뷰가 아님

15. 기존 디자인/레이아웃 최대한 유지

16. Supabase migration SQL 보강

17. npm run build 통과

---

## W166 (L1208, build_error, unknown)

디자인은 건드리지 말고, 판매자센터 리뷰 답글/평점 관리 화면을 상용화 기준으로 구현해줘.

와딜은 고객, 판매자, 관리자 3가지 권한이 있는 일반상품 + 공동구매 커머스 플랫폼이다.
판매자는 본인 상품의 리뷰를 확인하고 답글을 작성할 수 있지만, 리뷰 삭제/숨김/제재는 관리자만 가능해야 한다.

이번 작업 목표:
판매자가 본인 상품 리뷰를 확인하고 답글을 작성할 수 있는 리뷰 관리 기능을 만든다.

요구사항:
1. /seller/reviews 페이지 생성
   - 본인 상품 리뷰만 목록 표시

2. 리뷰 목록 항목
   - 상품명
   - 별점
   - 리뷰 내용 일부
   - 작성자 일부 마스킹
   - 구매확정 리뷰 여부
   - 작성일
   - 답글 여부

3. 필터
   - 전체
   - 별점 5점
   - 별점 4점
   - 별점 3점 이하
   - 답글 미작성
   - 답글 작성완료
   - 신고된 리뷰

4. /seller/reviews/[id] 상세 페이지
   - 리뷰 상세
   - 리뷰 이미지
   - 주문/상품 기본 정보
   - 기존 판매자 답글
   - 답글 작성/수정

5. seller_review_replies 테이블 사용
   - id
   - seller_id
   - review_id
   - reply_content
   - status
   - created_at
   - updated_at

6. 답글 상태
   - visible
   - hidden
   - deleted

7. 판매자 가능 권한
   - 본인 상품 리뷰 조회
   - 답글 작성
   - 답글 수정
   - 본인 답글 삭제 요청 또는 숨김 처리

8. 판매자 불가 권한
   - 리뷰 삭제
   - 리뷰 숨김
   - 리뷰 평점 수정
   - 다른 판매자 상품 리뷰 조회
   - 신고 처리 최종 결정

9. 관리자 리뷰 관리와 연결
   - /admin/reviews 에서 판매자 답글 확인 가능
   - 부적절한 판매자 답글 숨김 처리 가능
   - 신고된 리뷰는 관리자만 최종 처리

10. 리뷰 통계
   - 평균 별점
   - 리뷰 수
   - 답글 미작성 수
   - 낮은 평점 리뷰 수

11. 알림
   - 판매자가 답글 작성 시 구매자에게 알림
   - 낮은 평점 리뷰 발생 시 판매자에게 알림 가능 구조

12. RLS
   - 판매자는 본인 seller_id 상품 리뷰만 조회
   - 판매자는 본인 seller_id로만 답글 작성
   - 사용자는 visible 리뷰/답글 조회 가능
   - 관리자는 전체 조회/관리 가능

13. 활동 로그
   - seller_review_reply_create
   - seller_review_reply_update
   - admin_review_reply_hide

14. 에러 처리
   - 권한 없음
   - 이미 삭제/숨김된 리뷰
   - 빈 답글
   - 본인 상품 리뷰가 아님

15. 기존 디자인/레이아웃 최대한 유지

16. Supabase migration SQL 보강

17. npm run build 통과

---

## W167 (L1209, build_error, unknown)

디자인은 건드리지 말고, 판매자센터 공지/운영정책/자료실 기능을 상용화 기준으로 구현해줘.

와딜은 고객, 판매자, 관리자 3가지 권한이 있는 일반상품 + 공동구매 커머스 플랫폼이다.
판매자에게 운영정책, 정산 기준, 배송 기준, 상품 등록 가이드, 공지사항을 안내할 수 있어야 한다.

이번 작업 목표:
판매자센터 안에 공지사항, 운영정책, 자료실 구조를 만든다.

요구사항:
1. /seller/notices 페이지 생성
   - 판매자 공지사항 목록
   - 중요공지 표시
   - 검색
   - 카테고리 필터

2. /seller/notices/[id] 상세 페이지
   - 제목
   - 내용
   - 작성일
   - 중요공지 여부
   - 첨부파일 있으면 표시

3. /seller/policies 페이지 생성
   - 상품 등록 정책
   - 공동구매 운영 정책
   - 배송/송장 처리 기준
   - C/S 응대 기준
   - 환불/교환 처리 기준
   - 정산 기준
   - 금지 상품 기준

4. /seller/resources 페이지 생성
   - 상품 등록 가이드
   - 이미지 가이드
   - 정산 안내서
   - 배송 처리 가이드
   - FAQ
   - 다운로드 자료

5. seller_notices 테이블 생성
   - id
   - title
   - content
   - category
   - is_important
   - attachment_urls
   - status
   - created_by
   - created_at
   - updated_at

6. notice category
   - general
   - settlement
   - shipping
   - product
   - policy
   - system

7. notice status
   - draft
   - published
   - archived

8. 관리자 페이지 생성
   - /admin/seller-notices
   - 공지 작성
   - 수정
   - 임시저장
   - 게시
   - 보관

9. 판매자 대시보드에 최근 공지 표시
   - 중요공지 우선
   - 최근 5개

10. RLS
   - 승인된 판매자는 published 공지만 조회 가능
   - 관리자는 전체 작성/수정/삭제 가능
   - 일반 사용자는 접근 불가

11. 활동 로그
   - admin_seller_notice_create
   - admin_seller_notice_update
   - admin_seller_notice_publish
   - admin_seller_notice_archive

12. 문서 추가
   - docs/SELLER_OPERATIONS_POLICY.md
   - docs/SELLER_PRODUCT_GUIDE.md
   - docs/SELLER_SETTLEMENT_GUIDE.md

13. 기존 디자인/레이아웃 최대한 유지

14. Supabase migration SQL 생성

15. npm run build 통과

---

## W168 (L1210, build_error, unknown)

디자인은 건드리지 말고, 판매자 입점 신청 심사 체크리스트와 관리자 심사 화면을 상용화 기준으로 구현해줘.

와딜은 고객, 판매자, 관리자 3가지 권한이 있는 일반상품 + 공동구매 커머스 플랫폼이다.
판매자가 입점 신청을 하면 관리자가 사업자 정보, 정산 계좌, 판매 가능 품목, 운영 리스크를 확인하고 승인해야 한다.

이번 작업 목표:
판매자 입점 신청 → 관리자 심사 → 승인/반려/보류 흐름을 안정적으로 만든다.

요구사항:
1. sellers 테이블 보강
   - status: pending / approved / rejected / suspended / under_review
   - rejected_reason
   - reviewed_by
   - reviewed_at
   - approved_at
   - suspended_at
   - suspension_reason

2. 판매자 입점 신청 항목
   - 상호명
   - 사업자등록번호
   - 대표자명
   - 사업장 주소
   - 담당자명
   - 담당자 휴대폰
   - 담당자 이메일
   - 판매 예정 카테고리
   - 주요 상품 설명
   - 정산 은행
   - 정산 계좌번호
   - 예금주
   - 통신판매업 신고번호 optional
   - 사업자등록증 파일 optional
   - 통장 사본 파일 optional

3. seller_documents 테이블 생성
   - id
   - seller_id
   - document_type
   - file_url
   - status
   - uploaded_at
   - reviewed_at
   - reviewed_by

4. document_type
   - business_registration
   - bankbook_copy
   - mail_order_license
   - etc

5. 관리자 심사 페이지
   - /admin/sellers/[id]/review
   - 신청 정보 확인
   - 첨부 문서 확인
   - 심사 체크리스트
   - 승인
   - 반려
   - 보류
   - 정지

6. 심사 체크리스트
   - 사업자등록번호 입력 여부
   - 대표자명 입력 여부
   - 연락처 입력 여부
   - 정산 계좌 입력 여부
   - 판매 카테고리 확인
   - 금지 상품 여부 확인
   - 배송 가능 여부 확인
   - C/S 응대 가능 여부 확인
   - 정산 정보 확인
   - 정책 동의 여부 확인

7. seller_review_checks 테이블 생성
   - id
   - seller_id
   - check_key
   - checked
   - memo
   - checked_by
   - checked_at

8. 승인 시
   - sellers.status = approved
   - users.role = seller
   - approved_at 기록
   - 판매자에게 알림 생성

9. 반려 시
   - sellers.status = rejected
   - rejected_reason 저장
   - 판매자에게 알림 생성
   - 재신청 가능 구조

10. 보류 시
   - sellers.status = under_review
   - 보완 요청 메시지 저장
   - 판매자에게 알림 생성

11. 정지 시
   - sellers.status = suspended
   - suspension_reason 저장
   - 판매자센터 접근 제한
   - 기존 상품은 관리자 판단에 따라 유지/비노출 가능하게 구조 준비

12. 파일 업로드
   - Supabase Storage seller-documents 버킷 사용
   - pdf/jpg/jpeg/png 허용
   - 최대 10MB
   - 일반 사용자 접근 금지
   - 판매자는 본인 문서만 업로드/조회
   - 관리자는 전체 조회

13. RLS
   - 판매자는 본인 신청/문서만 조회·수정 가능
   - 관리자는 전체 심사 가능
   - 일반 사용자는 접근 불가

14. 활동 로그
   - seller_apply_submit
   - admin_seller_approve
   - admin_seller_reject
   - admin_seller_hold
   - admin_seller_suspend

15. 문서 추가
   - docs/SELLER_REVIEW_CHECKLIST.md
   - docs/PROHIBITED_PRODUCTS.md
   - docs/SELLER_ONBOARDING.md

16. 기존 디자인/레이아웃 최대한 유지

17. Supabase migration SQL 생성

18. npm run build 통과

---

## W169 (L1211, build_error, unknown)

다음은 **금지 상품 / 카테고리별 검수 기준**이야.
판매자 입점까지 붙이면 이건 꼭 필요해.

Cursor/Codex에 그대로 보내:

```txt
디자인은 건드리지 말고, 금지 상품/카테고리별 검수 기준을 상용화 기준으로 구현해줘.

와딜은 고객, 판매자, 관리자 3가지 권한이 있는 일반상품 + 공동구매 커머스 플랫폼이다.
판매자가 상품 등록 요청을 할 수 있으므로, 금지 상품과 카테고리별 검수 기준을 명확히 관리해야 한다.

이번 작업 목표:
관리자가 상품 검수 시 금지 상품 여부와 카테고리별 기준을 확인할 수 있는 구조를 만든다.

요구사항:
1. prohibited_products 문서 생성
   - docs/PROHIBITED_PRODUCTS.md
   - 판매 금지/제한 상품 기준 정리

2. 금지/제한 상품 예시
   - 의약품/전문의약품
   - 의료기기 중 허가 필요 상품
   - 건강기능식품 중 미신고/허위광고 상품
   - 주류
   - 담배/전자담배
   - 성인용품
   - 무기류/위험물
   - 위조상품/가품
   - 불법 복제품
   - 개인정보/계정 거래
   - 동물/생체 거래
   - 법령상 통신판매 제한 상품
   - 과장광고/허위효능 상품

3. category_review_rules 테이블 생성
   - id
   - category_id
   - rule_title
   - rule_description
   - required_documents
   - warning_keywords
   - is_active
   - created_at
   - updated_at

4. 카테고리별 검수 기준
   - 식품: 원산지, 유통기한, 보관방법, 표시사항
   - 뷰티: 화장품 표시, 기능성 문구 주의, 전성분
   - 생활용품: KC 인증 필요 여부
   - 디지털/가전: KC 인증, A/S 안내, 전파인증
   - 유아/아동: KC 인증, 안전기준
   - 반려동물: 사료/간식 표시사항
   - 패션잡화: 가품/상표권 주의
   - 지역특산물: 원산지/생산자 정보

5. product_review_checklists 테이블 생성
   - id
   - product_request_id
   - check_key
   - checked
   - memo
   - checked_by
   - checked_at

6. 관리자 상품 검수 화면에 체크리스트 추가
   - 금지 상품 여부 확인
   - 카테고리별 필수 확인사항
   - 필요한 인증/서류 확인
   - 과장광고 문구 확인
   - 가격/재고/배송 가능 여부 확인

7. 경고 키워드 기능
   - 판매자가 상품명/설명 입력 시 warning_keywords 포함 여부 감지
   - 관리자 검수 화면에 경고 표시
   - 예: 치료, 완치, 의약, 정품 보장, 100% 효과 등

8. 판매자 상품 등록 폼에도 안내 표시
   - 금지 상품 안내
   - 카테고리별 필수 정보 안내
   - 허위/과장 광고 금지 안내

9. 관리자 검수 승인 시
   - 필수 체크리스트 미완료면 승인 제한 또는 경고
   - 관리자 확인 후 강제 승인 가능 여부는 구조만 준비

10. RLS
   - category_review_rules는 관리자만 작성/수정
   - 판매자는 active rule 조회 가능
   - product_review_checklists는 관리자만 수정 가능

11. 문서 추가
   - docs/CATEGORY_REVIEW_RULES.md
   - docs/SELLER_PRODUCT_COMPLIANCE.md

12. 기존 디자인/레이아웃 최대한 유지

13. Supabase migration SQL 생성

14. npm run build 통과
```

다음은 **판매자센터 최종 연결: 고객/관리자/판매자 권한 메뉴 통합**으로 가면 돼.

---

## W170 (L1212, git_deploy, push_failed)

Execute the selected diff-tab commit-and-push action.

---

## W171 (L1219, build_error, unknown)

디자인은 건드리지 말고, 와딜의 고객/판매자/관리자 알림 구조를 상용화 기준으로 통합해줘.

와딜은 고객, 판매자, 관리자 3가지 권한이 있는 일반상품 + 공동구매 커머스 플랫폼이다.
알림은 고객의 주문/배송/공동구매 알림뿐 아니라 판매자의 상품검수/주문/문의/정산 알림, 관리자의 승인/에러/문의 알림까지 필요하다.

이번 작업 목표:
역할별 알림을 하나의 notifications 구조로 통합하되, 대상 권한과 링크를 명확히 분리한다.

요구사항:
1. notifications 테이블 보강
   - id
   - user_id nullable
   - seller_id nullable
   - target_role
   - type
   - title
   - message
   - link_url
   - read_at
   - created_at

2. target_role
   - user
   - seller
   - admin

3. 고객 알림 type
   - order_confirmed
   - payment_ready
   - payment_paid
   - payment_failed
   - shipping_started
   - shipping_delivered
   - review_available
   - refund_updated
   - deal_deadline_soon
   - price_tier_reached
   - next_tier_soon

4. 판매자 알림 type
   - seller_application_approved
   - seller_application_rejected
   - product_request_approved
   - product_request_rejected
   - product_changes_requested
   - new_order_received
   - shipping_required
   - new_product_question
   - new_review
   - settlement_confirmed
   - settlement_paid
   - seller_notice_published

5. 관리자 알림 type
   - new_seller_application
   - new_product_request
   - product_change_request
   - refund_request
   - escalated_support_ticket
   - payment_webhook_failed
   - critical_error
   - settlement_pending
   - prohibited_keyword_detected

6. 알림함 분리
   - 고객: /notifications
   - 판매자: /seller/notifications 또는 판매자센터 상단 알림
   - 관리자: /admin/notifications 또는 관리자 대시보드 알림

7. unread count 분리
   - 고객 알림 unread count
   - 판매자 알림 unread count
   - 관리자 알림 unread count

8. 알림 생성 유틸 함수
   - createUserNotification(userId, type, title, message, linkUrl)
   - createSellerNotification(sellerId, type, title, message, linkUrl)
   - createAdminNotification(type, title, message, linkUrl)
   - markNotificationAsRead(notificationId)
   - getUnreadCountByRole(userId, role)

9. 판매자 알림 연결
   - 입점 승인/반려
   - 상품 요청 승인/반려
   - 새 주문
   - 송장 입력 필요
   - 새 문의
   - 새 리뷰
   - 정산 확정/지급완료
   - 판매자 공지

10. 관리자 알림 연결
   - 신규 입점 신청
   - 신규 상품 검수 요청
   - 수정 요청
   - 환불 요청
   - 관리자 확인 요청 문의
   - 결제 webhook 실패
   - critical error

11. 고객 알림 연결
   - 주문상태
   - 결제상태
   - 배송상태
   - 공동구매 가격단계 달성
   - 리뷰 작성 가능
   - 문의 답변

12. 권한
   - 고객은 본인 user_id 알림만 조회
   - 판매자는 본인 seller_id 알림만 조회
   - 관리자는 admin target_role 알림과 전체 알림 조회 가능
   - 일반 사용자가 seller/admin 알림 조회 불가

13. RLS
   - notifications role/user/seller 기준 정책 보강
   - 알림 생성은 서버 액션/API에서만
   - read_at 업데이트는 본인 알림만 가능

14. UI
   - 기존 디자인 유지
   - 알림 유형별 아이콘/뱃지는 기존 톤에 맞게
   - 빈 알림 UI
   - 읽음/안읽음 필터
   - 클릭 시 link_url 이동

15. Supabase migration SQL 생성

16. npm run build 통과

---

## W172 (L1223, build_error, unknown)

디자인은 건드리지 말고, 와딜의 고객/판매자/관리자 알림 구조를 상용화 기준으로 통합해줘.

와딜은 고객, 판매자, 관리자 3가지 권한이 있는 일반상품 + 공동구매 커머스 플랫폼이다.
알림은 고객의 주문/배송/공동구매 알림뿐 아니라 판매자의 상품검수/주문/문의/정산 알림, 관리자의 승인/에러/문의 알림까지 필요하다.

이번 작업 목표:
역할별 알림을 하나의 notifications 구조로 통합하되, 대상 권한과 링크를 명확히 분리한다.

요구사항:
1. notifications 테이블 보강
   - id
   - user_id nullable
   - seller_id nullable
   - target_role
   - type
   - title
   - message
   - link_url
   - read_at
   - created_at

2. target_role
   - user
   - seller
   - admin

3. 고객 알림 type
   - order_confirmed
   - payment_ready
   - payment_paid
   - payment_failed
   - shipping_started
   - shipping_delivered
   - review_available
   - refund_updated
   - deal_deadline_soon
   - price_tier_reached
   - next_tier_soon

4. 판매자 알림 type
   - seller_application_approved
   - seller_application_rejected
   - product_request_approved
   - product_request_rejected
   - product_changes_requested
   - new_order_received
   - shipping_required
   - new_product_question
   - new_review
   - settlement_confirmed
   - settlement_paid
   - seller_notice_published

5. 관리자 알림 type
   - new_seller_application
   - new_product_request
   - product_change_request
   - refund_request
   - escalated_support_ticket
   - payment_webhook_failed
   - critical_error
   - settlement_pending
   - prohibited_keyword_detected

6. 알림함 분리
   - 고객: /notifications
   - 판매자: /seller/notifications 또는 판매자센터 상단 알림
   - 관리자: /admin/notifications 또는 관리자 대시보드 알림

7. unread count 분리
   - 고객 알림 unread count
   - 판매자 알림 unread count
   - 관리자 알림 unread count

8. 알림 생성 유틸 함수
   - createUserNotification(userId, type, title, message, linkUrl)
   - createSellerNotification(sellerId, type, title, message, linkUrl)
   - createAdminNotification(type, title, message, linkUrl)
   - markNotificationAsRead(notificationId)
   - getUnreadCountByRole(userId, role)

9. 판매자 알림 연결
   - 입점 승인/반려
   - 상품 요청 승인/반려
   - 새 주문
   - 송장 입력 필요
   - 새 문의
   - 새 리뷰
   - 정산 확정/지급완료
   - 판매자 공지

10. 관리자 알림 연결
   - 신규 입점 신청
   - 신규 상품 검수 요청
   - 수정 요청
   - 환불 요청
   - 관리자 확인 요청 문의
   - 결제 webhook 실패
   - critical error

11. 고객 알림 연결
   - 주문상태
   - 결제상태
   - 배송상태
   - 공동구매 가격단계 달성
   - 리뷰 작성 가능
   - 문의 답변

12. 권한
   - 고객은 본인 user_id 알림만 조회
   - 판매자는 본인 seller_id 알림만 조회
   - 관리자는 admin target_role 알림과 전체 알림 조회 가능
   - 일반 사용자가 seller/admin 알림 조회 불가

13. RLS
   - notifications role/user/seller 기준 정책 보강
   - 알림 생성은 서버 액션/API에서만
   - read_at 업데이트는 본인 알림만 가능

14. UI
   - 기존 디자인 유지
   - 알림 유형별 아이콘/뱃지는 기존 톤에 맞게
   - 빈 알림 UI
   - 읽음/안읽음 필터
   - 클릭 시 link_url 이동

15. Supabase migration SQL 생성

16. npm run build 통과

---

## W173 (L1281, git_deploy, push_failed)

Execute the selected diff-tab commit-and-push action.

---

## W174 (L1282, git_deploy, build_error_reported)

파일 열기:

app/actions/admin-seller-settlements.ts

여기 부분 찾기:

import {
  notifySellerSettlementConfirmed,
  notifySellerSettlementPaid,
} from "@/lib/notifications/seller-events";

그리고 아래쪽에도 아마 또 있을 거야:

import { notifySellerSettlementPaid } ...

또는:

const notifySellerSettlementPaid = ...
핵심

같은 이름:

notifySellerSettlementPaid

가 2번 존재하면 안 됨.

빠른 수정법

Cursor에서:

notifySellerSettlementPaid

전체 검색 (Cmd + Shift + F)

해서:

중복 import
중복 함수 선언

하나 삭제.

수정 후 다시 실행
npm run build

성공하면 그 다음:

npx vercel --prod
참고

이 에러는:

TypeScript 중복 선언 에러

---

## W175 (L1283, git_deploy, push_failed)

Execute the selected diff-tab push action.

---
