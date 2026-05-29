import { calculateSettlement } from "@/lib/settlements/calculate-settlement";
import type {
  AdminSettlementDetail,
  AdminSettlementListItem,
  AdminSettlementStatusFilter,
} from "@/lib/admin-settlements/shared";
import type { SettlementStatus } from "@/lib/settlements/labels";
import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type {
  AdminSettlementDetail,
  AdminSettlementListItem,
  AdminSettlementStatusFilter,
} from "@/lib/admin-settlements/shared";

export {
  ADMIN_SETTLEMENT_STATUS_FILTER_OPTIONS,
  getSettlementStatusLabel,
  settlementStatusTone,
} from "@/lib/admin-settlements/shared";

export type AdminSettlementMutationResult = {
  success: boolean;
  error?: "not_found" | "invalid_status" | "save_failed";
  message?: string;
};

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[settlements] using mock fallback: ${context}`);
  }
}

function toListItem(row: {
  id: string;
  supplier_id: string;
  deal_id: string;
  product_id: string;
  total_sales_amount: number;
  commission_rate: number;
  commission_amount: number;
  settlement_amount: number;
  status: SettlementStatus;
  settled_at: string | null;
  created_at: string;
  suppliers?: { name: string } | null;
  products?: { name: string } | null;
}): AdminSettlementListItem {
  return {
    id: row.id,
    supplierId: row.supplier_id,
    supplierName: row.suppliers?.name ?? "-",
    dealId: row.deal_id,
    productId: row.product_id,
    productName: row.products?.name ?? "-",
    totalSalesAmount: row.total_sales_amount,
    commissionRate: Number(row.commission_rate),
    commissionAmount: row.commission_amount,
    settlementAmount: row.settlement_amount,
    status: row.status,
    settledAt: row.settled_at,
    createdAt: row.created_at,
  };
}

const mockSettlements = new Map<string, AdminSettlementDetail>();

function seedMockSettlements() {
  if (mockSettlements.size > 0) {
    return;
  }

  const now = new Date().toISOString();
  mockSettlements.set("mock-settlement-1", {
    id: "mock-settlement-1",
    supplierId: "mock-supplier-1",
    supplierName: "celloh 직영",
    dealId: "mock-deal-1",
    productId: "mock-product-1",
    productName: "제주 고당도 감귤 3kg",
    totalSalesAmount: 1522800,
    commissionRate: 10,
    commissionAmount: 152280,
    settlementAmount: 1370520,
    status: "pending",
    settledAt: null,
    createdAt: now,
    updatedAt: now,
  });
}

function getMockSettlements(): AdminSettlementListItem[] {
  seedMockSettlements();
  return Array.from(mockSettlements.values());
}

function getMockSettlementById(id: string): AdminSettlementDetail | null {
  seedMockSettlements();
  return mockSettlements.get(id) ?? null;
}

const settlementSelect = `
  id,
  supplier_id,
  deal_id,
  product_id,
  total_sales_amount,
  commission_rate,
  commission_amount,
  settlement_amount,
  status,
  settled_at,
  created_at,
  updated_at,
  suppliers ( name ),
  products ( name )
`;

export function parseAdminSettlementStatusFilter(
  raw: string | undefined,
): AdminSettlementStatusFilter {
  if (
    raw === "pending" ||
    raw === "confirmed" ||
    raw === "paid" ||
    raw === "cancelled"
  ) {
    return raw;
  }

  return "all";
}

export function filterAdminSettlementsByStatus(
  items: AdminSettlementListItem[],
  filter: AdminSettlementStatusFilter,
): AdminSettlementListItem[] {
  if (filter === "all") {
    return items;
  }

  return items.filter((item) => item.status === filter);
}

export async function getAdminSettlements(): Promise<AdminSettlementListItem[]> {
  if (!isSupabaseConfigured()) {
    logMockFallback("getAdminSettlements");
    return shouldUseMockData() ? getMockSettlements() : [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return shouldUseMockData() ? getMockSettlements() : [];
  }

  const { data, error } = await supabase
    .from("settlements")
    .select(settlementSelect)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("[settlements] getAdminSettlements:", error?.message);
    return shouldUseMockData() ? getMockSettlements() : [];
  }

  return (data as unknown as Array<Parameters<typeof toListItem>[0]>).map(toListItem);
}

export async function getAdminSettlementById(
  settlementId: string,
): Promise<AdminSettlementDetail | null> {
  if (!isSupabaseConfigured()) {
    return shouldUseMockData() ? getMockSettlementById(settlementId) : null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return shouldUseMockData() ? getMockSettlementById(settlementId) : null;
  }

  const { data, error } = await supabase
    .from("settlements")
    .select(settlementSelect)
    .eq("id", settlementId)
    .maybeSingle();

  if (error || !data) {
    console.error("[settlements] getAdminSettlementById:", error?.message);
    return shouldUseMockData() ? getMockSettlementById(settlementId) : null;
  }

  const row = data as unknown as Parameters<typeof toListItem>[0] & { updated_at: string };
  return {
    ...toListItem(row),
    updatedAt: row.updated_at,
  };
}

export async function confirmAdminSettlement(
  settlementId: string,
): Promise<AdminSettlementMutationResult> {
  return updateSettlementStatus(settlementId, "confirmed", ["pending"]);
}

export async function markAdminSettlementPaid(
  settlementId: string,
): Promise<AdminSettlementMutationResult> {
  return updateSettlementStatus(settlementId, "paid", ["confirmed"], true);
}

export async function cancelAdminSettlement(
  settlementId: string,
): Promise<AdminSettlementMutationResult> {
  return updateSettlementStatus(settlementId, "cancelled", ["pending", "confirmed"]);
}

async function updateSettlementStatus(
  settlementId: string,
  nextStatus: SettlementStatus,
  allowedFrom: SettlementStatus[],
  setSettledAt = false,
): Promise<AdminSettlementMutationResult> {
  if (!isSupabaseConfigured()) {
    if (!shouldUseMockData()) {
      return { success: false, error: "save_failed" };
    }

    const existing = getMockSettlementById(settlementId);
    if (!existing) {
      return { success: false, error: "not_found" };
    }

    if (!allowedFrom.includes(existing.status)) {
      return { success: false, error: "invalid_status" };
    }

    mockSettlements.set(settlementId, {
      ...existing,
      status: nextStatus,
      settledAt: setSettledAt ? new Date().toISOString() : existing.settledAt,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { data: existing, error: loadError } = await supabase
    .from("settlements")
    .select("id, status")
    .eq("id", settlementId)
    .maybeSingle();

  if (loadError) {
    console.error("[settlements] updateSettlementStatus load:", loadError.message);
    return { success: false, error: "save_failed" };
  }

  if (!existing) {
    return { success: false, error: "not_found" };
  }

  const currentStatus = (existing as { status: SettlementStatus }).status;
  if (!allowedFrom.includes(currentStatus)) {
    return { success: false, error: "invalid_status", message: "현재 상태에서는 변경할 수 없어요." };
  }

  const payload: {
    status: SettlementStatus;
    settled_at?: string;
  } = { status: nextStatus };

  if (setSettledAt) {
    payload.settled_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("settlements")
    .update(payload)
    .eq("id", settlementId);

  if (error) {
    console.error("[settlements] updateSettlementStatus:", error.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true };
}

export async function calculateSettlementForDeal(
  dealId: string,
): Promise<Awaited<ReturnType<typeof calculateSettlement>>> {
  return calculateSettlement(dealId);
}
