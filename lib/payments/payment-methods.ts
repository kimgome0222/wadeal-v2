export const PAYMENT_METHODS = [
  "card",
  "kakaopay",
  "tosspay",
  "naverpay",
  "phone",
  "virtual_account",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  card: "신용·체크카드",
  kakaopay: "카카오페이",
  tosspay: "토스페이",
  naverpay: "네이버페이",
  phone: "휴대폰 결제",
  virtual_account: "가상계좌",
};

export function isPaymentMethod(value: string | null | undefined): value is PaymentMethod {
  return value != null && (PAYMENT_METHODS as readonly string[]).includes(value);
}

export function getPaymentMethodLabel(method: string | null | undefined): string {
  if (!method || !isPaymentMethod(method)) {
    return "미선택";
  }

  return PAYMENT_METHOD_LABELS[method];
}

export function isVirtualAccountMethod(method: string | null | undefined): boolean {
  return method === "virtual_account";
}

export const PAYMENT_METHOD_OPTIONS: readonly {
  value: PaymentMethod;
  label: string;
  description: string;
}[] = PAYMENT_METHODS.map((value) => ({
  value,
  label: PAYMENT_METHOD_LABELS[value],
  description:
    value === "virtual_account" ?
      "입금 확인 후 배송이 시작돼요."
    : value === "phone" ?
      "휴대폰 소액결제로 결제해요."
    : "선택한 수단으로 결제해요.",
}));
