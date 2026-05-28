import type { CategorySlug } from "@/lib/categories";
import { dealMatchesSubCategory, getSubCategory } from "@/lib/categories/catalog";
import type { Deal } from "@/lib/deals";
import { deals as mockDeals, getDealDiscount } from "@/lib/deals";
import { getDealReviewScoreLabel } from "@/lib/deals/card-display";
import { mapDealRows } from "@/lib/data/adapter";
import { markWadealDataSource } from "@/lib/data/source";
import { shouldUseMockData } from "@/lib/env/runtime";
import { PUBLIC_PRODUCT_APPROVAL_STATUS } from "@/lib/products/public-visibility";
import type { DealWithProductRow } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import type {
  DealCatalogFilters,
  DealCatalogQuery,
  DealCatalogResult,
  DealSortOption,
} from "./types";
import { DEFAULT_PAGE_SIZE } from "./types";

const CLOSING_SOON_HOURS = 24;

const dealSelect = `
  id,
  product_id,
  title,
  section,
  current_participants,
  target_participants,
  group_price,
  lowest_price,
  price_tiers,
  badge,
  starts_at,
  ends_at,
  status,
  created_at,
  products!inner (
    id,
    slug,
    legacy_id,
    name,
    category,
    category_id,
    category_tags,
    brand_name,
    keywords,
    image_url,
    original_price,
    description,
    is_active,
    approval_status,
    created_at
  )
`;

function escapeIlike(value: string): string {
  return value.replace(/[%_\\]/g, "\\$&");
}

function getAchievementRate(deal: Deal): number {
  if (deal.targetParticipants <= 0) {
    return 0;
  }

  return Math.round((deal.participants / deal.targetParticipants) * 100);
}

function applyClientFilters(deals: Deal[], filters: DealCatalogFilters): Deal[] {
  let result = deals;

  if (filters.priceMin != null) {
    result = result.filter((deal) => deal.groupPrice >= filters.priceMin!);
  }

  if (filters.priceMax != null) {
    result = result.filter((deal) => deal.groupPrice <= filters.priceMax!);
  }

  if (filters.closingSoon) {
    result = result.filter((deal) => deal.endsInMinutes <= CLOSING_SOON_HOURS * 60);
  }

  if (filters.todayDeadline) {
    result = result.filter((deal) => deal.section === "main");
  }

  if (filters.minDiscount != null) {
    result = result.filter((deal) => getDealDiscount(deal) >= filters.minDiscount!);
  }

  if (filters.minAchievement != null) {
    result = result.filter(
      (deal) => getAchievementRate(deal) >= filters.minAchievement!,
    );
  }

  return result;
}

function applyTextSearch(deals: Deal[], query: string): Deal[] {
  const terms = query.trim().toLowerCase();
  if (!terms) {
    return deals;
  }

  return deals.filter((deal) => {
    const haystack = [
      deal.title,
      deal.badge,
      deal.description ?? "",
      ...(deal.searchKeywords ?? []),
      deal.brandName ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return terms.split(/\s+/).every((term) => haystack.includes(term));
  });
}

function applyCategoryFilter(deals: Deal[], categorySlug?: string): Deal[] {
  if (!categorySlug || categorySlug === "all") {
    return deals;
  }

  if (categorySlug === "closing-soon") {
    return deals.filter((deal) => deal.endsInMinutes <= CLOSING_SOON_HOURS * 60);
  }

  return deals.filter((deal) => deal.categoryTags.includes(categorySlug as CategorySlug));
}

function applyStatusFilter(deals: Deal[], status: DealCatalogFilters["status"]): Deal[] {
  if (!status || status === "active") {
    return deals.filter((deal) => deal.dealStatus !== "closed" && deal.dealStatus !== "cancelled");
  }

  if (status === "closed") {
    return deals.filter((deal) => deal.dealStatus === "closed" || deal.dealStatus === "cancelled");
  }

  return deals;
}

function applySubCategoryFilter(
  deals: Deal[],
  categorySlug?: string,
  subCategorySlug?: string,
): Deal[] {
  if (!categorySlug || !subCategorySlug || categorySlug === "all" || categorySlug === "closing-soon") {
    return deals;
  }

  const sub = getSubCategory(categorySlug as CategorySlug, subCategorySlug);
  if (!sub) {
    return deals;
  }

  return deals.filter((deal) => dealMatchesSubCategory(deal, sub));
}

function sortDealsList(deals: Deal[], sort: DealSortOption): Deal[] {
  const sorted = [...deals];

  switch (sort) {
    case "closing":
      return sorted.sort((a, b) => a.endsInMinutes - b.endsInMinutes);
    case "newest":
      return sorted.sort((a, b) => b.id - a.id);
    case "price-asc":
      return sorted.sort((a, b) => a.groupPrice - b.groupPrice);
    case "price-desc":
      return sorted.sort((a, b) => b.groupPrice - a.groupPrice);
    case "discount":
      return sorted.sort((a, b) => getDealDiscount(b) - getDealDiscount(a));
    case "reviews":
      return sorted.sort(
        (a, b) => getDealReviewScoreLabel(b).count - getDealReviewScoreLabel(a).count,
      );
    case "rating":
      return sorted.sort(
        (a, b) =>
          Number(getDealReviewScoreLabel(b).score) - Number(getDealReviewScoreLabel(a).score),
      );
    case "participants":
    case "popular":
    default:
      return sorted.sort((a, b) => b.participants - a.participants);
  }
}

function paginateDeals(
  deals: Deal[],
  page: number,
  pageSize: number,
): Pick<DealCatalogResult, "deals" | "total" | "hasMore"> {
  const total = deals.length;
  const offset = (page - 1) * pageSize;
  const slice = deals.slice(offset, offset + pageSize);

  return {
    deals: slice,
    total,
    hasMore: offset + slice.length < total,
  };
}

function searchMockDeals(query: DealCatalogQuery): DealCatalogResult {
  if (!shouldUseMockData()) {
    return {
      deals: [],
      total: 0,
      page: query.page ?? 1,
      pageSize: query.pageSize ?? DEFAULT_PAGE_SIZE,
      hasMore: false,
    };
  }

  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
  const sort = query.sort ?? "popular";
  const filters = query.filters ?? {};
  const status = filters.status ?? "active";

  let deals = [...mockDeals];

  if (status !== "all") {
    deals = applyStatusFilter(deals, status);
  }

  if (query.q) {
    deals = applyTextSearch(deals, query.q);
  }

  if (query.categorySlug) {
    deals = applyCategoryFilter(deals, query.categorySlug);
  }

  deals = applySubCategoryFilter(deals, query.categorySlug, query.subCategorySlug);

  deals = applyClientFilters(deals, filters);
  deals = sortDealsList(deals, sort);

  const paginated = paginateDeals(deals, page, pageSize);

  return {
    ...paginated,
    page,
    pageSize,
  };
}

function getSupabaseOrder(sort: DealSortOption): {
  column: string;
  ascending: boolean;
} {
  switch (sort) {
    case "closing":
      return { column: "ends_at", ascending: true };
    case "newest":
      return { column: "created_at", ascending: false };
    case "price-asc":
      return { column: "group_price", ascending: true };
    case "price-desc":
      return { column: "group_price", ascending: false };
    case "participants":
    case "popular":
    default:
      return { column: "current_participants", ascending: false };
  }
}

async function searchSupabaseDeals(query: DealCatalogQuery): Promise<DealCatalogResult> {
  const supabase = await createServerSupabaseClient();
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
  const sort = query.sort ?? "popular";
  const filters = query.filters ?? {};
  const status = filters.status ?? "active";

  if (!supabase) {
    return searchMockDeals(query);
  }

  let request = supabase.from("group_buy_deals").select(dealSelect, { count: "exact" });

  if (status === "active") {
    request = request
      .eq("status", "active")
      .eq("products.is_active", true)
      .eq("products.approval_status", PUBLIC_PRODUCT_APPROVAL_STATUS);
  } else if (status === "closed") {
    request = request
      .in("status", ["closed", "cancelled"])
      .eq("products.is_active", true)
      .eq("products.approval_status", PUBLIC_PRODUCT_APPROVAL_STATUS);
  } else {
    request = request
      .eq("products.is_active", true)
      .eq("products.approval_status", PUBLIC_PRODUCT_APPROVAL_STATUS);
  }

  if (filters.priceMin != null) {
    request = request.gte("group_price", filters.priceMin);
  }

  if (filters.priceMax != null) {
    request = request.lte("group_price", filters.priceMax);
  }

  if (filters.closingSoon) {
    const deadline = new Date(Date.now() + CLOSING_SOON_HOURS * 60 * 60 * 1000).toISOString();
    request = request.lte("ends_at", deadline);
  }

  if (filters.todayDeadline) {
    request = request.eq("section", "main");
  }

  if (query.categorySlug && query.categorySlug !== "all") {
    if (query.categorySlug === "closing-soon") {
      const deadline = new Date(Date.now() + CLOSING_SOON_HOURS * 60 * 60 * 1000).toISOString();
      request = request.lte("ends_at", deadline);
    } else {
      request = request.eq("products.category", query.categorySlug);
    }
  }

  if (query.q?.trim()) {
    const escaped = escapeIlike(query.q.trim());
    const pattern = `%${escaped}%`;
    request = request.or(
      [
        `products.name.ilike.${pattern}`,
        `products.brand_name.ilike.${pattern}`,
        `products.description.ilike.${pattern}`,
        `title.ilike.${pattern}`,
      ].join(","),
    );
  }

  const order = getSupabaseOrder(sort);
  request = request.order(order.column, { ascending: order.ascending });

  const offset = (page - 1) * pageSize;
  request = request.range(offset, offset + pageSize - 1);

  const { data, error, count } = await request;

  if (error || !data) {
    console.error("[search] searchSupabaseDeals:", error?.message);
    return searchMockDeals(query);
  }

  markWadealDataSource("supabase");
  let deals = mapDealRows(data as unknown as DealWithProductRow[]);

  deals = applySubCategoryFilter(deals, query.categorySlug, query.subCategorySlug);

  if (
    filters.minDiscount != null ||
    filters.minAchievement != null ||
    sort === "discount" ||
    sort === "reviews" ||
    sort === "rating" ||
    sort === "price-desc"
  ) {
    deals = applyClientFilters(deals, filters);
    if (sort === "discount" || sort === "reviews" || sort === "rating" || sort === "price-desc") {
      deals = sortDealsList(deals, sort);
    }
  }

  const total = count ?? deals.length;

  return {
    deals,
    total,
    page,
    pageSize,
    hasMore: offset + deals.length < total,
  };
}

export async function executeDealCatalogQuery(
  query: DealCatalogQuery,
): Promise<DealCatalogResult> {
  if (!isSupabaseConfigured()) {
    return searchMockDeals(query);
  }

  return searchSupabaseDeals(query);
}
