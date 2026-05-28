import {
  normalizeOrderStatus,
  normalizePaymentStatus,
  normalizeShippingStatus,
} from "@/lib/orders/order-status";
import { normalizeShippingStatusWithConfirmed } from "@/lib/orders/shipping-status";
import type { UserOrderRecord } from "@/lib/reviews/review-rules";

export function canShowOrderCancelButton(order: UserOrderRecord): boolean {
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
  const shippingStatus = normalizeShippingStatusWithConfirmed(order.shippingStatus);
  return shippingStatus === "delivered";
}
