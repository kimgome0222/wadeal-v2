import { getDealById } from "@/lib/data/deals";
import type { Deal } from "@/lib/deals";
import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PUBLIC_PRODUCT_APPROVAL_STATUS } from "@/lib/products/public-visibility";

const MAX_RECENT_VIEWS = 20;

async function resolveProductId(productSlug: string): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("id")
    .eq("slug", productSlug)
    .eq("is_active", true)
    .eq("approval_status", PUBLIC_PRODUCT_APPROVAL_STATUS)
    .maybeSingle();

  if (error || !data) {
    console.error("[data] resolveProductId:", error?.message);
    return null;
  }

  return (data as { id: string }).id;
}

export async function recordRecentViewForUser(
  userId: string,
  productSlug: string,
): Promise<{ success: boolean }> {
  if (!isSupabaseConfigured()) {
    return { success: shouldUseMockData() };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false };
  }

  const productId = await resolveProductId(productSlug);
  if (!productId) {
    return { success: false };
  }

  const { error } = await supabase.from("recent_views").upsert(
    {
      user_id: userId,
      product_id: productId,
      viewed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,product_id" },
  );

  if (error) {
    console.error("[data] recordRecentViewForUser:", error.message);
    return { success: false };
  }

  return { success: true };
}

export async function getRecentViewSlugsForUser(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("recent_views")
    .select("products!inner(slug), viewed_at")
    .eq("user_id", userId)
    .order("viewed_at", { ascending: false })
    .limit(MAX_RECENT_VIEWS);

  if (error) {
    console.error("[data] getRecentViewSlugsForUser:", error.message);
    return [];
  }

  return (data as unknown as Array<{ products: { slug: string } }>)
    .map((row) => row.products.slug)
    .filter(Boolean);
}

export async function getRecentViewsForUser(userId: string): Promise<Deal[]> {
  const slugs = await getRecentViewSlugsForUser(userId);
  if (slugs.length === 0) {
    return [];
  }

  const deals = await Promise.all(slugs.map((slug) => getDealById(slug)));
  return deals.filter((deal): deal is Deal => deal != null);
}
