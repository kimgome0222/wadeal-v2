import { appendOrderTimeline } from "@/lib/data/order-timelines";
import { getAdminOrderById } from "@/lib/data/admin-orders";
import { releaseProductInventory } from "@/lib/data/inventory";
import { notifyRefundUpdated } from "@/lib/notifications/order-events";
import { createUserNotification } from "@/lib/notifications/unified";
import { getDealUuidById } from "@/lib/services/deals";
import {
  normalizeOrderRefundStatus,
  type OrderRefundStatus,
  type RefundRecordStatus,
} from "@/lib/orders/refund-status";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isMissingTableError } from "@/lib/supabase/query-fallback";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

export type RefundClaimType = "cancel" | "refund";

export type RefundRecord = {
  id: string;
  orderId: string;
  userId: string;
  status: RefundRecordStatus;
  reason: string;
  amount: number;
  createdAt: string;
  rejectedAt: string | null;
  rejectedReason: string | null;
  claimType: RefundClaimType;
  productName: string;
  orderNumber: string;
  buyerName: string;
};

type RefundRow = {
  id: string;
  order_id: string;
  user_id: string;
  status: string;
  reason: string;
  amount: number;
  created_at: string;
  rejected_at: string | null;
  rejected_reason: string | null;
};

function inferClaimType(order: {
  cancelReason?: string | null;
  refundReason?: string | null;
}): RefundClaimType {
  if (order.cancelReason?.trim()) {
    return "cancel";
  }

  return "refund";
}

function mapRefundRow(
  row: RefundRow,
  order?: {
    productName: string;
    orderNumber: string;
    buyerName: string;
    cancelReason?: string | null;
    refundReason?: string | null;
  },
): RefundRecord {
  return {
    id: row.id,
    orderId: row.order_id,
    userId: row.user_id,
    status: row.status as RefundRecordStatus,
    reason: row.reason,
    amount: row.amount,
    createdAt: row.created_at,
    rejectedAt: row.rejected_at,
    rejectedReason: row.rejected_reason,
    claimType: order ? inferClaimType(order) : "refund",
    productName: order?.productName ?? "주문",
    orderNumber: order?.orderNumber ?? row.order_id.slice(0, 8),
    buyerName: order?.buyerName ?? "고객",
  };
}

async function getWriteClient() {
  return createServiceRoleSupabaseClient() ?? (await createServerSupabaseClient());
}

function resolveMaxRefundableAmount(order: {
  final_payment_amount?: number | null;
  payment_amount?: number | null;
  final_price?: number | null;
  joined_price?: number | null;
  quantity?: number | null;
}): number {
  const fromPayment = order.final_payment_amount ?? order.payment_amount ?? null;
  if (fromPayment != null && Number.isFinite(fromPayment) && fromPayment > 0) {
    return Math.round(fromPayment);
  }

  const lineTotal =
    order.final_price ??
    (order.joined_price != null && order.quantity != null ?
      order.joined_price * order.quantity
    : null);
  if (lineTotal != null && Number.isFinite(lineTotal) && lineTotal > 0) {
    return Math.round(lineTotal);
  }

  return 0;
}

export async function createRefundRequest(input: {
  orderId: string;
  userId: string;
  claimType: RefundClaimType;
  reason: string;
  amount: number;
}): Promise<{ ok: boolean; refundId?: string }> {
  const requestedAmount = Math.round(input.amount);
  if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
    return { ok: false };
  }

  if (!isSupabaseConfigured()) {
    return { ok: false };
  }

  const supabase = await getWriteClient();
  if (!supabase) {
    return { ok: false };
  }

  const { data: orderRow, error: orderFetchError } = await supabase
    .from("orders")
    .select("final_payment_amount, payment_amount, final_price, joined_price, quantity")
    .eq("id", input.orderId)
    .eq("user_id", input.userId)
    .maybeSingle();

  if (orderFetchError || !orderRow) {
    if (orderFetchError && isMissingTableError(orderFetchError.message)) {
      return { ok: false };
    }
    return { ok: false };
  }

  const maxRefundable = resolveMaxRefundableAmount(
    orderRow as {
      final_payment_amount?: number | null;
      payment_amount?: number | null;
      final_price?: number | null;
      joined_price?: number | null;
      quantity?: number | null;
    },
  );

  if (maxRefundable <= 0 || requestedAmount > maxRefundable) {
    return { ok: false };
  }

  const now = new Date().toISOString();
  const orderFields =
    input.claimType === "cancel" ?
      {
        cancel_reason: input.reason,
        refund_reason: null,
        refund_requested_at: now,
        refund_status: "requested" as OrderRefundStatus,
        refund_rejected_reason: null,
      }
    : {
        refund_reason: input.reason,
        refund_requested_at: now,
        refund_status: "requested" as OrderRefundStatus,
        refund_rejected_reason: null,
      };

  const { error: orderError } = await supabase
    .from("orders")
    .update(orderFields)
    .eq("id", input.orderId)
    .eq("user_id", input.userId);

  if (orderError) {
    if (isMissingTableError(orderError.message)) {
      return { ok: false };
    }
    console.error("[refunds] createRefundRequest order update:", orderError.message);
    return { ok: false };
  }

  const { data, error } = await supabase
    .from("refunds")
    .insert({
      order_id: input.orderId,
      user_id: input.userId,
      status: "pending",
      reason: input.reason,
      amount: requestedAmount,
    })
    .select("id")
    .single();

  if (error) {
    if (isMissingTableError(error.message)) {
      return { ok: false };
    }
    console.error("[refunds] createRefundRequest insert:", error.message);
    return { ok: false };
  }

  return { ok: true, refundId: (data as { id: string }).id };
}

export async function getPendingRefundsForAdmin(): Promise<RefundRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("refunds")
    .select("id, order_id, user_id, status, reason, amount, created_at, rejected_at, rejected_reason")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingTableError(error.message)) {
      return [];
    }
    console.error("[refunds] getPendingRefundsForAdmin:", error.message);
    return [];
  }

  const rows = (data ?? []) as RefundRow[];
  const results: RefundRecord[] = [];

  for (const row of rows) {
    const order = await getAdminOrderById(row.order_id);
    results.push(
      mapRefundRow(row, order ?
        {
          productName: order.productName,
          orderNumber: order.orderNumber,
          buyerName: order.buyerName,
          cancelReason: order.cancelReason,
          refundReason: order.refundReason,
        }
      : undefined),
    );
  }

  return results;
}

export async function countPendingRefundsForAdmin(): Promise<number> {
  if (!isSupabaseConfigured()) {
    return 0;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return 0;
  }

  const { count, error } = await supabase
    .from("refunds")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  if (error) {
    if (isMissingTableError(error.message)) {
      return 0;
    }
    console.error("[refunds] countPendingRefundsForAdmin:", error.message);
    return 0;
  }

  return count ?? 0;
}

export type ReviewRefundResult = {
  ok: boolean;
  error?: "not_found" | "invalid_input" | "save_failed" | "already_processed";
};

export async function approveRefundRequest(input: {
  refundId: string;
  adminUserId: string;
  adminNote?: string;
}): Promise<ReviewRefundResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "save_failed" };
  }

  const supabase = await getWriteClient();
  if (!supabase) {
    return { ok: false, error: "save_failed" };
  }

  const { data: refundRow, error: fetchError } = await supabase
    .from("refunds")
    .select("id, order_id, user_id, status, reason, amount")
    .eq("id", input.refundId)
    .maybeSingle();

  if (fetchError || !refundRow) {
    return { ok: false, error: "not_found" };
  }

  const refund = refundRow as RefundRow;
  if (refund.status !== "pending") {
    return { ok: false, error: "already_processed" };
  }

  const order = await getAdminOrderById(refund.order_id);
  if (!order) {
    return { ok: false, error: "not_found" };
  }

  const claimType = inferClaimType(order);
  const now = new Date().toISOString();
  const isCancel = claimType === "cancel";

  const orderPatch =
    isCancel ?
      {
        order_status: "cancelled",
        payment_status: order.paymentStatus === "paid" ? "cancelled" : order.paymentStatus,
        refund_status: "approved",
        refund_requested_at: null,
      }
    : {
        order_status: "refunded",
        payment_status: "refunded",
        refund_status: "refunded",
        refunded_at: now,
        refund_requested_at: null,
      };

  const { error: orderError } = await supabase
    .from("orders")
    .update(orderPatch)
    .eq("id", refund.order_id);

  if (orderError) {
    console.error("[refunds] approveRefundRequest order:", orderError.message);
    return { ok: false, error: "save_failed" };
  }

  const { error: refundError } = await supabase
    .from("refunds")
    .update({
      status: isCancel ? "approved" : "refunded",
    })
    .eq("id", input.refundId);

  if (refundError) {
    console.error("[refunds] approveRefundRequest refund:", refundError.message);
    return { ok: false, error: "save_failed" };
  }

  await appendOrderTimeline({
    orderId: refund.order_id,
    status: isCancel ? "cancelled" : "refunded",
    title: isCancel ? "취소 승인" : "환불 승인",
    message: refund.reason,
    actorUserId: input.adminUserId,
  });

  const dealUuid = await getDealUuidById(order.productId);
  await releaseProductInventory({
    productSlug: order.productId,
    dealId: dealUuid ?? null,
    quantity: order.quantity,
    productType: order.productType ?? "groupbuy",
  });

  await notifyRefundUpdated({
    userId: refund.user_id,
    productName: order.productName,
  });

  await createUserNotification(
    refund.user_id,
    "refund_updated",
    isCancel ? "주문 취소가 승인됐어요" : "환불이 승인됐어요",
    `${order.productName} ${isCancel ? "주문 취소" : "환불"} 처리가 완료됐어요.`,
    "/mypage/orders",
  );

  return { ok: true };
}

export async function rejectRefundRequest(input: {
  refundId: string;
  adminUserId: string;
  rejectedReason: string;
}): Promise<ReviewRefundResult> {
  const reason = input.rejectedReason.trim();
  if (!reason) {
    return { ok: false, error: "invalid_input" };
  }

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "save_failed" };
  }

  const supabase = await getWriteClient();
  if (!supabase) {
    return { ok: false, error: "save_failed" };
  }

  const { data: refundRow, error: fetchError } = await supabase
    .from("refunds")
    .select("id, order_id, user_id, status")
    .eq("id", input.refundId)
    .maybeSingle();

  if (fetchError || !refundRow) {
    return { ok: false, error: "not_found" };
  }

  const refund = refundRow as Pick<RefundRow, "id" | "order_id" | "user_id" | "status">;
  if (refund.status !== "pending") {
    return { ok: false, error: "already_processed" };
  }

  const order = await getAdminOrderById(refund.order_id);
  const now = new Date().toISOString();

  const { error: orderError } = await supabase
    .from("orders")
    .update({
      refund_status: "rejected",
      refund_rejected_reason: reason,
      refund_requested_at: null,
    })
    .eq("id", refund.order_id);

  if (orderError) {
    console.error("[refunds] rejectRefundRequest order:", orderError.message);
    return { ok: false, error: "save_failed" };
  }

  const { error: refundError } = await supabase
    .from("refunds")
    .update({
      status: "rejected",
      rejected_at: now,
      rejected_reason: reason,
    })
    .eq("id", input.refundId);

  if (refundError) {
    console.error("[refunds] rejectRefundRequest refund:", refundError.message);
    return { ok: false, error: "save_failed" };
  }

  await appendOrderTimeline({
    orderId: refund.order_id,
    status: "refund_rejected",
    title: "환불/취소 요청 반려",
    message: reason,
    actorUserId: input.adminUserId,
  });

  if (order) {
    await createUserNotification(
      refund.user_id,
      "refund_updated",
      "환불/취소 요청이 반려됐어요",
      `${order.productName} 요청이 반려됐어요. 사유: ${reason}`,
      "/mypage/orders",
    );
  }

  return { ok: true };
}

export { normalizeOrderRefundStatus };
