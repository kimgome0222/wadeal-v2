import { cache } from "react";

import type { CategorySlug } from "@/lib/categories";
import type { Deal, DealSectionCategory } from "@/lib/deals";
import {
  deals as mockDeals,
  getDealById as getMockDealById,
  getSavedDeals as getMockSavedDeals,
} from "@/lib/deals";
import { mapDealRow, mapDealRows, mapPriceTierRow } from "@/lib/data/adapter";
import { markWadealDataSource } from "@/lib/data/source";
import { shouldUseMockData } from "@/lib/env/runtime";
import { getMockPriceTiersByDealSlug } from "@/lib/pricing/mock-tiers";
import { PUBLIC_PRODUCT_APPROVAL_STATUS } from "@/lib/products/public-visibility";
import type { DealWithProductRow } from "@/lib/types";
import type { PriceTier } from "@/lib/types";
import { PROTOTYPE_USER_ID } from "@/lib/database/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function mockDealsOrEmpty(): Deal[] {
  return shouldUseMockData() ? [...mockDeals] : [];
}

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[deals] using mock fallback: ${context}`);
  }
}

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
  target_quantity,
  current_quantity,
  max_quantity,
  products!inner (
    id,
    slug,
    legacy_id,
    name,
    category,
    category_tags,
    brand_name,
    keywords,
    image_url,
    original_price,
    description,
    is_active,
    approval_status,
    product_type,
    stock_quantity,
    sold_quantity,
    min_order_quantity,
    max_order_quantity,
    per_user_limit,
    is_sold_out,
    sold_out_at,
    created_at
  )
`;

const fetchActiveDeals = cache(async (): Promise<Deal[]> => {
  if (!isSupabaseConfigured()) {
    logMockFallback("fetchActiveDeals: Supabase is not configured");
    return mockDealsOrEmpty();
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    logMockFallback("fetchActiveDeals: failed to create Supabase client");
    return mockDealsOrEmpty();
  }

  const { data, error } = await supabase
    .from("group_buy_deals")
    .select(dealSelect)
    .eq("status", "active")
    .eq("products.is_active", true)
    .eq("products.approval_status", PUBLIC_PRODUCT_APPROVAL_STATUS)
    .order("created_at", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) {
      console.error("[deals] fetchActiveDeals:", error.message);
    }
    logMockFallback("fetchActiveDeals: query error or empty result");
    return mockDealsOrEmpty();
  }

  markWadealDataSource("supabase");
  return mapDealRows(data as unknown as DealWithProductRow[]);
});

const fetchDealBySlug = cache(async (slug: string): Promise<Deal | undefined> => {
  if (!isSupabaseConfigured()) {
    logMockFallback("fetchDealBySlug: Supabase is not configured");
    return shouldUseMockData() ? getMockDealById(slug) : undefined;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    logMockFallback("fetchDealBySlug: failed to create Supabase client");
    return shouldUseMockData() ? getMockDealById(slug) : undefined;
  }

  const numericId = Number(slug);
  const isNumeric = Number.isInteger(numericId) && numericId > 0;

  const { data, error } = await supabase
    .from("group_buy_deals")
    .select(dealSelect)
    .eq("status", "active")
    .eq("products.is_active", true)
    .eq("products.approval_status", PUBLIC_PRODUCT_APPROVAL_STATUS)
    .eq(isNumeric ? "products.legacy_id" : "products.slug", isNumeric ? numericId : slug)
    .maybeSingle();

  if (error || !data) {
    if (error) {
      console.error("[deals] fetchDealBySlug:", error.message);
    }
    logMockFallback("fetchDealBySlug: query error or not found");
    return shouldUseMockData() ? getMockDealById(slug) : undefined;
  }

  markWadealDataSource("supabase");
  return mapDealRow(data as unknown as DealWithProductRow);
});

const fetchDealUuidBySlug = cache(async (slug: string): Promise<string | undefined> => {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return undefined;
  }

  const numericId = Number(slug);
  const isNumeric = Number.isInteger(numericId) && numericId > 0;

  let query = supabase
    .from("group_buy_deals")
    .select("id, products!inner(slug, legacy_id, is_active, approval_status)")
    .eq("status", "active")
    .eq("products.is_active", true)
    .eq("products.approval_status", PUBLIC_PRODUCT_APPROVAL_STATUS);

  if (isNumeric) {
    query = query.eq("products.legacy_id", numericId);
  } else {
    query = query.eq("products.slug", slug);
  }

  const { data, error } = await query.maybeSingle();

  if (error || !data) {
    return undefined;
  }

  return (data as { id: string }).id;
});

export async function getFeaturedDeals(): Promise<Deal[]> {
  const deals = await fetchActiveDeals();
  return deals.filter((deal) => deal.section === "main");
}

export async function getDealsBySection(
  section: DealSectionCategory,
): Promise<Deal[]> {
  const deals = await fetchActiveDeals();
  return deals.filter((deal) => deal.section === section);
}

export async function getDealsByCategory(
  category: CategorySlug,
): Promise<Deal[]> {
  const deals = await fetchActiveDeals();

  if (category === "all") {
    return deals;
  }

  return deals.filter((deal) => deal.categoryTags.includes(category));
}

export async function getDealById(id: string): Promise<Deal | undefined> {
  return fetchDealBySlug(id);
}

export async function getPriceTiersByDealId(
  dealId: string,
): Promise<PriceTier[]> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      const deal = getMockDealById(dealId);
      return deal ? getMockPriceTiersByDealSlug(dealId, deal) : [];
    }
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const dealUuid = await fetchDealUuidBySlug(dealId);
  if (!dealUuid) {
    return [];
  }

  const { data, error } = await supabase
    .from("price_tiers")
    .select("*")
    .eq("deal_id", dealUuid)
    .order("tier_order", { ascending: true });

  if (error) {
    console.error("[deals] getPriceTiersByDealId:", error.message);
    return [];
  }

  if (!data || data.length === 0) {
    if (shouldUseMockData()) {
      const deal = getMockDealById(dealId);
      return deal ? getMockPriceTiersByDealSlug(dealId, deal) : [];
    }
    return [];
  }

  markWadealDataSource("supabase");
  return data.map(mapPriceTierRow);
}

export async function getAllActiveDeals(): Promise<Deal[]> {
  return fetchActiveDeals();
}

async function fetchSavedDealSlugs(userId: string): Promise<string[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("saved_deals")
    .select("products!inner(slug)")
    .eq("user_id", userId);

  if (error || !data) {
    console.error("[deals] fetchSavedDealSlugs:", error?.message);
    return [];
  }

  return (data as unknown as Array<{ products: { slug: string } }>)
    .map((row) => row.products.slug)
    .filter(Boolean);
}

export async function getSavedDeals(userId?: string): Promise<Deal[]> {
  const deals = await fetchActiveDeals();
  if (!userId) {
    return shouldUseMockData() ? getMockSavedDeals() : [];
  }

  const savedSlugs = await fetchSavedDealSlugs(userId);

  if (savedSlugs.length === 0) {
    return shouldUseMockData() ? getMockSavedDeals() : [];
  }

  const slugSet = new Set(savedSlugs);

  return deals
    .filter((deal) => slugSet.has(deal.slug))
    .map((deal) => ({ ...deal, saved: true }));
}

export async function getDealUuidById(id: string): Promise<string | undefined> {
  if (!isSupabaseConfigured()) {
    return undefined;
  }

  return fetchDealUuidBySlug(id);
}
