import type { CategorySlug } from "@/lib/categories";
import type { Deal, DealSectionCategory } from "@/lib/deals";
import {
  getDealById as getMockDealById,
  getDealsByCategorySlug as getMockDealsByCategorySlug,
  getDealsBySection as getMockDealsBySection,
  getSavedDeals as getMockSavedDeals,
} from "@/lib/deals";
import { mapDealRow, mapDealRows, mapPriceTierRow } from "@/lib/data/adapter";
import type {
  CreateParticipationInput,
  CreatePriceAlertInput,
  DealWithProductRow,
  PriceTier,
} from "@/lib/database/types";
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

async function fetchActiveDeals(): Promise<Deal[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("group_buy_deals")
    .select(dealSelect)
    .eq("status", "active")
    .order("created_at", { ascending: true });

  if (error || !data) {
    console.error("[data] fetchActiveDeals:", error?.message);
    return [];
  }

  return mapDealRows(data as DealWithProductRow[]);
}

async function fetchDealByIdentifier(id: string): Promise<Deal | undefined> {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return undefined;
  }

  const numericId = Number(id);
  const isNumeric = Number.isInteger(numericId) && numericId > 0;

  const query = supabase
    .from("group_buy_deals")
    .select(dealSelect)
    .eq("status", "active")
    .eq(isNumeric ? "products.legacy_id" : "products.slug", isNumeric ? numericId : id);

  const { data, error } = await query.maybeSingle();

  if (error || !data) {
    console.error("[data] fetchDealByIdentifier:", error?.message);
    return undefined;
  }

  return mapDealRow(data as DealWithProductRow);
}

async function fetchDealUuidByIdentifier(id: string): Promise<string | undefined> {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return undefined;
  }

  const numericId = Number(id);
  const isNumeric = Number.isInteger(numericId) && numericId > 0;

  let query = supabase
    .from("group_buy_deals")
    .select("id, products!inner(slug, legacy_id)")
    .eq("status", "active");

  if (isNumeric) {
    query = query.eq("products.legacy_id", numericId);
  } else {
    query = query.eq("products.slug", id);
  }

  const { data, error } = await query.maybeSingle();

  if (error || !data) {
    return undefined;
  }

  return (data as { id: string }).id;
}

export async function getFeaturedDeals(): Promise<Deal[]> {
  if (!isSupabaseConfigured()) {
    return getMockDealsBySection("main");
  }

  const deals = await fetchActiveDeals();
  if (deals.length === 0) {
    return getMockDealsBySection("main");
  }

  return deals.filter((deal) => deal.section === "main");
}

export async function getDealsBySection(
  section: DealSectionCategory,
): Promise<Deal[]> {
  if (!isSupabaseConfigured()) {
    return getMockDealsBySection(section);
  }

  const deals = await fetchActiveDeals();
  if (deals.length === 0) {
    return getMockDealsBySection(section);
  }

  return deals.filter((deal) => deal.section === section);
}

export async function getProductsByCategory(
  slug: CategorySlug,
): Promise<Deal[]> {
  if (!isSupabaseConfigured()) {
    return getMockDealsByCategorySlug(slug);
  }

  const deals = await fetchActiveDeals();
  if (deals.length === 0) {
    return getMockDealsByCategorySlug(slug);
  }

  if (slug === "all") {
    return deals;
  }

  return deals.filter((deal) => deal.categoryTags.includes(slug));
}

export async function getProductDetailById(
  id: string,
): Promise<Deal | undefined> {
  if (!isSupabaseConfigured()) {
    return getMockDealById(id);
  }

  const deal = await fetchDealByIdentifier(id);
  return deal ?? getMockDealById(id);
}

export async function getSavedDeals(): Promise<Deal[]> {
  if (!isSupabaseConfigured()) {
    return getMockSavedDeals();
  }

  const deals = await fetchActiveDeals();
  if (deals.length === 0) {
    return getMockSavedDeals();
  }

  const mockSavedSlugs = new Set(getMockSavedDeals().map((deal) => deal.slug));
  const savedDeals = deals.filter((deal) => mockSavedSlugs.has(deal.slug));

  return savedDeals.length > 0 ? savedDeals : getMockSavedDeals();
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

export async function getPriceTiersByDeal(
  dealId: string,
): Promise<PriceTier[]> {
  if (!isSupabaseConfigured()) {
    return getMockPriceTiers(dealId);
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return getMockPriceTiers(dealId);
  }

  const dealUuid = await fetchDealUuidByIdentifier(dealId);
  if (!dealUuid) {
    return getMockPriceTiers(dealId);
  }

  const { data, error } = await supabase
    .from("price_tiers")
    .select("*")
    .eq("deal_id", dealUuid)
    .order("tier_order", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) {
      console.error("[data] getPriceTiersByDeal:", error.message);
    }
    return getMockPriceTiers(dealId);
  }

  return data.map(mapPriceTierRow);
}

export async function createPriceAlert(
  input: CreatePriceAlertInput,
): Promise<{ success: boolean; id?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true, id: "mock-alert" };
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return { success: true, id: "mock-alert" };
  }

  const dealUuid = await fetchDealUuidByIdentifier(input.dealId);
  if (!dealUuid) {
    return { success: true, id: "mock-alert" };
  }

  const { data, error } = await supabase
    .from("price_alerts")
    .insert({
      deal_id: dealUuid,
      user_id: input.userId ?? null,
      target_price: input.targetPrice ?? null,
      notify_at_lowest_price: input.notifyAtLowestPrice ?? false,
      notify_before_deadline: input.notifyBeforeDeadline ?? false,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[data] createPriceAlert:", error.message);
    return { success: false };
  }

  return { success: true, id: (data as { id: string }).id };
}

export async function createParticipation(
  input: CreateParticipationInput,
): Promise<{ success: boolean; id?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true, id: "mock-participation" };
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return { success: true, id: "mock-participation" };
  }

  const dealUuid = await fetchDealUuidByIdentifier(input.dealId);
  if (!dealUuid) {
    return { success: true, id: "mock-participation" };
  }

  const { data, error } = await supabase
    .from("group_buy_participants")
    .insert({
      deal_id: dealUuid,
      user_id: input.userId || PROTOTYPE_USER_ID,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[data] createParticipation:", error.message);
    return { success: false };
  }

  return { success: true, id: (data as { id: string }).id };
}

export async function getParticipatingDealSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return ["wd-vacuum-001", "wd-beef-001"];
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return ["wd-vacuum-001", "wd-beef-001"];
  }

  const { data, error } = await supabase
    .from("group_buy_participants")
    .select("group_buy_deals!inner(products!inner(slug))")
    .eq("status", "active")
    .limit(20);

  if (error || !data) {
    return ["wd-vacuum-001", "wd-beef-001"];
  }

  const slugs = (data as Array<{
    group_buy_deals: { products: { slug: string } };
  }>)
    .map((row) => row.group_buy_deals.products.slug)
    .filter(Boolean);

  return slugs.length > 0 ? slugs : ["wd-vacuum-001", "wd-beef-001"];
}
