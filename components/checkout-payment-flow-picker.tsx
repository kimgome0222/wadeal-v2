"use client";

import Link from "next/link";

import type { SavedPaymentMethodSummary } from "@/lib/data/saved-payment-methods";
import {
  DEFAULT_GROUPBUY_PAYMENT_FLOW,
  GROUPBUY_PAYMENT_FLOW_OPTIONS,
  type PaymentFlow,
} from "@/lib/payments/payment-flow";

type CheckoutPaymentFlowPickerProps = {
  value: PaymentFlow;
  onChange: (flow: PaymentFlow) => void;
  savedCards: SavedPaymentMethodSummary[];
  selectedCardId: string | null;
  onSelectCard: (cardId: string) => void;
  paymentHref: string;
  disabled?: boolean;
};

export function CheckoutPaymentFlowPicker({
  value,
  onChange,
  savedCards,
  selectedCardId,
  onSelectCard,
  paymentHref,
  disabled = false,
}: CheckoutPaymentFlowPickerProps) {
  const activeCards = savedCards.filter((card) => card.status === "active");
  const isAuto = value === "post_deadline_auto";

  return (
    <article className="rounded-xl border border-wadeal-line bg-white p-4">
      <h2 className="text-sm font-extrabold text-wadeal-ink">결제 방식</h2>
      <p className="mt-1 text-[11px] font-bold text-wadeal-muted">
        공동구매 마감 후 결제 방법을 선택해 주세요.
      </p>
      <div className="mt-3 space-y-2">
        {GROUPBUY_PAYMENT_FLOW_OPTIONS.map((option) => {
          const isSelected = value === option.value;

          return (
            <button
              aria-pressed={isSelected}
              className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border-2 p-3.5 text-left transition active:opacity-90 ${
                isSelected ?
                  "border-wadeal-red bg-red-50 ring-1 ring-wadeal-red"
                : "border-wadeal-line bg-white hover:border-wadeal-red hover:bg-red-50"
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

      {isAuto ?
        <div className="mt-3 space-y-2 rounded-lg bg-wadeal-surface px-3 py-3">
          <p className="text-[11px] font-bold text-wadeal-muted">
            자동결제에 사용할 카드를 선택해 주세요.
          </p>
          {activeCards.length === 0 ?
            <div className="space-y-2">
              <p className="text-xs font-bold text-wadeal-red">
                등록된 카드가 없어요. 카드를 등록한 뒤 자동결제를 예약할 수 있어요.
              </p>
              <Link
                className="inline-block text-xs font-black text-wadeal-red active:opacity-80"
                href={paymentHref}
              >
                카드 등록하기
              </Link>
            </div>
          : <div className="space-y-2">
              {activeCards.map((card) => {
                const label = card.cardCompany ?? "등록 카드";
                const masked = `**** ${card.cardLast4}`;
                const cardSelected = selectedCardId === card.id;

                return (
                  <button
                    className={`flex w-full cursor-pointer items-center justify-between rounded-lg border px-3 py-2.5 text-left ${
                      cardSelected ?
                        "border-wadeal-red bg-white"
                      : "border-wadeal-line bg-white"
                    }`}
                    key={card.id}
                    onClick={() => onSelectCard(card.id)}
                    type="button"
                  >
                    <span className="text-xs font-black text-wadeal-ink">
                      {label} {masked}
                    </span>
                    {card.isDefault ?
                      <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-black text-wadeal-red">
                        기본
                      </span>
                    : null}
                  </button>
                );
              })}
            </div>
          }
        </div>
      : null}
    </article>
  );
}

export { DEFAULT_GROUPBUY_PAYMENT_FLOW };
