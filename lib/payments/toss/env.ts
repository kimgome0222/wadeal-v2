/** Client key for Toss Payments widget (public). */
export function getTossClientKey(): string | null {
  return (
    process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY?.trim() ||
    process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY?.trim() ||
    null
  );
}

/** Secret key for Toss Payments server APIs (never expose to client). */
export function getTossSecretKey(): string | null {
  return (
    process.env.TOSS_SECRET_KEY?.trim() ||
    process.env.TOSS_PAYMENTS_SECRET_KEY?.trim() ||
    null
  );
}

/** Webhook HMAC secret (optional; payout/seller webhooks). */
export function getTossWebhookSecret(): string | null {
  return (
    process.env.TOSS_WEBHOOK_SECRET?.trim() ||
    process.env.TOSS_PAYMENTS_WEBHOOK_SECRET?.trim() ||
    null
  );
}

export function isTossPaymentsConfigured(): boolean {
  return Boolean(getTossClientKey() && getTossSecretKey());
}
