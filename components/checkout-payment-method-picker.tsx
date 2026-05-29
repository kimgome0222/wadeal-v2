"use client";

import type { PaymentMethod } from "@/lib/payments/payment-methods";
import { PAYMENT_METHOD_OPTIONS } from "@/lib/payments/payment-methods";

type CheckoutPaymentMethodPickerProps = {
  value: PaymentMethod | null;
  onChange: (method: PaymentMethod) => void;
  disabled?: boolean;
};

export function CheckoutPaymentMethodPicker({
  value,
  onChange,
  disabled = false,
}: CheckoutPaymentMethodPickerProps) {
  return (
    <article className="rounded-xl border border-wadeal-line bg-white p-4">
      <h2 className="text-sm font-extrabold text-wadeal-ink">결제 수단</h2>
      <p className="mt-1 text-[11px] font-bold text-wadeal-muted">
        주문에 사용할 결제 수단을 선택해 주세요.
      </p>
      <div className="mt-3 space-y-2">
        {PAYMENT_METHOD_OPTIONS.map((option) => {
          const isSelected = value === option.value;

          return (
            <button
              aria-pressed={isSelected}
              className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border-2 p-3.5 text-left transition active:opacity-90 ${
                isSelected ?
                  "border-wadeal-red bg-[#F5F8F4] ring-1 ring-wadeal-red"
                : "border-wadeal-line bg-white hover:border-wadeal-red hover:bg-[#F5F8F4]"
              }`}
              disabled={disabled}
              key={option.value}
              onClick={() => onChange(option.value)}
              type="button"
            >
              <span
                aria-hidden
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  isSelected ?
                    "border-wadeal-red bg-wadeal-red text-[10px] font-black text-white"
                  : "border-wadeal-line bg-white"
                }`}
              >
                {isSelected ? "✓" : null}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-extrabold text-wadeal-ink">
                  {option.label}
                </span>
                <span className="mt-0.5 block text-[11px] font-bold text-wadeal-muted">
                  {option.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </article>
  );
}
