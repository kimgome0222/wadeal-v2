"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type MouseEvent } from "react";

import { MinusIcon, PlusIcon } from "@/components/icons";
import {
  decrementDealCartQuantity,
  incrementDealCartQuantity,
} from "@/lib/cart/add-to-cart-client";
import { useAddToCartSheet } from "@/lib/cart/add-to-cart-sheet-context";
import { useCartQuantity } from "@/hooks/use-cart";
import type { Deal } from "@/lib/deals";
import { isDealSoldOut } from "@/lib/deals";

type CartQuantityControlProps = {
  deal: Deal;
  /** spec alias — product가 있으면 deal 대신 사용 */
  product?: Deal;
  size?: "default" | "compact" | "rail";
  variant?: "default" | "compact";
  openSheetOnFirstAdd?: boolean;
  onAdded?: (product: Deal) => void;
  className?: string;
};

/** 전 상품 공통 + / 수량 stepper — 이미지 오른쪽 아래 */
export function CartQuantityControl({
  deal: dealProp,
  product,
  size,
  variant,
  openSheetOnFirstAdd = true,
  onAdded,
  className = "",
}: CartQuantityControlProps) {
  const deal = product ?? dealProp;
  const resolvedSize =
    size ?? (variant === "compact" ? "compact" : variant === "default" ? "default" : "default");
  const router = useRouter();
  const { openSheet } = useAddToCartSheet();
  const quantity = useCartQuantity(deal.slug);
  const [optimisticQty, setOptimisticQty] = useState<number | null>(null);
  const [pressed, setPressed] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (isDealSoldOut(deal)) {
    return null;
  }

  const displayQty = optimisticQty ?? quantity;
  const isCompact = resolvedSize === "compact";
  const isRail = resolvedSize === "rail";

  const plusSize =
    isRail ? "h-8 w-8"
    : isCompact ? "h-[30px] w-[30px]"
    : "h-9 w-9 min-h-9 min-w-9";
  const plusIcon =
    isRail ? "h-4 w-4"
    : isCompact ? "h-4 w-4"
    : "h-[18px] w-[18px]";
  const stepperClass =
    isRail ? "h-8 min-w-[92px] rounded-xl px-0.5"
    : isCompact ? "h-[30px] min-w-[76px] px-0.5"
    : "h-9 min-w-[92px] px-1";
  const btnInner =
    isRail ? "h-8 w-10"
    : isCompact ? "h-6 w-6"
    : "h-8 w-8";
  const stepperRadius = isRail ? "rounded-xl" : "rounded-full";
  const plusRadius = isRail ? "rounded-xl" : "rounded-full";

  function runIncrement(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setPressed(true);

    startTransition(async () => {
      const wasZero = displayQty <= 0;
      const result = await incrementDealCartQuantity(deal, displayQty);

      if (!result.success) {
        setPressed(false);
        setOptimisticQty(null);
        return;
      }

      setOptimisticQty(displayQty + 1);
      setPressed(false);

      if (wasZero && openSheetOnFirstAdd) {
        openSheet(deal, 1);
        onAdded?.(deal);
      }

      if (!result.loginRequired) {
        router.refresh();
      }

      window.setTimeout(() => setOptimisticQty(null), 200);
    });
  }

  function runDecrement(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    startTransition(async () => {
      const result = await decrementDealCartQuantity(deal, displayQty);

      if (!result.success) {
        setOptimisticQty(null);
        return;
      }

      setOptimisticQty(Math.max(0, displayQty - 1));

      if (!result.loginRequired) {
        router.refresh();
      }

      window.setTimeout(() => setOptimisticQty(null), 200);
    });
  }

  if (displayQty <= 0) {
    return (
      <button
        aria-label="장바구니에 담기"
        className={`pointer-events-auto absolute bottom-2 right-2 z-20 flex ${plusSize} items-center justify-center ${plusRadius} bg-[#2E5E4E] text-white shadow-[0_2px_8px_rgba(46,94,78,0.22)] transition-transform duration-[100ms] ease-out active:scale-95 disabled:opacity-60 ${
          pressed ? "scale-95" : ""
        } ${className}`.trim()}
        disabled={isPending}
        onClick={runIncrement}
        type="button"
      >
        <PlusIcon className={plusIcon} />
      </button>
    );
  }

  return (
    <div
      className={`pointer-events-auto absolute bottom-2 right-2 z-20 flex ${stepperClass} items-center justify-between overflow-hidden border border-[#E8ECEA] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${stepperRadius} ${className}`.trim()}
      onClick={(event) => event.stopPropagation()}
    >
      <button
        aria-label="수량 줄이기"
        className={`flex ${btnInner} items-center justify-center text-[#666666] active:bg-[#F5F7F6] disabled:opacity-50`}
        disabled={isPending}
        onClick={runDecrement}
        type="button"
      >
        <MinusIcon className={isCompact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </button>
      <span className="min-w-[28px] text-center text-[13px] font-bold tabular-nums text-[#111111]">
        {displayQty}
      </span>
      <button
        aria-label="수량 늘리기"
        className={`flex ${btnInner} items-center justify-center text-[#2E5E4E] active:bg-[#F5F7F6] disabled:opacity-50`}
        disabled={isPending}
        onClick={runIncrement}
        type="button"
      >
        <PlusIcon className={isCompact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </button>
    </div>
  );
}
