import type { ReadonlyURLSearchParams } from "next/navigation";

import type { DealSortOption } from "@/lib/search/types";

export type PlpQuickFilterKey =
  | "all"
  | "freeShipping"
  | "specialPrice"
  | "newArrival"
  | "rating45"
  | "sellerRecommended";

export const PLP_QUICK_FILTER_CHIPS: { key: PlpQuickFilterKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "freeShipping", label: "무료배송" },
  { key: "specialPrice", label: "특가" },
  { key: "newArrival", label: "신상품" },
  { key: "rating45", label: "평점4.5+" },
  { key: "sellerRecommended", label: "판매자추천" },
];

export function getActivePlpQuickFilter(
  searchParams: ReadonlyURLSearchParams,
): PlpQuickFilterKey {
  if (searchParams.get("freeShip") === "1") {
    return "freeShipping";
  }
  if (searchParams.get("minDiscount") === "30") {
    return "specialPrice";
  }
  if (searchParams.get("sort") === "newest") {
    return "newArrival";
  }
  if (searchParams.get("minSellerRating") === "1") {
    return "rating45";
  }
  if (searchParams.get("highTrustSeller") === "1") {
    return "sellerRecommended";
  }
  return "all";
}

/** 칩 클릭 시 URL 갱신용 (상호 배타 — 전체는 필터 초기화) */
export function buildPlpQuickFilterUpdates(
  key: PlpQuickFilterKey,
  current: PlpQuickFilterKey,
): Record<string, string | null | DealSortOption> {
  if (key === "all" || key === current) {
    return {
      freeShip: null,
      minDiscount: null,
      minSellerRating: null,
      highTrustSeller: null,
      sort: "popular",
    };
  }

  return {
    freeShip: null,
    minDiscount: null,
    minSellerRating: null,
    highTrustSeller: null,
    sort: "popular",
    ...(key === "freeShipping" ? { freeShip: "1" } : {}),
    ...(key === "specialPrice" ? { minDiscount: "30" } : {}),
    ...(key === "newArrival" ? { sort: "newest" as DealSortOption } : {}),
    ...(key === "rating45" ? { minSellerRating: "1" } : {}),
    ...(key === "sellerRecommended" ? { highTrustSeller: "1" } : {}),
  };
}
