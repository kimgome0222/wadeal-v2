"use client";

import { type MouseEvent } from "react";

import { MinusIcon, PlusIcon } from "@/components/icons";
import {
  addToJoinCartAction,
  setJoinCartQuantityBySlugAction,
} from "@/app/actions/join-cart";
import { useAddToCartSheet } from "@/lib/cart/add-to-cart-sheet-context";
import {
  decrementCartQuantity,
  getCartQuantityBySlug,
  incrementCartQuantity,
  setCartQuantity,
} from "@/lib/cart/cart-store";
import { useCartQuantity } from "@/hooks/use-cart";
import type { Deal } from "@/lib/deals";
import { isDealSoldOut } from "@/lib/deals";
import { recordRecentPurchase } from "@/lib/mock/cart-recommendations";

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

type SizeConfig = {
  plus: string;
  plusIcon: string;
  stepper: string;
  btn: string;
  icon: string;
  qtyMin: string;
};

const SIZE_CONFIG: Record<"default" | "compact", SizeConfig> = {
  default: {
    plus: "h-9 w-9",
    plusIcon: "h-[18px] w-[18px]",
    stepper: "h-9 min-w-[96px] gap-0.5 px-1",
    btn: "h-8 w-8",
    icon: "h-4 w-4",
    qtyMin: "min-w-6",
  },
  compact: {
    plus: "h-8 w-8",
    plusIcon: "h-4 w-4",
    stepper: "h-8 min-w-[84px] gap-0.5 px-1",
    btn: "h-7 w-7",
    icon: "h-3.5 w-3.5",
    qtyMin: "min-w-6",
  },
};

const ANCHOR_CLASS = "pointer-events-auto absolute bottom-2 right-2 z-20";

async function persistIncrement(deal: Deal, previousQty: number) {
  const result = await addToJoinCartAction(deal.slug, 1);

  if ("error" in result && result.error === "login_required") {
    return;
  }

  if (
    ("error" in result && result.error === "deal_closed") ||
    !result.success
  ) {
    setCartQuantity(deal, previousQty);
  }
}

async function persistDecrement(deal: Deal, previousQty: number, nextQty: number) {
  const result = await setJoinCartQuantityBySlugAction(deal.slug, nextQty);

  if ("error" in result && result.error === "login_required") {
    return;
  }

  if (!result.success) {
    setCartQuantity(deal, previousQty);
  }
}

/** 전 상품 공통 + / 수량 stepper — 이미지 오른쪽 아래, 오른쪽 기준 왼쪽 확장 */
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
  const resolvedSize: "default" | "compact" =
    size === "compact" || variant === "compact" ? "compact" : "default";
  const config = SIZE_CONFIG[resolvedSize];
  const { openSheet } = useAddToCartSheet();
  const quantity = useCartQuantity(deal.slug);

  if (isDealSoldOut(deal)) {
    return null;
  }

  const displayQty = Number.isFinite(quantity) ? Math.max(0, quantity) : 0;

  function runIncrement(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const currentQty = getCartQuantityBySlug(deal.slug);
    if (currentQty >= 99) {
      return;
    }

    const wasZero = currentQty <= 0;
    incrementCartQuantity(deal, currentQty);
    recordRecentPurchase(deal.slug);

    if (wasZero && openSheetOnFirstAdd) {
      openSheet(deal, 1);
      onAdded?.(deal);
    }

    void persistIncrement(deal, currentQty);
  }

  function runDecrement(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const currentQty = getCartQuantityBySlug(deal.slug);
    if (currentQty <= 0) {
      return;
    }

    const nextQty = currentQty - 1;
    decrementCartQuantity(deal, currentQty);
    void persistDecrement(deal, currentQty, nextQty);
  }

  if (displayQty <= 0) {
    return (
      <button
        aria-label="장바구니에 담기"
        className={`${ANCHOR_CLASS} flex ${config.plus} min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[#2E5E4E] p-2 text-white shadow-[0_2px_8px_rgba(46,94,78,0.22)] transition-transform duration-[100ms] ease-out active:scale-95 ${className}`.trim()}
        onClick={runIncrement}
        type="button"
      >
        <PlusIcon className={config.plusIcon} />
      </button>
    );
  }

  return (
    <div
      className={`${ANCHOR_CLASS} flex ${config.stepper} items-center justify-between rounded-full border border-[#E8ECEA] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${className}`.trim()}
      onClick={(event) => event.stopPropagation()}
    >
      <button
        aria-label="수량 줄이기"
        className={`-m-1 flex ${config.btn} min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full p-1 text-[#666666] active:bg-[#F5F7F6]`}
        onClick={runDecrement}
        type="button"
      >
        <MinusIcon className={config.icon} />
      </button>
      <span
        className={`${config.qtyMin} shrink-0 text-center text-[13px] font-bold tabular-nums text-[#111111]`}
      >
        {displayQty}
      </span>
      <button
        aria-label="수량 늘리기"
        className={`-m-1 flex ${config.btn} min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full p-1 text-[#2E5E4E] active:bg-[#F5F7F6]`}
        onClick={runIncrement}
        type="button"
      >
        <PlusIcon className={config.icon} />
      </button>
    </div>
  );
}
