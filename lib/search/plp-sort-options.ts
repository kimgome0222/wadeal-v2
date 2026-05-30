import type { DealSortOption } from "@/lib/search/types";

/** PLP 정렬 — 5개만 노출 */
export const PLP_SORT_OPTIONS: { value: DealSortOption; label: string }[] = [
  { value: "popular", label: "인기순" },
  { value: "participants", label: "구매순" },
  { value: "discount", label: "할인순" },
  { value: "rating", label: "평점순" },
  { value: "newest", label: "신상품순" },
];
