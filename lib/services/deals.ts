import { cache } from "react";

import type { CategorySlug } from "@/lib/categories";
import type { Deal, DealSectionCategory } from "@/lib/deals";
import {
  deals as mockDeals,
  getDealById as getMockDealById,
  getSavedDeals as getMockSavedDeals,
} from "@/lib/deals";
import { mapDealRow, mapDealRows, mapPriceTierRow } from "@/lib/data/adapter";
import { markcellohDataSource } from "@/lib/data/source";
import { shouldUseMockData } from "@/lib/env/runtime";
import { getMockPriceTiersByDealSlug } from "@/lib/pricing/mock-tiers";
import { PUBLIC_PRODUCT_APPROVAL_STATUS } from "@/lib/products/public-visibility";
import type { DealWithProductRow } from "@/lib/types";
import type { PriceTier } from "@/lib/types";
import { PROTOTYPE_USER_ID } from "@/lib/database/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { logDataQueryFallback } from "@/lib/supabase/query-fallback";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function mockDealsOrEmpty(): Deal[] {
  return shouldUseMockData() ? [...mockDeals] : [];
}

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[deals] using mock fallback: ${context}`);
  }
}

const legacyDealSelect = `
  id,
  product_id,
  title,
  section,
  current_participants,
  target_participants,
  group_price,
  lowest_price,
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
    image_url,
    original_price,
    description,
    is_active
  )
`;

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

type SupabaseClient = NonNullable<Awaited<ReturnType<typeof createServerSupabaseClient>>>;

function isMissingColumnError(message: string | undefined): boolean {
  return Boolean(message?.includes("does not exist"));
}

async function queryActiveDeals(
  supabase: SupabaseClient,
  select: string,
  options: { requireApprovedProduct: boolean },
) {
  let query = supabase
    .from("group_buy_deals")
    .select(select)
    .eq("status", "active")
    .eq("products.is_active", true);

  if (options.requireApprovedProduct) {
    query = query.eq("products.approval_status", PUBLIC_PRODUCT_APPROVAL_STATUS);
  }

  return query.order("created_at", { ascending: true });
}

async function queryDealBySlug(
  supabase: SupabaseClient,
  select: string,
  slug: string,
  options: { requireApprovedProduct: boolean },
) {
  const numericId = Number(slug);
  const isNumeric = Number.isInteger(numericId) && numericId > 0;

  let query = supabase
    .from("group_buy_deals")
    .select(select)
    .eq("status", "active")
    .eq("products.is_active", true);

  if (options.requireApprovedProduct) {
    query = query.eq("products.approval_status", PUBLIC_PRODUCT_APPROVAL_STATUS);
  }

  return query
    .eq(isNumeric ? "products.legacy_id" : "products.slug", isNumeric ? numericId : slug)
    .maybeSingle();
}

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

  const fullResult = await queryActiveDeals(supabase, dealSelect, {
    requireApprovedProduct: true,
  });

  if (!fullResult.error && fullResult.data && fullResult.data.length > 0) {
    markcellohDataSource("supabase");
    return mapDealRows(fullResult.data as unknown as DealWithProductRow[]);
  }

  if (fullResult.error && !isMissingColumnError(fullResult.error.message)) {
    logDataQueryFallback("[deals] fetchActiveDeals", fullResult.error.message);
    logMockFallback("fetchActiveDeals: query error or empty result");
    return mockDealsOrEmpty();
  }

  if (fullResult.error) {
    console.warn("[deals] fetchActiveDeals: retrying with legacy schema select");
  }

  const legacyResult = await queryActiveDeals(supabase, legacyDealSelect, {
    requireApprovedProduct: false,
  });

  if (legacyResult.error || !legacyResult.data || legacyResult.data.length === 0) {
    if (legacyResult.error) {
      logDataQueryFallback("[deals] fetchActiveDeals legacy", legacyResult.error.message);
    }
    logMockFallback("fetchActiveDeals: query error or empty result");
    return mockDealsOrEmpty();
  }

  markcellohDataSource("supabase");
  return mapDealRows(legacyResult.data as unknown as DealWithProductRow[]);
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

  const fullResult = await queryDealBySlug(supabase, dealSelect, slug, {
    requireApprovedProduct: true,
  });

  if (!fullResult.error && fullResult.data) {
    markcellohDataSource("supabase");
    return mapDealRow(fullResult.data as unknown as DealWithProductRow);
  }

  if (fullResult.error && !isMissingColumnError(fullResult.error.message)) {
    logDataQueryFallback("[deals] fetchDealBySlug", fullResult.error.message);
    logMockFallback("fetchDealBySlug: query error or not found");
    return shouldUseMockData() ? getMockDealById(slug) : undefined;
  }

  const legacyResult = await queryDealBySlug(supabase, legacyDealSelect, slug, {
    requireApprovedProduct: false,
  });

  if (legacyResult.error || !legacyResult.data) {
    if (legacyResult.error) {
      logDataQueryFallback("[deals] fetchDealBySlug legacy", legacyResult.error.message);
    }
    logMockFallback("fetchDealBySlug: query error or not found");
    return shouldUseMockData() ? getMockDealById(slug) : undefined;
  }

  markcellohDataSource("supabase");
  return mapDealRow(legacyResult.data as unknown as DealWithProductRow);
});

const fetchDealUuidBySlug = cache(async (slug: string): Promise<string | undefined> => {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return undefined;
  }

  const numericId = Number(slug);
  const isNumeric = Number.isInteger(numericId) && numericId > 0;

  const fullQuery = supabase
    .from("group_buy_deals")
    .select("id, products!inner(slug, legacy_id, is_active, approval_status)")
    .eq("status", "active")
    .eq("products.is_active", true)
    .eq("products.approval_status", PUBLIC_PRODUCT_APPROVAL_STATUS);

  const scopedFullQuery = isNumeric
    ? fullQuery.eq("products.legacy_id", numericId)
    : fullQuery.eq("products.slug", slug);

  const fullResult = await scopedFullQuery.maybeSingle();

  if (!fullResult.error && fullResult.data) {
    return (fullResult.data as { id: string }).id;
  }

  if (fullResult.error && !isMissingColumnError(fullResult.error.message)) {
    return undefined;
  }

  const legacyQuery = supabase
    .from("group_buy_deals")
    .select("id, products!inner(slug, legacy_id, is_active)")
    .eq("status", "active")
    .eq("products.is_active", true);

  const scopedLegacyQuery = isNumeric
    ? legacyQuery.eq("products.legacy_id", numericId)
    : legacyQuery.eq("products.slug", slug);

  const legacyResult = await scopedLegacyQuery.maybeSingle();

  if (legacyResult.error || !legacyResult.data) {
    return undefined;
  }

  return (legacyResult.data as { id: string }).id;
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
    logDataQueryFallback("[deals] getPriceTiersByDealId", error.message);
    return [];
  }

  if (!data || data.length === 0) {
    if (shouldUseMockData()) {
      const deal = getMockDealById(dealId);
      return deal ? getMockPriceTiersByDealSlug(dealId, deal) : [];
    }
    return [];
  }

  markcellohDataSource("supabase");
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
    logDataQueryFallback("[deals] fetchSavedDealSlugs", error?.message);
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
