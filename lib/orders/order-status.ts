export const ORDER_STATUSES = [
  "pending",
  "joined",
  "confirmed",
  "cancelled",
  "refunded",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "ready",
  "waiting_deposit",
  "authorized",
  "paid",
  "failed",
  "cancelled",
  "refunded",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const SHIPPING_STATUSES = [
  "none",
  "preparing",
  "shipped",
  "delivered",
  "confirmed",
  "returned",
] as const;

export type ShippingStatus = (typeof SHIPPING_STATUSES)[number];

export const USER_ORDER_DISPLAY_FILTER_ALL = "전체" as const;

export const USER_ORDER_DISPLAY_STATUSES = [
  "참여완료",
  "가격확정",
  "결제완료",
  "배송준비",
  "배송중",
  "배송완료",
  "취소/환불",
] as const;

export type UserOrderDisplayStatus = (typeof USER_ORDER_DISPLAY_STATUSES)[number];

export type UserOrderDisplayFilter =
  | typeof USER_ORDER_DISPLAY_FILTER_ALL
  | UserOrderDisplayStatus;

export const USER_ORDER_DISPLAY_FILTER_OPTIONS: readonly UserOrderDisplayFilter[] = [
  USER_ORDER_DISPLAY_FILTER_ALL,
  ...USER_ORDER_DISPLAY_STATUSES,
];

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "대기",
  joined: "참여",
  confirmed: "가격 확정",
  cancelled: "취소",
  refunded: "환불",
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  ready: "결제 준비",
  waiting_deposit: "입금 대기",
  authorized: "결제 승인",
  paid: "결제 완료",
  failed: "결제 실패",
  cancelled: "결제 취소",
  refunded: "환불 완료",
};

const SHIPPING_STATUS_LABELS: Record<ShippingStatus, string> = {
  none: "배송 전",
  preparing: "배송 준비",
  shipped: "배송 중",
  delivered: "배송 완료",
  confirmed: "구매 확정",
  returned: "반품",
};

const LEGACY_ORDER_STATUS: Record<string, OrderStatus> = {
  참여완료: "joined",
  결제대기: "joined",
  결제완료: "confirmed",
  배송준비: "confirmed",
  배송중: "confirmed",
  배송완료: "confirmed",
  "취소/환불": "cancelled",
};

const LEGACY_PAYMENT_STATUS: Record<string, PaymentStatus> = {
  pending: "ready",
  결제대기: "ready",
  결제완료: "paid",
  결제실패: "failed",
  환불완료: "refunded",
};

const LEGACY_SHIPPING_STATUS: Record<string, ShippingStatus> = {
  배송전: "none",
  배송준비: "preparing",
  배송중: "shipped",
  배송완료: "delivered",
};

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

export function isPaymentStatus(value: string): value is PaymentStatus {
  return (PAYMENT_STATUSES as readonly string[]).includes(value);
}

export function isShippingStatus(value: string): value is ShippingStatus {
  return (SHIPPING_STATUSES as readonly string[]).includes(value);
}

export function normalizeOrderStatus(value: string | null | undefined): OrderStatus {
  if (!value) {
    return "joined";
  }

  if (isOrderStatus(value)) {
    return value;
  }

  return LEGACY_ORDER_STATUS[value] ?? "joined";
}

export function normalizePaymentStatus(value: string | null | undefined): PaymentStatus {
  if (!value) {
    return "ready";
  }

  if (isPaymentStatus(value)) {
    return value;
  }

  return LEGACY_PAYMENT_STATUS[value] ?? "ready";
}

export function normalizeShippingStatus(value: string | null | undefined): ShippingStatus {
  if (!value) {
    return "none";
  }

  if (isShippingStatus(value)) {
    return value;
  }

  return LEGACY_SHIPPING_STATUS[value] ?? "none";
}

export function getOrderStatusLabel(status: string): string {
  const normalized = normalizeOrderStatus(status);
  return ORDER_STATUS_LABELS[normalized];
}

export function getPaymentStatusLabel(status: string): string {
  const normalized = normalizePaymentStatus(status);
  return PAYMENT_STATUS_LABELS[normalized];
}

export function getShippingStatusLabel(status: string): string {
  const normalized = normalizeShippingStatus(status);
  return SHIPPING_STATUS_LABELS[normalized];
}

export function getUserOrderDisplayLabel(input: {
  orderStatus: string;
  paymentStatus: string;
  shippingStatus: string;
}): UserOrderDisplayStatus {
  const orderStatus = normalizeOrderStatus(input.orderStatus);
  const paymentStatus = normalizePaymentStatus(input.paymentStatus);
  const shippingStatus = normalizeShippingStatus(input.shippingStatus);

  if (
    orderStatus === "cancelled" ||
    orderStatus === "refunded" ||
    paymentStatus === "cancelled" ||
    paymentStatus === "refunded" ||
    shippingStatus === "returned"
  ) {
    return "취소/환불";
  }

  if (shippingStatus === "confirmed" || shippingStatus === "delivered") {
    return "배송완료";
  }

  if (shippingStatus === "shipped") {
    return "배송중";
  }

  if (shippingStatus === "preparing") {
    return "배송준비";
  }

  if (paymentStatus === "paid") {
    return "결제완료";
  }

  if (paymentStatus === "waiting_deposit") {
    return orderStatus === "confirmed" ? "가격확정" : "참여완료";
  }

  if (orderStatus === "confirmed") {
    return "가격확정";
  }

  return "참여완료";
}

export function isUserOrderDisplayFilter(
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

export function parseUserOrderDisplayFilter(
  value: string | undefined,
): UserOrderDisplayFilter {
  if (value && isUserOrderDisplayFilter(value)) {
    return value;
  }

  return USER_ORDER_DISPLAY_FILTER_ALL;
}

export function matchesUserOrderDisplayFilter(
  order: {
    orderStatus: string;
    paymentStatus: string;
    shippingStatus: string;
  },
  filter: UserOrderDisplayFilter,
): boolean {
  if (filter === USER_ORDER_DISPLAY_FILTER_ALL) {
    return true;
  }

  return getUserOrderDisplayLabel(order) === filter;
}

/** Initial statuses when a user joins a group buy. */
export const JOIN_ORDER_STATUSES = {
  orderStatus: "joined" as const,
  paymentStatus: "ready" as const,
  shippingStatus: "none" as const,
};
