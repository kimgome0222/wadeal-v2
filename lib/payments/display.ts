import { formatOrderCurrency } from "@/lib/orders/admin-order-status";

export function formatPaymentAmountDelta(delta: number | null): string | null {
  if (delta == null || delta === 0) {
    return null;
  }

  const sign = delta > 0 ? "+" : "";
  return `${sign}${formatOrderCurrency(delta)} (참여 시점 대비)`;
}
