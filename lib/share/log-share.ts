import type { ShareChannel } from "@/lib/share/types";
import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getDealUuidById } from "@/lib/services/deals";
import { PUBLIC_PRODUCT_APPROVAL_STATUS } from "@/lib/products/public-visibility";

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
    console.error("[share] resolveProductId:", error?.message);
    return null;
  }

  return (data as { id: string }).id;
}

export async function logShare(input: {
  productSlug: string;
  channel: ShareChannel;
  userId?: string | null;
  referralCode?: string | null;
}): Promise<{ success: boolean }> {
  if (!isSupabaseConfigured()) {
    return { success: shouldUseMockData() };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false };
  }

  const productId = await resolveProductId(input.productSlug);
  if (!productId) {
    return { success: false };
  }

  const dealId = await getDealUuidById(input.productSlug);

  const { error } = await supabase.from("share_logs").insert({
    user_id: input.userId ?? null,
    product_id: productId,
    deal_id: dealId ?? null,
    channel: input.channel,
    referral_code: input.referralCode ?? null,
  });

  if (error) {
    console.error("[share] logShare:", error.message);
    return { success: false };
  }

  return { success: true };
}
