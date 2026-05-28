import { shouldUseMockData } from "@/lib/env/runtime";
import {
  hasRequiredConsentFields,
  type SaveUserConsentsInput,
  type UserConsentRecord,
} from "@/lib/consents/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const MOCK_CONSENTS = new Map<string, UserConsentRecord>();

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[user-consents] using mock fallback: ${context}`);
  }
}

function mapConsentRow(row: Record<string, unknown>): UserConsentRecord {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    termsAgreedAt: row.terms_agreed_at ? String(row.terms_agreed_at) : null,
    privacyAgreedAt: row.privacy_agreed_at ? String(row.privacy_agreed_at) : null,
    groupbuyAgreedAt: row.groupbuy_agreed_at ? String(row.groupbuy_agreed_at) : null,
    marketingAgreedAt: row.marketing_agreed_at ? String(row.marketing_agreed_at) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function buildMockRecord(userId: string, input: SaveUserConsentsInput): UserConsentRecord {
  const now = new Date().toISOString();
  const existing = MOCK_CONSENTS.get(userId);
  const termsAgreedAt = input.terms ? now : existing?.termsAgreedAt ?? null;
  const privacyAgreedAt = input.privacy ? now : existing?.privacyAgreedAt ?? null;
  const groupbuyAgreedAt = input.groupbuy ? now : existing?.groupbuyAgreedAt ?? null;
  const marketingAgreedAt =
    input.marketing ? now
    : input.marketing === false ? null
    : existing?.marketingAgreedAt ?? null;

  const record: UserConsentRecord = {
    id: existing?.id ?? `mock-consent-${userId}`,
    userId,
    termsAgreedAt,
    privacyAgreedAt,
    groupbuyAgreedAt,
    marketingAgreedAt,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  MOCK_CONSENTS.set(userId, record);
  return record;
}

export async function getUserConsents(userId: string): Promise<UserConsentRecord | null> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      logMockFallback("getUserConsents: Supabase is not configured");
      return MOCK_CONSENTS.get(userId) ?? null;
    }
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    logMockFallback("getUserConsents: failed to create Supabase client");
    return MOCK_CONSENTS.get(userId) ?? null;
  }

  const { data, error } = await supabase
    .from("user_consents")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[data] getUserConsents:", error.message);
    return MOCK_CONSENTS.get(userId) ?? null;
  }

  if (!data) {
    return null;
  }

  return mapConsentRow(data as Record<string, unknown>);
}

export async function saveUserConsents(
  userId: string,
  input: SaveUserConsentsInput,
): Promise<{ success: boolean; record?: UserConsentRecord }> {
  if (!input.terms || !input.privacy || !input.groupbuy) {
    return { success: false };
  }

  const now = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      const record = buildMockRecord(userId, input);
      return { success: true, record };
    }
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    if (shouldUseMockData()) {
      const record = buildMockRecord(userId, input);
      return { success: true, record };
    }
    return { success: false };
  }

  const existing = await getUserConsents(userId);

  const payload = {
    user_id: userId,
    terms_agreed_at: input.terms ? now : existing?.termsAgreedAt ?? null,
    privacy_agreed_at: input.privacy ? now : existing?.privacyAgreedAt ?? null,
    groupbuy_agreed_at: input.groupbuy ? now : existing?.groupbuyAgreedAt ?? null,
    marketing_agreed_at:
      input.marketing ? now
      : input.marketing === false ? null
      : existing?.marketingAgreedAt ?? null,
  };

  const { data, error } =
    existing ?
      await supabase
        .from("user_consents")
        .update(payload)
        .eq("user_id", userId)
        .select("*")
        .single()
    : await supabase.from("user_consents").insert(payload).select("*").single();

  if (error) {
    console.error("[data] saveUserConsents:", error.message);
    if (shouldUseMockData()) {
      const record = buildMockRecord(userId, input);
      return { success: true, record };
    }
    return { success: false };
  }

  return {
    success: true,
    record: mapConsentRow(data as Record<string, unknown>),
  };
}

export async function hasRequiredConsents(userId: string): Promise<boolean> {
  const record = await getUserConsents(userId);
  return hasRequiredConsentFields(record);
}
