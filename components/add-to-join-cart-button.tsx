"use client";

import { useState } from "react";

import { buildGuestCartSnapshot, addDealToCart } from "@/lib/cart/add-to-cart-client";
import { useAddToCartSheet } from "@/lib/cart/add-to-cart-sheet-context";
import type { Deal } from "@/lib/deals";
import type { GuestJoinCartSnapshot } from "@/lib/join-cart/guest-cart-storage";
import { ds } from "@/lib/design-system";

type AddToJoinCartButtonProps = {
  deal: Deal;
  quantity?: number;
  className?: string;
  wrapperClassName?: string;
  guestSnapshot?: GuestJoinCartSnapshot;
};

export function AddToJoinCartButton({
  deal,
  quantity = 1,
  className = "",
  wrapperClassName = "relative",
  guestSnapshot,
}: AddToJoinCartButtonProps) {
  const { openSheet } = useAddToCartSheet();
  const [message, setMessage] = useState<string | null>(null);

  function handleClick() {
    setMessage(null);

    void addDealToCart(deal, quantity).then((result) => {
      if (!result.success) {
        if (result.error === "deal_closed") {
          setMessage("판매가 종료된 상품이에요.");
        } else {
          setMessage("담기에 실패했어요.");
        }
        return;
      }

      openSheet(deal, quantity);
    });
  }

  const snapshot = guestSnapshot ?? buildGuestCartSnapshot(deal);

  return (
    <div className={wrapperClassName}>
      <button
        aria-label="장바구니에 담기"
        className={`${ds.btn.outline} h-11 min-w-0 cursor-pointer px-3 text-[12px] ${className}`}
        onClick={handleClick}
        type="button"
      >
        장바구니
      </button>
      {message ?
        <p className="absolute -top-8 right-0 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-[10px] font-medium text-white">
          {message}
        </p>
      : null}
      <span className="sr-only">{snapshot.productName}</span>
    </div>
  );
}
