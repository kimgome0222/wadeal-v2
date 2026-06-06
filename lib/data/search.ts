import { getServerAuthUser } from "@/lib/auth/server-session";
import { executeDealCatalogQuery } from "@/lib/search/query";
import { parseDealCatalogSearchParams } from "@/lib/search/params";
import type {
  DealCatalogQuery,
  DealCatalogResult,
  PopularSearchTerm,
} from "@/lib/search/types";
import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type { DealCatalogQuery, DealCatalogResult, PopularSearchTerm };

export async function searchDeals(
  query: DealCatalogQuery,
): Promise<DealCatalogResult> {
  return executeDealCatalogQuery(query);
}

export async function searchDealsFromParams(
  searchParams: Record<string, string | string[] | undefined>,
  options?: { categorySlug?: string },
): Promise<DealCatalogResult> {
  const parsed = parseDealCatalogSearchParams(searchParams);

  return searchDeals({
    ...parsed,
    categorySlug: options?.categorySlug ?? parsed.categorySlug,
  });
}

export async function logSearchQuery(input: {
  query: string;
  resultCount: number;
  userId?: string | null;
}): Promise<void> {
  const trimmed = input.query.trim();
  if (!trimmed) {
    return;
  }

  if (!isSupabaseConfigured()) {
    return;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return;
  }

  let userId = input.userId;
  if (userId === undefined) {
    const user = await getServerAuthUser();
    userId = user?.id ?? null;
  }

  const { error } = await supabase.from("search_logs").insert({
    user_id: userId,
    query: trimmed,
    result_count: input.resultCount,
  });

  if (error) {
    console.error("[search] logSearchQuery:", error.message);
  }
}

export async function getPopularSearchTerms(
  limit = 8,
): Promise<PopularSearchTerm[]> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      return [
        { query: "감귤", count: 12 },
        { query: "청소기", count: 9 },
        { query: "세제", count: 7 },
        { query: "한우", count: 5 },
      ].slice(0, limit);
    }

    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase.rpc("get_popular_search_terms", {
    limit_count: limit,
  });

  if (!error && data) {
    return (data as Array<{ query: string; search_count: number }>).map((row) => ({
      query: row.query,
      count: Number(row.search_count),
    }));
  }

  if (error) {
    console.error("[search] getPopularSearchTerms rpc:", error.message);
  }

  const { data: fallbackData, error: fallbackError } = await supabase
    .from("search_logs")
    .select("query")
    .gte("created_at", since)
    .limit(500);

  if (fallbackError || !fallbackData) {
    if (fallbackError) {
      console.error("[search] getPopularSearchTerms:", fallbackError.message);
    }
    return [];
  }

  const counts = new Map<string, number>();

  for (const row of fallbackData as Array<{ query: string }>) {
    const normalized = row.query.trim();
    if (!normalized) {
      continue;
    }

    counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export type SearchSuggestionKind = "product" | "seller" | "keyword";

export type SearchSuggestion = {
  query: string;
  label: string;
  kind: SearchSuggestionKind;
};

const FALLBACK_SUGGESTIONS = ["감귤", "청소기", "세제", "한우", "생수", "커피"];

export async function getSearchSuggestions(
  query: string,
  limit = 8,
): Promise<SearchSuggestion[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const normalized = trimmed.toLowerCase();
  const result = await searchDeals({ q: trimmed, page: 1, pageSize: limit * 2 });
  const items: SearchSuggestion[] = [];
  const seen = new Set<string>();

  for (const deal of result.deals) {
    const sellerName = deal.brandName?.trim();
    if (
      sellerName &&
      sellerName.toLowerCase().includes(normalized) &&
      !seen.has(`seller:${sellerName.toLowerCase()}`)
    ) {
      seen.add(`seller:${sellerName.toLowerCase()}`);
      items.push({ query: sellerName, label: sellerName, kind: "seller" });
    }
  }

  for (const deal of result.deals) {
    const key = deal.title.toLowerCase();
    if (!seen.has(`product:${key}`)) {
      seen.add(`product:${key}`);
      items.push({ query: deal.title, label: deal.title, kind: "product" });
    }
  }

  if (items.length >= limit) {
    return items.slice(0, limit);
  }

  const keywordMatches = FALLBACK_SUGGESTIONS.filter(
    (keyword) =>
      keyword.includes(trimmed) || trimmed.includes(keyword.slice(0, 1)),
  )
    .filter((keyword) => !seen.has(`keyword:${keyword.toLowerCase()}`))
    .map((keyword) => ({
      query: keyword,
      label: keyword,
      kind: "keyword" as const,
    }));

  return [...items, ...keywordMatches].slice(0, limit);
}

export async function getFeaturedSearchTerms(limit = 8): Promise<PopularSearchTerm[]> {
  if (!isSupabaseConfigured()) {
    return getPopularSearchTerms(limit);
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return getPopularSearchTerms(limit);
  }

  const { data, error } = await supabase
    .from("featured_search_terms")
    .select("query, display_order")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(limit);

  if (error || !data?.length) {
    if (error && process.env.NODE_ENV === "development") {
      console.warn("[search] getFeaturedSearchTerms:", error.message);
    }
    return getPopularSearchTerms(limit);
  }

  return (data as Array<{ query: string; display_order: number }>).map((row) => ({
    query: row.query,
    count: row.display_order,
  }));
}
