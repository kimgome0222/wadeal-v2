import { cache } from "react";

import type { CategorySlug } from "@/lib/categories";
import type { Deal, DealSectionCategory } from "@/lib/deals";
import {
  getDealById as getMockDealById,
  getDealsByCategorySlug as getMockDealsByCategorySlug,
  getDealsBySection as getMockDealsBySection,
  getSavedDeals as getMockSavedDeals,
} from "@/lib/deals";
import { mapDealRow, mapDealRows, mapPriceTierRow } from "@/lib/data/adapter";
import { markWadealDataSource } from "@/lib/data/source";
import type { DealWithProductRow } from "@/lib/types";
import type { PriceTier } from "@/lib/types";
import { PROTOTYPE_USER_ID } from "@/lib/database/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const dealSelect = `
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
    category_tags,
    image_url,
    original_price,
    description,
    is_active,
    created_at
  )
`;

const fetchActiveDeals = cache(async (): Promise<Deal[]> => {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("group_buy_deals")
    .select(dealSelect)
    .eq("status", "active")
    .order("created_at", { ascending: true });

  if (error || !data) {
    console.error("[deals] fetchActiveDeals:", error?.message);
    return [];
  }

  markWadealDataSource("supabase");
  return mapDealRows(data as DealWithProductRow[]);
});

async function fetchDealBySlug(slug: string): Promise<Deal | undefined> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return undefined;
  }

  const numericId = Number(slug);
  const isNumeric = Number.isInteger(numericId) && numericId > 0;

  const { data, error } = await supabase
    .from("group_buy_deals")
    .select(dealSelect)
    .eq("status", "active")
    .eq(isNumeric ? "products.legacy_id" : "products.slug", isNumeric ? numericId : slug)
    .maybeSingle();

  if (error || !data) {
    console.error("[deals] fetchDealBySlug:", error?.message);
    return undefined;
  }

  markWadealDataSource("supabase");
  return mapDealRow(data as DealWithProductRow);
}

async function fetchDealUuidBySlug(slug: string): Promise<string | undefined> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return undefined;
  }

  const numericId = Number(slug);
  const isNumeric = Number.isInteger(numericId) && numericId > 0;

  let query = supabase
    .from("group_buy_deals")
    .select("id, products!inner(slug, legacy_id)")
    .eq("status", "active");

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
}

function getMockPriceTiers(dealId: string): PriceTier[] {
  const deal = getMockDealById(dealId);
  if (!deal) {
    return [];
  }

  return [
    {
      id: "mock-tier-1",
      order: 1,
      requiredParticipants: 1,
      price: deal.originalPrice,
    },
    {
      id: "mock-tier-2",
      order: 2,
      requiredParticipants: deal.targetParticipants - 1,
      price: deal.groupPrice,
    },
    {
      id: "mock-tier-3",
      order: 3,
      requiredParticipants: deal.targetParticipants,
      price: deal.lowestPrice,
    },
  ];
}

export async function getFeaturedDeals(): Promise<Deal[]> {
  if (!isSupabaseConfigured()) {
    markWadealDataSource("mock");
    return getMockDealsBySection("main");
  }

  const deals = await fetchActiveDeals();
  if (deals.length === 0) {
    markWadealDataSource("mock");
    return getMockDealsBySection("main");
  }

  return deals.filter((deal) => deal.section === "main");
}

export async function getDealsBySection(
  section: DealSectionCategory,
): Promise<Deal[]> {
  if (!isSupabaseConfigured()) {
    markWadealDataSource("mock");
    return getMockDealsBySection(section);
  }

  const deals = await fetchActiveDeals();
  if (deals.length === 0) {
    markWadealDataSource("mock");
    return getMockDealsBySection(section);
  }

  return deals.filter((deal) => deal.section === section);
}

export async function getDealsByCategory(
  category: CategorySlug,
): Promise<Deal[]> {
  if (!isSupabaseConfigured()) {
    markWadealDataSource("mock");
    return getMockDealsByCategorySlug(category);
  }

  const deals = await fetchActiveDeals();
  if (deals.length === 0) {
    markWadealDataSource("mock");
    return getMockDealsByCategorySlug(category);
  }

  if (category === "all") {
    return deals;
  }

  return deals.filter((deal) => deal.categoryTags.includes(category));
}

export async function getDealById(id: string): Promise<Deal | undefined> {
  if (!isSupabaseConfigured()) {
    markWadealDataSource("mock");
    return getMockDealById(id);
  }

  const deal = await fetchDealBySlug(id);
  if (deal) {
    return deal;
  }

  markWadealDataSource("mock");
  return getMockDealById(id);
}

export async function getPriceTiersByDealId(
  dealId: string,
): Promise<PriceTier[]> {
  if (!isSupabaseConfigured()) {
    markWadealDataSource("mock");
    return getMockPriceTiers(dealId);
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    markWadealDataSource("mock");
    return getMockPriceTiers(dealId);
  }

  const dealUuid = await fetchDealUuidBySlug(dealId);
  if (!dealUuid) {
    markWadealDataSource("mock");
    return getMockPriceTiers(dealId);
  }

  const { data, error } = await supabase
    .from("price_tiers")
    .select("*")
    .eq("deal_id", dealUuid)
    .order("tier_order", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) {
      console.error("[deals] getPriceTiersByDealId:", error.message);
    }
    markWadealDataSource("mock");
    return getMockPriceTiers(dealId);
  }

  markWadealDataSource("supabase");
  return data.map(mapPriceTierRow);
}

async function fetchSavedDealSlugs(): Promise<string[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("saved_deals")
    .select("products!inner(slug)")
    .eq("user_id", PROTOTYPE_USER_ID);

  if (error || !data) {
    console.error("[deals] fetchSavedDealSlugs:", error?.message);
    return [];
  }

  return (data as Array<{ products: { slug: string } }>)
    .map((row) => row.products.slug)
    .filter(Boolean);
}

export async function getSavedDeals(): Promise<Deal[]> {
  if (!isSupabaseConfigured()) {
    markWadealDataSource("mock");
    return getMockSavedDeals();
  }

  const [deals, savedSlugs] = await Promise.all([
    fetchActiveDeals(),
    fetchSavedDealSlugs(),
  ]);

  if (deals.length === 0) {
    markWadealDataSource("mock");
    return getMockSavedDeals();
  }

  const slugSet =
    savedSlugs.length > 0 ?
      new Set(savedSlugs)
    : new Set(getMockSavedDeals().map((deal) => deal.slug));

  const savedDeals = deals
    .filter((deal) => slugSet.has(deal.slug))
    .map((deal) => ({ ...deal, saved: true }));

  if (savedDeals.length > 0) {
    return savedDeals;
  }

  markWadealDataSource("mock");
  return getMockSavedDeals();
}

export async function getDealUuidById(id: string): Promise<string | undefined> {
  if (!isSupabaseConfigured()) {
    return undefined;
  }

  return fetchDealUuidBySlug(id);
}
