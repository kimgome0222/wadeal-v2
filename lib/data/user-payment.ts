import { shouldUseMockData } from "@/lib/env/runtime";
import {
  DEFAULT_PAYMENT,
  type SavedPaymentData,
} from "@/lib/mock-storage";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[user-payment] using mock fallback: ${context}`);
  }
}

function extractLastFour(masked: string): string {
  const digits = masked.replace(/\D/g, "");
  return digits.slice(-4) || "1234";
}

function mapPaymentRow(row: Record<string, unknown>): SavedPaymentData {
  const lastFour = String(row.card_last_four ?? "1234");
  return {
    cardName: String(row.label ?? row.card_brand ?? DEFAULT_PAYMENT.cardName),
    cardNumberMasked: `**** **** **** ${lastFour}`,
  };
}

export async function getDefaultPaymentForUser(userId: string): Promise<SavedPaymentData> {
  if (!isSupabaseConfigured()) {
    logMockFallback("getDefaultPaymentForUser: Supabase is not configured");
    return DEFAULT_PAYMENT;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    logMockFallback("getDefaultPaymentForUser: failed to create Supabase client");
    return DEFAULT_PAYMENT;
  }

  const { data, error } = await supabase
    .from("payment_methods_mock")
    .select("label, card_brand, card_last_four")
    .eq("user_id", userId)
    .eq("is_default", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[data] getDefaultPaymentForUser:", error.message);
    logMockFallback("getDefaultPaymentForUser: query error");
    return DEFAULT_PAYMENT;
  }

  if (!data) {
    if (shouldUseMockData()) {
      logMockFallback("getDefaultPaymentForUser: empty result");
    }
    return DEFAULT_PAYMENT;
  }

  return mapPaymentRow(data as Record<string, unknown>);
}

export async function saveDefaultPaymentForUser(
  userId: string,
  input: SavedPaymentData,
): Promise<{ success: boolean }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: true };
  }

  const { error: clearError } = await supabase
    .from("payment_methods_mock")
    .update({ is_default: false })
    .eq("user_id", userId)
    .eq("is_default", true);

  if (clearError) {
    console.error("[data] saveDefaultPaymentForUser clear:", clearError.message);
  }

  const { error } = await supabase.from("payment_methods_mock").insert({
    user_id: userId,
    label: input.cardName.trim(),
    card_brand: input.cardName.trim(),
    card_last_four: extractLastFour(input.cardNumberMasked),
    is_default: true,
  });

  if (error) {
    console.error("[data] saveDefaultPaymentForUser:", error.message);
    return { success: false };
  }

  return { success: true };
}

export async function hasDefaultPaymentForUser(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return shouldUseMockData();
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return false;
  }

  const { data, error } = await supabase
    .from("payment_methods_mock")
    .select("id")
    .eq("user_id", userId)
    .eq("is_default", true)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[data] hasDefaultPaymentForUser:", error.message);
    return false;
  }

  return Boolean(data);
}
