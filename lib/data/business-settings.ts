import { cache } from "react";

import {
  BUSINESS_SETTINGS_ID,
  EMPTY_BUSINESS_SETTINGS,
  mapBusinessSettingsRow,
  parseBusinessSettingsForm,
  toBusinessSettingsDbPayload,
  type BusinessSettings,
  type BusinessSettingsFormInput,
} from "@/lib/business-settings/shared";
import type { BusinessSettingsRow } from "@/lib/database/types";
import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { logDataQueryFallback } from "@/lib/supabase/query-fallback";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type {
  BusinessSettings,
  BusinessSettingsFormInput,
} from "@/lib/business-settings/shared";
export {
  BUSINESS_SETTINGS_ID,
  EMPTY_BUSINESS_SETTINGS,
  isBusinessSettingsConfigured,
  parseBusinessSettingsForm,
} from "@/lib/business-settings/shared";

let mockBusinessSettings: BusinessSettings = { ...EMPTY_BUSINESS_SETTINGS };

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[business-settings] using mock fallback: ${context}`);
  }
}

export const getBusinessSettings = cache(async (): Promise<BusinessSettings> => {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      logMockFallback("getBusinessSettings: Supabase is not configured");
      return mockBusinessSettings;
    }
    return EMPTY_BUSINESS_SETTINGS;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    logMockFallback("getBusinessSettings: failed to create Supabase client");
    return shouldUseMockData() ? mockBusinessSettings : EMPTY_BUSINESS_SETTINGS;
  }

  const { data, error } = await supabase
    .from("business_settings")
    .select("*")
    .eq("id", BUSINESS_SETTINGS_ID)
    .maybeSingle();

  if (error) {
    logDataQueryFallback("getBusinessSettings fallback", error.message);
    return shouldUseMockData() ? mockBusinessSettings : EMPTY_BUSINESS_SETTINGS;
  }

  if (!data) {
    return EMPTY_BUSINESS_SETTINGS;
  }

  return mapBusinessSettingsRow(data as BusinessSettingsRow);
});

export type UpdateBusinessSettingsResult = {
  success: boolean;
  settings?: BusinessSettings;
  error?: "invalid_input" | "save_failed";
};

export async function updateBusinessSettings(
  input: BusinessSettingsFormInput,
): Promise<UpdateBusinessSettingsResult> {
  const parsed = parseBusinessSettingsForm(input);
  if (!parsed.ok) {
    return { success: false, error: "invalid_input" };
  }

  const payload = toBusinessSettingsDbPayload(parsed.input);
  const now = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      logMockFallback("updateBusinessSettings: Supabase is not configured");
      mockBusinessSettings = mapBusinessSettingsRow({
        ...payload,
        created_at: mockBusinessSettings.createdAt || now,
        updated_at: now,
      });
      return { success: true, settings: mockBusinessSettings };
    }
    return { success: false, error: "save_failed" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { data, error } = await supabase
    .from("business_settings")
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    console.error("[data] updateBusinessSettings:", error.message);
    return { success: false, error: "save_failed" };
  }

  return {
    success: true,
    settings: mapBusinessSettingsRow(data as BusinessSettingsRow),
  };
}
