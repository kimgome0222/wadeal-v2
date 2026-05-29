import { shouldUseMockData } from "@/lib/env/runtime";
import { getPopularSearchTerms, type PopularSearchTerm } from "@/lib/data/search";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type FeaturedSearchTermRow = {
  id: string;
  query: string;
  displayOrder: number;
  isActive: boolean;
};

const FALLBACK_FEATURED: FeaturedSearchTermRow[] = [
  { id: "mock-1", query: "감귤", displayOrder: 1, isActive: true },
  { id: "mock-2", query: "청소기", displayOrder: 2, isActive: true },
  { id: "mock-3", query: "세제", displayOrder: 3, isActive: true },
  { id: "mock-4", query: "한우", displayOrder: 4, isActive: true },
];

export async function listFeaturedSearchTermsForAdmin(): Promise<FeaturedSearchTermRow[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_FEATURED;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return FALLBACK_FEATURED;
  }

  const { data, error } = await supabase
    .from("featured_search_terms")
    .select("id, query, display_order, is_active")
    .order("display_order", { ascending: true });

  if (error || !data?.length) {
    if (error && process.env.NODE_ENV === "development") {
      console.warn("[admin-search] listFeaturedSearchTermsForAdmin:", error.message);
    }
    return FALLBACK_FEATURED;
  }

  return (data as Array<{
    id: string;
    query: string;
    display_order: number;
    is_active: boolean;
  }>).map((row) => ({
    id: row.id,
    query: row.query,
    displayOrder: row.display_order,
    isActive: row.is_active,
  }));
}

export async function getPopularSearchTermsForAdmin(limit = 10): Promise<PopularSearchTerm[]> {
  return getPopularSearchTerms(limit);
}

export async function saveFeaturedSearchTerm(input: {
  query: string;
  displayOrder: number;
  isActive: boolean;
}): Promise<{ success: boolean }> {
  const trimmed = input.query.trim();
  if (!trimmed) {
    return { success: false };
  }

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      return { success: true };
    }
    return { success: false };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false };
  }

  const { error } = await supabase.from("featured_search_terms").insert({
    query: trimmed,
    display_order: input.displayOrder,
    is_active: input.isActive,
  });

  if (error) {
    console.error("[admin-search] saveFeaturedSearchTerm:", error.message);
    return { success: false };
  }

  return { success: true };
}

export async function deleteFeaturedSearchTerm(id: string): Promise<{ success: boolean }> {
  if (!isSupabaseConfigured()) {
    return { success: shouldUseMockData() };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false };
  }

  const { error } = await supabase.from("featured_search_terms").delete().eq("id", id);
  if (error) {
    console.error("[admin-search] deleteFeaturedSearchTerm:", error.message);
    return { success: false };
  }

  return { success: true };
}
