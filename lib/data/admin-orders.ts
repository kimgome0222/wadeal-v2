import {
  buildOrderNumber,
  formatOrderCurrency,
  formatOrderDate,
  getOrderStatusLabel,
  getPaymentStatusLabel,
  getShippingStatusLabel,
  getUserOrderDisplayLabel,
  isOrderStatus,
  isPaymentStatus,
  isShippingStatus,
  matchesUserOrderDisplayFilter,
  normalizeOrderStatus,
  normalizePaymentStatus,
  normalizeShippingStatus,
  parseUserOrderDisplayFilter,
  USER_ORDER_DISPLAY_FILTER_ALL,
  type OrderStatus,
  type PaymentStatus,
  type ShippingStatus,
  type UserOrderDisplayFilter,
} from "@/lib/orders/admin-order-status";
import { maskUserId } from "@/lib/reviews/review-rules";
import { formatKoreanMobile } from "@/lib/identity/phone";
import {
  getVerificationStatusLabel,
  isVerificationStatus,
} from "@/lib/identity/verification-status";
import { shouldUseMockData } from "@/lib/env/runtime";
import {
  notifyPaymentPaid,
  notifyRefundUpdated,
  notifyShippingDelivered,
  notifyShippingStarted,
} from "@/lib/notifications";
import { logError } from "@/lib/monitoring/error-log";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { releaseProductInventory } from "@/lib/data/inventory";
import { getDealUuidById } from "@/lib/services/deals";

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[admin-orders] using mock fallback: ${context}`);
  }
}

export type AdminOrderListItem = {
  id: string;
  orderNumber: string;
  productName: string;
  buyerName: string;
  quantity: number;
  paymentAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  displayStatus: string;
  orderDate: string;
  orderDateIso: string;
};

export type AdminOrderDetail = AdminOrderListItem & {
  userId: string;
  productId: string;
  groupBuyStatus: string;
  paymentMethod: string | null;
  paymentFlow: string;
  productType: string | null;
  ordererName: string | null;
  ordererPhone: string | null;
  ordererVerificationStatus: string | null;
  ordererVerificationLabel: string;
  courierCompany: string | null;
  trackingNumber: string | null;
  adminMemo: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  confirmedAt: string | null;
  joinedPrice: number;
  finalPrice: number | null;
  currentMembers: number;
  targetMembers: number;
  shippingRecipientName: string | null;
  shippingPhone: string | null;
  shippingPostalCode: string | null;
  shippingAddressLine1: string | null;
  shippingAddressLine2: string | null;
  shippingDeliveryMemo: string | null;
  shippingRegion: string | null;
  shippingIsRemoteArea: boolean | null;
  shippingFee: number | null;
  cancelReason: string | null;
  refundReason: string | null;
  refundRequestedAt: string | null;
};

export type AdminOrderClaimType = "cancel" | "full_refund" | "partial_refund";

export type UpdateAdminOrderInput = {
  orderId: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  courierCompany: string | null;
  trackingNumber: string | null;
  adminMemo: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  cancelReason?: string | null;
  refundReason?: string | null;
  clearRefundRequest?: boolean;
};

export type UpdateAdminOrderResult = {
  success: boolean;
  error?: "not_found" | "save_failed" | "invalid_input";
};

type MockAdminOrderRecord = AdminOrderDetail & {
  updatedAt?: string;
};

const EMPTY_CLAIM_SNAPSHOT = {
  cancelReason: null,
  refundReason: null,
  refundRequestedAt: null,
} satisfies Pick<AdminOrderDetail, "cancelReason" | "refundReason" | "refundRequestedAt">;

const EMPTY_SHIPPING_SNAPSHOT = {
  shippingRecipientName: null,
  shippingPhone: null,
  shippingPostalCode: null,
  shippingAddressLine1: null,
  shippingAddressLine2: null,
  shippingDeliveryMemo: null,
  shippingRegion: null,
  shippingIsRemoteArea: null,
  shippingFee: null,
} satisfies Pick<
  AdminOrderDetail,
  | "shippingRecipientName"
  | "shippingPhone"
  | "shippingPostalCode"
  | "shippingAddressLine1"
  | "shippingAddressLine2"
  | "shippingDeliveryMemo"
  | "shippingRegion"
  | "shippingIsRemoteArea"
  | "shippingFee"
>;

const mockAdminOrders: MockAdminOrderRecord[] = [
  {
    id: "mock-admin-order-1",
    orderNumber: "WD-MOCK0001",
    userId: "00000000-0000-4000-8000-000000000001",
    productId: "wd-citrus-001",
    productName: "제주 고당도 감귤 3kg",
    buyerName: "데모회원",
    quantity: 1,
    paymentAmount: 12900,
    orderStatus: "joined",
    paymentStatus: "ready",
    shippingStatus: "none",
    displayStatus: "참여완료",
    orderDate: "2026. 05. 20. 19:00",
    orderDateIso: "2026-05-20T10:00:00.000Z",
    groupBuyStatus: "모집중",
    paymentMethod: "card",
    paymentFlow: "post_deadline_manual",
    productType: "groupbuy",
    ordererName: "데모회원",
    ordererPhone: "010-1234-5678",
    ordererVerificationStatus: "unverified",
    ordererVerificationLabel: "미인증",
    courierCompany: null,
    trackingNumber: null,
    adminMemo: null,
    shippedAt: null,
    deliveredAt: null,
    confirmedAt: null,
    joinedPrice: 12900,
    finalPrice: null,
    currentMembers: 118,
    targetMembers: 120,
    ...EMPTY_SHIPPING_SNAPSHOT,
    ...EMPTY_CLAIM_SNAPSHOT,
  },
  {
    id: "mock-admin-order-2",
    orderNumber: "WD-MOCK0002",
    userId: "00000000-0000-4000-8000-000000000002",
    productId: "wd-vacuum-001",
    productName: "초경량 무선 청소기",
    buyerName: "u***2",
    quantity: 2,
    paymentAmount: 159800,
    orderStatus: "confirmed",
    paymentStatus: "paid",
    shippingStatus: "preparing",
    displayStatus: "배송준비",
    orderDate: "2026. 05. 15. 19:00",
    orderDateIso: "2026-05-15T10:00:00.000Z",
    groupBuyStatus: "공동구매 성공",
    paymentMethod: "card",
    paymentFlow: "post_deadline_auto",
    productType: "groupbuy",
    ordererName: "데모회원2",
    ordererPhone: "010-9876-5432",
    ordererVerificationStatus: "phone_verified",
    ordererVerificationLabel: "휴대폰 인증 완료",
    courierCompany: "CJ대한통운",
    trackingNumber: "123456789012",
    adminMemo: "출고 예정",
    shippedAt: "2026-05-16T10:00:00.000Z",
    deliveredAt: null,
    confirmedAt: null,
    joinedPrice: 79900,
    finalPrice: 74900,
    currentMembers: 95,
    targetMembers: 95,
    ...EMPTY_SHIPPING_SNAPSHOT,
    ...EMPTY_CLAIM_SNAPSHOT,
  },
  {
    id: "mock-admin-order-3",
    orderNumber: "WD-MOCK0003",
    userId: "00000000-0000-4000-8000-000000000003",
    productId: "wd-beef-001",
    productName: "한우 등심 600g",
    buyerName: "u***3",
    quantity: 1,
    paymentAmount: 89000,
    orderStatus: "confirmed",
    paymentStatus: "paid",
    shippingStatus: "shipped",
    displayStatus: "배송중",
    orderDate: "2026. 05. 10. 19:00",
    orderDateIso: "2026-05-10T10:00:00.000Z",
    groupBuyStatus: "공동구매 성공",
    paymentMethod: "card",
    paymentFlow: "post_deadline_manual",
    productType: "groupbuy",
    ordererName: "데모회원3",
    ordererPhone: "010-5555-6666",
    ordererVerificationStatus: "identity_verified",
    ordererVerificationLabel: "본인인증 완료",
    courierCompany: "롯데택배",
    trackingNumber: "987654321098",
    adminMemo: null,
    shippedAt: "2026-05-11T10:00:00.000Z",
    deliveredAt: null,
    confirmedAt: null,
    joinedPrice: 89000,
    finalPrice: 84900,
    currentMembers: 80,
    targetMembers: 80,
    ...EMPTY_SHIPPING_SNAPSHOT,
    ...EMPTY_CLAIM_SNAPSHOT,
  },
];

const mockOrderOverrides = new Map<string, Partial<MockAdminOrderRecord>>();

function getMockAdminOrders(): MockAdminOrderRecord[] {
  return mockAdminOrders.map((order) => {
    const merged = {
      ...order,
      ...mockOrderOverrides.get(order.id),
    };

    return {
      ...merged,
      displayStatus: getUserOrderDisplayLabel({
        orderStatus: merged.orderStatus,
        paymentStatus: merged.paymentStatus,
        shippingStatus: merged.shippingStatus,
      }),
    };
  });
}

function toListItem(order: AdminOrderDetail): AdminOrderListItem {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    productName: order.productName,
    buyerName: order.buyerName,
    quantity: order.quantity,
    paymentAmount: order.paymentAmount,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    shippingStatus: order.shippingStatus,
    displayStatus: order.displayStatus,
    orderDate: order.orderDate,
    orderDateIso: order.orderDateIso,
  };
}

function resolveBuyerName(
  userId: string | null | undefined,
  profile?: { nickname?: string | null; email?: string | null } | null,
): string {
  if (profile?.nickname) {
    return profile.nickname;
  }

  if (profile?.email) {
    return profile.email.split("@")[0] ?? profile.email;
  }

  return maskUserId(userId ?? "unknown");
}

function resolveOrdererVerificationLabel(status: string | null | undefined): string {
  if (status && isVerificationStatus(status)) {
    return getVerificationStatusLabel(status);
  }
  return getVerificationStatusLabel("unverified");
}

function mapOrderRow(
  row: Record<string, unknown>,
  buyerProfiles: Map<string, { nickname: string | null; email: string | null }>,
): AdminOrderDetail {
  const userId = row.user_id as string;
  const profile = buyerProfiles.get(userId);
  const groupBuyStatus = (row.status as string) ?? "모집중";
  const orderStatus = normalizeOrderStatus(row.order_status as string | undefined);
  const paymentStatus = normalizePaymentStatus(row.payment_status as string | undefined);
  const shippingStatus = normalizeShippingStatus(row.shipping_status as string | undefined);
  const quantity = (row.quantity as number) ?? 1;
  const joinedPrice = row.joined_price as number;
  const finalPrice = (row.final_price as number | null | undefined) ?? null;
  const paymentAmount =
    (row.payment_amount as number | null) ??
    (finalPrice != null ? finalPrice : joinedPrice * quantity);
  const createdAtIso = row.created_at as string;
  const trackingCompany =
    (row.tracking_company as string | null) ??
    (row.courier_company as string | null) ??
    null;

  return {
    id: row.id as string,
    orderNumber:
      (row.order_number as string | null) ?? buildOrderNumber(row.id as string),
    userId,
    productId: row.product_id as string,
    productName: row.product_name as string,
    buyerName: resolveBuyerName(userId, profile),
    quantity,
    paymentAmount,
    orderStatus,
    paymentStatus,
    shippingStatus,
    displayStatus: getUserOrderDisplayLabel({
      orderStatus,
      paymentStatus,
      shippingStatus,
    }),
    orderDate: formatOrderDate(createdAtIso),
    orderDateIso: createdAtIso,
    groupBuyStatus,
    paymentMethod: (row.payment_method as string | null) ?? null,
    paymentFlow: (row.payment_flow as string | null) ?? "post_deadline_manual",
    productType: (row.product_type as string | null) ?? null,
    ordererName: (row.orderer_name as string | null) ?? null,
    ordererPhone:
      row.orderer_phone != null ?
        formatKoreanMobile(String(row.orderer_phone))
      : null,
    ordererVerificationStatus: (row.orderer_verification_status as string | null) ?? null,
    ordererVerificationLabel: resolveOrdererVerificationLabel(
      row.orderer_verification_status as string | null | undefined,
    ),
    courierCompany: trackingCompany,
    trackingNumber: (row.tracking_number as string | null) ?? null,
    adminMemo: (row.admin_memo as string | null) ?? null,
    shippedAt: (row.shipped_at as string | null) ?? null,
    deliveredAt: (row.delivered_at as string | null) ?? null,
    confirmedAt: (row.confirmed_at as string | null) ?? null,
    joinedPrice,
    finalPrice,
    currentMembers: row.current_members as number,
    targetMembers: row.target_members as number,
    shippingRecipientName: (row.shipping_recipient_name as string | null) ?? null,
    shippingPhone: (row.shipping_phone as string | null) ?? null,
    shippingPostalCode: (row.shipping_postal_code as string | null) ?? null,
    shippingAddressLine1: (row.shipping_address_line1 as string | null) ?? null,
    shippingAddressLine2: (row.shipping_address_line2 as string | null) ?? null,
    shippingDeliveryMemo: (row.shipping_delivery_memo as string | null) ?? null,
    shippingRegion: (row.shipping_region as string | null) ?? null,
    shippingIsRemoteArea: (row.shipping_is_remote_area as boolean | null) ?? null,
    shippingFee: (row.shipping_fee as number | null) ?? null,
    cancelReason: (row.cancel_reason as string | null) ?? null,
    refundReason: (row.refund_reason as string | null) ?? null,
    refundRequestedAt: (row.refund_requested_at as string | null) ?? null,
  };
}

const ORDER_SELECT_COLUMNS =
  "id, user_id, product_id, product_name, joined_price, final_price, current_members, target_members, status, created_at, order_number, quantity, payment_amount, order_status, payment_status, shipping_status, payment_method, payment_flow, product_type, courier_company, tracking_company, tracking_number, admin_memo, shipped_at, delivered_at, confirmed_at, orderer_name, orderer_phone, orderer_verification_status, shipping_recipient_name, shipping_phone, shipping_postal_code, shipping_address_line1, shipping_address_line2, shipping_delivery_memo, shipping_region, shipping_is_remote_area, shipping_fee, cancel_reason, refund_reason, refund_requested_at";

async function loadBuyerProfiles(
  userIds: string[],
): Promise<Map<string, { nickname: string | null; email: string | null }>> {
  const profiles = new Map<string, { nickname: string | null; email: string | null }>();

  if (userIds.length === 0 || !isSupabaseConfigured()) {
    return profiles;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return profiles;
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, nickname, email")
    .in("id", userIds);

  if (error) {
    console.error("[data] loadBuyerProfiles:", error.message);
    return profiles;
  }

  for (const row of data ?? []) {
    profiles.set(row.id as string, {
      nickname: (row.nickname as string | null) ?? null,
      email: (row.email as string | null) ?? null,
    });
  }

  return profiles;
}

export function filterAdminOrdersByStatus(
  orders: AdminOrderListItem[],
  filter: UserOrderDisplayFilter,
): AdminOrderListItem[] {
  if (filter === USER_ORDER_DISPLAY_FILTER_ALL) {
    return orders;
  }

  return orders.filter((order) => matchesUserOrderDisplayFilter(order, filter));
}

export function parseAdminOrderStatusFilter(
  value: string | undefined,
): UserOrderDisplayFilter {
  return parseUserOrderDisplayFilter(value);
}

export async function getAllAdminOrders(): Promise<AdminOrderListItem[]> {
  const details = await getAllAdminOrdersDetailed();
  return details.map(toListItem);
}

export async function getAllAdminOrdersDetailed(): Promise<AdminOrderDetail[]> {
  if (!isSupabaseConfigured()) {
    logMockFallback("getAllAdminOrdersDetailed: Supabase is not configured");
    return shouldUseMockData() ? getMockAdminOrders() : [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    logMockFallback("getAllAdminOrdersDetailed: failed to create Supabase client");
    return shouldUseMockData() ? getMockAdminOrders() : [];
  }

  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[data] getAllAdminOrdersDetailed:", error.message);
    logMockFallback("getAllAdminOrdersDetailed: query error");
    return shouldUseMockData() ? getMockAdminOrders() : [];
  }

  const rows = data ?? [];
  if (rows.length === 0) {
    logMockFallback("getAllAdminOrdersDetailed: empty result");
    return shouldUseMockData() ? getMockAdminOrders() : [];
  }

  const userIds = [
    ...new Set(rows.map((row) => row.user_id as string).filter(Boolean)),
  ];
  const buyerProfiles = await loadBuyerProfiles(userIds);

  return rows.map((row) =>
    mapOrderRow(row as Record<string, unknown>, buyerProfiles),
  );
}

export async function getAdminOrderById(
  orderId: string,
): Promise<AdminOrderDetail | null> {
  if (orderId.startsWith("mock-admin-order-")) {
    return getMockAdminOrders().find((order) => order.id === orderId) ?? null;
  }

  if (!isSupabaseConfigured()) {
    return shouldUseMockData() ?
        (getMockAdminOrders().find((order) => order.id === orderId) ?? null)
      : null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return shouldUseMockData() ?
        (getMockAdminOrders().find((order) => order.id === orderId) ?? null)
      : null;
  }

  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT_COLUMNS)
    .eq("id", orderId)
    .maybeSingle();

  if (error) {
    console.error("[data] getAdminOrderById:", error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  const userId = data.user_id as string;
  const buyerProfiles = await loadBuyerProfiles([userId]);
  return mapOrderRow(data as Record<string, unknown>, buyerProfiles);
}

export async function updateAdminOrder(
  input: UpdateAdminOrderInput,
): Promise<UpdateAdminOrderResult> {
  if (
    !isOrderStatus(input.orderStatus) ||
    !isPaymentStatus(input.paymentStatus) ||
    !isShippingStatus(input.shippingStatus)
  ) {
    return { success: false, error: "invalid_input" };
  }

  const existing = await getAdminOrderById(input.orderId);
  if (!existing && !input.orderId.startsWith("mock-admin-order-")) {
    return { success: false, error: "not_found" };
  }

  const now = new Date().toISOString();
  const trackingNumber = input.trackingNumber?.trim() || null;
  const hadTrackingNumber = Boolean(existing?.trackingNumber?.trim());
  let shippingStatus = input.shippingStatus;

  if (trackingNumber && !hadTrackingNumber && (shippingStatus === "none" || shippingStatus === "preparing")) {
    shippingStatus = "shipped";
  }

  let shippedAt = input.shippedAt?.trim() || existing?.shippedAt || null;
  let deliveredAt = input.deliveredAt?.trim() || existing?.deliveredAt || null;

  if (shippingStatus === "shipped" && !shippedAt) {
    shippedAt = now;
  }

  if (shippingStatus === "delivered" && !deliveredAt) {
    deliveredAt = now;
  }

  const patch = {
    order_status: input.orderStatus,
    payment_status: input.paymentStatus,
    shipping_status: shippingStatus,
    courier_company: input.courierCompany?.trim() || null,
    tracking_company: input.courierCompany?.trim() || null,
    tracking_number: trackingNumber,
    admin_memo: input.adminMemo?.trim() || null,
    shipped_at: shippedAt,
    delivered_at: deliveredAt,
    ...(input.cancelReason !== undefined ? { cancel_reason: input.cancelReason?.trim() || null } : {}),
    ...(input.refundReason !== undefined ? { refund_reason: input.refundReason?.trim() || null } : {}),
    ...(input.clearRefundRequest ? { refund_requested_at: null } : {}),
    ...(input.paymentStatus === "paid" && existing?.paymentStatus !== "paid"
      ? { paid_at: now }
      : {}),
    ...(input.orderStatus === "cancelled" && existing?.orderStatus !== "cancelled"
      ? { cancelled_at: now }
      : {}),
    ...((input.orderStatus === "refunded" || input.paymentStatus === "refunded") &&
    existing?.paymentStatus !== "refunded" &&
    existing?.orderStatus !== "refunded"
      ? { refunded_at: now }
      : {}),
  };

  if (input.orderId.startsWith("mock-admin-order-")) {
    mockOrderOverrides.set(input.orderId, {
      orderStatus: input.orderStatus,
      paymentStatus: input.paymentStatus,
      shippingStatus,
      displayStatus: getUserOrderDisplayLabel({
        orderStatus: input.orderStatus,
        paymentStatus: input.paymentStatus,
        shippingStatus,
      }),
      courierCompany: input.courierCompany,
      trackingNumber: input.trackingNumber,
      adminMemo: input.adminMemo,
      shippedAt,
      deliveredAt,
    });
    return { success: true };
  }

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { data, error } = await supabase
    .from("orders")
    .update(patch)
    .eq("id", input.orderId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[data] updateAdminOrder:", error.message);
    const becameRefundedAttempt =
      input.orderStatus === "refunded" ||
      input.paymentStatus === "refunded";
    const shippingChangeAttempt = existing && input.shippingStatus !== existing.shippingStatus;

    void logError({
      level: becameRefundedAttempt ? "error" : shippingChangeAttempt ? "warning" : "error",
      source: becameRefundedAttempt ? "payment" : "shipping",
      message: becameRefundedAttempt
        ? "Admin refund status update failed"
        : "Admin shipping status update failed",
      error,
      orderId: input.orderId,
      userId: existing?.userId ?? null,
      productId: existing?.productId ?? null,
      metadata: {
        orderStatus: input.orderStatus,
        paymentStatus: input.paymentStatus,
        shippingStatus: input.shippingStatus,
      },
    });
    return { success: false, error: "save_failed" };
  }

  if (!data) {
    return { success: false, error: "not_found" };
  }

  if (existing) {
    if (shippingStatus === "shipped" && existing.shippingStatus !== "shipped") {
      await notifyShippingStarted({
        userId: existing.userId,
        productName: existing.productName,
        courierCompany: input.courierCompany,
      });
    }

    if (shippingStatus === "delivered" && existing.shippingStatus !== "delivered") {
      await notifyShippingDelivered({
        userId: existing.userId,
        productName: existing.productName,
      });
    }

    if (input.paymentStatus === "paid" && existing.paymentStatus !== "paid") {
      await notifyPaymentPaid({
        userId: existing.userId,
        productName: existing.productName,
        amount: existing.finalPrice ?? existing.joinedPrice * existing.quantity,
      });
    }

    const becameCancelled =
      input.orderStatus === "cancelled" &&
      existing.orderStatus !== "cancelled" &&
      existing.orderStatus !== "refunded";

    const becameRefunded =
      (input.orderStatus === "refunded" && existing.orderStatus !== "refunded") ||
      (input.paymentStatus === "refunded" && existing.paymentStatus !== "refunded");

    if (becameCancelled || becameRefunded) {
      const dealUuid = await getDealUuidById(existing.productId);
      await releaseProductInventory({
        productSlug: existing.productId,
        dealId: dealUuid ?? null,
        quantity: existing.quantity,
        productType: existing.productType ?? "groupbuy",
      });
    }

    if (becameRefunded) {
      await notifyRefundUpdated({
        userId: existing.userId,
        productName: existing.productName,
      });
    }
  }

  return { success: true };
}

export type ProcessAdminOrderClaimInput = {
  orderId: string;
  claimType: AdminOrderClaimType;
  reason: string;
  partialAmount?: number | null;
};

export async function processAdminOrderClaim(
  input: ProcessAdminOrderClaimInput,
): Promise<UpdateAdminOrderResult> {
  const reason = input.reason.trim();
  if (!reason) {
    return { success: false, error: "invalid_input" };
  }

  const existing = await getAdminOrderById(input.orderId);
  if (!existing) {
    return { success: false, error: "not_found" };
  }

  if (input.claimType === "cancel") {
    return updateAdminOrder({
      orderId: input.orderId,
      orderStatus: "cancelled",
      paymentStatus:
        existing.paymentStatus === "paid" ? "cancelled" : existing.paymentStatus,
      shippingStatus: existing.shippingStatus,
      courierCompany: existing.courierCompany,
      trackingNumber: existing.trackingNumber,
      adminMemo: existing.adminMemo,
      cancelReason: reason,
      clearRefundRequest: Boolean(existing.refundRequestedAt),
    });
  }

  if (input.claimType === "full_refund") {
    return updateAdminOrder({
      orderId: input.orderId,
      orderStatus: "refunded",
      paymentStatus: "refunded",
      shippingStatus: existing.shippingStatus,
      courierCompany: existing.courierCompany,
      trackingNumber: existing.trackingNumber,
      adminMemo: existing.adminMemo,
      refundReason: reason,
      clearRefundRequest: true,
    });
  }

  const partialAmount = input.partialAmount ?? 0;
  if (partialAmount <= 0 || partialAmount > existing.paymentAmount) {
    return { success: false, error: "invalid_input" };
  }

  const partialNote = `[부분환불 ${partialAmount.toLocaleString("ko-KR")}원] ${reason}`;
  const adminMemo =
    existing.adminMemo ? `${existing.adminMemo}\n${partialNote}` : partialNote;

  const result = await updateAdminOrder({
    orderId: input.orderId,
    orderStatus: existing.orderStatus,
    paymentStatus: existing.paymentStatus,
    shippingStatus: existing.shippingStatus,
    courierCompany: existing.courierCompany,
    trackingNumber: existing.trackingNumber,
    adminMemo,
    refundReason: reason,
    clearRefundRequest: true,
  });

  if (result.success) {
    await notifyRefundUpdated({
      userId: existing.userId,
      productName: existing.productName,
    });
  }

  return result;
}
