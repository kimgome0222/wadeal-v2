import {
  normalizeOrderStatus,
  normalizePaymentStatus,
  normalizeShippingStatus,
} from "@/lib/orders/order-status";
import { normalizeShippingStatusWithConfirmed } from "@/lib/orders/shipping-status";
import { isRefundRequestPending, normalizeOrderRefundStatus } from "@/lib/orders/refund-status";
import type { UserOrderRecord } from "@/lib/reviews/review-rules";

function hasPendingRefund(order: UserOrderRecord): boolean {
  if (order.refundRequestedAt) {
    return true;
  }

  return isRefundRequestPending(normalizeOrderRefundStatus(order.refundStatus));
}

export function canShowOrderCancelButton(order: UserOrderRecord): boolean {
  if (hasPendingRefund(order)) {
    return false;
  }
  const paymentStatus = normalizePaymentStatus(order.paymentStatus);
  const orderStatus = normalizeOrderStatus(order.orderStatus);
  const shippingStatus = normalizeShippingStatus(order.shippingStatus);

  const paidBeforeShipping =
    paymentStatus === "paid" &&
    (shippingStatus === "preparing" || shippingStatus === "none");
  const confirmedPreparing =
    orderStatus === "confirmed" && shippingStatus === "preparing";

  return paidBeforeShipping || confirmedPreparing;
}

export function canShowExchangeReturnButton(order: UserOrderRecord): boolean {
  if (hasPendingRefund(order)) {
    return false;
  }

  const shippingStatus = normalizeShippingStatusWithConfirmed(order.shippingStatus);
  return shippingStatus === "delivered";
}
