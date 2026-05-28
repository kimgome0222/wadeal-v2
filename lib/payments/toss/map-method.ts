import type { PaymentMethod } from "@/lib/payments/payment-methods";
import { isPaymentMethod } from "@/lib/payments/payment-methods";

/** Toss payment widget `variantKey` (configure matching keys in Toss admin). */
export function getTossWidgetVariantKey(method: PaymentMethod): string {
  const variantKeys: Record<PaymentMethod, string> = {
    card: "CARD",
    kakaopay: "KAKAOPAY",
    tosspay: "TOSSPAY",
    naverpay: "NAVERPAY",
    phone: "MOBILE_PHONE",
    virtual_account: "VIRTUAL_ACCOUNT",
  };

  return variantKeys[method];
}

export function getTossAgreementVariantKey(): string {
  return "AGREEMENT";
}

/** Map Toss `method` string from confirm/webhook to Wadeal payment_method. */
export function mapTossMethodToWadeal(tossMethod: string | null | undefined): PaymentMethod | null {
  if (!tossMethod) {
    return null;
  }

  const normalized = tossMethod.toUpperCase();

  if (normalized.includes("VIRTUAL")) {
    return "virtual_account";
  }

  if (normalized.includes("MOBILE") || normalized.includes("PHONE")) {
    return "phone";
  }

  if (normalized === "KAKAOPAY" || normalized.includes("KAKAO")) {
    return "kakaopay";
  }

  if (normalized === "TOSSPAY" || normalized.includes("TOSS_PAY")) {
    return "tosspay";
  }

  if (normalized === "NAVERPAY" || normalized.includes("NAVER")) {
    return "naverpay";
  }

  if (normalized === "CARD" || normalized.includes("CARD")) {
    return "card";
  }

  return null;
}

export function parsePaymentMethodParam(value: string | null | undefined): PaymentMethod | null {
  if (!value || !isPaymentMethod(value)) {
    return null;
  }

  return value;
}
