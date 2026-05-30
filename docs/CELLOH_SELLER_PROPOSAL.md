# CELLOH 판매자 입점 제안서 (초안)

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** ⚠️ **법무·세무 검토 전 초안** — 실제 계약서가 아닙니다.

---

## celloh 소개

**celloh**는 “좋은 판매자의 상품”을 고객에게 연결하는 큐레이션 커머스입니다.  
가격 할인 경쟁보다 **누가, 어떤 기준으로 상품을 고르는지**를 먼저 보여 주고, 그 신뢰 위에서 구매가 이어지도록 설계했습니다.

- 고객: 판매자 스토리 → 상품 상세 → 주문/배송 → 리뷰
- 판매자: 입점 → 상품 검수 → 판매 → 정산
- 플랫폼: 검수·CS·정산·기획전 운영

---

## “판매자를 알면, 상품이 보입니다”

celloh의 핵심 메시지입니다.

| 일반 마켓 | celloh |
|-----------|--------|
| 상품명·가격만 노출 | 판매자 소개·스토리가 함께 노출 |
| 최저가 경쟁 | 큐레이션·신뢰 기반 구매 |
| 익명 셀러 | `/sellers/[id]` 판매자 프로필 |

고객이 **“이 판매자를 믿을 수 있는지”** 먼저 판단한 뒤 상품을 살펴봅니다.  
입점 판매자는 자신의 기준·과정·철학을 스토리로 전달할 수 있습니다.

---

## 입점 판매자에게 주는 가치

### 1. 판매자 스토리 노출
- 판매자 프로필·소개글·스토리 카드
- Only Celloh·기획전에서 스토리 강조 노출 (운영 일정)

### 2. 상품 중심 노출
- 검수 통과 상품만 고객 화면 노출
- 카테고리·컬렉션·검색·추천 영역 배치 (알고리즘 기본)

### 3. 쿠폰·기획전 참여
- 플랫폼 쿠폰·기획전 공동 참여 (Growth 이상 — 초안)
- 마감세일·시즌 컬렉션 노출 기회

### 4. 리뷰·문의 관리
- 판매자센터 `/seller/reviews`, `/seller/inquiries`
- 48시간 이내 문의 응대 권장 (SLA)

### 5. 정산 관리
- `/seller/finance/settlements` — 정산 내역·상태 확인
- 월 1회 정산 주기 (placeholder)

### 6. 고객 CS 기반
- celloh 고객센터가 1차 CS·분쟁 조율 지원
- 판매자는 상품·배송·문의에 집중

---

## 초기 입점 혜택 (placeholder)

> 운영팀과 협의 후 확정. UI mock 기준 초안입니다.

| 혜택 | 내용 (초안) |
|------|-------------|
| 초기 수수료 | 입점 후 **3개월** 플랫폼 수수료 **○%** (placeholder) |
| 기획전 우선 노출 | 신규 셀러 기획전 **1회** 우선 배치 후보 |
| 판매자 스토리 카드 | 홈·셀러 목록 **스토리 카드** 노출 후보 |
| 검수 fast-track | 첫 상품 **○영업일** 내 검수 목표 (placeholder) |

상세: `docs/CELLOH_SELLER_PRICING_PLAN.md`

---

## 입점 가능 카테고리 (placeholder)

| 카테고리 | 비고 |
|----------|------|
| 식품·신선 | 유통기한·원산지 표기 필수 |
| 생활·주방 | KC·안전 인증 해당 시 필수 |
| 뷰티·헬스 | 기능성 표시·인증 확인 |
| 패션·잡화 | 이미지·실측 정보 권장 |
| 반려·취미 | 금지품목 제외 |

**입점 불가:** 의약품, 주류(별도 허가 없을 시), 담배, 성인용품, 위조·불법 복제품 등  
→ `docs/CELLOH_PRODUCT_DATA_POLICY.md`, `/seller/policies`

---

## 입점 절차

```
1. 입점 신청 (/seller/apply)
2. 서류·정보 검토 (3~5영업일 placeholder)
3. 승인 → 판매자센터 활성화
4. 프로필·스토리 작성
5. 상품 등록 요청 → 검수
6. 승인 완료 → 판매 시작
```

상세: `docs/CELLOH_SELLER_ONBOARDING_GUIDE.md`

---

## 준비 서류 (placeholder)

| 서류 | 필수 |
|------|------|
| 사업자등록증 | ✅ |
| 통신판매업 신고증 (해당 시) | ✅ |
| 대표자 신분 확인 | ✅ |
| 정산 계좌 정보 | ✅ |
| 상품별 인증서 (KC, HACCP 등 해당 시) | 카테고리별 |

※ mock 단계: 파일 업로드 placeholder, DB 저장 없음

---

## 판매자 책임

- 등록 정보·상품 정보의 **정확성**
- **검수 기준** 준수 (과장·금지 표현 없음)
- 결제 완료 후 **배송·송장** 처리 (영업일 3일 이내 권장)
- **문의·리뷰** 성실 응대
- **환불·교환** 정책 준수 (판매자 귀책 시 부담)
- **개인정보** 취급 위탁 약관 준수

---

## 수수료·정산 (placeholder)

| 항목 | 초안 |
|------|------|
| 플랫폼 수수료 | GMV의 **○%** (카테고리·플랜별 차등 placeholder) |
| 결제 수수료 | PG 수수료 **별도** (placeholder) |
| 정산 주기 | **월 1회** (익월 ○일 placeholder) |
| 정산 방식 | 판매대금 − 수수료 − 공제 → 입금 |

상세: `docs/CELLOH_SELLER_PRICING_PLAN.md`, `/policies/payment`

---

## 문의 연락처 (placeholder)

| 채널 | 내용 |
|------|------|
| 입점 문의 | seller@celloh.example (placeholder) |
| 운영 시간 | 평일 10:00–18:00 (placeholder) |
| 판매자센터 | `/seller/support`, `/seller/notices` |

---

## Related

- [CELLOH_SELLER_ONBOARDING_GUIDE.md](./CELLOH_SELLER_ONBOARDING_GUIDE.md)
- [CELLOH_PRODUCT_REGISTRATION_GUIDE.md](./CELLOH_PRODUCT_REGISTRATION_GUIDE.md)
- [CELLOH_SELLER_STORY_GUIDE.md](./CELLOH_SELLER_STORY_GUIDE.md)
- `/seller/apply` · `/policies/seller`
