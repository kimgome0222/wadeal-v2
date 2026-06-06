import type { OrderRow } from "@/lib/database/types";
import { isNormalProduct } from "@/lib/products/product-type";

export type PayableOrderRow = Pick<
  OrderRow,
  | "final_price"
  | "payment_amount"
  | "joined_price"
  | "quantity"
  | "product_type"
  | "order_status"
> & {
  final_payment_amount?: number | null;
};

/**
 * Server-side payable amount for Toss confirm / widget display.
 */
export function computePayableAmountForOrder(order: PayableOrderRow): number | null {
  if (order.final_payment_amount != null && Number.isFinite(order.final_payment_amount)) {
    return Math.max(0, Math.round(order.final_payment_amount));
  }

  if (isNormalProduct(order.product_type)) {
    if (order.payment_amount != null && Number.isFinite(order.payment_amount)) {
      return Math.max(0, Math.round(order.payment_amount));
    }

    const qty = Math.max(1, order.quantity ?? 1);
    const joined = Math.round(order.joined_price ?? 0);
    return Math.max(0, joined * qty);
  }

  if (order.final_price != null && Number.isFinite(order.final_price)) {
    return Math.max(0, Math.round(order.final_price));
  }

  if (order.order_status === "confirmed" && order.payment_amount != null) {
    return Math.max(0, Math.round(order.payment_amount));
  }

  return null;
}
