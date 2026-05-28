export const PAYMENT_FLOWS = [
  "instant",
  "post_deadline_manual",
  "post_deadline_auto",
] as const;

export type PaymentFlow = (typeof PAYMENT_FLOWS)[number];

const PAYMENT_FLOW_LABELS: Record<PaymentFlow, string> = {
  instant: "즉시 결제",
  post_deadline_manual: "마감 후 직접 결제",
  post_deadline_auto: "카드 자동결제 예약",
};

export function isPaymentFlow(value: string | null | undefined): value is PaymentFlow {
  return value != null && (PAYMENT_FLOWS as readonly string[]).includes(value);
}

export function normalizePaymentFlow(value: string | null | undefined): PaymentFlow {
  if (isPaymentFlow(value)) {
    return value;
  }

  return "post_deadline_manual";
}

export function getPaymentFlowLabel(value: string | null | undefined): string {
  return PAYMENT_FLOW_LABELS[normalizePaymentFlow(value)];
}

export function getAutoPayStatusLabel(input: {
  paymentFlow: string | null | undefined;
  paymentStatus: string;
  autoChargeAttemptedAt?: string | null;
}): string | null {
  const flow = normalizePaymentFlow(input.paymentFlow);
  if (flow !== "post_deadline_auto") {
    return null;
  }

  if (input.paymentStatus === "paid") {
    return "자동결제 성공";
  }

  if (input.paymentStatus === "failed") {
    return "자동결제 실패";
  }

  if (input.autoChargeAttemptedAt) {
    return "자동결제 시도됨";
  }

  return "자동결제 대기";
}

/** Default flow when joining a group buy without explicit choice. */
export const DEFAULT_GROUPBUY_PAYMENT_FLOW: PaymentFlow = "post_deadline_manual";

/** Group-buy checkout options shown to the user. */
export const GROUPBUY_PAYMENT_FLOW_OPTIONS: readonly {
  value: Extract<PaymentFlow, "post_deadline_manual" | "post_deadline_auto">;
  label: string;
  description: string;
}[] = [
  {
    value: "post_deadline_manual",
    label: "마감 후 직접 결제",
    description: "공동구매 마감·가격 확정 후 직접 결제해요.",
  },
  {
    value: "post_deadline_auto",
    label: "카드 자동결제 예약",
    description: "등록한 카드로 마감 후 자동 결제를 시도해요.",
  },
];
