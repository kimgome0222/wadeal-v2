import { calculateSellerSettlementAmounts } from "@/lib/settlements/calculate-seller-settlement";
import { notifySellerSettlementReady } from "@/lib/notifications/seller-events";
import type {
  SellerSettlementRecord,
  SellerSettlementRecordItem,
  SellerSettlementRecordStatus,
} from "@/lib/settlements/seller-settlement-types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

function mapItemRow(row: Record<string, unknown>): SellerSettlementRecordItem {
  return {
    id: row.id as string,
    itemType: row.item_type as SellerSettlementRecordItem["itemType"],
    label: row.label as string,
    amount: row.amount as number,
    sortOrder: (row.sort_order as number) ?? 0,
  };
}

function mapRecordRow(
  row: Record<string, unknown>,
  items: SellerSettlementRecordItem[] = [],
): SellerSettlementRecord {
  return {
    id: row.id as string,
    sellerId: row.seller_id as string,
    periodStart: row.period_start as string,
    periodEnd: row.period_end as string,
    grossSalesAmount: row.gross_sales_amount as number,
    platformFeeAmount: row.platform_fee_amount as number,
    adDeductionAmount: row.ad_deduction_amount as number,
    otherDeductionAmount: row.other_deduction_amount as number,
    netPayoutAmount: row.net_payout_amount as number,
    status: row.status as SellerSettlementRecordStatus,
    sellerConfirmedAt: (row.seller_confirmed_at as string | null) ?? null,
    confirmedAt: (row.confirmed_at as string | null) ?? null,
    paidAt: (row.paid_at as string | null) ?? null,
    depositConfirmedAt: (row.deposit_confirmed_at as string | null) ?? null,
    receiptReference: (row.receipt_reference as string | null) ?? null,
    createdAt: row.created_at as string,
    items,
  };
}

async function loadItemsForRecords(
  recordIds: string[],
): Promise<Map<string, SellerSettlementRecordItem[]>> {
  const map = new Map<string, SellerSettlementRecordItem[]>();
  if (recordIds.length === 0) {
    return map;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return map;
  }

  const { data, error } = await supabase
    .from("settlement_record_items")
    .select("id, settlement_record_id, item_type, label, amount, sort_order")
    .in("settlement_record_id", recordIds)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return map;
  }

  for (const row of data) {
    const recordId = row.settlement_record_id as string;
    const list = map.get(recordId) ?? [];
    list.push(mapItemRow(row as Record<string, unknown>));
    map.set(recordId, list);
  }

  return map;
}

export async function getSellerSettlementRecords(
  sellerId: string,
  limit = 20,
): Promise<SellerSettlementRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("settlement_records")
    .select("*")
    .eq("seller_id", sellerId)
    .order("period_end", { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error("[seller-settlements] getSellerSettlementRecords:", error?.message);
    return [];
  }

  const itemsMap = await loadItemsForRecords(data.map((row) => row.id as string));
  return data.map((row) =>
    mapRecordRow(row as Record<string, unknown>, itemsMap.get(row.id as string) ?? []),
  );
}

export async function getSellerSettlementRecordById(
  sellerId: string,
  recordId: string,
): Promise<SellerSettlementRecord | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("settlement_records")
    .select("*")
    .eq("id", recordId)
    .eq("seller_id", sellerId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const itemsMap = await loadItemsForRecords([recordId]);
  return mapRecordRow(data as Record<string, unknown>, itemsMap.get(recordId) ?? []);
}

export async function getAdminSellerSettlementRecords(
  limit = 50,
): Promise<(SellerSettlementRecord & { companyName: string })[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("settlement_records")
    .select("*, sellers ( company_name )")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error("[seller-settlements] getAdminSellerSettlementRecords:", error?.message);
    return [];
  }

  const itemsMap = await loadItemsForRecords(data.map((row) => row.id as string));

  return data.map((row) => {
    const record = mapRecordRow(row as Record<string, unknown>, itemsMap.get(row.id as string) ?? []);
    const sellers = row.sellers as unknown as { company_name: string } | null;
    return { ...record, companyName: sellers?.company_name ?? "-" };
  });
}

function resolveOrderAmount(row: {
  final_payment_amount: number | null;
  final_price: number | null;
  payment_amount: number | null;
  joined_price: number | null;
  quantity: number | null;
}): number {
  if (row.final_payment_amount != null) {
    return Math.max(0, row.final_payment_amount);
  }
  if (row.final_price != null) {
    return Math.max(0, row.final_price);
  }
  if (row.payment_amount != null) {
    return Math.max(0, row.payment_amount);
  }
  const qty = Math.max(1, row.quantity ?? 1);
  return Math.max(0, Math.round((row.joined_price ?? 0) * qty));
}

export async function generateSellerSettlementRecord(input: {
  sellerId: string;
  sellerUserId: string;
  periodStart: string;
  periodEnd: string;
}): Promise<{ success: boolean; recordId?: string; error?: string }> {
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  const { data: existing } = await supabase
    .from("settlement_records")
    .select("id")
    .eq("seller_id", input.sellerId)
    .eq("period_start", input.periodStart)
    .eq("period_end", input.periodEnd)
    .maybeSingle();

  if (existing) {
    return { success: true, recordId: (existing as { id: string }).id };
  }

  const { data: products } = await supabase
    .from("products")
    .select("id")
    .eq("created_by", input.sellerUserId);

  const productIds = (products ?? []).map((p) => p.id as string);
  let grossSalesAmount = 0;

  if (productIds.length > 0) {
    const periodStartIso = `${input.periodStart}T00:00:00.000Z`;
    const periodEndIso = `${input.periodEnd}T23:59:59.999Z`;

    const { data: orders } = await supabase
      .from("orders")
      .select(
        "final_payment_amount, final_price, payment_amount, joined_price, quantity, payment_status",
      )
      .in("product_id", productIds)
      .gte("created_at", periodStartIso)
      .lte("created_at", periodEndIso)
      .in("payment_status", ["paid", "waiting_deposit"]);

    grossSalesAmount = (orders ?? []).reduce(
      (sum, row) => sum + resolveOrderAmount(row as Parameters<typeof resolveOrderAmount>[0]),
      0,
    );
  }

  const { data: pendingBillings } = await supabase
    .from("seller_billings")
    .select("id, amount")
    .eq("seller_id", input.sellerId)
    .eq("status", "pending_deduction");

  const adDeductionAmount = (pendingBillings ?? []).reduce(
    (sum, row) => sum + (row.amount as number),
    0,
  );

  const calculated = calculateSellerSettlementAmounts({
    grossSalesAmount,
    adDeductionAmount,
    salesLabel: `${input.periodStart} ~ ${input.periodEnd} 판매 매출`,
  });

  const { data: inserted, error: insertError } = await supabase
    .from("settlement_records")
    .insert({
      seller_id: input.sellerId,
      period_start: input.periodStart,
      period_end: input.periodEnd,
      gross_sales_amount: calculated.grossSalesAmount,
      platform_fee_amount: calculated.platformFeeAmount,
      ad_deduction_amount: calculated.adDeductionAmount,
      other_deduction_amount: calculated.otherDeductionAmount,
      net_payout_amount: calculated.netPayoutAmount,
      status: "pending_seller_confirm",
      seller_confirmed_at: null,
      confirmed_at: null,
      paid_at: null,
      deposit_confirmed_at: null,
      receipt_reference: null,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("[seller-settlements] generate:", insertError?.message);
    return { success: false, error: "save_failed" };
  }

  const recordId = (inserted as { id: string }).id;

  const itemRows = calculated.items
    .filter((item) => item.id !== "net")
    .map((item, index) => ({
      settlement_record_id: recordId,
      item_type: item.itemType,
      label: item.label,
      amount: item.amount,
      sort_order: index + 1,
      reference_id: null,
    }));

  if (itemRows.length > 0) {
    await supabase.from("settlement_record_items").insert(itemRows);
  }

  if (pendingBillings && pendingBillings.length > 0) {
    await supabase
      .from("seller_billings")
      .update({ settlement_record_id: recordId })
      .in(
        "id",
        pendingBillings.map((b) => b.id as string),
      );
  }

  await notifySellerSettlementReady({
    sellerId: input.sellerId,
    periodLabel: `${input.periodStart} ~ ${input.periodEnd}`,
    recordId,
  });

  return { success: true, recordId };
}

export async function confirmSellerSettlementRecord(
  sellerId: string,
  recordId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  const { data, error } = await supabase
    .from("settlement_records")
    .update({
      status: "seller_confirmed",
      seller_confirmed_at: new Date().toISOString(),
    })
    .eq("id", recordId)
    .eq("seller_id", sellerId)
    .eq("status", "pending_seller_confirm")
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return { success: false, error: "invalid_status" };
  }

  return { success: true };
}

export async function adminConfirmSellerSettlement(
  recordId: string,
): Promise<{ success: boolean; sellerUserId?: string; sellerId?: string; error?: string }> {
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  const { data: before } = await supabase
    .from("settlement_records")
    .select("id, seller_id, status, sellers ( user_id )")
    .eq("id", recordId)
    .maybeSingle();

  if (!before) {
    return { success: false, error: "not_found" };
  }

  const status = before.status as string;
  if (status !== "seller_confirmed" && status !== "pending_seller_confirm") {
    return { success: false, error: "invalid_status" };
  }

  const { error } = await supabase
    .from("settlement_records")
    .update({
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
    })
    .eq("id", recordId);

  if (error) {
    return { success: false, error: "save_failed" };
  }

  const sellers = before.sellers as unknown as { user_id: string } | null;
  return {
    success: true,
    sellerUserId: sellers?.user_id,
    sellerId: before.seller_id as string,
  };
}

export async function adminMarkSellerSettlementPaid(
  recordId: string,
): Promise<{ success: boolean; sellerUserId?: string; sellerId?: string; netPayoutAmount?: number; error?: string }> {
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  const { data: before } = await supabase
    .from("settlement_records")
    .select("id, status, net_payout_amount, seller_id, sellers ( user_id )")
    .eq("id", recordId)
    .maybeSingle();

  if (!before) {
    return { success: false, error: "not_found" };
  }

  if ((before.status as string) !== "confirmed") {
    return { success: false, error: "invalid_status" };
  }

  const now = new Date().toISOString();
  const receiptReference = `WD-ST-${recordId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;

  const { error } = await supabase
    .from("settlement_records")
    .update({
      status: "paid",
      paid_at: now,
      deposit_confirmed_at: now,
      receipt_reference: receiptReference,
    })
    .eq("id", recordId);

  if (error) {
    return { success: false, error: "save_failed" };
  }

  await supabase
    .from("seller_billings")
    .update({ status: "paid", paid_at: now })
    .eq("settlement_record_id", recordId)
    .eq("status", "pending_deduction");

  const sellers = before.sellers as unknown as { user_id: string } | null;
  return {
    success: true,
    sellerUserId: sellers?.user_id,
    sellerId: before.seller_id as string,
    netPayoutAmount: before.net_payout_amount as number,
  };
}
