import { resolveUserIdByReferralCode } from "@/lib/share/referral-code";
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

export async function logReferralVisit(input: {
  referralCode: string;
  productSlug: string;
  visitorUserId?: string | null;
  ipHash?: string | null;
  userAgent?: string | null;
}): Promise<{ success: boolean }> {
  const referralCode = input.referralCode.trim().toUpperCase();
  if (!referralCode) {
    return { success: false };
  }

  const referrerUserId = await resolveUserIdByReferralCode(referralCode);
  if (!referrerUserId) {
    return { success: false };
  }

  if (input.visitorUserId && input.visitorUserId === referrerUserId) {
    return { success: false };
  }

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

  const { error } = await supabase.from("referral_visits").insert({
    referral_code: referralCode,
    product_id: productId,
    deal_id: dealId ?? null,
    visitor_user_id: input.visitorUserId ?? null,
    ip_hash: input.ipHash ?? null,
    user_agent: input.userAgent?.slice(0, 512) ?? null,
  });

  if (error) {
    console.error("[share] logReferralVisit:", error.message);
    return { success: false };
  }

  return { success: true };
}
