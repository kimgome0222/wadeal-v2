import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminViralSummary = {
  totalShareLogs: number;
  totalReferralVisits: number;
  topReferralCodes: Array<{ referralCode: string; visitCount: number }>;
  recentVisits: Array<{ referralCode: string; visitedAt: string }>;
};

const EMPTY_SUMMARY: AdminViralSummary = {
  totalShareLogs: 0,
  totalReferralVisits: 0,
  topReferralCodes: [],
  recentVisits: [],
};

export async function getAdminViralSummary(): Promise<AdminViralSummary> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      return {
        totalShareLogs: 12,
        totalReferralVisits: 34,
        topReferralCodes: [
          { referralCode: "WD1234", visitCount: 9 },
          { referralCode: "WD5678", visitCount: 6 },
        ],
        recentVisits: [
          { referralCode: "WD1234", visitedAt: new Date().toISOString() },
        ],
      };
    }
    return EMPTY_SUMMARY;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return EMPTY_SUMMARY;
  }

  const [shareResult, visitResult, topResult, recentResult] = await Promise.all([
    supabase.from("share_logs").select("id", { count: "exact", head: true }),
    supabase.from("referral_visits").select("id", { count: "exact", head: true }),
    supabase
      .from("referral_visits")
      .select("referral_code")
      .limit(500),
    supabase
      .from("referral_visits")
      .select("referral_code, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const visitCounts = new Map<string, number>();
  for (const row of (topResult.data ?? []) as Array<{ referral_code: string }>) {
    const code = row.referral_code;
    visitCounts.set(code, (visitCounts.get(code) ?? 0) + 1);
  }

  return {
    totalShareLogs: shareResult.count ?? 0,
    totalReferralVisits: visitResult.count ?? 0,
    topReferralCodes: [...visitCounts.entries()]
      .map(([referralCode, visitCount]) => ({ referralCode, visitCount }))
      .sort((a, b) => b.visitCount - a.visitCount)
      .slice(0, 8),
    recentVisits: ((recentResult.data ?? []) as Array<{
      referral_code: string;
      created_at: string;
    }>).map((row) => ({
      referralCode: row.referral_code,
      visitedAt: row.created_at,
    })),
  };
}
