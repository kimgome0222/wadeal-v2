import { formatKoreanMobile, normalizePhone, validateKoreanMobile } from "@/lib/identity/phone";
import {
  getVerificationStatus,
  type VerificationStatus,
} from "@/lib/identity/verification-status";
import type { UserIdentityProfile } from "@/lib/identity/types";
import {
  validateOrdererInfo,
  type OrdererValidationResult,
} from "@/lib/identity/orderer-validation";
import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/** Safe columns only — never select ci_hash / di_hash for client-facing reads. */
export const USER_IDENTITY_SELECT =
  "id, real_name, phone, birth_date, phone_verified_at";

export type UserIdentityRecord = {
  id: string;
  real_name: string | null;
  phone: string | null;
  birth_date: string | null;
  phone_verified_at: string | null;
};

const mockUserProfiles = new Map<string, UserIdentityRecord>();

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[users] using mock fallback: ${context}`);
  }
}

function getMockProfile(userId: string): UserIdentityRecord {
  const existing = mockUserProfiles.get(userId);
  if (existing) {
    return existing;
  }

  const profile: UserIdentityRecord = {
    id: userId,
    real_name: null,
    phone: null,
    birth_date: null,
    phone_verified_at: null,
  };
  mockUserProfiles.set(userId, profile);
  return profile;
}

export function mapUserIdentityProfile(
  row: UserIdentityRecord,
  ciHash?: string | null,
): UserIdentityProfile {
  const verificationStatus: VerificationStatus = getVerificationStatus({
    phoneVerifiedAt: row.phone_verified_at,
    ciHash,
  });

  return {
    userId: row.id,
    realName: row.real_name,
    phone: row.phone ? formatKoreanMobile(row.phone) : null,
    birthDate: row.birth_date,
    phoneVerifiedAt: row.phone_verified_at,
    verificationStatus,
  };
}

export async function getUserIdentityProfile(
  userId: string,
): Promise<UserIdentityProfile | null> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      logMockFallback("getUserIdentityProfile");
      return mapUserIdentityProfile(getMockProfile(userId));
    }
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    if (shouldUseMockData()) {
      return mapUserIdentityProfile(getMockProfile(userId));
    }
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select(USER_IDENTITY_SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("[data] getUserIdentityProfile:", error.message);
    if (shouldUseMockData()) {
      return mapUserIdentityProfile(getMockProfile(userId));
    }
    return null;
  }

  if (!data) {
    if (shouldUseMockData()) {
      return mapUserIdentityProfile(getMockProfile(userId));
    }
    return null;
  }

  return mapUserIdentityProfile(data as UserIdentityRecord);
}

export async function updateUserIdentityProfile(
  userId: string,
  input: { realName: string; phone: string },
): Promise<{ success: boolean; error?: "invalid_name" | "invalid_phone" | "save_failed" }> {
  const realName = input.realName.trim();
  const phone = normalizePhone(input.phone);

  if (!realName) {
    return { success: false, error: "invalid_name" };
  }

  if (!validateKoreanMobile(phone)) {
    return { success: false, error: "invalid_phone" };
  }

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      const profile = getMockProfile(userId);
      profile.real_name = realName;
      profile.phone = phone;
      mockUserProfiles.set(userId, profile);
      return { success: true };
    }
    return { success: false, error: "save_failed" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { error } = await supabase
    .from("users")
    .update({
      real_name: realName,
      phone,
      phone_verified_at: null,
    })
    .eq("id", userId);

  if (error) {
    console.error("[data] updateUserIdentityProfile:", error.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true };
}

export async function updateUserPhoneWithVerification(
  userId: string,
  phone: string,
): Promise<{ success: boolean; error?: "invalid_phone" | "save_failed" }> {
  const normalized = normalizePhone(phone);

  if (!validateKoreanMobile(normalized)) {
    return { success: false, error: "invalid_phone" };
  }

  const verifiedAt = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      const profile = getMockProfile(userId);
      profile.phone = normalized;
      profile.phone_verified_at = verifiedAt;
      mockUserProfiles.set(userId, profile);
      return { success: true };
    }
    return { success: false, error: "save_failed" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { error } = await supabase
    .from("users")
    .update({
      phone: normalized,
      phone_verified_at: verifiedAt,
    })
    .eq("id", userId);

  if (error) {
    console.error("[data] updateUserPhoneWithVerification:", error.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true };
}

export async function markUserPhoneVerified(userId: string): Promise<{ success: boolean }> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      const profile = getMockProfile(userId);
      profile.phone_verified_at = new Date().toISOString();
      mockUserProfiles.set(userId, profile);
      return { success: true };
    }
    return { success: false };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false };
  }

  const { error } = await supabase.rpc("mark_phone_verified_for_user");

  if (error) {
    console.error("[data] markUserPhoneVerified:", error.message);
    return { success: false };
  }

  return { success: true };
}

export async function validateOrdererInfoForUser(
  userId: string,
  options: { hasAddress: boolean },
): Promise<OrdererValidationResult> {
  const profile = await getUserIdentityProfile(userId);

  return validateOrdererInfo({
    realName: profile?.realName ?? null,
    phone: profile?.phone ?? null,
    phoneVerifiedAt: profile?.phoneVerifiedAt ?? null,
    hasDefaultAddress: options.hasAddress,
  });
}

