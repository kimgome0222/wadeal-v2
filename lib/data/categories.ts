import { cache } from "react";

import type { CategorySlug } from "@/lib/categories";
import { categoryTitles } from "@/lib/categories";
import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type CategoryRecord = {
  id: string;
  slug: CategorySlug;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
};

const mockCategories: CategoryRecord[] = [
  { id: "mock-food", slug: "food", name: "식품", description: null, sortOrder: 1, isActive: true },
  { id: "mock-living", slug: "living", name: "생활용품", description: null, sortOrder: 2, isActive: true },
  { id: "mock-beauty", slug: "beauty", name: "뷰티", description: null, sortOrder: 3, isActive: true },
  { id: "mock-fashion", slug: "fashion", name: "패션잡화", description: null, sortOrder: 4, isActive: true },
  { id: "mock-pet", slug: "pet", name: "반려동물", description: null, sortOrder: 5, isActive: true },
  { id: "mock-baby", slug: "baby", name: "육아", description: null, sortOrder: 6, isActive: true },
  { id: "mock-digital", slug: "digital", name: "디지털/가전", description: null, sortOrder: 7, isActive: true },
  { id: "mock-local", slug: "local", name: "지역특산물", description: null, sortOrder: 8, isActive: true },
];

function mapCategoryRow(row: {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  display_order?: number | null;
  sort_order: number;
  is_active?: boolean;
}): CategoryRecord {
  return {
    id: row.id,
    slug: row.slug as CategorySlug,
    name: row.name,
    description: row.description ?? null,
    sortOrder: row.display_order ?? row.sort_order,
    isActive: row.is_active ?? true,
  };
}

export const getCategories = cache(async (): Promise<CategoryRecord[]> => {
  if (!isSupabaseConfigured()) {
    return shouldUseMockData() ? mockCategories : [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return shouldUseMockData() ? mockCategories : [];
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name, description, display_order, sort_order, is_active")
    .eq("is_active", true)
    .order("display_order", { ascending: true, nullsFirst: false })
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) {
      console.error("[categories] getCategories:", error.message);
    }
    return shouldUseMockData() ? mockCategories : [];
  }

  return data.map(mapCategoryRow);
});

export async function getCategoryBySlug(
  slug: string,
): Promise<CategoryRecord | undefined> {
  if (slug === "all" || slug === "closing-soon") {
    return {
      id: slug,
      slug: slug as CategorySlug,
      name: categoryTitles[slug as CategorySlug],
      description: null,
      sortOrder: 0,
      isActive: true,
    };
  }

  const categories = await getCategories();
  return categories.find((category) => category.slug === slug);
}

export function getCategoryDisplayName(slug: string): string {
  if (slug in categoryTitles) {
    return categoryTitles[slug as CategorySlug];
  }

  return slug;
}
