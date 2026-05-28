import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  SHIPPING_STATUSES,
  USER_ORDER_DISPLAY_FILTER_ALL,
  USER_ORDER_DISPLAY_FILTER_OPTIONS,
  USER_ORDER_DISPLAY_STATUSES,
  type OrderStatus,
  type PaymentStatus,
  type ShippingStatus,
  type UserOrderDisplayFilter,
} from "@/lib/orders/order-status";

export {
  getOrderStatusLabel,
  getPaymentStatusLabel,
  getShippingStatusLabel,
  getUserOrderDisplayLabel,
  isOrderStatus,
  isPaymentStatus,
  isShippingStatus,
  isUserOrderDisplayFilter,
  JOIN_ORDER_STATUSES,
  matchesUserOrderDisplayFilter,
  normalizeOrderStatus,
  normalizePaymentStatus,
  normalizeShippingStatus,
  ORDER_STATUSES,
  parseUserOrderDisplayFilter,
  PAYMENT_STATUSES,
  SHIPPING_STATUSES,
  USER_ORDER_DISPLAY_FILTER_ALL,
  USER_ORDER_DISPLAY_FILTER_OPTIONS,
  USER_ORDER_DISPLAY_STATUSES,
  type OrderStatus,
  type PaymentStatus,
  type ShippingStatus,
  type UserOrderDisplayFilter,
  type UserOrderDisplayStatus,
} from "@/lib/orders/order-status";

const currencyFormatter = new Intl.NumberFormat("ko-KR");

export function formatOrderCurrency(amount: number): string {
  return `${currencyFormatter.format(amount)}원`;
}

export function formatOrderDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function buildOrderNumber(orderId: string): string {
  const compact = orderId.replace(/-/g, "").toUpperCase();
  return `WD-${compact.slice(0, 8)}`;
}

export const ADMIN_ORDER_STATUS_FILTER_ALL = USER_ORDER_DISPLAY_FILTER_ALL;
export const ADMIN_ORDER_STATUSES = ORDER_STATUSES;
export const ADMIN_PAYMENT_STATUSES = PAYMENT_STATUSES;
export const ADMIN_SHIPPING_STATUSES = SHIPPING_STATUSES;
export const ADMIN_ORDER_STATUS_FILTER_OPTIONS = USER_ORDER_DISPLAY_FILTER_OPTIONS;

export type AdminOrderStatus = OrderStatus;
export type AdminPaymentStatus = PaymentStatus;
export type AdminShippingStatus = ShippingStatus;
export type AdminOrderStatusFilter = UserOrderDisplayFilter;

export function isAdminOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

export function isAdminPaymentStatus(value: string): value is PaymentStatus {
  return (PAYMENT_STATUSES as readonly string[]).includes(value);
}

export function isAdminShippingStatus(value: string): value is ShippingStatus {
  return (SHIPPING_STATUSES as readonly string[]).includes(value);
}

export function isAdminOrderStatusFilter(
  value: string | undefined,
): value is UserOrderDisplayFilter {
  if (!value) {
    return false;
  }

  return (
    value === USER_ORDER_DISPLAY_FILTER_ALL ||
    (USER_ORDER_DISPLAY_STATUSES as readonly string[]).includes(value)
  );
}

export function parseAdminOrderStatusFilter(
  value: string | undefined,
): UserOrderDisplayFilter {
  if (value && isAdminOrderStatusFilter(value)) {
    return value;
  }

  return USER_ORDER_DISPLAY_FILTER_ALL;
}
