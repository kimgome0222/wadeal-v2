import type { DealSortOption } from "@/lib/search/types";

/** 추천 검색어 mock (DB 변경 없음) */
export const RECOMMENDED_SEARCH_TERMS: string[] = [
  "제주 감귤",
  "성수 로스터리",
  "프리미엄 생수",
  "저자극 스킨케어",
  "반려동물 간식",
  "유기농 샐러드",
  "명절 선물세트",
  "핸드메이드 소품",
  "로컬 푸드",
  "재구매 높은 상품",
];

/** 급상승 검색어 기본 풀 (1시간 mock 로테이션) */
export const TRENDING_SEARCH_POOL: string[] = [
  "감귤",
  "한우",
  "커피",
  "계란",
  "김치",
  "생수",
  "핸드크림",
  "반려간식",
  "샐러드",
  "무선이어폰",
];

export const SEARCH_PRODUCT_SORT_OPTIONS: {
  value: DealSortOption;
  label: string;
}[] = [
  { value: "popular", label: "추천순" },
  { value: "participants", label: "인기순" },
  { value: "newest", label: "최신순" },
  { value: "rating", label: "평점순" },
  { value: "price-asc", label: "낮은 가격순" },
  { value: "price-desc", label: "높은 가격순" },
];

export type SearchResultsTab = "products" | "sellers";

export function parseSearchResultsTab(value: string | null | undefined): SearchResultsTab {
  return value === "sellers" ? "sellers" : "products";
}
