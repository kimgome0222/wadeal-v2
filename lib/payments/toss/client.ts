import { getTossSecretKey } from "@/lib/payments/toss/env";
import type { TossPaymentWebhookData } from "@/lib/payments/toss/types";

const TOSS_API_BASE = "https://api.tosspayments.com/v1";

function buildAuthHeader(secretKey: string): string {
  const encoded = Buffer.from(`${secretKey}:`).toString("base64");
  return `Basic ${encoded}`;
}

export type ConfirmTossPaymentInput = {
  paymentKey: string;
  orderId: string;
  amount: number;
};

export type ConfirmTossPaymentResult =
  | { ok: true; payment: TossPaymentWebhookData }
  | { ok: false; error: "not_configured" | "request_failed"; message?: string };

/** Confirm (capture) a Toss payment after client-side authorization. */
export async function confirmTossPayment(
  input: ConfirmTossPaymentInput,
): Promise<ConfirmTossPaymentResult> {
  const secretKey = getTossSecretKey();
  if (!secretKey) {
    return { ok: false, error: "not_configured", message: "Toss secret key not configured" };
  }

  try {
    const response = await fetch(`${TOSS_API_BASE}/payments/confirm`, {
      method: "POST",
      headers: {
        Authorization: buildAuthHeader(secretKey),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentKey: input.paymentKey,
        orderId: input.orderId,
        amount: Math.round(input.amount),
      }),
      cache: "no-store",
    });

    const payload = (await response.json()) as TossPaymentWebhookData & {
      message?: string;
      code?: string;
    };

    if (!response.ok) {
      console.error("[toss] confirm payment failed:", response.status, payload);
      return {
        ok: false,
        error: "request_failed",
        message: payload.message ?? "결제 승인에 실패했어요.",
      };
    }

    return { ok: true, payment: payload };
  } catch (error) {
    console.error("[toss] confirm payment error:", error);
    return { ok: false, error: "request_failed", message: "결제 승인 API 호출에 실패했어요." };
  }
}

export type TossPaymentQueryResult =
  | { ok: true; payment: TossPaymentWebhookData }
  | { ok: false; error: "not_configured" | "not_found" | "request_failed" };

/** Re-query Toss Payments to verify webhook payload (recommended for general payment webhooks). */
export async function queryTossPaymentByKey(
  paymentKey: string,
): Promise<TossPaymentQueryResult> {
  const secretKey = getTossSecretKey();
  if (!secretKey) {
    return { ok: false, error: "not_configured" };
  }

  try {
    const response = await fetch(`${TOSS_API_BASE}/payments/${encodeURIComponent(paymentKey)}`, {
      method: "GET",
      headers: {
        Authorization: buildAuthHeader(secretKey),
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (response.status === 404) {
      return { ok: false, error: "not_found" };
    }

    if (!response.ok) {
      console.error("[toss] query payment failed:", response.status, await response.text());
      return { ok: false, error: "request_failed" };
    }

    const payment = (await response.json()) as TossPaymentWebhookData;
    return { ok: true, payment };
  } catch (error) {
    console.error("[toss] query payment error:", error);
    return { ok: false, error: "request_failed" };
  }
}

export async function queryTossPaymentByOrderId(
  orderId: string,
): Promise<TossPaymentQueryResult> {
  const secretKey = getTossSecretKey();
  if (!secretKey) {
    return { ok: false, error: "not_configured" };
  }

  try {
    const response = await fetch(
      `${TOSS_API_BASE}/payments/orders/${encodeURIComponent(orderId)}`,
      {
        method: "GET",
        headers: {
          Authorization: buildAuthHeader(secretKey),
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (response.status === 404) {
      return { ok: false, error: "not_found" };
    }

    if (!response.ok) {
      console.error("[toss] query order payment failed:", response.status, await response.text());
      return { ok: false, error: "request_failed" };
    }

    const payment = (await response.json()) as TossPaymentWebhookData;
    return { ok: true, payment };
  } catch (error) {
    console.error("[toss] query order payment error:", error);
    return { ok: false, error: "request_failed" };
  }
}
