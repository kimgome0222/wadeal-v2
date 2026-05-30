"use client";

import type { PaymentMethod } from "@/lib/payments/payment-methods";

type CheckoutPaymentMethodPickerProps = {
  value: PaymentMethod | null;
  onChange: (method: PaymentMethod) => void;
  disabled?: boolean;
};

const CHECKOUT_PAYMENT_UI_OPTIONS: readonly {
  value: PaymentMethod | null;
  label: string;
  description: string;
  ready: boolean;
}[] = [
  { value: "card", label: "신용/체크카드", description: "카드로 결제해요.", ready: true },
  { value: "kakaopay", label: "카카오페이", description: "카카오페이로 결제해요.", ready: true },
  { value: "tosspay", label: "토스페이", description: "토스페이로 결제해요.", ready: true },
  { value: "virtual_account", label: "무통장입금", description: "입금 확인 후 배송이 시작돼요.", ready: true },
  { value: null, label: "네이버페이", description: "준비 중이에요.", ready: false },
  { value: null, label: "휴대폰 결제", description: "준비 중이에요.", ready: false },
];

export function CheckoutPaymentMethodPicker({
  value,
  onChange,
  disabled = false,
}: CheckoutPaymentMethodPickerProps) {
  return (
    <div className="space-y-2">
      {CHECKOUT_PAYMENT_UI_OPTIONS.map((option) => {
        const isSelected = option.ready && value === option.value;

        return (
          <button
            aria-pressed={isSelected}
            className={`flex w-full cursor-pointer items-start gap-3 rounded-2xl border p-4 text-left transition active:opacity-90 ${
              isSelected ?
                "border-[#2E5E4E] bg-[#F5F7F6]"
              : "border-[#E8ECEA] bg-white"
            } ${!option.ready ? "opacity-60" : ""}`}
            disabled={disabled || !option.ready}
            key={option.label}
            onClick={() => {
              if (option.ready && option.value) {
                onChange(option.value);
              }
            }}
            type="button"
          >
            <span
              aria-hidden
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                isSelected ?
                  "border-[#2E5E4E] bg-[#2E5E4E] text-[10px] font-bold text-white"
                : "border-[#E8ECEA] bg-white"
              }`}
            >
              {isSelected ? "✓" : null}
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="block text-[14px] font-semibold text-[#111111]">
                  {option.label}
                </span>
                {!option.ready ?
                  <span className="rounded-md bg-[#F5F7F6] px-1.5 py-0.5 text-[10px] font-medium text-[#666666]">
                    준비중
                  </span>
                : null}
              </span>
              <span className="mt-0.5 block text-[12px] text-[#666666]">
                {option.description}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
