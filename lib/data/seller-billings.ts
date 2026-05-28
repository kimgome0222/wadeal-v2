import type {
  SellerBillingPaymentMode,
  SellerBillingRecord,
  SellerBillingStatus,
} from "@/lib/settlements/seller-settlement-types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
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
    console.error("[seller-billings] getSellerBillings:", error?.message);
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
    return { success: false, error: "invalid_status" };
  }

  return { success: true };
}

/**
 * TODO: Wire to Toss Payments for immediate ad fee payment.
 */
export async function paySellerBillingWithToss(
  sellerId: string,
  billingId: string,
): Promise<{ success: boolean; message: string }> {
  const result = await markSellerBillingPaid(sellerId, billingId);
  if (!result.success) {
    return { success: false, message: "결제 처리에 실패했어요." };
  }

  return {
    success: true,
    message: "결제가 완료됐어요. (Toss Payments 연동 준비 중)",
  };
}
