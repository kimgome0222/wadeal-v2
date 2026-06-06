# Work Queue Prompts Part 05

## W101 (L720, general, unknown)

다음할수잇는거 해줘

---

## W102 (L754, general, unknown)

둘다 차례대로

---

## W103 (L767, production, unknown)

계속 추가할거 추가하고 수정할거 수정해줘. 상용화 버전으로 만들거야

---

## W104 (L823, general, unknown)

일단 되는거 부터 쭉하자

---

## W105 (L826, general, unknown)

일단 되는거 부터 쭉하자

---

## W106 (L840, reviews, unknown)

상품 상세페이지를 상업용 공동구매 플랫폼 수준으로 개선해줘.

요구사항:
1. 상품 이미지/상세컷 영역을 보기 좋게 구성
2. 상품명, 가격, 할인율, 공동구매 목표수량, 현재 참여수량 표시
3. 진행률 바 표시
4. 마감시간/오늘 마감 뱃지 표시
5. 배송 안내, 교환/환불 안내 섹션 추가
6. 리뷰는 페이지 하단에 배치
7. 구매/참여 버튼은 모바일에서 하단 고정 CTA로 표시
8. Tailwind 기준으로 깔끔하고 고급스럽게 디자인
9. 기존 Supabase 데이터 구조와 라우팅은 최대한 유지
10. 빌드 에러 없이 수정

---

## W107 (L843, build_error, unknown)

관리자 페이지에 상품 등록/수정 기능을 만들어줘.

요구사항:
1. /admin/products 페이지 생성
2. 상품 목록 표시
3. 상품 등록 버튼
4. 상품 등록/수정 폼 구성
   - 상품명
   - 슬러그
   - 가격
   - 원가
   - 할인율
   - 대표 이미지 URL
   - 상세 이미지 URL 목록
   - 목표 수량
   - 현재 참여 수량
   - 마감일
   - 상태: draft / active / ended
5. Supabase products 또는 deals 테이블 구조에 맞춰 저장
6. 관리자 권한 users.role = 'admin' 인 경우만 접근 가능
7. 저장 성공/실패 메시지 표시
8. 모바일에서도 보기 좋게 Tailwind UI 적용
9. 기존 코드 구조 최대한 유지
10. npm run build 통과하게 수정

---

## W108 (L846, build_error, unknown)

관리자 주문 관리 페이지를 만들어줘.

요구사항:
1. /admin/orders 페이지 생성
2. 전체 주문 목록 표시
3. 주문 목록 항목:
   - 주문번호
   - 상품명
   - 구매자
   - 수량
   - 결제금액
   - 주문상태
   - 결제상태
   - 배송상태
   - 주문일
4. 상태 필터 추가
   - 전체
   - 참여완료
   - 결제대기
   - 결제완료
   - 배송준비
   - 배송중
   - 배송완료
   - 취소/환불
5. 주문 상세 모달 또는 상세 페이지 추가
6. 관리자가 수정 가능한 항목:
   - 주문상태
   - 결제상태
   - 배송상태
   - 택배사
   - 송장번호
   - 관리자 메모
7. Supabase orders 테이블 기준으로 저장/수정
8. users.role = 'admin' 인 계정만 접근 가능
9. 저장 성공/실패 메시지 표시
10. 모바일에서도 관리하기 쉽게 Tailwind UI 적용
11. 기존 코드 구조 유지
12. npm run build 통과

---

## W109 (L849, build_error, unknown)

관리자 상품 이미지 업로드 기능을 만들어줘.

요구사항:
1. Supabase Storage를 사용해서 상품 이미지를 업로드
2. 버킷 이름은 product-images 로 사용
3. /admin/products 등록/수정 폼에 이미지 업로드 UI 추가
4. 대표 이미지 1장 업로드 가능
5. 상세 이미지 여러 장 업로드 가능
6. 업로드 후 public URL을 상품 데이터에 저장
7. 이미지 미리보기 표시
8. 상세 이미지는 순서 변경/삭제 가능
9. 업로드 중 로딩 상태 표시
10. 업로드 실패 시 에러 메시지 표시
11. 허용 파일:
   - jpg
   - jpeg
   - png
   - webp
12. 최대 파일 크기 5MB 제한
13. 모바일에서도 사용하기 쉽게 Tailwind UI 적용
14. 기존 products/deals 구조 최대한 유지
15. npm run build 통과

---

## W110 (L852, admin, unknown)

Supabase Storage에 product-images 버킷을 만들고, 관리자만 업로드/수정/삭제 가능하고 모든 사용자는 이미지를 볼 수 있도록 RLS 정책도 추가해줘.

---

## W111 (L860, build_error, unknown)

와딜은 쿠팡/위메프 같은 커머스 앱 형태의 공동구매 플랫폼이다.
단순 랜딩페이지가 아니라 실제 쇼핑몰 앱처럼 만들어야 한다.

핵심 구조:
여러 명이 같이 구매해서 누적 구매 수량이 특정 구간을 넘으면 가격이 더 싸지는 공동구매 방식이다.

예시:
- 기본가: 29,900원
- 10개 이상 달성 시: 24,900원
- 30개 이상 달성 시: 21,900원
- 50개 이상 달성 시: 18,900원

수정 요구사항:
1. 홈 화면을 쇼핑몰 앱 메인처럼 구성
   - 검색창
   - 카테고리
   - 오늘의 공동구매
   - 마감임박
   - 인기상품
   - 신규상품

2. 상품 카드에 가격 단계 표시
   - 현재 구매 수량
   - 다음 할인 단계까지 남은 수량
   - 현재 적용 예상가
   - 최종 달성 가능 최저가

3. 상품 상세페이지에 공동구매 가격표 추가
   - 1개 이상 가격
   - 10개 이상 가격
   - 30개 이상 가격
   - 50개 이상 가격
   - 현재 달성 단계 강조
   - 다음 단계까지 몇 개 남았는지 표시

4. 주문/참여 방식
   - 사용자가 먼저 공동구매에 참여
   - 마감 시점에 최종 누적 수량 기준으로 최종 가격 확정
   - 많이 모일수록 더 싸짐
   - 결제 예정 금액과 최종 확정 금액을 구분해서 표시

5. DB 구조도 필요하면 수정
   - deals/products에 price_tiers JSON 컬럼 추가
   - price_tiers 예시:
     [
       { "minQty": 1, "price": 29900 },
       { "minQty": 10, "price": 24900 },
       { "minQty": 30, "price": 21900 },
       { "minQty": 50, "price": 18900 }
     ]

6. 현재 수량 기준으로 적용 가격을 계산하는 유틸 함수 생성
7. 다음 할인 단계까지 남은 수량 계산 함수 생성
8. 홈, 상품 상세, checkout 화면에 이 가격 단계 로직 반영
9. UI는 쿠팡/위메프처럼 실제 쇼핑 앱 느낌으로 구성
10. npm run build 통과

---

## W112 (L863, build_error, unknown)

와딜은 실제 상용화할 공동구매 커머스 플랫폼이다.
쿠팡/위메프 같은 쇼핑몰 앱 구조에, 여러 명이 같이 살수록 가격이 내려가는 수량 구간별 공동구매 로직을 핵심으로 구현해야 한다.

이번 작업 목표:
공동구매 가격 단계제를 실제 서비스 로직으로 반영한다.

요구사항:
1. products 또는 deals 테이블에 price_tiers 컬럼을 추가한다.
   - 타입은 jsonb 권장
   - 예시:
     [
       { "minQty": 1, "price": 29900 },
       { "minQty": 10, "price": 24900 },
       { "minQty": 30, "price": 21900 },
       { "minQty": 50, "price": 18900 }
     ]

2. 현재 누적 참여 수량 기준으로 현재 적용 예상가를 계산하는 함수 생성
   - getCurrentTierPrice(priceTiers, currentQty)

3. 다음 할인 단계까지 남은 수량을 계산하는 함수 생성
   - getNextTierInfo(priceTiers, currentQty)

4. 최저 달성 가능 가격을 계산하는 함수 생성
   - getLowestTierPrice(priceTiers)

5. 상품 카드 UI에 표시
   - 현재 공동구매가
   - 최저 달성 가능가
   - 다음 할인까지 남은 수량
   - 현재 참여 수량
   - 진행률 바

6. 상품 상세페이지에 가격 단계표 표시
   - 1개 이상
   - 10개 이상
   - 30개 이상
   - 50개 이상
   - 현재 달성 단계 강조
   - 다음 단계까지 몇 개 남았는지 표시

7. checkout 화면에 표시
   - 현재 예상 결제금액
   - 마감 후 최종 수량에 따라 확정 가격이 달라질 수 있다는 안내
   - 최종 확정 가격 기준으로 결제/정산될 구조를 고려

8. 주문 데이터에는 아래 값을 저장
   - joined_price: 참여 시점 예상가
   - final_price: 마감 후 확정가, 처음에는 null 가능
   - quantity
   - deal_id/product_id
   - user_id
   - status

9. 관리자 상품 등록/수정 화면에도 price_tiers 입력 UI 추가
   - 단계 추가
   - 단계 삭제
   - minQty, price 입력
   - 저장 시 jsonb로 저장

10. Supabase migration SQL 파일도 생성
11. 기존 데이터가 깨지지 않도록 기본 price_tiers 값을 넣어준다
12. npm run build 통과

---

## W113 (L910, admin, unknown)

이제부터 진짜 중요한 건 “예쁘게 만들기”보다:

구조
확장성
결제 흐름
주문 상태
정산 구조
운영 편의성
트래픽 대응
모바일 UX
DB 설계

이걸 실제 서비스 기준으로 잡는 거야.

와딜은 사실상 구조가:

Coupang + 공동구매
Wemakeprice + 가격 단계제

Temu 스타일 바이럴

이 섞인 구조라서 꽤 사업성이 있어.

앞으로 우선순위는 이렇게 간다:

공동구매 가격엔진 완성
주문/결제 구조 안정화
관리자 운영툴
모바일 UX
알림/공유 바이럴
실제 PG 결제
트래픽/보안
앱화(PWA → React Native 가능)

그리고 지금부터는 “프로토타입 감성” 버리고:

mock 제거
서버 검증
RLS
실데이터
에러 처리
상태관리
optimistic UI
SEO
성능

이걸 기준으로 가야 돼.

다음 단계 끝나면,
그다음은:

공동구매 참여 인원 실시간 반영
마감 카운트다운
인기 급상승 로직
친구 초대 공유
공동구매 달성 애니메이션
구매 확정/자동환불 흐름

이런 실제 커머스 기능으로 들어가면 돼.

---

## W114 (L913, build_error, unknown)

이번 작업 목표:
공동구매 가격 단계 로직을 실제 서비스 핵심 기능으로 반영한다.

중요:
- 기존 디자인/레이아웃 최대한 유지
- 불필요한 랜딩페이지/비주얼 변경 금지
- 기능, 데이터 구조, 주문 로직 중심으로 수정
- 기존 컴포넌트 스타일은 유지

요구사항:
1. price_tiers 기반 수량별 가격 단계제 구현
2. 현재 참여 수량 기준 현재 공동구매가 계산
3. 다음 할인 단계까지 남은 수량 계산
4. 최저 달성 가능 가격 표시
5. 상품 상세에 가격 단계표 추가
6. checkout에 현재 예상가/최종 확정가 안내 추가
7. orders에 joined_price, final_price 컬럼 반영
8. 관리자 상품 등록/수정에 가격 단계 입력 기능 추가
9. Supabase migration SQL 생성
10. 기존 mock/demo 구조가 있다면 실서비스 기준으로 정리
11. npm run build 통과

---

## W115 (L920, build_error, unknown)

와딜은 수량 구간별 공동구매 플랫폼이다.
사용자는 먼저 공동구매에 참여하고, 마감 시 최종 누적 수량에 따라 최종 가격이 확정된다.

이번 작업 목표:
주문 상태, 결제 상태, 배송 상태를 실제 운영 가능한 구조로 정리한다.

요구사항:
1. orders 테이블 상태값 정리
   - order_status:
     pending / joined / confirmed / cancelled / refunded
   - payment_status:
     pending / authorized / paid / failed / cancelled / refunded
   - shipping_status:
     none / preparing / shipped / delivered / returned

2. orders 테이블에 필요한 컬럼 추가
   - joined_price
   - final_price
   - quantity
   - order_status
   - payment_status
   - shipping_status
   - tracking_company
   - tracking_number
   - paid_at
   - cancelled_at
   - refunded_at

3. 공동구매 참여 시
   - joined_price 저장
   - final_price는 null
   - order_status = joined
   - payment_status = pending 또는 authorized
   - shipping_status = none

4. 공동구매 마감 후
   - 최종 누적 수량 기준 final_price 계산
   - 주문별 final_price 업데이트
   - order_status = confirmed

5. checkout 화면에는
   - 현재 예상가
   - 마감 후 최종가 확정 안내
   - 참여 수량
   - 예상 총액
   - 최종 확정 전까지 가격이 낮아질 수 있다는 안내 표시

6. 마이페이지 주문내역에는
   - 참여완료
   - 가격확정
   - 결제완료
   - 배송준비
   - 배송중
   - 배송완료
   - 취소/환불
   상태가 사용자 친화적으로 보이게 매핑

7. 관리자 주문 상세에서 상태 수정 가능
   - order_status
   - payment_status
   - shipping_status
   - 택배사
   - 송장번호
   - 관리자 메모

8. 상태값 매핑 유틸 함수 생성
   - getOrderStatusLabel
   - getPaymentStatusLabel
   - getShippingStatusLabel

9. Supabase migration SQL 생성

10. 기존 디자인/레이아웃은 최대한 유지

11. npm run build 통과

---

## W116 (L935, build_error, unknown)

디자인은 건드리지 말고, 공동구매 마감 처리 로직을 상용화 기준으로 구현해줘.

와딜은 여러 명이 같이 구매해서 누적 수량이 많아질수록 가격이 내려가는 공동구매 커머스 플랫폼이다.

이번 작업 목표:
공동구매가 마감되면 최종 누적 수량 기준으로 최종 가격을 확정하고, 참여 주문들에 final_price를 반영하는 로직을 만든다.

요구사항:
1. deal/product 마감 여부 판단
   - end_at 또는 deadline 기준
   - 현재 시간이 마감시간 이후면 마감 대상

2. 마감 처리 함수 생성
   - finalizeDeal(dealId)
   - 해당 deal의 현재 참여 수량 계산
   - price_tiers 기준 최종 단가 계산
   - 연결된 orders의 final_price 업데이트
   - order_status = confirmed 로 변경
   - deal/product status = ended 로 변경

3. final_price 계산 기준
   - final_unit_price = 최종 누적 수량에 해당하는 price_tiers 가격
   - order.final_price = final_unit_price * order.quantity

4. 이미 마감 처리된 deal은 중복 처리되지 않게 방어
   - status가 ended면 return
   - final_price가 이미 있는 주문은 덮어쓰기 주의

5. 관리자 페이지에 수동 마감 버튼 추가
   - /admin/products 또는 /admin/deals 상세/목록에서 “공동구매 마감 처리” 버튼
   - 클릭 시 finalizeDeal 실행
   - 성공/실패 메시지 표시

6. 자동 마감 대비 서버 함수 구조 준비
   - 나중에 cron 또는 Supabase Edge Function으로 호출 가능하게 작성
   - 지금은 관리자 수동 실행 가능하면 됨

7. 마감 후 사용자 화면 반영
   - 상품 상세: 마감됨 표시
   - checkout: 마감된 상품은 신규 참여 불가
   - 마이페이지 주문: 최종 확정가 표시

8. 에러 처리
   - 주문이 없는 경우
   - price_tiers가 없는 경우
   - DB 업데이트 실패
   - 이미 마감된 경우

9. Supabase RLS와 서버 액션 기준으로 안전하게 처리
   - 클라이언트에서 직접 final_price 조작 불가
   - 관리자 또는 서버 로직에서만 마감 가능

10. 기존 디자인/레이아웃은 최대한 유지

11. npm run build 통과

---

## W117 (L942, build_error, unknown)

디자인은 건드리지 말고, 공동구매 마감 처리 로직을 상용화 기준으로 구현해줘.

와딜은 여러 명이 같이 구매해서 누적 수량이 많아질수록 가격이 내려가는 공동구매 커머스 플랫폼이다.

이번 작업 목표:
공동구매가 마감되면 최종 누적 수량 기준으로 최종 가격을 확정하고, 참여 주문들에 final_price를 반영하는 로직을 만든다.

요구사항:
1. deal/product 마감 여부 판단
   - end_at 또는 deadline 기준
   - 현재 시간이 마감시간 이후면 마감 대상

2. 마감 처리 함수 생성
   - finalizeDeal(dealId)
   - 해당 deal의 현재 참여 수량 계산
   - price_tiers 기준 최종 단가 계산
   - 연결된 orders의 final_price 업데이트
   - order_status = confirmed 로 변경
   - deal/product status = ended 로 변경

3. final_price 계산 기준
   - final_unit_price = 최종 누적 수량에 해당하는 price_tiers 가격
   - order.final_price = final_unit_price * order.quantity

4. 이미 마감 처리된 deal은 중복 처리되지 않게 방어
   - status가 ended면 return
   - final_price가 이미 있는 주문은 덮어쓰기 주의

5. 관리자 페이지에 수동 마감 버튼 추가
   - /admin/products 또는 /admin/deals 상세/목록에서 “공동구매 마감 처리” 버튼
   - 클릭 시 finalizeDeal 실행
   - 성공/실패 메시지 표시

6. 자동 마감 대비 서버 함수 구조 준비
   - 나중에 cron 또는 Supabase Edge Function으로 호출 가능하게 작성
   - 지금은 관리자 수동 실행 가능하면 됨

7. 마감 후 사용자 화면 반영
   - 상품 상세: 마감됨 표시
   - checkout: 마감된 상품은 신규 참여 불가
   - 마이페이지 주문: 최종 확정가 표시

8. 에러 처리
   - 주문이 없는 경우
   - price_tiers가 없는 경우
   - DB 업데이트 실패
   - 이미 마감된 경우

9. Supabase RLS와 서버 액션 기준으로 안전하게 처리
   - 클라이언트에서 직접 final_price 조작 불가
   - 관리자 또는 서버 로직에서만 마감 가능

10. 기존 디자인/레이아웃은 최대한 유지

11. npm run build 통과

---

## W118 (L952, build_error, unknown)

디자인은 건드리지 말고, 실제 PG 결제 연동 전에 필요한 결제 준비 구조를 상용화 기준으로 정리해줘.

와딜은 공동구매 마감 후 최종 수량에 따라 최종 가격이 확정되는 커머스 플랫폼이다.

이번 작업 목표:
나중에 Toss Payments 같은 PG를 붙일 수 있도록 payment 구조를 안전하게 준비한다.

요구사항:
1. payments 테이블 생성 또는 정리
   - id
   - order_id
   - user_id
   - deal_id/product_id
   - payment_provider
   - payment_key
   - amount
   - requested_amount
   - confirmed_amount
   - status
   - method
   - approved_at
   - failed_at
   - cancelled_at
   - raw_response
   - created_at
   - updated_at

2. payment_status 값 정리
   - ready
   - authorized
   - paid
   - failed
   - cancelled
   - refunded

3. 공동구매 참여 시
   - 아직 실제 결제 전이면 payment record를 ready 상태로 생성
   - 주문에는 payment_status = pending 또는 ready 계열로 표시

4. 공동구매 마감 후
   - final_price 기준으로 결제 확정 가능하게 구조 준비
   - joined_price와 final_price 차이를 추적 가능하게 구성

5. checkout 화면에는
   - 현재 예상 결제금액
   - 마감 후 최종 확정금액 안내
   - 결제는 마감 후 확정가 기준으로 진행된다는 안내
   - 실제 PG 미연동 상태에서는 “참여하기” 중심으로 유지

6. 관리자 주문 상세에 결제 정보 영역 추가
   - 결제상태
   - 요청금액
   - 확정금액
   - 결제수단
   - PG사
   - 승인일
   - 실패/취소일

7. 서버 유틸 함수 생성
   - createPendingPayment(order)
   - updatePaymentStatus(paymentId, status)
   - syncOrderPaymentStatus(orderId)

8. 클라이언트에서 amount/payment_status를 직접 조작하지 못하게 서버 액션 기준으로 작성

9. Supabase migration SQL 생성

10. 기존 디자인/레이아웃은 최대한 유지

11. npm run build 통과

---

## W119 (L955, build_error, unknown)

디자인은 건드리지 말고, 배송/송장/구매확정 흐름을 상용화 기준으로 구현해줘.

와딜은 공동구매 마감 후 최종 가격이 확정되고, 결제 완료 후 배송이 진행되는 커머스 플랫폼이다.

이번 작업 목표:
주문 확정 이후 배송 상태 관리와 구매확정 흐름을 만든다.

요구사항:
1. orders 테이블 배송 관련 컬럼 정리
   - shipping_status
   - tracking_company
   - tracking_number
   - shipped_at
   - delivered_at
   - confirmed_at
   - admin_memo

2. 배송 상태값
   - none
   - preparing
   - shipped
   - delivered
   - confirmed
   - returned

3. 관리자 주문 상세에서 수정 가능
   - 배송상태
   - 택배사
   - 송장번호
   - 관리자 메모
   - 배송 시작일
   - 배송 완료일

4. 송장번호 입력 시
   - shipping_status = shipped 로 변경 가능
   - shipped_at 자동 기록

5. 배송완료 처리 시
   - shipping_status = delivered
   - delivered_at 자동 기록

6. 사용자 마이페이지 주문 상세에 표시
   - 배송상태
   - 택배사
   - 송장번호
   - 배송조회 버튼
   - 구매확정 버튼

7. 구매확정 버튼
   - 배송완료 상태에서만 노출
   - 클릭 시 shipping_status = confirmed
   - confirmed_at 기록
   - 이후 리뷰 작성 가능 상태로 연결

8. 리뷰 작성 가능 조건
   - 주문자가 해당 상품을 구매
   - shipping_status = confirmed
   - confirmed_at 기준 15일 이내

9. 상태 라벨 유틸 함수 생성
   - getShippingStatusLabel
   - canConfirmPurchase
   - canWriteReview

10. Supabase migration SQL 생성

11. RLS 기준
   - 사용자는 본인 주문만 조회/구매확정 가능
   - 관리자는 전체 주문 배송상태 수정 가능

12. 기존 디자인/레이아웃은 최대한 유지

13. npm run build 통과

---

## W120 (L958, build_error, unknown)

디자인은 건드리지 말고, 리뷰/별점 기능을 상용화 기준으로 정리해줘.

와딜은 실제 공동구매 커머스 플랫폼이므로 리뷰는 반드시 실제 구매자 기반으로 운영되어야 한다.

이번 작업 목표:
구매확정한 사용자만 리뷰를 작성할 수 있고, 리뷰 신뢰도를 높이는 구조를 구현한다.

요구사항:
1. reviews 테이블 구조 정리
   - id
   - user_id
   - order_id
   - product_id 또는 deal_id
   - rating
   - content
   - images
   - is_verified_purchase
   - status
   - created_at
   - updated_at

2. 리뷰 작성 조건
   - 로그인 사용자
   - 본인 주문
   - shipping_status = confirmed
   - confirmed_at 기준 15일 이내
   - 같은 order_id로 중복 리뷰 작성 불가

3. 리뷰 상태값
   - visible
   - hidden
   - reported
   - deleted

4. 상품 상세 하단 리뷰 영역
   - 평균 별점
   - 리뷰 개수
   - 별점 분포
   - 리뷰 목록
   - “구매확정 리뷰” 뱃지

5. 마이페이지 리뷰 관리
   - 작성 가능한 리뷰
   - 작성한 리뷰
   - 작성 기간 만료된 리뷰

6. 리뷰 작성 UI
   - 별점 1~5
   - 텍스트 후기
   - 이미지 업로드 가능
   - 작성 성공/실패 메시지

7. 리뷰 이미지
   - Supabase Storage review-images 버킷 사용
   - jpg/jpeg/png/webp 허용
   - 최대 5MB
   - 여러 장 가능

8. 관리자 리뷰 관리
   - 전체 리뷰 목록
   - 신고된 리뷰 필터
   - 숨김 처리
   - 삭제 처리
   - 상태 변경

9. 유틸 함수 생성
   - canWriteReview(order)
   - getReviewStatusLabel
   - getAverageRating
   - getRatingDistribution

10. RLS 기준
   - 사용자는 본인 리뷰 작성/수정 가능
   - visible 리뷰는 모두 조회 가능
   - 관리자는 전체 리뷰 관리 가능

11. Supabase migration SQL 생성

12. 기존 디자인/레이아웃은 최대한 유지

13. npm run build 통과

---

## W121 (L961, build_error, unknown)

디자인은 건드리지 말고, 찜/최근 본 상품/장바구니형 참여 흐름을 상용화 기준으로 구현해줘.

와딜은 쿠팡/위메프 같은 커머스 앱 구조에 수량 구간별 공동구매가 붙은 서비스다.

이번 작업 목표:
사용자가 상품을 탐색하고, 찜하고, 최근 본 상품을 다시 보고, 여러 상품을 참여 전 검토할 수 있는 구조를 만든다.

요구사항:
1. 찜 기능 정리
   - saved_deals 또는 wishlists 테이블 사용
   - 로그인 사용자는 DB에 저장
   - 비로그인 사용자는 로그인 유도
   - 중복 찜 방지
   - 찜 해제 가능

2. 최근 본 상품 기능 추가
   - recent_views 테이블 또는 localStorage 기반
   - 로그인 사용자는 DB 저장 가능
   - 비로그인 사용자는 localStorage 사용
   - 최근 본 상품 페이지 또는 마이페이지 섹션 추가

3. 장바구니형 참여 검토 기능 추가
   - cart 또는 join_cart 테이블 생성
   - 공동구매 참여 전 상품/수량을 담아둘 수 있게 함
   - 수량 변경 가능
   - 삭제 가능
   - 현재 예상 공동구매가 표시
   - 다음 할인 단계까지 남은 수량 표시

4. cart/join_cart 구조
   - id
   - user_id
   - product_id 또는 deal_id
   - quantity
   - estimated_unit_price
   - created_at
   - updated_at

5. 상품 상세에서
   - 바로 참여하기
   - 참여 검토함에 담기
   버튼 제공

6. 참여 검토함 페이지
   - /cart 또는 /join-cart
   - 담은 상품 목록
   - 수량 수정
   - 예상 금액
   - 공동구매 참여하기 버튼

7. checkout으로 넘어갈 때
   - 서버에서 가격 재계산
   - 클라이언트 가격 조작 방지

8. 마이페이지에 추가
   - 찜한 상품
   - 최근 본 상품
   - 참여 검토함

9. Supabase migration SQL 생성

10. RLS 기준
   - 사용자는 본인 찜/최근본/카트만 조회·수정 가능
   - 상품 데이터는 공개 조회 가능

11. 기존 디자인/레이아웃 최대한 유지

12. npm run build 통과

---

## W122 (L964, build_error, unknown)

디자인은 건드리지 말고, 검색/카테고리/필터 기능을 상용화 기준으로 구현해줘.

와딜은 쿠팡/위메프 같은 커머스 앱 구조에 수량 구간별 공동구매가 붙은 플랫폼이다.

이번 작업 목표:
사용자가 원하는 공동구매 상품을 쉽게 찾을 수 있도록 검색, 카테고리, 정렬, 필터 기능을 구현한다.

요구사항:
1. 검색 기능
   - 상품명 검색
   - 브랜드명 검색
   - 키워드 검색
   - 검색어 입력 후 /search?q=검색어 페이지로 이동
   - 검색 결과 없음 UI 표시

2. 카테고리 기능
   - categories 테이블 생성 또는 정리
   - 상품/deal에 category_id 연결
   - 홈/상품목록에서 카테고리별 조회 가능

3. 필터 기능
   - 가격대
   - 마감임박
   - 오늘 마감
   - 진행중
   - 마감됨
   - 할인율
   - 목표수량 달성률

4. 정렬 기능
   - 인기순
   - 마감임박순
   - 최신순
   - 낮은가격순
   - 높은할인율순
   - 참여수량순

5. 검색 결과 페이지
   - /search
   - 검색어 표시
   - 결과 개수 표시
   - 필터/정렬 UI
   - 상품 카드 목록

6. 카테고리 페이지
   - /category/[slug]
   - 카테고리명
   - 상품 목록
   - 필터/정렬 UI

7. 서버에서 검색/필터 처리
   - Supabase query 기준
   - 클라이언트 조작 최소화
   - pagination 또는 load more 구조 준비

8. 검색 로그 테이블 추가
   - search_logs
   - user_id nullable
   - query
   - result_count
   - created_at
   - 나중에 인기 검색어에 활용 가능

9. 인기 검색어 준비
   - 최근 검색어 기반으로 집계 가능한 구조
   - 지금은 기본 UI/함수만 만들어도 됨

10. Supabase migration SQL 생성

11. RLS 기준
   - 상품/카테고리는 공개 조회 가능
   - search_logs는 insert 가능, 관리자는 조회 가능

12. 기존 디자인/레이아웃 최대한 유지

13. npm run build 통과

---

## W123 (L967, build_error, unknown)

디자인은 건드리지 말고, 알림/마감임박/가격단계 달성 알림 기능을 상용화 기준으로 구현해줘.

와딜은 수량이 모일수록 가격이 내려가는 공동구매 커머스 플랫폼이다.

이번 작업 목표:
사용자에게 공동구매 진행 상황, 마감 임박, 가격 단계 달성, 주문 상태 변경을 알려주는 알림 구조를 만든다.

요구사항:
1. notifications 테이블 정리
   - id
   - user_id
   - type
   - title
   - message
   - link_url
   - read_at
   - created_at

2. 알림 type
   - deal_deadline_soon
   - price_tier_reached
   - next_tier_soon
   - order_confirmed
   - payment_ready
   - payment_paid
   - shipping_started
   - shipping_delivered
   - review_available
   - refund_updated

3. 알림함 페이지
   - /notifications
   - 읽지 않은 알림 표시
   - 전체/읽지 않음 필터
   - 클릭 시 관련 페이지 이동
   - 읽음 처리

4. 헤더 또는 마이페이지에 알림 뱃지 표시
   - unread count 표시
   - 로그인 사용자 기준

5. 가격 단계 알림
   - 공동구매 수량이 새로운 price_tier를 달성하면 참여자에게 알림 생성
   - 다음 가격 단계까지 얼마 안 남았을 때 알림 생성 가능한 구조 준비

6. 마감임박 알림
   - deadline 기준 24시간 전/3시간 전 알림 생성 가능한 함수 준비
   - 지금은 관리자 수동 실행 또는 서버 함수 형태로 작성

7. 주문 상태 알림
   - 주문 확정
   - 결제 준비
   - 배송 시작
   - 배송 완료
   - 리뷰 작성 가능
   상태 변경 시 알림 생성

8. 서버 유틸 함수 생성
   - createNotification(userId, type, title, message, linkUrl)
   - markNotificationAsRead(notificationId)
   - getUnreadNotificationCount(userId)
   - notifyDealParticipants(dealId, type, payload)

9. 나중에 카카오 알림톡/이메일/푸시로 확장 가능하게
   - channel 컬럼 또는 구조 준비
   - in_app 기본값

10. RLS 기준
   - 사용자는 본인 알림만 조회/읽음 처리 가능
   - 서버/관리자만 알림 생성 가능

11. Supabase migration SQL 생성

12. 기존 디자인/레이아웃 최대한 유지

13. npm run build 통과

---

## W124 (L970, build_error, unknown)

디자인은 건드리지 말고, 친구 공유/초대/바이럴 기능을 상용화 기준으로 구현해줘.

와딜은 여러 명이 함께 살수록 가격이 내려가는 공동구매 플랫폼이므로, 사용자가 공동구매를 공유해서 참여자를 모으는 기능이 핵심이다.

이번 작업 목표:
카카오톡 공유, 링크 공유, 초대 추적, 공유 유입 기록 구조를 만든다.

요구사항:
1. 공유 기능
   - 상품 상세페이지에 공유 버튼 추가
   - 카카오톡 공유 버튼
   - 링크 복사 버튼
   - 기본 Web Share API 지원
   - 공유 성공/실패 메시지 표시

2. 공유 URL 구조
   - /product/[slug]?ref=USER_ID 또는 referral_code
   - 로그인 사용자는 본인 referral_code 사용
   - 비로그인 사용자는 일반 공유 링크 사용

3. users 테이블에 referral_code 추가
   - 고유값
   - 자동 생성
   - 중복 방지

4. share_logs 테이블 생성
   - id
   - user_id nullable
   - product_id/deal_id
   - channel
   - referral_code nullable
   - created_at

5. referral_visits 테이블 생성
   - id
   - referral_code
   - product_id/deal_id
   - visitor_user_id nullable
   - ip_hash nullable
   - user_agent nullable
   - created_at

6. 공유 유입 추적
   - 상품 상세 진입 시 ref 파라미터가 있으면 referral_visits 기록
   - 로그인/주문 참여까지 이어지면 나중에 기여 추적 가능하도록 구조 준비

7. 카카오 공유
   - 실제 Kakao JS SDK 연결 가능하게 구조 작성
   - 지금 앱 키가 없으면 환경변수 기반으로 준비
   - NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY 사용
   - 키가 없으면 카카오 공유 버튼은 비활성 또는 링크 복사로 fallback

8. 공유 메시지 내용
   - 상품명
   - 현재 공동구매가
   - 최저 달성 가능가
   - 다음 할인까지 남은 수량
   - 상품 링크

9. 마이페이지에 내 초대/공유 현황 섹션 추가
   - 공유한 상품 수
   - 유입 수
   - 참여 전환 수는 나중에 확장 가능하게 placeholder

10. 서버 유틸 함수 생성
   - getOrCreateReferralCode(userId)
   - logShare(productId, channel)
   - logReferralVisit(referralCode, productId)
   - buildShareUrl(productSlug, referralCode)

11. Supabase migration SQL 생성

12. RLS 기준
   - 사용자는 본인 share_logs 조회 가능
   - referral_visits는 insert 가능
   - 관리자는 전체 조회 가능

13. 기존 디자인/레이아웃 최대한 유지

14. npm run build 통과

---

## W125 (L973, build_error, unknown)

디자인은 건드리지 말고, 고객센터/문의/환불요청 기능을 상용화 기준으로 구현해줘.

와딜은 실제 운영할 공동구매 커머스 플랫폼이다.

이번 작업 목표:
사용자가 주문/상품 관련 문의를 남기고, 환불/취소 요청을 할 수 있으며, 관리자가 처리할 수 있는 구조를 만든다.

요구사항:
1. support_tickets 테이블 생성 또는 정리
   - id
   - user_id
   - order_id nullable
   - product_id/deal_id nullable
   - type
   - title
   - content
   - status
   - admin_reply
   - created_at
   - updated_at
   - resolved_at

2. 문의 type
   - product
   - order
   - payment
   - shipping
   - refund
   - exchange
   - account
   - etc

3. 문의 status
   - open
   - in_progress
   - answered
   - resolved
   - closed

4. 사용자 페이지
   - /support
   - 문의 목록
   - 문의 작성
   - 주문 선택 가능
   - 상품 선택 가능
   - 답변 확인
   - 상태 표시

5. 마이페이지에 고객센터/문의내역 연결

6. 주문 상세에서
   - 문의하기 버튼
   - 취소/환불 요청 버튼

7. 환불/취소 요청
   - 주문 상태에 따라 가능 여부 제한
   - 배송 전: 취소 요청 가능
   - 배송 후: 환불/교환 문의로 접수
   - 요청 사유 저장
   - 주문에 cancel_reason/refund_reason/refund_requested_at 반영

8. 관리자 페이지
   - /admin/support
   - 전체 문의 목록
   - 상태 필터
   - 유형 필터
   - 문의 상세
   - 관리자 답변 작성
   - 상태 변경

9. 알림 연동
   - 문의 답변 시 사용자 알림 생성
   - 환불 상태 변경 시 사용자 알림 생성

10. 유틸 함수 생성
   - canRequestCancel(order)
   - canRequestRefund(order)
   - getSupportStatusLabel
   - getSupportTypeLabel

11. RLS 기준
   - 사용자는 본인 문의만 조회/작성 가능
   - 관리자는 전체 조회/답변/상태변경 가능

12. Supabase migration SQL 생성

13. 기존 디자인/레이아웃 최대한 유지

14. npm run build 통과

---
