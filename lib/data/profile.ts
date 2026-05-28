import type { User } from "@supabase/supabase-js";

import { getAuthDisplayName, getAuthProviderLabel } from "@/lib/auth/user-display";
import { formatKoreanMobile, normalizePhone, validateKoreanMobile } from "@/lib/identity/phone";
import {
  getVerificationStatus,
  type VerificationStatus,
} from "@/lib/identity/verification-status";
import type {
  AccountStatus,
  UpdateUserProfileInput,
  UserGender,
  UserProfile,
} from "@/lib/profile/types";
import {
  validateOrdererInfo,
  type OrdererValidationResult,
} from "@/lib/identity/orderer-validation";
import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/** Safe columns only — never select ci_hash / di_hash. */
export const USER_PROFILE_SELECT =
  "id, nickname, email, real_name, phone, birth_date, gender, phone_verified_at, marketing_agreed_at, account_status, withdrawal_requested_at";

type UserProfileRow = {
  id: string;
  nickname: string | null;
  email: string | null;
  real_name: string | null;
  phone: string | null;
  birth_date: string | null;
  gender: string | null;
  phone_verified_at: string | null;
  marketing_agreed_at: string | null;
  account_status: AccountStatus;
  withdrawal_requested_at: string | null;
};

const mockProfiles = new Map<string, UserProfileRow>();

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[profile] using mock fallback: ${context}`);
  }
}

function normalizeGender(value: string | null | undefined): UserGender {
  if (value === "male" || value === "female" || value === "other") {
    return value;
  }
  return null;
}

function mapProfileRow(
  row: UserProfileRow,
  authUser?: User | null,
): UserProfile {
  const verificationStatus: VerificationStatus = getVerificationStatus({
    phoneVerifiedAt: row.phone_verified_at,
  });

  return {
    userId: row.id,
    nickname: row.nickname,
    email: row.email,
    realName: row.real_name,
    phone: row.phone ? formatKoreanMobile(row.phone) : null,
    birthDate: row.birth_date,
    gender: normalizeGender(row.gender),
    phoneVerifiedAt: row.phone_verified_at,
    verificationStatus,
    marketingAgreedAt: row.marketing_agreed_at,
    accountStatus: row.account_status ?? "active",
    withdrawalRequestedAt: row.withdrawal_requested_at,
    memberGrade: "일반",
    providerLabel: authUser ? getAuthProviderLabel(authUser) : null,
  };
}

function getMockProfileRow(userId: string, authUser?: User | null): UserProfileRow {
  const existing = mockProfiles.get(userId);
  if (existing) {
    return existing;
  }

  const profile: UserProfileRow = {
    id: userId,
    nickname: authUser ? getAuthDisplayName(authUser) : "회원",
    email: authUser?.email ?? null,
    real_name: null,
    phone: null,
    birth_date: null,
    gender: null,
    phone_verified_at: null,
    marketing_agreed_at: null,
    account_status: "active",
    withdrawal_requested_at: null,
  };
  mockProfiles.set(userId, profile);
  return profile;
}

export async function getUserProfile(
  userId: string,
  authUser?: User | null,
): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      logMockFallback("getUserProfile");
      return mapProfileRow(getMockProfileRow(userId, authUser), authUser);
    }
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    if (shouldUseMockData()) {
      return mapProfileRow(getMockProfileRow(userId, authUser), authUser);
    }
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select(USER_PROFILE_SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("[data] getUserProfile:", error.message);
    if (shouldUseMockData()) {
      return mapProfileRow(getMockProfileRow(userId, authUser), authUser);
    }
    return null;
  }

  if (!data) {
    if (shouldUseMockData()) {
      return mapProfileRow(getMockProfileRow(userId, authUser), authUser);
    }
    return null;
  }

  return mapProfileRow(data as UserProfileRow, authUser);
}

export async function updateUserProfile(
  userId: string,
  input: UpdateUserProfileInput,
): Promise<{
  success: boolean;
  error?: "invalid_name" | "invalid_phone" | "invalid_nickname" | "save_failed" | "withdrawal_pending";
}> {
  const realName = input.realName.trim();
  const phone = normalizePhone(input.phone);
  const nickname = input.nickname?.trim() ?? null;

  if (!realName) {
    return { success: false, error: "invalid_name" };
  }

  if (!validateKoreanMobile(phone)) {
    return { success: false, error: "invalid_phone" };
  }

  if (nickname !== null && nickname.length > 0 && nickname.length < 2) {
    return { success: false, error: "invalid_nickname" };
  }

  const birthDate =
    input.birthDate === undefined || input.birthDate === "" ? null : input.birthDate;
  const gender = input.gender ?? null;
  const now = new Date().toISOString();
  const marketingAgreedAt =
    input.marketing === undefined ? undefined
    : input.marketing ? now
    : null;

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      const profile = getMockProfileRow(userId);
      profile.real_name = realName;
      profile.phone = phone;
      profile.nickname = nickname ?? profile.nickname;
      profile.birth_date = birthDate;
      profile.gender = gender;
      profile.phone_verified_at = null;
      if (marketingAgreedAt !== undefined) {
        profile.marketing_agreed_at = marketingAgreedAt;
      }
      mockProfiles.set(userId, profile);
      return { success: true };
    }
    return { success: false, error: "save_failed" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { data: existing, error: existingError } = await supabase
    .from("users")
    .select("account_status")
    .eq("id", userId)
    .maybeSingle();

  if (existingError) {
    console.error("[data] updateUserProfile status check:", existingError.message);
    return { success: false, error: "save_failed" };
  }

  const accountStatus = (existing as { account_status?: AccountStatus } | null)?.account_status;
  if (accountStatus === "withdrawal_requested" || accountStatus === "withdrawn") {
    return { success: false, error: "withdrawal_pending" };
  }

  const { error } = await supabase
    .from("users")
    .update({
      real_name: realName,
      phone,
      phone_verified_at: null,
      ...(nickname !== null ? { nickname } : {}),
      ...(birthDate !== undefined ? { birth_date: birthDate } : {}),
      ...(gender !== undefined ? { gender } : {}),
      ...(marketingAgreedAt !== undefined ? { marketing_agreed_at: marketingAgreedAt } : {}),
    })
    .eq("id", userId);

  if (error) {
    console.error("[data] updateUserProfile:", error.message);
    return { success: false, error: "save_failed" };
  }

  if (input.marketing !== undefined) {
    const consentPayload = {
      user_id: userId,
      marketing_agreed_at: marketingAgreedAt,
    };

    const { data: consent } = await supabase
      .from("user_consents")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (consent) {
      await supabase.from("user_consents").update(consentPayload).eq("user_id", userId);
    }
  }

  return { success: true };
}

export async function requestAccountWithdrawal(
  userId: string,
): Promise<{ success: boolean; error?: "login_required" | "not_allowed" | "save_failed" }> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      const profile = getMockProfileRow(userId);
      if (profile.account_status !== "active") {
        return { success: false, error: "not_allowed" };
      }
      profile.account_status = "withdrawal_requested";
      profile.withdrawal_requested_at = new Date().toISOString();
      mockProfiles.set(userId, profile);
      return { success: true };
    }
    return { success: false, error: "save_failed" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { error } = await supabase.rpc("request_account_withdrawal");

  if (error) {
    if (error.message.includes("withdrawal_not_allowed")) {
      return { success: false, error: "not_allowed" };
    }
    console.error("[data] requestAccountWithdrawal:", error.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true };
}

export async function validateOrdererInfoForUser(
  userId: string,
  options: { hasAddress: boolean },
  authUser?: User | null,
): Promise<OrdererValidationResult> {
  const profile = await getUserProfile(userId, authUser);
  return validateOrdererInfo({
    realName: profile?.realName,
    phone: profile?.phone,
    phoneVerifiedAt: profile?.phoneVerifiedAt,
    hasDefaultAddress: options.hasAddress,
  });
}
