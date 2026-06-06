export const ORDER_REFUND_STATUSES = [
  "none",
  "requested",
  "approved",
  "rejected",
  "refunded",
] as const;

export type OrderRefundStatus = (typeof ORDER_REFUND_STATUSES)[number];

export const REFUND_RECORD_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "refunded",
] as const;

export type RefundRecordStatus = (typeof REFUND_RECORD_STATUSES)[number];

export function normalizeOrderRefundStatus(
  value: string | null | undefined,
): OrderRefundStatus {
  if (value && ORDER_REFUND_STATUSES.includes(value as OrderRefundStatus)) {
    return value as OrderRefundStatus;
  }

  return "none";
}

export function isRefundRequestPending(status: OrderRefundStatus): boolean {
  return status === "requested";
}

export function getOrderRefundStatusLabel(status: OrderRefundStatus): string {
  switch (status) {
    case "requested":
      return "환불/취소 요청";
    case "approved":
      return "승인됨";
    case "rejected":
      return "반려됨";
    case "refunded":
      return "환불 완료";
    default:
      return "없음";
  }
}
