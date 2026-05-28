import type {
  SellerBillingPaymentMode,
  SellerBillingRecord,
  SellerBillingStatus,
} from "@/lib/settlements/seller-settlement-types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isMissingColumnError, isMissingTableError } from "@/lib/supabase/query-fallback";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

function mapBillingRow(row: Record<string, unknown>): SellerBillingRecord {
  return {
    id: row.id as string,
    sellerId: row.seller_id as string,
    billingType: row.billing_type as SellerBillingRecord["billingType"],
    amount: row.amount as number,
    status: row.status as SellerBillingStatus,
    paymentMode: row.payment_mode as SellerBillingPaymentMode,
    description: (row.description as string | null) ?? null,
    dueDate: (row.due_date as string | null) ?? null,
    paidAt: (row.paid_at as string | null) ?? null,
    settlementRecordId: (row.settlement_record_id as string | null) ?? null,
    createdAt: row.created_at as string,
  };
}

export async function getSellerBillings(
  sellerId: string,
  limit = 20,
): Promise<SellerBillingRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("seller_billings")
    .select("*")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    if (
      error &&
      !isMissingTableError(error.message) &&
      !isMissingColumnError(error.message) &&
      process.env.NODE_ENV === "development"
    ) {
      console.error("[seller-billings] getSellerBillings:", error.message);
    }
    return [];
  }

  return data.map((row) => mapBillingRow(row as Record<string, unknown>));
}

export async function createSellerBilling(input: {
  sellerId: string;
  billingType: "ad_fee" | "extra_charge";
  amount: number;
  paymentMode: SellerBillingPaymentMode;
  description?: string;
  dueDate?: string;
}): Promise<{ success: boolean; billingId?: string; error?: string }> {
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  const status = input.paymentMode === "settlement_deduction" ? "pending_deduction" : "pending";

  const { data, error } = await supabase
    .from("seller_billings")
    .insert({
      seller_id: input.sellerId,
      billing_type: input.billingType,
      amount: input.amount,
      payment_mode: input.paymentMode,
      status,
      description: input.description ?? null,
      due_date: input.dueDate ?? null,
      paid_at: null,
      settlement_record_id: null,
    })
    .select("id")
    .single();

  if (error || !data) {
    if (error && isMissingTableError(error.message)) {
      return { success: false, error: "not_configured" };
    }
    return { success: false, error: "save_failed" };
  }

  return { success: true, billingId: (data as { id: string }).id };
}

export async function markSellerBillingPaid(
  sellerId: string,
  billingId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  const { data, error } = await supabase
    .from("seller_billings")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("id", billingId)
    .eq("seller_id", sellerId)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (error || !data) {
    if (error && isMissingTableError(error.message)) {
      return { success: false, error: "not_configured" };
    }
    return { success: false, error: "invalid_status" };
  }

  return { success: true };
}

/** Immediate ad-fee payment via Toss — not wired yet. */
export async function paySellerBillingWithToss(
  _sellerId: string,
  _billingId: string,
): Promise<{ success: boolean; message: string }> {
  return {
    success: false,
    message: "즉시 결제는 Toss Payments 연동 준비 중입니다. 정산 차감 방식을 이용해 주세요.",
  };
}
