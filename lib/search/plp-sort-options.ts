import type { DealSortOption } from "@/lib/search/types";

/** PLP 정렬 — 6개 */
export const PLP_SORT_OPTIONS: { value: DealSortOption; label: string }[] = [
  { value: "popular", label: "추천순" },
  { value: "rating", label: "인기순" },
  { value: "participants", label: "구매순" },
  { value: "reviews", label: "리뷰순" },
  { value: "discount", label: "할인순" },
  { value: "newest", label: "신상품순" },
  { value: "price-asc", label: "낮은 가격순" },
];
