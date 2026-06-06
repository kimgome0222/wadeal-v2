export const PAYMENT_RECORD_STATUSES = [
  "ready",
  "waiting_deposit",
  "authorized",
  "paid",
  "failed",
  "cancelled",
  "refunded",
] as const;

export type PaymentRecordStatus = (typeof PAYMENT_RECORD_STATUSES)[number];

const PAYMENT_RECORD_STATUS_LABELS: Record<PaymentRecordStatus, string> = {
  ready: "결제 준비",
  waiting_deposit: "입금 대기",
  authorized: "결제 승인",
  paid: "결제 완료",
  failed: "결제 실패",
  cancelled: "결제 취소",
  refunded: "환불 완료",
};

const LEGACY_PAYMENT_RECORD_STATUS: Record<string, PaymentRecordStatus> = {
  pending: "ready",
  결제대기: "ready",
  결제완료: "paid",
  결제실패: "failed",
  환불완료: "refunded",
};

export function isPaymentRecordStatus(value: string): value is PaymentRecordStatus {
  return (PAYMENT_RECORD_STATUSES as readonly string[]).includes(value);
}

export function normalizePaymentRecordStatus(
  value: string | null | undefined,
): PaymentRecordStatus {
  if (!value) {
    return "ready";
  }

  if (isPaymentRecordStatus(value)) {
    return value;
  }

  return LEGACY_PAYMENT_RECORD_STATUS[value] ?? "ready";
}

export function getPaymentRecordStatusLabel(status: string): string {
  return PAYMENT_RECORD_STATUS_LABELS[normalizePaymentRecordStatus(status)];
}
