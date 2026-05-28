import type { GroupBuyOrderCardItem } from "@/components/group-buy-order-card";
import type { CreateOrderInput } from "@/lib/database/types";
import { appendOrderTimeline } from "@/lib/data/order-timelines";
import { getDealById } from "@/lib/data/deals";
import { getUserIdentityProfile } from "@/lib/data/users";
import {
  validateOrdererInfo,
} from "@/lib/identity/orderer-validation";
import {
  buildOrderNumber,
} from "@/lib/orders/admin-order-status";
import { resolveOrderFlow, shouldChargeImmediately } from "@/lib/orders/order-flow";
import { canConfirmPurchase } from "@/lib/orders/shipping-status";
import type { UserOrderRecord } from "@/lib/reviews/review-rules";
import { shouldUseMockData } from "@/lib/env/runtime";
import { getDealUuidById } from "@/lib/services/deals";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isMissingTableError } from "@/lib/supabase/query-fallback";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  getUserOrderDisplayLabel,
  normalizeOrderStatus,
  normalizePaymentStatus,
} from "@/lib/orders/order-status";
import { normalizeShippingStatusWithConfirmed } from "@/lib/orders/shipping-status";
import { createPendingPayment } from "@/lib/payments/create-pending-payment";
import { isPaymentMethod } from "@/lib/payments/payment-methods";
import {
  DEFAULT_GROUPBUY_PAYMENT_FLOW,
  isPaymentFlow,
  normalizePaymentFlow,
  type PaymentFlow,
} from "@/lib/payments/payment-flow";
import {
  computeJoinedPriceForDealSlug,
  computeNormalPriceForDealSlug,
} from "@/lib/pricing/compute-joined-price";
import { normalizeProductType } from "@/lib/products/product-type";
import {
  getUserOrderedQuantityForProduct,
  releaseProductInventory,
  reserveProductInventory,
} from "@/lib/data/inventory";
import {
  inventoryFromDeal,
  validateOrderQuantity,
} from "@/lib/products/inventory";
import {
  isValidOrderQuantity,
  normalizeOrderQuantity,
} from "@/lib/security/order-quantity";
import { resolveOrderShippingSnapshot } from "@/lib/data/addresses";
import { getProductShippingBySlug } from "@/lib/data/product-shipping";
import { calculateOrderTotal } from "@/lib/discounts/calculate-order-total";
import { calculateOrderAmounts } from "@/lib/orders/calculate-order-amounts";
import {
  reservePoints,
  rollbackDiscounts,
} from "@/lib/discounts/points";
import { checkDealPriceTierNotifications } from "@/lib/notifications/price-tier";
import { logError } from "@/lib/monitoring/error-log";
import { notifyReviewAvailable } from "@/lib/notifications/order-events";
import {
  buildMypagePaginatedResult,
  paginateArray,
  resolveMypagePagination,
  type MypagePaginatedResult,
  type MypagePaginationOptions,
} from "@/lib/pagination/mypage";

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[orders] using mock fallback: ${context}`);
  }
}

export type CreateOrderResult = {
  success: boolean;
  id?: string;
  error?:
    | "login_required"
    | "save_failed"
    | "already_ordered"
    | "consent_required"
    | "sold_out"
    | "insufficient_stock"
    | "insufficient_capacity"
    | "quantity_limit_exceeded"
    | "invalid_quantity"
    | "orderer_incomplete"
    | "invalid_coupon"
    | "insufficient_points";
};

export type ConfirmPurchaseResult = {
  success: boolean;
  error?: "login_required" | "not_found" | "not_eligible" | "save_failed";
};

const mockOrderRecords: UserOrderRecord[] = [
  {
    id: "mock-order-1",
    userId: "00000000-0000-4000-8000-000000000001",
    productId: "wd-citrus-001",
    productName: "제주 고당도 감귤 3kg",
    joinedPrice: 12900,
    finalPrice: null,
    quantity: 1,
    orderStatus: "joined",
    paymentStatus: "ready",
    shippingStatus: "none",
    currentMembers: 118,
    targetMembers: 120,
    status: "모집중",
    createdAt: "2026-05-20T10:00:00.000Z",
  },
  {
    id: "mock-order-2",
    userId: "00000000-0000-4000-8000-000000000001",
    productId: "wd-vacuum-001",
    productName: "초경량 무선 청소기",
    joinedPrice: 79900,
    finalPrice: 21900,
    quantity: 1,
    orderStatus: "confirmed",
    paymentStatus: "paid",
    shippingStatus: "preparing",
    trackingCompany: "CJ대한통운",
    trackingNumber: null,
    shippedAt: null,
    deliveredAt: null,
    confirmedAt: null,
    currentMembers: 93,
    targetMembers: 95,
    status: "공동구매 성공",
    createdAt: "2026-05-15T10:00:00.000Z",
  },
];

function getMockOrderRecords(): UserOrderRecord[] {
  return mockOrderRecords.map((order) => ({ ...order }));
}

function toGroupBuyOrderCard(order: UserOrderRecord): GroupBuyOrderCardItem {
  const joinedLineTotal = order.joinedPrice * order.quantity;

  return {
    id: order.id,
    productName: order.productName,
    participationPrice: order.finalPrice ?? joinedLineTotal,
    joinedPrice: order.joinedPrice,
    finalPrice: order.finalPrice,
    quantity: order.quantity,
    currentParticipants: order.currentMembers,
    targetParticipants: order.targetMembers,
    displayStatus: getUserOrderDisplayLabel({
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      shippingStatus: order.shippingStatus,
    }),
    status: order.status,
  };
}

function mapOrderRow(row: Record<string, unknown>): UserOrderRecord {
  const orderStatus = normalizeOrderStatus(row.order_status as string | undefined);
  const paymentStatus = normalizePaymentStatus(row.payment_status as string | undefined);
  const shippingStatus = normalizeShippingStatusWithConfirmed(row.shipping_status as string | undefined);
  const trackingCompany =
    (row.tracking_company as string | null) ??
    (row.courier_company as string | null) ??
    null;

  return {
    id: row.id as string,
    userId: row.user_id as string,
    productId: row.product_id as string,
    productName: row.product_name as string,
    joinedPrice: row.joined_price as number,
    finalPrice: (row.final_price as number | null | undefined) ?? null,
    quantity: (row.quantity as number | undefined) ?? 1,
    orderStatus,
    paymentStatus,
    shippingStatus,
    trackingCompany,
    trackingNumber: (row.tracking_number as string | null) ?? null,
    shippedAt: (row.shipped_at as string | null) ?? null,
    deliveredAt: (row.delivered_at as string | null) ?? null,
    confirmedAt: (row.confirmed_at as string | null) ?? null,
    cancelReason: (row.cancel_reason as string | null) ?? null,
    refundReason: (row.refund_reason as string | null) ?? null,
    refundRequestedAt: (row.refund_requested_at as string | null) ?? null,
    refundStatus: (row.refund_status as string | null) ?? null,
    refundRejectedReason: (row.refund_rejected_reason as string | null) ?? null,
    currentMembers: row.current_members as number,
    targetMembers: row.target_members as number,
    status: row.status as string,
    createdAt: row.created_at as string,
    paymentMethod: (row.payment_method as string | null) ?? null,
    paymentFlow: (row.payment_flow as string | null) ?? null,
    productType: (row.product_type as string | null) ?? null,
  };
}

function deriveGroupBuyStatus(currentMembers: number, targetMembers: number): string {
  return currentMembers >= targetMembers ? "공동구매 성공" : "모집중";
}

function resolvePaymentFlow(
  productType: string,
  input: CreateOrderInput,
): PaymentFlow {
  if (shouldChargeImmediately(productType)) {
    return "instant";
  }

  if (input.paymentFlow && isPaymentFlow(input.paymentFlow)) {
    return input.paymentFlow;
  }

  return DEFAULT_GROUPBUY_PAYMENT_FLOW;
}

export async function createOrder(
  userId: string,
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  if (!isPaymentMethod(input.paymentMethod)) {
    return { success: false, error: "save_failed" };
  }

  if (input.quantity != null && !isValidOrderQuantity(input.quantity)) {
    return { success: false, error: "save_failed" };
  }

  if (!input.addressId?.trim()) {
    return { success: false, error: "save_failed" };
  }

  const quantity = normalizeOrderQuantity(input.quantity);
  const deal = await getDealById(input.productSlug);
  if (!deal) {
    return { success: false, error: "save_failed" };
  }

  const productType = normalizeProductType(input.productType ?? deal.productType);
  const inventory = inventoryFromDeal({ ...deal, productType });
  const userExistingQty = await getUserOrderedQuantityForProduct(userId, input.productSlug);
  const validation = validateOrderQuantity(inventory, quantity, userExistingQty);

  if (!validation.ok) {
    switch (validation.error) {
      case "sold_out":
        return { success: false, error: "sold_out" };
      case "insufficient_stock":
        return { success: false, error: "insufficient_stock" };
      case "insufficient_capacity":
        return { success: false, error: "insufficient_capacity" };
      case "per_user_limit_exceeded":
        return { success: false, error: "quantity_limit_exceeded" };
      case "quantity_out_of_range":
      case "invalid_quantity":
        return { success: false, error: "invalid_quantity" };
      default:
        return { success: false, error: "save_failed" };
    }
  }

  const priced =
    shouldChargeImmediately(productType) ?
      await computeNormalPriceForDealSlug(input.productSlug, quantity)
    : await computeJoinedPriceForDealSlug(input.productSlug);

  if (!priced) {
    return { success: false, error: "save_failed" };
  }

  const unitPrice =
    "unitPrice" in priced ? priced.unitPrice : priced.price;
  const lineTotal =
    "totalPrice" in priced ? priced.totalPrice : unitPrice * quantity;

  if (!Number.isFinite(unitPrice) || unitPrice < 0 || !Number.isFinite(lineTotal) || lineTotal < 0) {
    return { success: false, error: "save_failed" };
  }

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      return { success: true, id: "mock-order" };
    }
    return { success: false, error: "save_failed" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", input.productSlug)
    .maybeSingle();

  if (existing) {
    return { success: false, error: "already_ordered" };
  }

  const dealId = input.dealId ?? (await getDealUuidById(input.productSlug));

  const reserveResult = await reserveProductInventory({
    productSlug: input.productSlug,
    dealId: dealId ?? null,
    userId,
    quantity,
    productType,
  });

  if (!reserveResult.success) {
    switch (reserveResult.error) {
      case "sold_out":
        return { success: false, error: "sold_out" };
      case "insufficient_stock":
        return { success: false, error: "insufficient_stock" };
      case "insufficient_capacity":
        return { success: false, error: "insufficient_capacity" };
      case "per_user_limit_exceeded":
      case "quantity_out_of_range":
        return { success: false, error: "quantity_limit_exceeded" };
      case "invalid_quantity":
        return { success: false, error: "invalid_quantity" };
      default:
        return { success: false, error: "save_failed" };
    }
  }

  async function rollbackInventory() {
    await releaseProductInventory({
      productSlug: input.productSlug,
      dealId: dealId ?? null,
      quantity,
      productType,
    });
  }

  const shippingResult = await resolveOrderShippingSnapshot(
    userId,
    input.addressId,
    input.deliveryMemo ?? "",
  );

  if (!shippingResult.success) {
    await rollbackInventory();
    return { success: false, error: "save_failed" };
  }

  const shipping = shippingResult.snapshot;
  const joinedPrice = Math.round(unitPrice);
  const subtotalAmount = joinedPrice * quantity;
  const productShipping = await getProductShippingBySlug(input.productSlug);
  const amountBreakdown = calculateOrderAmounts({
    unitPrice: joinedPrice,
    quantity,
    product: productShipping,
    address: {
      postalCode: shipping.postalCode,
      isRemoteArea: shipping.isRemoteArea,
    },
  });
  const baseShippingFee = amountBreakdown.shipping.totalShippingFee;

  const discountPreview = await calculateOrderTotal({
    userId,
    subtotalAmount,
    couponCode: input.couponCode,
    pointAmount: input.pointAmount,
    shippingFee: baseShippingFee,
  });

  if (!discountPreview.success) {
    await rollbackInventory();
    if (discountPreview.error === "insufficient_points") {
      return { success: false, error: "insufficient_points" };
    }
    return { success: false, error: "invalid_coupon" };
  }

  const discount = discountPreview.breakdown;
  const shippingFee = discount.shippingFee;
  const finalPaymentAmount = discount.finalPaymentAmount;
  const discountStatus =
    discount.couponId || discount.pointDiscountAmount > 0 ? "reserved" as const : "none" as const;

  const ordererProfile = await getUserIdentityProfile(userId);
  const ordererValidation = validateOrdererInfo({
    realName: ordererProfile?.realName,
    phone: ordererProfile?.phone,
    phoneVerifiedAt: ordererProfile?.phoneVerifiedAt,
    hasDefaultAddress: true,
  });

  if (!ordererValidation.ok) {
    await rollbackInventory();
    return { success: false, error: "orderer_incomplete" };
  }

  const flow = resolveOrderFlow(productType, input.paymentMethod);
  const paymentFlow = resolvePaymentFlow(productType, input);
  const groupBuyStatus = deriveGroupBuyStatus(input.currentMembers, input.targetMembers);
  const orderStatus = flow.orderStatus;
  const paymentStatus = flow.paymentStatus;
  const shippingStatus = flow.shippingStatus;
  const statusLabel =
    shouldChargeImmediately(productType) ? "주문 완료" : groupBuyStatus;

  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      product_id: input.productSlug,
      product_name: priced.dealTitle,
      deal_id: dealId ?? null,
      joined_price: joinedPrice,
      final_price: shouldChargeImmediately(productType) ? subtotalAmount : null,
      current_members: Math.round(input.currentMembers),
      target_members: Math.round(input.targetMembers),
      status: statusLabel,
      quantity,
      subtotal_amount: subtotalAmount,
      coupon_id: discount.couponId,
      coupon_code: discount.couponCode,
      coupon_discount_amount: discount.couponDiscountAmount,
      point_discount_amount: discount.pointDiscountAmount,
      point_amount_reserved: discount.pointDiscountAmount,
      shipping_fee: amountBreakdown.shippingFee,
      remote_area_extra_fee: amountBreakdown.remoteAreaExtraFee,
      final_payment_amount: finalPaymentAmount,
      discount_status: discountStatus,
      payment_amount: finalPaymentAmount,
      order_status: orderStatus,
      payment_status: paymentStatus,
      shipping_status: shippingStatus,
      payment_method: input.paymentMethod,
      payment_flow: paymentFlow,
      saved_payment_method_id:
        paymentFlow === "post_deadline_auto" ? (input.savedPaymentMethodId ?? null) : null,
      product_type: productType,
      paid_at: paymentStatus === "paid" ? new Date().toISOString() : null,
      address_id: shipping.addressId,
      shipping_recipient_name: shipping.recipientName,
      shipping_phone: shipping.phone,
      shipping_postal_code: shipping.postalCode,
      shipping_address_line1: shipping.addressLine1,
      shipping_address_line2: shipping.addressLine2,
      shipping_delivery_memo: shipping.deliveryMemo,
      shipping_region: shipping.region,
      shipping_is_remote_area: shipping.isRemoteArea,
      orderer_name: ordererValidation.ordererName,
      orderer_phone: ordererValidation.ordererPhone,
      orderer_verification_status: ordererValidation.verificationStatus,
    })
    .select("id")
    .single();

  if (error) {
    if (!isMissingTableError(error.message)) {
      console.error("[data] createOrder:", error.message);
    }
    await rollbackInventory();
    void logError({
      level: "error",
      source: "checkout",
      message: "Order insert failed during checkout",
      error,
      userId,
      productId: input.productSlug,
      dealId: dealId ?? null,
      metadata: { quantity },
    });
    return { success: false, error: "save_failed" };
  }

  const orderId = (data as { id: string }).id;

  await appendOrderTimeline({
    orderId,
    status: "created",
    title: "주문 접수",
    message: shouldChargeImmediately(productType) ? "주문이 접수됐어요." : "공동구매 참여가 접수됐어요.",
    actorUserId: userId,
  });

  if (discount.pointDiscountAmount > 0) {
    const pointReserve = await reservePoints({
      userId,
      amount: discount.pointDiscountAmount,
      orderId,
    });

    if (!pointReserve.success) {
      await supabase.from("orders").delete().eq("id", orderId);
      await rollbackInventory();
      return {
        success: false,
        error: pointReserve.error === "insufficient_points" ? "insufficient_points" : "save_failed",
      };
    }
  }

  if (discountStatus === "reserved") {
    await supabase
      .from("orders")
      .update({ discount_status: "reserved" })
      .eq("id", orderId);
  }

  await supabase
    .from("orders")
    .update({ order_number: buildOrderNumber(orderId) })
    .eq("id", orderId);

  const paymentResult = await createPendingPayment({
    id: orderId,
    user_id: userId,
    deal_id: dealId ?? null,
    product_id: input.productSlug,
    joined_price: joinedPrice,
    quantity,
    paymentMethod: input.paymentMethod,
  });

  if (!paymentResult.success || !paymentResult.paymentId) {
    console.error("[data] createOrder: pending payment failed");
    await supabase.from("orders").delete().eq("id", orderId);
    await rollbackDiscounts(orderId);
    await rollbackInventory();
    return { success: false, error: "save_failed" };
  }

  if (!shouldChargeImmediately(productType) && dealId) {
    await checkDealPriceTierNotifications(dealId);
  }

  return { success: true, id: orderId };
}

const USER_ORDER_SELECT =
  "id, user_id, product_id, product_name, joined_price, final_price, quantity, order_status, payment_status, shipping_status, payment_method, payment_flow, product_type, courier_company, tracking_company, tracking_number, shipped_at, delivered_at, confirmed_at, cancel_reason, refund_reason, refund_requested_at, refund_status, refund_rejected_reason, current_members, target_members, status, created_at";

const USER_ORDER_SELECT_LEGACY =
  "id, user_id, product_id, product_name, joined_price, final_price, quantity, order_status, payment_status, shipping_status, payment_method, payment_flow, product_type, courier_company, tracking_company, tracking_number, shipped_at, delivered_at, confirmed_at, cancel_reason, refund_reason, refund_requested_at, current_members, target_members, status, created_at";

async function fetchUserOrderRows(
  userId: string,
  options?: MypagePaginationOptions,
): Promise<{ rows: UserOrderRecord[]; total: number }> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      logMockFallback("getUserOrdersDetailed: Supabase is not configured");
      const mockRows = getMockOrderRecords();
      if (options) {
        const paginated = paginateArray(mockRows, options);
        return { rows: paginated.items, total: paginated.total };
      }
      return { rows: mockRows, total: mockRows.length };
    }
    return { rows: [], total: 0 };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    if (shouldUseMockData()) {
      logMockFallback("getUserOrdersDetailed: failed to create Supabase client");
      const mockRows = getMockOrderRecords();
      if (options) {
        const paginated = paginateArray(mockRows, options);
        return { rows: paginated.items, total: paginated.total };
      }
      return { rows: mockRows, total: mockRows.length };
    }
    return { rows: [], total: 0 };
  }

  let rawRows: Record<string, unknown>[] | null = null;
  let error: { message: string } | null = null;
  let count: number | null = null;

  {
    let query = supabase
      .from("orders")
      .select(USER_ORDER_SELECT, options ? { count: "exact" } : undefined)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (options) {
      const { page, pageSize, offset } = resolveMypagePagination(options);
      query = query.range(offset, offset + pageSize - 1);
    }

    const result = await query;
    rawRows = (result.data ?? null) as Record<string, unknown>[] | null;
    error = result.error;
    count = result.count;

    if (error?.message.includes("refund_status")) {
      let legacyQuery = supabase
        .from("orders")
        .select(USER_ORDER_SELECT_LEGACY, options ? { count: "exact" } : undefined)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (options) {
        const { page, pageSize, offset } = resolveMypagePagination(options);
        legacyQuery = legacyQuery.range(offset, offset + pageSize - 1);
      }

      const legacyResult = await legacyQuery;
      rawRows = (legacyResult.data ?? null) as Record<string, unknown>[] | null;
      error = legacyResult.error;
      count = legacyResult.count;
    }
  }

  if (error) {
    if (!isMissingTableError(error.message)) {
      console.error("[data] getUserOrdersDetailed:", error.message);
    }
    if (shouldUseMockData()) {
      logMockFallback("getUserOrdersDetailed: query error");
      const mockRows = getMockOrderRecords();
      if (options) {
        const paginated = paginateArray(mockRows, options);
        return { rows: paginated.items, total: paginated.total };
      }
      return { rows: mockRows, total: mockRows.length };
    }
    return { rows: [], total: 0 };
  }

  const rows = (rawRows ?? []).map((row) => mapOrderRow(row));
  if (rows.length === 0 && shouldUseMockData()) {
    logMockFallback("getUserOrdersDetailed: empty result");
    const mockRows = getMockOrderRecords();
    if (options) {
      const paginated = paginateArray(mockRows, options);
      return { rows: paginated.items, total: paginated.total };
    }
    return { rows: mockRows, total: mockRows.length };
  }

  return { rows, total: count ?? rows.length };
}

export async function getUserOrdersDetailed(userId: string): Promise<UserOrderRecord[]>;
export async function getUserOrdersDetailed(
  userId: string,
  options: MypagePaginationOptions,
): Promise<MypagePaginatedResult<UserOrderRecord>>;
export async function getUserOrdersDetailed(
  userId: string,
  options?: MypagePaginationOptions,
): Promise<UserOrderRecord[] | MypagePaginatedResult<UserOrderRecord>> {
  const { rows, total } = await fetchUserOrderRows(userId, options);

  if (options) {
    const { page, pageSize } = resolveMypagePagination(options);
    return buildMypagePaginatedResult(rows, total, page, pageSize);
  }

  return rows;
}

export async function getOrdersForUser(userId: string): Promise<GroupBuyOrderCardItem[]> {
  const orders = await getUserOrdersDetailed(userId);
  return orders.map(toGroupBuyOrderCard);
}

export async function userHasOrderForProduct(
  userId: string,
  productId: string,
): Promise<boolean> {
  const orders = await getUserOrdersDetailed(userId);
  return orders.some((order) => order.productId === productId);
}

export async function getUserOrderById(
  userId: string,
  orderId: string,
): Promise<UserOrderRecord | null> {
  if (orderId.startsWith("mock-order-")) {
    return getMockOrderRecords().find((order) => order.id === orderId && order.userId === userId) ?? null;
  }

  const orders = await getUserOrdersDetailed(userId);
  return orders.find((order) => order.id === orderId) ?? null;
}

export async function confirmPurchaseForUser(
  userId: string,
  orderId: string,
): Promise<ConfirmPurchaseResult> {
  const order = await getUserOrderById(userId, orderId);
  if (!order) {
    return { success: false, error: "not_found" };
  }

  if (!canConfirmPurchase(order)) {
    return { success: false, error: "not_eligible" };
  }

  const now = new Date().toISOString();

  if (orderId.startsWith("mock-order-")) {
    const mockOrder = mockOrderRecords.find((item) => item.id === orderId);
    if (mockOrder) {
      mockOrder.shippingStatus = "confirmed";
      mockOrder.confirmedAt = now;
    }
    return { success: true };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, error: "save_failed" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { data, error } = await supabase
    .from("orders")
    .update({
      shipping_status: "confirmed",
      confirmed_at: now,
    })
    .eq("id", orderId)
    .eq("user_id", userId)
    .eq("shipping_status", "delivered")
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[data] confirmPurchaseForUser:", error.message);
    return { success: false, error: "save_failed" };
  }

  if (!data) {
    return { success: false, error: "not_eligible" };
  }

  await notifyReviewAvailable({
    userId,
    productName: order.productName,
    productId: order.productId,
  });

  return { success: true };
}

export async function getUserOrderForProduct(
  userId: string,
  productId: string,
): Promise<UserOrderRecord | null> {
  const orders = await getUserOrdersDetailed(userId);
  return orders.find((order) => order.productId === productId) ?? null;
}
