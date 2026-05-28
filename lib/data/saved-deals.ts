import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PUBLIC_PRODUCT_APPROVAL_STATUS } from "@/lib/products/public-visibility";

export async function getSavedDealSlugsForUser(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("saved_deals")
    .select("products!inner(slug)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[data] getSavedDealSlugsForUser:", error.message);
    return [];
  }

  return (data as unknown as Array<{ products: { slug: string } }>)
    .map((row) => row.products.slug)
    .filter(Boolean);
}

export async function isDealSavedByUser(
  userId: string,
  dealSlug: string,
): Promise<boolean> {
  const slugs = await getSavedDealSlugsForUser(userId);
  return slugs.includes(dealSlug);
}

export async function toggleSavedDealForUser(
  userId: string,
  dealSlug: string,
): Promise<{ success: boolean; saved: boolean }> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      return { success: true, saved: true };
    }
    return { success: false, saved: false };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, saved: false };
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id")
    .eq("slug", dealSlug)
    .eq("is_active", true)
    .eq("approval_status", PUBLIC_PRODUCT_APPROVAL_STATUS)
    .maybeSingle();

  if (productError || !product) {
    console.error("[data] toggleSavedDealForUser product:", productError?.message);
    return { success: false, saved: false };
  }

  const productId = (product as { id: string }).id;

  const { data: existing, error: existingError } = await supabase
    .from("saved_deals")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (existingError) {
    console.error("[data] toggleSavedDealForUser check:", existingError.message);
    return { success: false, saved: false };
  }

  if (existing) {
    const { error: deleteError } = await supabase
      .from("saved_deals")
      .delete()
      .eq("id", (existing as { id: string }).id);

    if (deleteError) {
      console.error("[data] toggleSavedDealForUser delete:", deleteError.message);
      return { success: false, saved: true };
    }

    return { success: true, saved: false };
  }

  const { error: insertError } = await supabase.from("saved_deals").insert({
    user_id: userId,
    product_id: productId,
  });

  if (insertError) {
    console.error("[data] toggleSavedDealForUser insert:", insertError.message);
    return { success: false, saved: false };
  }

  return { success: true, saved: true };
}
