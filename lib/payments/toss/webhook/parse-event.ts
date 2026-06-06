import type {
  ParsedTossWebhookEvent,
  TossPaymentStatus,
  TossWebhookEventType,
} from "@/lib/payments/toss/types";
import type { TossWebhookHeaders } from "@/lib/payments/toss/webhook/verify-signature";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return null;
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readTossStatus(value: unknown): TossPaymentStatus | null {
  const status = readString(value);
  if (!status) {
    return null;
  }

  return status as TossPaymentStatus;
}

function resolveEventType(body: Record<string, unknown>): TossWebhookEventType {
  const explicit = readString(body.eventType);
  if (explicit === "PAYMENT_STATUS_CHANGED") {
    return "PAYMENT_STATUS_CHANGED";
  }
  if (explicit === "CANCEL_STATUS_CHANGED") {
    return "CANCEL_STATUS_CHANGED";
  }

  if (
    readString(body.orderId) &&
    readString(body.transactionKey) &&
    readTossStatus(body.status)
  ) {
    return "DEPOSIT_CALLBACK";
  }

  return "UNKNOWN";
}

export function parseTossWebhookEvent(
  rawBody: string,
  headers: TossWebhookHeaders,
): ParsedTossWebhookEvent | null {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return null;
  }

  const body = asRecord(parsed);
  if (!body) {
    return null;
  }

  const eventType = resolveEventType(body);
  const data = asRecord(body.data);

  const paymentKey = readString(data?.paymentKey) ?? readString(body.paymentKey);
  const orderId = readString(data?.orderId) ?? readString(body.orderId);
  const tossStatus = readTossStatus(data?.status) ?? readTossStatus(body.status);
  const secret = readString(data?.secret) ?? readString(body.secret);

  const eventId =
    headers.transmissionId ??
    readString(body.transactionKey) ??
    (paymentKey && tossStatus ? `${paymentKey}:${tossStatus}` : null);

  return {
    eventType,
    eventId,
    paymentKey,
    orderId,
    tossStatus,
    secret,
    transmissionId: headers.transmissionId,
    transmissionTime: headers.transmissionTime,
    rawPayload: body,
  };
}
