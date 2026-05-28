import type { CategorySlug } from "@/lib/categories";
import type { Deal, DealSectionCategory } from "@/lib/deals";
import type {
  CreateParticipationInput,
} from "@/lib/database/types";
import { shouldUseMockData } from "@/lib/env/runtime";
import {
  buildMypagePaginatedResult,
  paginateArray,
  resolveMypagePagination,
  type MypagePaginatedResult,
  type MypagePaginationOptions,
} from "@/lib/pagination/mypage";
import {
  getDealById,
  getDealUuidById,
  getDealsByCategory,
  getDealsBySection,
  getAllActiveDeals,
  getFeaturedDeals,
  getPriceTiersByDealId,
  getSavedDeals,
} from "@/lib/services/deals";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export {
  getAllActiveDeals,
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
  if (!input.userId) {
    return { success: false };
  }

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      return { success: true, id: "mock-participation" };
    }
    return { success: false };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false };
  }

  const dealUuid = await getDealUuidById(input.dealId);
  if (!dealUuid) {
    return { success: false };
  }

  const userId = input.userId;

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

export async function getParticipatingDealSlugs(userId: string): Promise<string[]>;
export async function getParticipatingDealSlugs(
  userId: string,
  options: MypagePaginationOptions,
): Promise<MypagePaginatedResult<string>>;
export async function getParticipatingDealSlugs(
  userId: string,
  options?: MypagePaginationOptions,
): Promise<string[] | MypagePaginatedResult<string>> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      const slugs = ["wd-jeju-citrus-5kg", "wd-premium-skincare"];
      if (options) {
        return paginateArray(slugs, options);
      }
      return slugs;
    }
    return options ? buildMypagePaginatedResult([], 0, 1, 10) : [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return options ? buildMypagePaginatedResult([], 0, 1, 10) : [];
  }

  let query = supabase
    .from("group_buy_participants")
    .select("group_buy_deals!inner(products!inner(slug))", options ? { count: "exact" } : undefined)
    .eq("status", "active")
    .eq("user_id", userId)
    .order("joined_at", { ascending: false });

  if (options) {
    const { pageSize, offset } = resolveMypagePagination(options);
    query = query.range(offset, offset + pageSize - 1);
  } else {
    query = query.limit(20);
  }

  const { data, error, count } = await query;

  if (error || !data) {
    return options ? buildMypagePaginatedResult([], 0, 1, 10) : [];
  }

  const slugs = (data as unknown as Array<{
    group_buy_deals: { products: { slug: string } };
  }>)
    .map((row) => row.group_buy_deals.products.slug)
    .filter(Boolean);

  if (options) {
    const { page, pageSize } = resolveMypagePagination(options);
    return buildMypagePaginatedResult(slugs, count ?? slugs.length, page, pageSize);
  }

  return slugs;
}

export type { Deal, DealSectionCategory };
