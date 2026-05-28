import { NextResponse } from "next/server";

import { logError } from "@/lib/monitoring/error-log";
import { parseTossWebhookEvent } from "@/lib/payments/toss/webhook/parse-event";
import { processTossWebhook } from "@/lib/payments/toss/webhook/process-webhook";
import {
  parseTossWebhookHeaders,
  verifyTossWebhookRequest,
} from "@/lib/payments/toss/webhook/verify-signature";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();

  if (!rawBody) {
    return NextResponse.json({ ok: false, reason: "empty_body" }, { status: 400 });
  }

  const headers = parseTossWebhookHeaders(request);
  const verification = verifyTossWebhookRequest({ rawBody, headers });

  if (!verification.ok) {
    console.warn("[toss/webhook] signature verification failed:", verification.reason);
    void logError({
      level: "warning",
      source: "webhook",
      message: `Webhook signature verification failed: ${verification.reason}`,
      metadata: { verificationReason: verification.reason },
    });
    return NextResponse.json({ ok: false, reason: "invalid_signature" }, { status: 401 });
  }

  const event = parseTossWebhookEvent(rawBody, headers);
  if (!event) {
    return NextResponse.json({ ok: false, reason: "invalid_payload" }, { status: 400 });
  }

  if (event.eventType === "UNKNOWN") {
    return NextResponse.json({ ok: true, reason: "ignored" }, { status: 200 });
  }

  const verificationMethod =
    verification.method === "signature" ?
      "signature"
    : event.eventType === "DEPOSIT_CALLBACK" ?
      "deposit_secret"
    : "query_api";

  try {
    const result = await processTossWebhook({ event, verificationMethod });
    return NextResponse.json(result.body, { status: result.httpStatus });
  } catch (error) {
    console.error("[toss/webhook] unhandled error:", error);
    void logError({
      level: "critical",
      source: "webhook",
      message: "Unhandled webhook processing error",
      error,
      metadata: { eventType: event.eventType },
    });
    return NextResponse.json({ ok: false, reason: "internal_error" }, { status: 500 });
  }
}
