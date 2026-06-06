import { normalizeOrderStatus, normalizePaymentStatus } from "@/lib/orders/order-status";
import { normalizePaymentFlow } from "@/lib/payments/payment-flow";
import { isNormalProduct } from "@/lib/products/product-type";
import type { UserOrderRecord } from "@/lib/reviews/review-rules";

export function canPayOrder(order: UserOrderRecord & { paymentFlow?: string | null }): boolean {
  const paymentStatus = normalizePaymentStatus(order.paymentStatus);
  if (paymentStatus !== "ready") {
    return false;
  }

  const paymentFlow = normalizePaymentFlow(order.paymentFlow);
  if (!isNormalProduct(order.productType) && paymentFlow === "post_deadline_auto") {
    return false;
  }

  const orderStatus = normalizeOrderStatus(order.orderStatus);

  if (isNormalProduct(order.productType)) {
    return orderStatus === "pending" || orderStatus === "joined";
  }

  return orderStatus === "confirmed" && order.finalPrice != null;
}
