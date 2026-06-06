export type DealSortOption =
  | "popular"
  | "closing"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "discount"
  | "participants"
  | "reviews"
  | "rating"
  | "seller-reviews"
  | "seller-rating"
  | "seller-new"
  | "seller-trust";

export type DealStatusFilter = "active" | "closed" | "all";

export type DealCatalogFilters = {
  priceMin?: number;
  priceMax?: number;
  closingSoon?: boolean;
  todayDeadline?: boolean;
  status?: DealStatusFilter;
  minDiscount?: number;
  minAchievement?: number;
  verifiedSeller?: boolean;
  minSellerRating?: number;
  highReviewSeller?: boolean;
  fastResponseSeller?: boolean;
  highRepurchaseSeller?: boolean;
  /** TODO(DB): seller_stats.trust_score >= threshold */
  highTrustSeller?: boolean;
  /** UI mock — groupPrice 기준 무료배송 가능 상품 */
  freeShipping?: boolean;
};

export type DealCatalogQuery = {
  q?: string;
  categorySlug?: string;
  subCategorySlug?: string;
  sort?: DealSortOption;
  filters?: DealCatalogFilters;
  page?: number;
  pageSize?: number;
};

export type DealCatalogResult = {
  deals: import("@/lib/deals").Deal[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export type PopularSearchTerm = {
  query: string;
  count: number;
};

export const DEAL_SORT_OPTIONS: { value: DealSortOption; label: string }[] = [
  { value: "popular", label: "추천순" },
  { value: "rating", label: "평점 높은 상품" },
  { value: "reviews", label: "리뷰 많은 상품" },
  { value: "seller-rating", label: "평점 높은 판매자" },
  { value: "seller-reviews", label: "리뷰 많은 판매자" },
  { value: "seller-trust", label: "신뢰 점수 높은 판매자" },
  { value: "seller-new", label: "신규 판매자 상품" },
  { value: "newest", label: "신상품순" },
  { value: "price-asc", label: "가격 낮은순" },
  { value: "price-desc", label: "가격 높은순" },
  { value: "closing", label: "인기 상품" },
  { value: "participants", label: "구매 많은순" },
  { value: "discount", label: "할인율순" },
];

export const SELLER_FILTER_OPTIONS: {
  key:
    | "verifiedSeller"
    | "minSellerRating"
    | "highReviewSeller"
    | "fastResponseSeller"
    | "highRepurchaseSeller"
    | "highTrustSeller";
  label: string;
  /** TODO(DB): 연동 필드 참고 */
  todoNote?: string;
}[] = [
  {
    key: "minSellerRating",
    label: "평점 4.5 이상",
    todoNote: "seller_stats.avg_rating >= 4.5",
  },
  {
    key: "highReviewSeller",
    label: "리뷰 많은 판매자",
    todoNote: "seller_stats.review_count",
  },
  {
    key: "verifiedSeller",
    label: "인증 판매자",
    todoNote: "sellers.status=approved",
  },
  {
    key: "fastResponseSeller",
    label: "빠른 응답 판매자",
    todoNote: "seller_stats.response_rate_30d",
  },
  {
    key: "highRepurchaseSeller",
    label: "재구매율 높은 판매자",
    todoNote: "seller_stats.repurchase_rate",
  },
  {
    key: "highTrustSeller",
    label: "신뢰 점수 높은 판매자",
    todoNote: "seller_stats.trust_score",
  },
];

/** 검색·카테고리 툴바 빠른 필터 (판매자 기준 전체). */
export const SELLER_QUICK_FILTER_OPTIONS = SELLER_FILTER_OPTIONS;

export const DEAL_STATUS_FILTER_OPTIONS: {
  value: DealStatusFilter;
  label: string;
}[] = [
  { value: "active", label: "진행중" },
  { value: "closed", label: "판매 종료" },
  { value: "all", label: "전체" },
];

export const PRICE_RANGE_PRESETS: {
  label: string;
  min?: number;
  max?: number;
}[] = [
  { label: "전체", min: undefined, max: undefined },
  { label: "1만원 이하", max: 10000 },
  { label: "1~3만원", min: 10000, max: 30000 },
  { label: "3~5만원", min: 30000, max: 50000 },
  { label: "5만원 이상", min: 50000 },
];

export const DISCOUNT_FILTER_OPTIONS: { label: string; value?: number }[] = [
  { label: "전체" },
  { label: "30%↑", value: 30 },
  { label: "50%↑", value: 50 },
];

export const ACHIEVEMENT_FILTER_OPTIONS: { label: string; value?: number }[] = [
  { label: "전체" },
  { label: "50%↑", value: 50 },
  { label: "80%↑", value: 80 },
  { label: "100%", value: 100 },
];

export const DEFAULT_PAGE_SIZE = 24;
