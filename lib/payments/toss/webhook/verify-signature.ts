import { createHmac, timingSafeEqual } from "node:crypto";

import { getTossWebhookSecret } from "@/lib/payments/toss/env";

export type TossWebhookHeaders = {
  transmissionId: string | null;
  transmissionTime: string | null;
  signature: string | null;
  retriedCount: string | null;
};

export function parseTossWebhookHeaders(request: Request): TossWebhookHeaders {
  return {
    transmissionId: request.headers.get("tosspayments-webhook-transmission-id"),
    transmissionTime: request.headers.get("tosspayments-webhook-transmission-time"),
    signature: request.headers.get("tosspayments-webhook-signature"),
    retriedCount: request.headers.get("tosspayments-webhook-transmission-retried-count"),
  };
}

export type VerifyTossWebhookSignatureResult =
  | { verified: true }
  | { verified: false; reason: "missing_secret" | "missing_headers" | "mismatch" | "unsupported" };

/**
 * Verify Toss webhook HMAC signature (payout/seller webhooks).
 *
 * TODO: General payment webhooks (PAYMENT_STATUS_CHANGED, DEPOSIT_CALLBACK) do not
 * include tosspayments-webhook-signature. Verify those via Payment Query API or
 * DEPOSIT_CALLBACK `secret` field instead. Set TOSS_PAYMENTS_WEBHOOK_SECRET when
 * Toss provides a dedicated signing key for payment webhooks.
 */
export function verifyTossWebhookSignature(input: {
  rawBody: string;
  transmissionTime: string | null;
  signature: string | null;
}): VerifyTossWebhookSignatureResult {
  const webhookSecret = getTossWebhookSecret();

  if (!webhookSecret) {
    return { verified: false, reason: "missing_secret" };
  }

  if (!input.transmissionTime || !input.signature) {
    return { verified: false, reason: "missing_headers" };
  }

  const signatureParts = input.signature
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.startsWith("v1:"))
    .map((part) => part.slice(3));

  if (signatureParts.length === 0) {
    return { verified: false, reason: "unsupported" };
  }

  const payload = `${input.rawBody}:${input.transmissionTime}`;
  const expected = createHmac("sha256", webhookSecret).update(payload).digest();

  for (const encodedSignature of signatureParts) {
    try {
      const received = Buffer.from(encodedSignature, "base64");
      if (received.length === expected.length && timingSafeEqual(received, expected)) {
        return { verified: true };
      }
    } catch {
      continue;
    }
  }

  return { verified: false, reason: "mismatch" };
}

/**
 * Server-only entry for webhook routes. Returns true when signature verified or
 * when no signature header is present (general payment webhook — verify via Query API).
 */
export function verifyTossWebhookRequest(input: {
  rawBody: string;
  headers: TossWebhookHeaders;
}): { ok: true; method: "signature" | "query_api" | "deposit_secret" } | { ok: false; reason: string } {
  if (input.headers.signature) {
    const result = verifyTossWebhookSignature({
      rawBody: input.rawBody,
      transmissionTime: input.headers.transmissionTime,
      signature: input.headers.signature,
    });

    if (result.verified) {
      return { ok: true, method: "signature" };
    }

    return { ok: false, reason: result.reason };
  }

  // General payment webhooks: no signature header — caller must verify via Query API or secret.
  return { ok: true, method: "query_api" };
}
