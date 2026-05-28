export const TOSS_PAYMENT_STATUSES = [
  "READY",
  "IN_PROGRESS",
  "WAITING_FOR_DEPOSIT",
  "DONE",
  "CANCELED",
  "PARTIAL_CANCELED",
  "ABORTED",
  "EXPIRED",
] as const;

export type TossPaymentStatus = (typeof TOSS_PAYMENT_STATUSES)[number];

export type TossWebhookEventType =
  | "PAYMENT_STATUS_CHANGED"
  | "DEPOSIT_CALLBACK"
  | "CANCEL_STATUS_CHANGED"
  | "UNKNOWN";

export type TossPaymentWebhookData = {
  paymentKey?: string;
  orderId?: string;
  status?: TossPaymentStatus;
  method?: string;
  totalAmount?: number;
  approvedAt?: string;
  secret?: string;
};

export type ParsedTossWebhookEvent = {
  eventType: TossWebhookEventType;
  eventId: string | null;
  paymentKey: string | null;
  orderId: string | null;
  tossStatus: TossPaymentStatus | null;
  secret: string | null;
  transmissionId: string | null;
  transmissionTime: string | null;
  rawPayload: Record<string, unknown>;
};
