import type { UserCouponUsage } from "@/lib/profile/types";
import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getUserCouponUsages(userId: string): Promise<UserCouponUsage[]> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      return [
        {
          id: "mock-coupon-usage-1",
          couponCode: "WELCOME10",
          couponName: "신규 가입 10% 할인",
          discountAmount: 3000,
          usedAt: new Date().toISOString(),
        },
      ];
    }
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase.rpc("get_user_coupon_usages", {
    p_user_id: userId,
  });

  if (error) {
    console.error("[data] getUserCouponUsages:", error.message);
    return [];
  }

  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: String(row.id),
    couponCode: String(row.coupon_code),
    couponName: String(row.coupon_name),
    discountAmount: Number(row.discount_amount),
    usedAt: String(row.used_at),
  }));
}
