/**
 * 판매자 신뢰 UI 필드별 DB/타입/컴포넌트 가용성 (점검용, UI 문서).
 * 실제 연동 시 이 표를 기준으로 seller_stats / sellers 컬럼 추가.
 */
export const SELLER_TRUST_FIELD_AUDIT = [
  {
    field: "판매자명",
    db: "products.brand_name, sellers.company_name",
    uiSource: "Deal.brandName → resolveSellerProfileForDeal()",
    status: "partial" as const,
    note: "UI는 brand_name만 사용. created_by→sellers 조인 미연결",
  },
  {
    field: "판매자 소개",
    db: "없음",
    uiSource: "SELLER_TAGLINES mock (home-sellers.ts)",
    status: "mock" as const,
    note: "sellers.tagline 또는 seller_public_profiles.bio 컬럼 필요",
  },
  {
    field: "로고/프로필 이미지",
    db: "없음",
    uiSource: "SellerProfileAvatar (이니셜)",
    status: "mock" as const,
    note: "sellers.logo_url 필요",
  },
  {
    field: "평점",
    db: "reviews.rating (상품 단위)",
    uiSource: "상세: reviewSummary / 카드: getDealReviewScoreLabel mock",
    status: "partial" as const,
    note: "판매자 집계 avg_rating 뷰/컬럼 필요",
  },
  {
    field: "리뷰 수",
    db: "reviews (product_id=slug)",
    uiSource: "상세: reviewSummary.totalCount / mock 병합",
    status: "partial" as const,
    note: "판매자 전체 review_count 집계 필요",
  },
  {
    field: "누적 판매 수",
    db: "products.sold_quantity, orders.quantity",
    uiSource: "home-sellers mock totalSales",
    status: "partial" as const,
    note: "판매자별 SUM 집계 API 필요",
  },
  {
    field: "재구매율",
    db: "없음",
    uiSource: "hashSeed mock",
    status: "mock" as const,
    note: "orders 기반 재구매율 집계 또는 seller_stats.repurchase_rate",
  },
  {
    field: "문의 응답률",
    db: "support_tickets.seller_answer*",
    uiSource: "satisfaction.ts mock",
    status: "mock" as const,
    note: "support_tickets 집계 연동 가능, UI 미연결",
  },
  {
    field: "사업자 인증",
    db: "sellers.status, business_number, business_registration_url",
    uiSource: "isVerified mock (index/seed)",
    status: "mock" as const,
    note: "status=approved + 공개 read 정책 필요",
  },
] as const;

export type SellerTrustFieldStatus = (typeof SELLER_TRUST_FIELD_AUDIT)[number]["status"];
