import type { Deal } from "@/lib/deals";
import { getCurrentTierPrice, parsePriceTiersJson, resolveDealPriceTiers } from "@/lib/pricing/tiers";
import { isDealPastDeadline, isDealStatusClosed } from "@/lib/deals/lifecycle";
import type { DealStatus, PriceTier } from "@/lib/types";
import { getProductShippingBySlug } from "@/lib/data/product-shipping";
import { calculateOrderAmounts } from "@/lib/orders/calculate-order-amounts";
import { recalculateDiscountsForFinalize } from "@/lib/discounts/apply-to-order";
import { processAutoChargesForDeal } from "@/lib/payments/auto-charge";
import { isVirtualAccountMethod } from "@/lib/payments/payment-methods";
import { prepareGroupBuyVirtualAccountAfterFinalize } from "@/lib/payments/process-instant-payment";
import { preparePaymentAfterFinalize } from "@/lib/payments/prepare-payment-after-finalize";
import { normalizePaymentFlow } from "@/lib/payments/payment-flow";
import { logError } from "@/lib/monitoring/error-log";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type FinalizeDealError =
  | "not_configured"
  | "deal_not_found"
  | "already_finalized"
  | "not_due"
  | "no_price_tiers"
  | "no_orders"
  | "save_failed";

export type FinalizeDealResult = {
  success: boolean;
  error?: FinalizeDealError;
  message?: string;
  dealId?: string;
  finalUnitPrice?: number;
  participantCount?: number;
  updatedOrderCount?: number;
  skippedOrderCount?: number;
};

export type FinalizeDealOptions = {
  /** Admin manual close before deadline */
  force?: boolean;
};

type DealRecord = {
  id: string;
  status: DealStatus;
  ends_at: string;
  current_participants: number;
  target_participants: number;
  group_price: number;
  lowest_price: number;
  price_tiers: unknown;
  products: {
    slug: string;
    original_price: number;
  };
};

const DEAL_SELECT = `
  id,
  status,
  ends_at,
  current_participants,
  target_participants,
  group_price,
  lowest_price,
  price_tiers,
  products!inner (
    slug,
    original_price
  )
`;

function toDealShape(row: DealRecord): Pick<
  Deal,
  | "slug"
  | "participants"
  | "targetParticipants"
  | "groupPrice"
  | "lowestPrice"
  | "originalPrice"
  | "priceTiers"
> {
  return {
    slug: row.products.slug,
    participants: row.current_participants,
    targetParticipants: row.target_participants,
    groupPrice: row.group_price,
    lowestPrice: row.lowest_price,
    originalPrice: row.products.original_price,
    priceTiers: undefined,
  };
}

async function loadLegacyTiers(dealUuid: string): Promise<PriceTier[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("price_tiers")
    .select("*")
    .eq("deal_id", dealUuid)
    .order("tier_order", { ascending: true });

  if (!data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id as string,
    order: row.tier_order as number,
    requiredParticipants: row.required_participants as number,
    price: row.price as number,
  }));
}

async function countParticipantQuantity(dealUuid: string): Promise<number> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return 0;
  }

  const { data, error } = await supabase
    .from("orders")
    .select("quantity")
    .eq("deal_id", dealUuid)
    .not("order_status", "in", '("cancelled","refunded")');

  if (error || !data) {
    return 0;
  }

  return data.reduce((sum, row) => sum + Math.max(1, (row.quantity as number) ?? 1), 0);
}

/**
 * Close a group-buy deal and finalize order prices from cumulative quantity tiers.
 * Callable from admin actions or future cron / Edge Function.
 */
export async function finalizeDeal(
  dealId: string,
  options: FinalizeDealOptions = {},
): Promise<FinalizeDealResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "not_configured", message: "Supabase가 설정되지 않았어요." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured", message: "Supabase 클라이언트를 만들 수 없어요." };
  }

  const { data: dealRow, error: dealError } = await supabase
    .from("group_buy_deals")
    .select(DEAL_SELECT)
    .eq("id", dealId)
    .maybeSingle();

  if (dealError) {
    console.error("[finalizeDeal] load deal:", dealError.message);
    return { success: false, error: "save_failed", message: "공동구매 정보를 불러오지 못했어요." };
  }

  if (!dealRow) {
    return { success: false, error: "deal_not_found", message: "공동구매를 찾을 수 없어요." };
  }

  const deal = dealRow as unknown as DealRecord;

  if (isDealStatusClosed(deal.status)) {
    const { calculateSettlement } = await import("@/lib/settlements/calculate-settlement");
    await calculateSettlement(dealId);

    return {
      success: true,
      error: "already_finalized",
      message: "이미 마감 처리된 공동구매예요.",
      dealId,
    };
  }

  if (!options.force && !isDealPastDeadline(deal.ends_at)) {
    return {
      success: false,
      error: "not_due",
      message: "아직 마감 시간이 지나지 않았어요.",
      dealId,
    };
  }

  const dealShape = toDealShape(deal);
  const parsedTiers = parsePriceTiersJson(deal.price_tiers);
  const legacyTiers = await loadLegacyTiers(dealId);
  const priceTiers = resolveDealPriceTiers(
    { ...dealShape, priceTiers: parsedTiers },
    legacyTiers,
  );

  if (priceTiers.length === 0) {
    return {
      success: false,
      error: "no_price_tiers",
      message: "가격 단계(price_tiers)가 없어요.",
      dealId,
    };
  }

  const participantCount = Math.max(
    await countParticipantQuantity(dealId),
    deal.current_participants,
  );

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(
      "id, user_id, product_id, product_name, quantity, final_price, payment_method, shipping_postal_code, shipping_is_remote_area, coupon_code, point_amount_reserved, shipping_fee",
    )
    .eq("deal_id", dealId)
    .not("order_status", "in", '("cancelled","refunded")');

  if (ordersError) {
    console.error("[finalizeDeal] load orders:", ordersError.message);
    void logError({
      level: "error",
      source: "finalize_deal",
      message: "Failed to load orders for finalization",
      error: ordersError,
      dealId,
      productId: deal.products.slug,
    });
    return { success: false, error: "save_failed", message: "주문 목록을 불러오지 못했어요." };
  }

  if (!orders || orders.length === 0) {
    return {
      success: false,
      error: "no_orders",
      message: "참여 주문이 없어 마감 처리할 수 없어요.",
      dealId,
    };
  }

  const finalUnitPrice = getCurrentTierPrice(priceTiers, participantCount);
  if (!Number.isFinite(finalUnitPrice) || finalUnitPrice < 0) {
    return {
      success: false,
      error: "save_failed",
      message: "최종 단가를 계산하지 못했어요.",
      dealId,
    };
  }

  let updatedOrderCount = 0;
  let skippedOrderCount = 0;

  for (const row of orders) {
    if (row.final_price != null) {
      skippedOrderCount += 1;
      continue;
    }

    const quantity = Math.max(1, (row.quantity as number) ?? 1);
    const productSlug = row.product_id as string;
    const productShipping = await getProductShippingBySlug(productSlug);
    const subtotalAmount = Math.round(finalUnitPrice * quantity);
    const amounts = calculateOrderAmounts({
      unitPrice: finalUnitPrice,
      quantity,
      product: productShipping,
      address: {
        postalCode: (row.shipping_postal_code as string | null) ?? null,
        isRemoteArea: Boolean(row.shipping_is_remote_area),
      },
    });

    const discountResult = await recalculateDiscountsForFinalize({
      userId: row.user_id as string,
      orderId: row.id as string,
      newSubtotalAmount: subtotalAmount,
      couponCode: (row.coupon_code as string | null) ?? null,
      pointAmountReserved: (row.point_amount_reserved as number) ?? 0,
      shippingFee: amounts.shipping.totalShippingFee,
    });

    const discount = discountResult.success ?
      discountResult.breakdown
    : {
        subtotalAmount,
        couponDiscountAmount: 0,
        pointDiscountAmount: Math.min((row.point_amount_reserved as number) ?? 0, subtotalAmount),
        shippingFee: amounts.shipping.totalShippingFee,
        finalPaymentAmount: amounts.finalPaymentAmount,
        couponId: null,
        couponCode: null,
        couponName: null,
        couponDiscountType: null,
      };

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        final_price: subtotalAmount,
        subtotal_amount: discount.subtotalAmount,
        coupon_discount_amount: discount.couponDiscountAmount,
        point_discount_amount: discount.pointDiscountAmount,
        shipping_fee: amounts.shippingFee,
        remote_area_extra_fee: amounts.remoteAreaExtraFee,
        final_payment_amount: discount.finalPaymentAmount,
        payment_amount: discount.finalPaymentAmount,
        order_status: "confirmed",
        status: "공동구매 성공",
      })
      .eq("id", row.id as string);

    if (updateError) {
      console.error("[finalizeDeal] update order:", updateError.message);
      return {
        success: false,
        error: "save_failed",
        message: "주문 가격 확정에 실패했어요.",
        dealId,
      };
    }

    const paymentPrep = await preparePaymentAfterFinalize(
      row.id as string,
      discount.finalPaymentAmount,
    );
    if (!paymentPrep.success) {
      console.error("[finalizeDeal] prepare payment:", row.id);
      void logError({
        level: "critical",
        source: "finalize_deal",
        message: "Failed to prepare payment after finalization",
        orderId: row.id as string,
        dealId,
        productId: deal.products.slug,
        metadata: { prepError: paymentPrep.error ?? null },
      });
      return {
        success: false,
        error: "save_failed",
        message: "결제 준비 정보 저장에 실패했어요.",
        dealId,
      };
    }

    const paymentMethod = row.payment_method as string | null;
    if (isVirtualAccountMethod(paymentMethod)) {
      const { data: paymentRow } = await supabase
        .from("payments")
        .select("id")
        .eq("order_id", row.id as string)
        .maybeSingle();

      if (paymentRow) {
        await prepareGroupBuyVirtualAccountAfterFinalize({
          orderId: row.id as string,
          paymentId: paymentRow.id as string,
          amount: discount.finalPaymentAmount,
        });
      }
    }

    updatedOrderCount += 1;
  }

  const { error: dealUpdateError } = await supabase
    .from("group_buy_deals")
    .update({
      status: "closed",
      current_participants: participantCount,
    })
    .eq("id", dealId);

  if (dealUpdateError) {
    console.error("[finalizeDeal] update deal:", dealUpdateError.message);
    void logError({
      level: "critical",
      source: "finalize_deal",
      message: "Failed to close deal status after finalization",
      error: dealUpdateError,
      dealId,
      productId: deal.products.slug,
    });
    return {
      success: false,
      error: "save_failed",
      message: "공동구매 상태 저장에 실패했어요.",
      dealId,
    };
  }

  const { calculateSettlement } = await import("@/lib/settlements/calculate-settlement");
  const settlementResult = await calculateSettlement(dealId);

  if (!settlementResult.success && settlementResult.error !== "no_supplier") {
    console.warn("[finalizeDeal] settlement:", settlementResult.message ?? settlementResult.error);
  }

  const autoChargeStats = await processAutoChargesForDeal(dealId);
  if (autoChargeStats.processed > 0) {
    console.info("[finalizeDeal] auto-charge:", autoChargeStats);
  }

  return {
    success: true,
    dealId,
    finalUnitPrice,
    participantCount,
    updatedOrderCount,
    skippedOrderCount,
    message: `${updatedOrderCount}건 주문 가격을 확정했어요.`,
  };
}

/** Auto-close candidate deals past deadline (for cron / Edge Function). */
export async function finalizeDueDeals(): Promise<{
  processed: number;
  results: FinalizeDealResult[];
}> {
  if (!isSupabaseConfigured()) {
    return { processed: 0, results: [] };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { processed: 0, results: [] };
  }

  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("group_buy_deals")
    .select("id")
    .eq("status", "active")
    .lte("ends_at", nowIso);

  if (error || !data) {
    console.error("[finalizeDueDeals]:", error?.message);
    return { processed: 0, results: [] };
  }

  const results: FinalizeDealResult[] = [];

  for (const row of data) {
    results.push(await finalizeDeal(row.id as string));
  }

  return { processed: results.length, results };
}

export async function finalizeDealByProductId(
  productId: string,
  options: FinalizeDealOptions = {},
): Promise<FinalizeDealResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "not_configured" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  const { data, error } = await supabase
    .from("group_buy_deals")
    .select("id")
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return { success: false, error: "deal_not_found", message: "연결된 공동구매를 찾을 수 없어요." };
  }

  return finalizeDeal((data as { id: string }).id, options);
}
