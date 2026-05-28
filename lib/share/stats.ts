import type { ShareStats } from "@/lib/share/types";
import { getOrCreateReferralCode } from "@/lib/share/referral-code";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getShareStatsForUser(userId: string): Promise<ShareStats> {
  const empty: ShareStats = {
    shareCount: 0,
    visitCount: 0,
    conversionCount: 0,
  };

  if (!isSupabaseConfigured()) {
    return empty;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return empty;
  }

  const referralCode = await getOrCreateReferralCode(userId);
  if (!referralCode) {
    return empty;
  }

  const [shareResult, visitResult] = await Promise.all([
    supabase
      .from("share_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("referral_visits")
      .select("id", { count: "exact", head: true })
      .eq("referral_code", referralCode),
  ]);

  if (shareResult.error) {
    console.error("[share] getShareStatsForUser share:", shareResult.error.message);
  }

  if (visitResult.error) {
    console.error("[share] getShareStatsForUser visits:", visitResult.error.message);
  }

  return {
    shareCount: shareResult.count ?? 0,
    visitCount: visitResult.count ?? 0,
    conversionCount: 0,
  };
}
