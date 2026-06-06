# CELLOH Seller Onboarding Plan

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** mock UI / 운영 초안

## Summary

판매자 입점 신청·상품 등록 요청·정산 안내를 mock/local state로 구성했습니다. 실제 DB 저장·사업자 인증 API·파일 업로드는 연동하지 않습니다.

## 입점 신청 (`/seller/apply`)

### Mock 필드 (`SellerOnboardingMockForm`)
- 브랜드/상호명, 대표자명, 사업자등록번호 (000-00-00000 형식)
- 통신판매업 신고번호
- 담당자 이름/연락처/이메일
- 판매 카테고리, 대표 상품 설명
- 사업자등록증·통신판매업 신고증 업로드 placeholder
- 정산 계좌 placeholder (**** 마스킹)
- 약관 동의: 판매자 이용약관, 정산, 검수, 개인정보 위탁

### 동작
- mock submit → "입점 신청이 접수되었습니다" (DB 없음)
- 필수값 inline error
- `showSellerCenterMock()` 환경에서 mock 폼 표시

## 상품 등록 요청 (`/seller/products/new`)

### Mock 필드 (`SellerProductRequestMockForm`)
- 상품명, 카테고리, 판매가/원가/할인율
- 이미지 placeholder, 재고, 배송방식/배송비/무료배송 기준
- 교환반품, 원산지, 유통기한/KC placeholder
- 검수 요청 mock submit

### 상태 badge (mock list)
- 작성중 / 검수요청 / 승인대기 / 반려 / 승인완료

## Pre-Launch Checklist

- [ ] 사업자 진위 확인 API
- [ ] 입점 신청 DB + admin 검수 workflow
- [ ] 상품 등록 requests 테이블 + 파일 storage
- [ ] 정산 계좌 암호화 저장
- [ ] 판매자 이용약관 법무 확정

## Push

Not performed.
