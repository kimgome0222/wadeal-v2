import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/** Client-safe saved card (billing_key never included). */
export type SavedPaymentMethodSummary = {
  id: string;
  provider: string;
  method: string;
  cardCompany: string | null;
  cardLast4: string;
  isDefault: boolean;
  status: "active" | "inactive" | "expired" | "revoked";
  createdAt: string;
};

const CLIENT_SELECT =
  "id, provider, method, card_company, card_last4, is_default, status, created_at";

function mapRow(row: Record<string, unknown>): SavedPaymentMethodSummary {
  return {
    id: row.id as string,
    provider: row.provider as string,
    method: row.method as string,
    cardCompany: (row.card_company as string | null) ?? null,
    cardLast4: row.card_last4 as string,
    isDefault: Boolean(row.is_default),
    status: row.status as SavedPaymentMethodSummary["status"],
    createdAt: row.created_at as string,
  };
}

export async function listSavedPaymentMethodsForUser(
  userId: string,
): Promise<SavedPaymentMethodSummary[]> {
  if (!isSupabaseConfigured()) {
    return shouldUseMockData() ?
        [
          {
            id: "mock-saved-payment-1",
            provider: "toss",
            method: "card",
            cardCompany: "Mock카드",
            cardLast4: "1234",
            isDefault: true,
            status: "active",
            createdAt: new Date().toISOString(),
          },
        ]
      : [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("saved_payment_methods")
    .select(CLIENT_SELECT)
    .eq("user_id", userId)
    .neq("status", "revoked")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[saved-payment-methods] list:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
}

export async function getDefaultSavedPaymentMethodForUser(
  userId: string,
): Promise<SavedPaymentMethodSummary | null> {
  const methods = await listSavedPaymentMethodsForUser(userId);
  return methods.find((method) => method.isDefault && method.status === "active") ?? methods[0] ?? null;
}

export async function hasActiveSavedPaymentMethod(userId: string): Promise<boolean> {
  const methods = await listSavedPaymentMethodsForUser(userId);
  return methods.some((method) => method.status === "active");
}

export async function registerSavedPaymentMethod(input: {
  billingKey: string;
  cardCompany?: string | null;
  cardLast4: string;
  provider?: string;
  method?: string;
  setDefault?: boolean;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true, id: "mock-saved-payment-1" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  const { data, error } = await supabase.rpc("register_saved_payment_method", {
    p_billing_key: input.billingKey,
    p_card_company: input.cardCompany ?? null,
    p_card_last4: input.cardLast4,
    p_provider: input.provider ?? "toss",
    p_method: input.method ?? "card",
    p_set_default: input.setDefault ?? true,
  });

  if (error) {
    console.error("[saved-payment-methods] register:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, id: data as string };
}

export async function deactivateSavedPaymentMethod(
  userId: string,
  methodId: string,
): Promise<{ success: boolean; error?: string }> {
  if (methodId.startsWith("mock-")) {
    return { success: true };
  }

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  const { data: owned } = await supabase
    .from("saved_payment_methods")
    .select("id")
    .eq("id", methodId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!owned) {
    return { success: false, error: "not_found" };
  }

  const { data, error } = await supabase.rpc("deactivate_saved_payment_method", {
    p_method_id: methodId,
  });

  if (error) {
    console.error("[saved-payment-methods] deactivate:", error.message);
    return { success: false, error: error.message };
  }

  if (data !== true) {
    return { success: false, error: "not_found" };
  }

  return { success: true };
}

export async function setDefaultSavedPaymentMethod(
  userId: string,
  methodId: string,
): Promise<{ success: boolean; error?: string }> {
  if (methodId.startsWith("mock-")) {
    return { success: true };
  }

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  const { data: owned } = await supabase
    .from("saved_payment_methods")
    .select("id")
    .eq("id", methodId)
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (!owned) {
    return { success: false, error: "not_found" };
  }

  const { data, error } = await supabase.rpc("set_default_saved_payment_method", {
    p_method_id: methodId,
  });

  if (error) {
    console.error("[saved-payment-methods] setDefault:", error.message);
    return { success: false, error: error.message };
  }

  if (data !== true) {
    return { success: false, error: "not_found" };
  }

  return { success: true };
}

export async function getSavedPaymentMethodForUser(
  userId: string,
  methodId: string,
): Promise<SavedPaymentMethodSummary | null> {
  const methods = await listSavedPaymentMethodsForUser(userId);
  return methods.find((method) => method.id === methodId) ?? null;
}
