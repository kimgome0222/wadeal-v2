import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function generateLocalReferralCode(userId: string): string {
  const segment = userId.replace(/-/g, "").slice(0, 8).toUpperCase();
  return `WD${segment}`;
}

export async function getOrCreateReferralCode(userId: string): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    return shouldUseMockData() ? generateLocalReferralCode(userId) : null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return shouldUseMockData() ? generateLocalReferralCode(userId) : null;
  }

  const { data: existing, error: selectError } = await supabase
    .from("users")
    .select("referral_code")
    .eq("id", userId)
    .maybeSingle();

  if (selectError) {
    console.error("[share] getOrCreateReferralCode select:", selectError.message);
    return null;
  }

  const currentCode = (existing as { referral_code?: string | null } | null)?.referral_code;
  if (currentCode) {
    return currentCode;
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = generateCandidateCode();

    const { data: updated, error: updateError } = await supabase
      .from("users")
      .update({ referral_code: candidate })
      .eq("id", userId)
      .is("referral_code", null)
      .select("referral_code")
      .maybeSingle();

    if (!updateError && updated) {
      return (updated as { referral_code: string }).referral_code;
    }

    const { data: refetched } = await supabase
      .from("users")
      .select("referral_code")
      .eq("id", userId)
      .maybeSingle();

    const refetchedCode = (refetched as { referral_code?: string | null } | null)?.referral_code;
    if (refetchedCode) {
      return refetchedCode;
    }
  }

  console.error("[share] getOrCreateReferralCode: failed after retries");
  return null;
}

function generateCandidateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < 8; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}

export async function resolveUserIdByReferralCode(
  referralCode: string,
): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("referral_code", referralCode)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return (data as { id: string }).id;
}
