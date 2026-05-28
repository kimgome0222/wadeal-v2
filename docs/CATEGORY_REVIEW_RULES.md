# 카테고리별 검수 기준

> `category_review_rules` 테이블 및 관리자 상품 검수 화면 연동

## 테이블 구조

| 컬럼 | 설명 |
|---|---|
| category_id | categories FK |
| rule_title | 검수 항목 제목 |
| rule_description | 상세 설명 |
| required_documents | 필요 서류/인증 목록 |
| warning_keywords | 경고 키워드 목록 |
| is_active | 활성 여부 |

## 카테고리별 기준 요약

| 카테고리 | 확인 사항 |
|---|---|
| 식품 | 원산지, 유통기한, 보관방법, 표시사항 |
| 뷰티 | 화장품 표시, 기능성 문구, 전성분 |
| 생활용품 | KC 인증, 안전 표시 |
| 디지털/가전 | KC/전파인증, A/S 안내 |
| 유아/아동 | KC 안전인증, 연령 표시 |
| 반려동물 | 사료/간식 표시, 유통기한 |
| 패션잡화 | 가품/상표권, 소재 표시 |
| 지역특산물 | 원산지, 생산자 정보 |

## RLS

- 관리자: CRUD
- 판매자/일반: active rule SELECT

## Migration

- `supabase/migrations/041_category_product_review.sql`
