import type { ReadonlyURLSearchParams } from "next/navigation";

import type {
  DealCatalogFilters,
  DealCatalogQuery,
  DealSortOption,
  DealStatusFilter,
} from "@/lib/search/types";
import { DEFAULT_PAGE_SIZE } from "@/lib/search/types";

function parseNumber(value: string | null | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseBoolean(value: string | null | undefined): boolean {
  return value === "1" || value === "true";
}

const VALID_SORTS = new Set<DealSortOption>([
  "popular",
  "closing",
  "newest",
  "price-asc",
  "price-desc",
  "discount",
  "participants",
  "reviews",
  "rating",
]);

const VALID_STATUS = new Set<DealStatusFilter>(["active", "closed", "all"]);

export function parseDealCatalogSearchParams(
  searchParams: ReadonlyURLSearchParams | Record<string, string | string[] | undefined>,
): DealCatalogQuery {
  const get = (key: string): string | undefined => {
    if (searchParams instanceof URLSearchParams || "get" in searchParams) {
      const value = (searchParams as ReadonlyURLSearchParams).get(key);
      return value ?? undefined;
    }

    const raw = (searchParams as Record<string, string | string[] | undefined>)[key];
    if (Array.isArray(raw)) {
      return raw[0];
    }

    return raw;
  };

  const sortRaw = get("sort") as DealSortOption | undefined;
  const sort = sortRaw && VALID_SORTS.has(sortRaw) ? sortRaw : "popular";

  const statusRaw = get("status") as DealStatusFilter | undefined;
  const status =
    statusRaw && VALID_STATUS.has(statusRaw) ? statusRaw : ("active" as const);

  const filters: DealCatalogFilters = {
    priceMin: parseNumber(get("priceMin")),
    priceMax: parseNumber(get("priceMax")),
    closingSoon: parseBoolean(get("closingSoon")),
    todayDeadline: parseBoolean(get("todayDeadline")),
    status,
    minDiscount: parseNumber(get("minDiscount")),
    minAchievement: parseNumber(get("minAchievement")),
  };

  const page = parseNumber(get("page")) ?? 1;

  return {
    q: get("q")?.trim() || undefined,
    categorySlug: get("cat")?.trim() || undefined,
    subCategorySlug: get("sub")?.trim() || undefined,
    sort,
    filters,
    page: Math.max(1, page),
    pageSize: DEFAULT_PAGE_SIZE,
  };
}

export function buildDealCatalogSearchParams(
  base: URLSearchParams,
  updates: Partial<{
    q: string | null;
    cat: string | null;
    sub: string | null;
    sort: DealSortOption;
    status: DealStatusFilter;
    priceMin: number | null;
    priceMax: number | null;
    closingSoon: boolean;
    todayDeadline: boolean;
    minDiscount: number | null;
    minAchievement: number | null;
    page: number | null;
  }>,
): URLSearchParams {
  const params = new URLSearchParams(base.toString());

  const setOrDelete = (key: string, value: string | null | undefined) => {
    if (value == null || value === "") {
      params.delete(key);
      return;
    }

    params.set(key, value);
  };

  if ("q" in updates) {
    setOrDelete("q", updates.q);
  }

  if ("cat" in updates) {
    setOrDelete("cat", updates.cat);
  }

  if ("sub" in updates) {
    setOrDelete("sub", updates.sub);
  }

  if ("sort" in updates && updates.sort) {
    params.set("sort", updates.sort);
  }

  if ("status" in updates && updates.status) {
    params.set("status", updates.status);
  }

  if ("priceMin" in updates) {
    setOrDelete("priceMin", updates.priceMin?.toString() ?? null);
  }

  if ("priceMax" in updates) {
    setOrDelete("priceMax", updates.priceMax?.toString() ?? null);
  }

  if ("closingSoon" in updates) {
    if (updates.closingSoon) {
      params.set("closingSoon", "1");
    } else {
      params.delete("closingSoon");
    }
  }

  if ("todayDeadline" in updates) {
    if (updates.todayDeadline) {
      params.set("todayDeadline", "1");
    } else {
      params.delete("todayDeadline");
    }
  }

  if ("minDiscount" in updates) {
    setOrDelete("minDiscount", updates.minDiscount?.toString() ?? null);
  }

  if ("minAchievement" in updates) {
    setOrDelete("minAchievement", updates.minAchievement?.toString() ?? null);
  }

  if ("page" in updates) {
    setOrDelete("page", updates.page?.toString() ?? null);
  } else if (
    "sort" in updates ||
    "cat" in updates ||
    "sub" in updates ||
    "status" in updates ||
    "priceMin" in updates ||
    "priceMax" in updates ||
    "closingSoon" in updates ||
    "todayDeadline" in updates ||
    "minDiscount" in updates ||
    "minAchievement" in updates
  ) {
    params.delete("page");
  }

  return params;
}
