import type { CategorySlug } from "@/lib/categories";
import type { Deal, DealSectionCategory } from "@/lib/deals";
import type {
  CreateParticipationInput,
} from "@/lib/database/types";
import { PROTOTYPE_USER_ID } from "@/lib/database/types";
import {
  getDealById,
  getDealUuidById,
  getDealsByCategory,
  getDealsBySection,
  getFeaturedDeals,
  getPriceTiersByDealId,
  getSavedDeals,
} from "@/lib/services/deals";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export {
  getDealById,
  getDealsByCategory,
  getDealsBySection,
  getFeaturedDeals,
  getPriceTiersByDealId,
  getSavedDeals,
};

/** @deprecated Use getDealById */
export async function getProductDetailById(id: string) {
  return getDealById(id);
}

/** @deprecated Use getDealsByCategory */
export async function getProductsByCategory(slug: CategorySlug) {
  return getDealsByCategory(slug);
}

/** @deprecated Use getPriceTiersByDealId */
export async function getPriceTiersByDeal(dealId: string) {
  return getPriceTiersByDealId(dealId);
}

export async function createParticipation(
  input: CreateParticipationInput,
): Promise<{ success: boolean; id?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true, id: "mock-participation" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: true, id: "mock-participation" };
  }

  const dealUuid = await getDealUuidById(input.dealId);
  if (!dealUuid) {
    return { success: true, id: "mock-participation" };
  }

  const userId = input.userId || PROTOTYPE_USER_ID;

  const { data, error } = await supabase
    .from("group_buy_participants")
    .insert({
      deal_id: dealUuid,
      user_id: userId,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { success: true, id: "existing" };
    }
    console.error("[data] createParticipation:", error.message);
    return { success: false };
  }

  return { success: true, id: (data as { id: string }).id };
}

export async function getParticipatingDealSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return ["wd-vacuum-001", "wd-beef-001"];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return ["wd-vacuum-001", "wd-beef-001"];
  }

  const { data, error } = await supabase
    .from("group_buy_participants")
    .select("group_buy_deals!inner(products!inner(slug))")
    .eq("status", "active")
    .eq("user_id", PROTOTYPE_USER_ID)
    .order("joined_at", { ascending: false })
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

export type { Deal, DealSectionCategory };
