"use client";

import { currency } from "@/lib/deals";

type JoinCartCheckoutBarProps = {
  totalAmount: number;
  disabled: boolean;
  onCheckout: () => void;
  itemCount: number;
};

/** /join-cart 전용 — 하단 고정 초록색 구매하기 */
export function JoinCartCheckoutBar({
  totalAmount,
  disabled,
  onCheckout,
  itemCount,
}: JoinCartCheckoutBarProps) {
  const label =
    itemCount <= 0 ? "상품을 담아주세요" : (
      `${currency.format(totalAmount)}원 구매하기`
    );

  return (
    <div className="fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-[55] mx-auto max-w-[430px] border-t border-[#E8ECEA] bg-white px-6 pb-[max(env(safe-area-inset-bottom),12px)] pt-3">
      <button
        className={`flex h-14 w-full items-center justify-center rounded-[16px] text-[16px] font-bold ${
          disabled ?
            "cursor-not-allowed bg-[#E8ECEA] text-[#999999]"
          : "cursor-pointer bg-[#2E5E4E] text-white active:scale-[0.99]"
        }`}
        disabled={disabled}
        onClick={onCheckout}
        type="button"
      >
        {label}
      </button>
    </div>
  );
}
