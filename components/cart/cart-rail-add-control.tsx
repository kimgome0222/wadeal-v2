"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition, type MouseEvent } from "react";

import { MinusIcon, PlusIcon } from "@/components/icons";
import {
  decrementDealCartQuantity,
  incrementDealCartQuantity,
} from "@/lib/cart/add-to-cart-client";
import type { Deal } from "@/lib/deals";
import { catalogDealFromRecommendation } from "@/lib/cart/catalog-from-recommendation";
import { useAddToCartSheet } from "@/lib/cart/add-to-cart-sheet-context";
import { useGuestCartQuantityBySlug } from "@/lib/join-cart/use-guest-cart-quantity-by-slug";
import type { CartRecommendationItem } from "@/lib/mock/cart-recommendations";

type CartRailAddControlProps = {
  item: CartRecommendationItem;
  deal?: Deal;
};

/** rail 추천상품 + / 수량 stepper */
export function CartRailAddControl({ item, deal: dealProp }: CartRailAddControlProps) {
  const router = useRouter();
  const { catalog, setSheetInteracting } = useAddToCartSheet();
  const guestQty = useGuestCartQuantityBySlug(item.slug);
  const [localQty, setLocalQty] = useState(guestQty);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setLocalQty(guestQty);
  }, [guestQty]);

  const deal = dealProp ?? catalogDealFromRecommendation(catalog, item);
  if (!deal) {
    return null;
  }

  const resolvedDeal = deal;
  const displayQty = Math.max(guestQty, localQty);

  function handleAdd(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setSheetInteracting(true);

    startTransition(async () => {
      const result = await incrementDealCartQuantity(resolvedDeal, displayQty);
      if (result.success) {
        setLocalQty(displayQty + 1);
        if (!result.loginRequired) {
          router.refresh();
        }
      }
    });
  }

  function handleIncrement(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setSheetInteracting(true);

    startTransition(async () => {
      const result = await incrementDealCartQuantity(resolvedDeal, displayQty);
      if (result.success) {
        setLocalQty(displayQty + 1);
        if (!result.loginRequired) {
          router.refresh();
        }
      }
    });
  }

  function handleDecrement(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setSheetInteracting(true);

    startTransition(async () => {
      const result = await decrementDealCartQuantity(resolvedDeal, displayQty);
      if (result.success) {
        setLocalQty(Math.max(0, displayQty - 1));
        if (!result.loginRequired) {
          router.refresh();
        }
      }
    });
  }

  if (displayQty <= 0) {
    return (
      <button
        aria-label="상품 담기"
        className="pointer-events-auto flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#2E5E4E] text-white transition-transform duration-[100ms] active:scale-95 disabled:opacity-60"
        disabled={isPending}
        onClick={handleAdd}
        type="button"
      >
        <PlusIcon className="h-[18px] w-[18px]" />
      </button>
    );
  }

  return (
    <div
      className="pointer-events-auto flex h-8 min-w-[88px] items-center justify-between rounded-full border border-[#E8ECEA] bg-white px-1"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        aria-label="수량 줄이기"
        className="flex h-7 w-7 items-center justify-center rounded-full text-[#2E5E4E] active:bg-[#F5F7F6] disabled:opacity-50"
        disabled={isPending}
        onClick={handleDecrement}
        type="button"
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span className="min-w-[20px] text-center text-[13px] font-semibold tabular-nums text-[#111111]">
        {displayQty}
      </span>
      <button
        aria-label="수량 늘리기"
        className="flex h-7 w-7 items-center justify-center rounded-full text-[#2E5E4E] active:bg-[#F5F7F6] disabled:opacity-50"
        disabled={isPending}
        onClick={handleIncrement}
        type="button"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
