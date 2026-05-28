import { appendOrderTimeline } from "@/lib/data/order-timelines";
import { createRefundRequest } from "@/lib/data/refunds";
import { getUserOrderById } from "@/lib/data/orders";
import { notifyAdminRefundRequest } from "@/lib/notifications/admin-events";
import { createUserNotification } from "@/lib/notifications/unified";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  canShowExchangeReturnButton,
  canShowOrderCancelButton,
} from "@/lib/orders/order-claims";
import { isRefundRequestPending, normalizeOrderRefundStatus } from "@/lib/orders/refund-status";
import type { UserOrderRecord } from "@/lib/reviews/review-rules";

export type SubmitOrderClaimResult = {
  ok: boolean;
  message: string;
};

function resolvePaymentAmount(order: UserOrderRecord): number {
  const lineTotal = (order.finalPrice ?? order.joinedPrice * order.quantity) || 0;
  return Math.max(0, Math.round(lineTotal));
}

function hasPendingClaim(order: UserOrderRecord): boolean {
  if (order.refundRequestedAt) {
    return true;
  }

  return isRefundRequestPending(normalizeOrderRefundStatus(order.refundStatus));
}

export async function submitOrderCancelRequest(
  userId: string,
  orderId: string,
  reason = "고객 취소 요청",
): Promise<SubmitOrderClaimResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "취소 요청은 DB 연결 후 이용할 수 있어요." };
  }

  const order = await getUserOrderById(userId, orderId);
  if (!order) {
    return { ok: false, message: "주문을 찾을 수 없어요." };
  }

  if (!canShowOrderCancelButton(order)) {
    return { ok: false, message: "배송 전 주문만 취소할 수 있어요." };
  }

  if (hasPendingClaim(order)) {
    return { ok: false, message: "이미 취소/환불 요청이 접수된 주문이에요." };
  }

  const trimmedReason = reason.trim() || "고객 취소 요청";
  const saved = await createRefundRequest({
    orderId,
    userId,
    claimType: "cancel",
    reason: trimmedReason,
    amount: resolvePaymentAmount(order),
  });

  if (!saved.ok) {
    return { ok: false, message: "취소 요청 저장에 실패했어요. 잠시 후 다시 시도해 주세요." };
  }

  await appendOrderTimeline({
    orderId,
    status: "cancel_requested",
    title: "취소 요청 접수",
    message: "관리자 확인 후 처리돼요.",
    actorUserId: userId,
  });

  await notifyAdminRefundRequest({
    orderId,
    productName: order.productName,
  });

  await createUserNotification(
    userId,
    "refund_updated",
    "취소 요청이 접수됐어요",
    `${order.productName} 취소 요청을 접수했어요. 관리자 확인 후 처리돼요.`,
    "/mypage/orders",
  );

  return { ok: true, message: "주문 취소 요청이 접수됐어요. 관리자 확인 후 처리돼요." };
}

export async function submitExchangeReturnRequest(
  userId: string,
  orderId: string,
  reason = "교환/반품 요청",
): Promise<SubmitOrderClaimResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "환불 요청은 DB 연결 후 이용할 수 있어요." };
  }

  const order = await getUserOrderById(userId, orderId);
  if (!order) {
    return { ok: false, message: "주문을 찾을 수 없어요." };
  }

  if (!canShowExchangeReturnButton(order)) {
    return { ok: false, message: "배송 완료 후 환불을 신청할 수 있어요." };
  }

  if (hasPendingClaim(order)) {
    return { ok: false, message: "이미 환불 요청이 접수된 주문이에요." };
  }

  const trimmedReason = reason.trim() || "교환/반품 요청";
  const saved = await createRefundRequest({
    orderId,
    userId,
    claimType: "refund",
    reason: trimmedReason,
    amount: resolvePaymentAmount(order),
  });

  if (!saved.ok) {
    return { ok: false, message: "환불 요청 저장에 실패했어요. 잠시 후 다시 시도해 주세요." };
  }

  await appendOrderTimeline({
    orderId,
    status: "refund_requested",
    title: "환불 요청 접수",
    message: "관리자 확인 후 처리돼요.",
    actorUserId: userId,
  });

  await notifyAdminRefundRequest({
    orderId,
    productName: order.productName,
  });

  await createUserNotification(
    userId,
    "refund_updated",
    "환불 요청이 접수됐어요",
    `${order.productName} 환불 요청을 접수했어요. 관리자 확인 후 처리돼요.`,
    "/mypage/orders",
  );

  return { ok: true, message: "환불 요청이 접수됐어요. 관리자 확인 후 처리돼요." };
}

export type { UserOrderRecord };
