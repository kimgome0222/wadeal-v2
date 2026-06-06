import { DEFAULT_COMMISSION_RATE } from "@/lib/settlements/labels";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type CalculateSettlementError =
  | "not_configured"
  | "deal_not_found"
  | "no_supplier"
  | "no_orders"
  | "not_finalized"
  | "save_failed";

export type CalculateSettlementResult = {
  success: boolean;
  error?: CalculateSettlementError;
  message?: string;
  settlementId?: string;
  dealId?: string;
  supplierId?: string;
  productId?: string;
  totalSalesAmount?: number;
  commissionRate?: number;
  commissionAmount?: number;
  settlementAmount?: number;
  alreadyExists?: boolean;
};

type DealProductRow = {
  id: string;
  status: string;
  product_id: string;
  products: {
    id: string;
    supplier_id: string | null;
    suppliers: {
      id: string;
      commission_rate: number;
      status: string;
    } | null;
  };
};

function resolveOrderLineAmount(row: {
  final_price: number | null;
  payment_amount: number | null;
  joined_price: number | null;
  quantity: number | null;
}): number {
  if (row.final_price != null && Number.isFinite(row.final_price)) {
    return Math.max(0, row.final_price);
  }

  if (row.payment_amount != null && Number.isFinite(row.payment_amount)) {
    return Math.max(0, row.payment_amount);
  }

  const quantity = Math.max(1, row.quantity ?? 1);
  const unitPrice = Math.max(0, row.joined_price ?? 0);
  return Math.round(unitPrice * quantity);
}

/**
 * Compute and persist settlement for a closed deal from finalized order totals.
 * Idempotent: returns existing settlement when deal_id already has one.
 */
export async function calculateSettlement(dealId: string): Promise<CalculateSettlementResult> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: "not_configured",
      message: "Supabase가 설정되지 않았어요.",
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      error: "not_configured",
      message: "Supabase 클라이언트를 만들 수 없어요.",
    };
  }

  const { data: existing, error: existingError } = await supabase
    .from("settlements")
    .select("id, supplier_id, deal_id, product_id, total_sales_amount, commission_rate, commission_amount, settlement_amount")
    .eq("deal_id", dealId)
    .maybeSingle();

  if (existingError) {
    console.error("[calculateSettlement] existing:", existingError.message);
    return {
      success: false,
      error: "save_failed",
      message: "기존 정산 정보를 확인하지 못했어요.",
      dealId,
    };
  }

  if (existing) {
    const row = existing as {
      id: string;
      supplier_id: string;
      deal_id: string;
      product_id: string;
      total_sales_amount: number;
      commission_rate: number;
      commission_amount: number;
      settlement_amount: number;
    };

    return {
      success: true,
      alreadyExists: true,
      settlementId: row.id,
      dealId: row.deal_id,
      supplierId: row.supplier_id,
      productId: row.product_id,
      totalSalesAmount: row.total_sales_amount,
      commissionRate: Number(row.commission_rate),
      commissionAmount: row.commission_amount,
      settlementAmount: row.settlement_amount,
      message: "이미 정산이 생성된 상품이에요.",
    };
  }

  const { data: dealRow, error: dealError } = await supabase
    .from("group_buy_deals")
    .select(`
      id,
      status,
      product_id,
      products!inner (
        id,
        supplier_id,
        suppliers (
          id,
          commission_rate,
          status
        )
      )
    `)
    .eq("id", dealId)
    .maybeSingle();

  if (dealError) {
    console.error("[calculateSettlement] deal:", dealError.message);
    return {
      success: false,
      error: "save_failed",
      message: "상품 정보를 불러오지 못했어요.",
      dealId,
    };
  }

  if (!dealRow) {
    return {
      success: false,
      error: "deal_not_found",
      message: "상품을 찾을 수 없어요.",
      dealId,
    };
  }

  const deal = dealRow as unknown as DealProductRow;

  if (deal.status !== "closed") {
    return {
      success: false,
      error: "not_finalized",
      message: "판매 종료된 상품만 정산할 수 있어요.",
      dealId,
    };
  }

  const supplierId = deal.products.supplier_id;
  const supplier = deal.products.suppliers;

  if (!supplierId || !supplier) {
    return {
      success: false,
      error: "no_supplier",
      message: "연결된 공급사가 없어 정산을 생성하지 않았어요.",
      dealId,
      productId: deal.products.id,
    };
  }

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("final_price, payment_amount, joined_price, quantity")
    .eq("deal_id", dealId)
    .not("order_status", "in", '("cancelled","refunded")');

  if (ordersError) {
    console.error("[calculateSettlement] orders:", ordersError.message);
    return {
      success: false,
      error: "save_failed",
      message: "주문 금액을 불러오지 못했어요.",
      dealId,
    };
  }

  if (!orders || orders.length === 0) {
    return {
      success: false,
      error: "no_orders",
      message: "정산할 주문이 없어요.",
      dealId,
    };
  }

  const totalSalesAmount = orders.reduce(
    (sum, row) => sum + resolveOrderLineAmount(row as Parameters<typeof resolveOrderLineAmount>[0]),
    0,
  );

  const commissionRate = Number(supplier.commission_rate) || DEFAULT_COMMISSION_RATE;
  const commissionAmount = Math.round(totalSalesAmount * (commissionRate / 100));
  const settlementAmount = Math.max(0, totalSalesAmount - commissionAmount);

  const { data: inserted, error: insertError } = await supabase
    .from("settlements")
    .insert({
      supplier_id: supplier.id,
      deal_id: dealId,
      product_id: deal.products.id,
      total_sales_amount: totalSalesAmount,
      commission_rate: commissionRate,
      commission_amount: commissionAmount,
      settlement_amount: settlementAmount,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      return calculateSettlement(dealId);
    }

    console.error("[calculateSettlement] insert:", insertError.message);
    return {
      success: false,
      error: "save_failed",
      message: "정산 저장에 실패했어요.",
      dealId,
    };
  }

  return {
    success: true,
    settlementId: (inserted as { id: string }).id,
    dealId,
    supplierId: supplier.id,
    productId: deal.products.id,
    totalSalesAmount,
    commissionRate,
    commissionAmount,
    settlementAmount,
    message: "정산이 생성됐어요.",
  };
}
