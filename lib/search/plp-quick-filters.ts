import type { ReadonlyURLSearchParams } from "next/navigation";

import type { DealSortOption } from "@/lib/search/types";

export type PlpQuickFilterKey =
  | "all"
  | "freeShipping"
  | "specialPrice"
  | "newArrival"
  | "rating45"
  | "priceRange";

export const PLP_QUICK_FILTER_CHIPS: { key: PlpQuickFilterKey; label: string }[] = [
  { key: "freeShipping", label: "무료배송" },
  { key: "specialPrice", label: "특가" },
  { key: "rating45", label: "평점4.5+" },
  { key: "newArrival", label: "신상품" },
  { key: "priceRange", label: "가격대" },
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
  if (searchParams.get("priceMin") === "10000" && searchParams.get("priceMax") === "50000") {
    return "priceRange";
  }
  return "all";
}

/** 칩 클릭 시 URL 갱신용 (상호 배타 — 전체는 필터 초기화) */
export function buildPlpQuickFilterUpdates(
  key: PlpQuickFilterKey,
  current: PlpQuickFilterKey,
): Record<string, string | null | DealSortOption> {
  if (key === current) {
    return {
      freeShip: null,
      minDiscount: null,
      minSellerRating: null,
      priceMin: null,
      priceMax: null,
      sort: "popular",
    };
  }

  return {
    freeShip: null,
    minDiscount: null,
    minSellerRating: null,
    priceMin: null,
    priceMax: null,
    sort: "popular",
    ...(key === "freeShipping" ? { freeShip: "1" } : {}),
    ...(key === "specialPrice" ? { minDiscount: "30" } : {}),
    ...(key === "newArrival" ? { sort: "newest" as DealSortOption } : {}),
    ...(key === "rating45" ? { minSellerRating: "1" } : {}),
    ...(key === "priceRange" ? { priceMin: "10000", priceMax: "50000" } : {}),
  };
}
