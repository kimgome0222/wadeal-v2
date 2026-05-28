import type { Json } from "@/lib/database/types";
import { logError } from "@/lib/monitoring/error-log";
import { queryTossPaymentByKey, queryTossPaymentByOrderId } from "@/lib/payments/toss/client";
import type { ParsedTossWebhookEvent } from "@/lib/payments/toss/types";
import { handleDepositCompleted } from "@/lib/payments/toss/webhook/handlers/deposit-completed";
import { handlePaymentApproved } from "@/lib/payments/toss/webhook/handlers/payment-approved";
import { handlePaymentCancelled } from "@/lib/payments/toss/webhook/handlers/payment-cancelled";
import { handlePaymentFailed } from "@/lib/payments/toss/webhook/handlers/payment-failed";
import { handleRefundCompleted } from "@/lib/payments/toss/webhook/handlers/refund-completed";
import {
  findProcessedWebhookDuplicate,
  insertWebhookLog,
  lookupPaymentByKeyOrOrderId,
  updateWebhookLogStatus,
} from "@/lib/payments/toss/webhook/webhook-logs";
import type { WebhookHandlerResult } from "@/lib/payments/toss/webhook/handlers/shared";

export type ProcessTossWebhookResult = {
  httpStatus: number;
  body: { ok: boolean; reason?: string };
};

function readStoredPaymentSecret(rawResponse: Json | null): string | null {
  if (!rawResponse || typeof rawResponse !== "object" || Array.isArray(rawResponse)) {
    return null;
  }

  const secret = (rawResponse as Record<string, unknown>).secret;
  return typeof secret === "string" ? secret : null;
}

async function verifyDepositSecret(input: {
  lookupSecret: string | null;
  webhookSecret: string | null;
}): Promise<boolean> {
  if (!input.webhookSecret || !input.lookupSecret) {
    // TODO: Require secret match once PG confirm flow stores payment.secret in raw_response.
    return true;
  }

  return input.webhookSecret === input.lookupSecret;
}

async function resolveVerifiedPayment(event: ParsedTossWebhookEvent) {
  if (event.paymentKey) {
    const query = await queryTossPaymentByKey(event.paymentKey);
    if (query.ok) {
      return query.payment;
    }
  }

  if (event.orderId) {
    const query = await queryTossPaymentByOrderId(event.orderId);
    if (query.ok) {
      return query.payment;
    }
  }

  return null;
}

async function dispatchHandler(
  event: ParsedTossWebhookEvent,
  verifiedPayment?: Awaited<ReturnType<typeof resolveVerifiedPayment>>,
): Promise<WebhookHandlerResult> {
  const lookup = await lookupPaymentByKeyOrOrderId({
    paymentKey: verifiedPayment?.paymentKey ?? event.paymentKey,
    orderId: verifiedPayment?.orderId ?? event.orderId,
  });

  if (!lookup) {
    return { outcome: "failed", error: "payment_not_found" };
  }

  const rawResponse = event.rawPayload as Json;
  const confirmedAmount = verifiedPayment?.totalAmount ?? lookup.payment.requested_amount;
  const paymentKey = verifiedPayment?.paymentKey ?? event.paymentKey;
  const method = verifiedPayment?.method ?? lookup.payment.method;

  const tossStatus = verifiedPayment?.status ?? event.tossStatus;

  if (event.eventType === "DEPOSIT_CALLBACK") {
    if (tossStatus === "DONE") {
      const secretOk = await verifyDepositSecret({
        lookupSecret: readStoredPaymentSecret(lookup.payment.raw_response),
        webhookSecret: event.secret,
      });

      if (!secretOk) {
        return { outcome: "failed", error: "invalid_deposit_secret" };
      }

      return handleDepositCompleted({
        lookup,
        paymentKey,
        confirmedAmount,
        method: method ?? "virtual_account",
        rawResponse,
      });
    }

    if (tossStatus === "CANCELED") {
      return handlePaymentCancelled({ lookup, rawResponse });
    }

    return { outcome: "skipped", reason: `deposit_status_${tossStatus ?? "unknown"}` };
  }

  if (event.eventType === "PAYMENT_STATUS_CHANGED" || event.eventType === "CANCEL_STATUS_CHANGED") {
    switch (tossStatus) {
      case "DONE":
        return handlePaymentApproved({
          lookup,
          paymentKey,
          confirmedAmount,
          method,
          rawResponse,
        });
      case "CANCELED":
        return handlePaymentCancelled({ lookup, rawResponse });
      case "PARTIAL_CANCELED":
        return handleRefundCompleted({
          lookup,
          confirmedAmount,
          rawResponse,
        });
      case "ABORTED":
      case "EXPIRED":
        return handlePaymentFailed({ lookup, rawResponse });
      default:
        return { outcome: "skipped", reason: `payment_status_${tossStatus ?? "unknown"}` };
    }
  }

  return { outcome: "skipped", reason: "unsupported_event" };
}

export async function processTossWebhook(input: {
  event: ParsedTossWebhookEvent;
  verificationMethod: "signature" | "query_api" | "deposit_secret";
}): Promise<ProcessTossWebhookResult> {
  const isDuplicate = await findProcessedWebhookDuplicate({
    eventId: input.event.eventId,
    paymentKey: input.event.paymentKey,
    eventType: input.event.eventType,
  });

  if (isDuplicate) {
    return { httpStatus: 200, body: { ok: true, reason: "duplicate" } };
  }

  const log = await insertWebhookLog({
    eventType: input.event.eventType,
    eventId: input.event.eventId,
    paymentKey: input.event.paymentKey,
    orderId: input.event.orderId,
    rawPayload: input.event.rawPayload as Json,
  });

  let verifiedPayment: Awaited<ReturnType<typeof resolveVerifiedPayment>> = null;

  if (
    input.verificationMethod === "query_api" &&
    (input.event.paymentKey || input.event.orderId)
  ) {
    verifiedPayment = await resolveVerifiedPayment(input.event);
  }

  const handlerResult = await dispatchHandler(input.event, verifiedPayment);

  if (log?.id) {
    if (handlerResult.outcome === "processed") {
      await updateWebhookLogStatus({ id: log.id, status: "processed" });
    } else if (handlerResult.outcome === "skipped") {
      await updateWebhookLogStatus({
        id: log.id,
        status: "skipped",
        errorMessage: handlerResult.reason,
      });
    } else {
      await updateWebhookLogStatus({
        id: log.id,
        status: "failed",
        errorMessage: handlerResult.error,
      });
      void logError({
        level: handlerResult.error === "payment_not_found" ? "warning" : "error",
        source: "webhook",
        message: `Webhook handler failed: ${handlerResult.error ?? "unknown"}`,
        orderId: input.event.orderId ?? null,
        metadata: {
          eventType: input.event.eventType,
          eventId: input.event.eventId ?? null,
          paymentKeyPrefix: input.event.paymentKey?.slice(0, 12) ?? null,
        },
      });
    }
  }

  if (handlerResult.outcome === "failed") {
    if (
      handlerResult.error === "payment_not_found" ||
      handlerResult.error === "invalid_deposit_secret"
    ) {
      return { httpStatus: 200, body: { ok: false, reason: handlerResult.error } };
    }

    return { httpStatus: 500, body: { ok: false, reason: handlerResult.error } };
  }

  return {
    httpStatus: 200,
    body: {
      ok: true,
      reason: handlerResult.outcome === "skipped" ? handlerResult.reason : undefined,
    },
  };
}
