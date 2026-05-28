export type DealSortOption =
  | "popular"
  | "closing"
  | "newest"
  | "price-asc"
  | "discount"
  | "participants";

export type DealStatusFilter = "active" | "closed" | "all";

export type DealCatalogFilters = {
  priceMin?: number;
  priceMax?: number;
  closingSoon?: boolean;
  todayDeadline?: boolean;
  status?: DealStatusFilter;
  minDiscount?: number;
  minAchievement?: number;
};

export type DealCatalogQuery = {
  q?: string;
  categorySlug?: string;
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
  { value: "popular", label: "인기순" },
  { value: "closing", label: "마감임박" },
  { value: "newest", label: "최신순" },
  { value: "price-asc", label: "낮은 가격" },
  { value: "discount", label: "할인율순" },
  { value: "participants", label: "참여 많은순" },
];

export const DEAL_STATUS_FILTER_OPTIONS: {
  value: DealStatusFilter;
  label: string;
}[] = [
  { value: "active", label: "진행중" },
  { value: "closed", label: "마감" },
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
