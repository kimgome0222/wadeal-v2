import { logError } from "@/lib/monitoring/error-log";

/**
 * Toss Payments Billing API stubs (server-only).
 * Wire real API calls when TOSS_SECRET_KEY is configured.
 *
 * @see https://docs.tosspayments.com/guides/v2/billing
 */

export type IssueBillingKeyInput = {
  customerKey: string;
  authKey: string;
};

export type IssueBillingKeyResult = {
  success: boolean;
  billingKey?: string;
  cardCompany?: string;
  cardLast4?: string;
  error?: string;
};

export type ChargeWithBillingKeyInput = {
  billingKey: string;
  customerKey: string;
  orderId: string;
  orderName: string;
  amount: number;
};

export type ChargeWithBillingKeyResult = {
  success: boolean;
  paymentKey?: string;
  approvedAt?: string;
  error?: string;
  errorCode?: string;
};

export type RevokeBillingKeyResult = {
  success: boolean;
  error?: string;
};

function getTossSecretKey(): string | null {
  const key = process.env.TOSS_SECRET_KEY?.trim();
  return key || null;
}

function isMockBillingEnabled(): boolean {
  if (process.env.NODE_ENV === "production") {
    return process.env.TOSS_BILLING_MOCK === "true";
  }

  return !getTossSecretKey() || process.env.TOSS_BILLING_MOCK === "true";
}

/**
 * Issue a billing key after Toss billing auth callback.
 * TODO: POST https://api.tosspayments.com/v1/billing/authorizations/issue
 */
export async function issueBillingKey(
  input: IssueBillingKeyInput,
): Promise<IssueBillingKeyResult> {
  if (isMockBillingEnabled()) {
    const suffix = input.customerKey.slice(-4).padStart(4, "0");
    return {
      success: true,
      billingKey: `mock_billing_${input.customerKey}_${input.authKey.slice(0, 8)}`,
      cardCompany: "Mock카드",
      cardLast4: suffix,
    };
  }

  const secretKey = getTossSecretKey();
  if (!secretKey) {
    return { success: false, error: "TOSS_SECRET_KEY is not configured" };
  }

  // TODO: Real Toss Billing API integration
  // const response = await fetch("https://api.tosspayments.com/v1/billing/authorizations/issue", { ... });
  return {
    success: false,
    error: "Toss Billing API integration pending (set TOSS_BILLING_MOCK=true for dev)",
  };
}

/**
 * Charge an order using a stored billing key.
 * TODO: POST https://api.tosspayments.com/v1/billing/{billingKey}
 */
export async function chargeWithBillingKey(
  input: ChargeWithBillingKeyInput,
): Promise<ChargeWithBillingKeyResult> {
  const amount = Math.round(input.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: "invalid_amount", errorCode: "INVALID_AMOUNT" };
  }

  if (isMockBillingEnabled()) {
    if (input.billingKey.includes("_fail_")) {
      return {
        success: false,
        error: "Mock billing charge failed",
        errorCode: "MOCK_CHARGE_FAILED",
      };
    }

    return {
      success: true,
      paymentKey: `mock_payment_${input.orderId}`,
      approvedAt: new Date().toISOString(),
    };
  }

  const secretKey = getTossSecretKey();
  if (!secretKey) {
    void logError({
      level: "warning",
      source: "payment",
      message: "Billing charge skipped: TOSS_SECRET_KEY not configured",
      orderId: input.orderId,
      metadata: { errorCode: "NOT_CONFIGURED" },
    });
    return { success: false, error: "TOSS_SECRET_KEY is not configured" };
  }

  // TODO: Real Toss Billing charge API
  void logError({
    level: "error",
    source: "payment",
    message: "Billing charge API not implemented",
    orderId: input.orderId,
    metadata: { errorCode: "NOT_IMPLEMENTED", amount: input.amount },
  });
  return {
    success: false,
    error: "Toss Billing charge API integration pending",
    errorCode: "NOT_IMPLEMENTED",
  };
}

/**
 * Revoke a billing key at Toss when user deletes a saved card.
 * TODO: DELETE https://api.tosspayments.com/v1/billing/{billingKey}
 */
export async function revokeBillingKey(billingKey: string): Promise<RevokeBillingKeyResult> {
  if (isMockBillingEnabled()) {
    return { success: true };
  }

  const secretKey = getTossSecretKey();
  if (!secretKey) {
    return { success: false, error: "TOSS_SECRET_KEY is not configured" };
  }

  // TODO: Real Toss Billing revoke API
  void billingKey;
  return { success: false, error: "Toss Billing revoke API integration pending" };
}
