import {
  normalizeOrderStatus,
  normalizePaymentStatus,
  normalizeShippingStatus,
} from "@/lib/orders/order-status";
import type { UserOrderRecord } from "@/lib/reviews/review-rules";

export const SUPPORT_TICKET_TYPES = [
  "product",
  "order",
  "payment",
  "shipping",
  "refund",
  "exchange",
  "cancel",
  "account",
  "other",
] as const;

export type SupportTicketType = (typeof SUPPORT_TICKET_TYPES)[number];

export const SUPPORT_TICKET_STATUSES = [
  "open",
  "in_progress",
  "answered",
  "resolved",
  "closed",
] as const;

export type SupportTicketStatus = (typeof SUPPORT_TICKET_STATUSES)[number];

const SUPPORT_TYPE_LABELS: Record<SupportTicketType, string> = {
  product: "상품 문의",
  order: "주문 문의",
  payment: "결제 문의",
  shipping: "배송 문의",
  refund: "환불 요청",
  exchange: "교환/반품",
  cancel: "주문 취소",
  account: "계정 문의",
  other: "기타",
};

const SUPPORT_STATUS_LABELS: Record<SupportTicketStatus, string> = {
  open: "접수",
  in_progress: "처리 중",
  answered: "답변 완료",
  resolved: "해결",
  closed: "종료",
};

export type OrderSupportFields = Pick<
  UserOrderRecord,
  "orderStatus" | "paymentStatus" | "shippingStatus"
> & {
  cancelReason?: string | null;
  refundReason?: string | null;
  refundRequestedAt?: string | null;
};

const PRE_SHIPPING_STATUSES = new Set(["none", "preparing"]);
const POST_SHIPPING_STATUSES = new Set(["shipped", "delivered", "confirmed"]);

export function isSupportTicketType(value: string): value is SupportTicketType {
  return (SUPPORT_TICKET_TYPES as readonly string[]).includes(value);
}

export function isSupportTicketStatus(value: string): value is SupportTicketStatus {
  return (SUPPORT_TICKET_STATUSES as readonly string[]).includes(value);
}

export function normalizeSupportTicketType(value: string | null | undefined): SupportTicketType {
  if (value && isSupportTicketType(value)) {
    return value;
  }

  return "other";
}

export function normalizeSupportTicketStatus(
  value: string | null | undefined,
): SupportTicketStatus {
  if (value && isSupportTicketStatus(value)) {
    return value;
  }

  return "open";
}

export function getSupportTypeLabel(type: string): string {
  return SUPPORT_TYPE_LABELS[normalizeSupportTicketType(type)];
}

export function getSupportStatusLabel(status: string): string {
  return SUPPORT_STATUS_LABELS[normalizeSupportTicketStatus(status)];
}

function isTerminalOrderState(order: OrderSupportFields): boolean {
  const orderStatus = normalizeOrderStatus(order.orderStatus);
  const paymentStatus = normalizePaymentStatus(order.paymentStatus);
  const shippingStatus = normalizeShippingStatus(order.shippingStatus);

  return (
    orderStatus === "cancelled" ||
    orderStatus === "refunded" ||
    paymentStatus === "cancelled" ||
    paymentStatus === "refunded" ||
    shippingStatus === "returned"
  );
}

export function canRequestCancel(order: OrderSupportFields): boolean {
  if (isTerminalOrderState(order)) {
    return false;
  }

  if (order.cancelReason?.trim()) {
    return false;
  }

  const shippingStatus = normalizeShippingStatus(order.shippingStatus);
  return PRE_SHIPPING_STATUSES.has(shippingStatus);
}

export function canRequestRefund(order: OrderSupportFields): boolean {
  if (isTerminalOrderState(order)) {
    return false;
  }

  if (order.refundReason?.trim() || order.refundRequestedAt) {
    return false;
  }

  const shippingStatus = normalizeShippingStatus(order.shippingStatus);
  return POST_SHIPPING_STATUSES.has(shippingStatus);
}

export function canRequestExchangeReturn(order: OrderSupportFields): boolean {
  if (isTerminalOrderState(order)) {
    return false;
  }

  if (order.refundReason?.trim() || order.refundRequestedAt) {
    return false;
  }

  const shippingStatus = normalizeShippingStatus(order.shippingStatus);
  return shippingStatus === "delivered";
}

export function getOrderSupportActionLabel(order: OrderSupportFields): string | null {
  if (canRequestCancel(order)) {
    return "취소 요청";
  }

  if (canRequestRefund(order)) {
    return "환불 요청";
  }

  return null;
}
