"use client";

import { useMemo, useState } from "react";

import { ProductQuantityTierOptions } from "@/components/product/product-quantity-tier-options";
import { QuantityStepper } from "@/components/product/quantity-stepper";
import { addToJoinCartAction } from "@/app/actions/join-cart";
import {
  getCartQuantityBySlug,
  setCartQuantity,
} from "@/lib/cart/cart-store";
import { useAddToCartSheet } from "@/lib/cart/add-to-cart-sheet-context";
import { useCartPreviewSheet } from "@/lib/cart/cart-preview-sheet-context";
import type { Deal } from "@/lib/deals";
import { currency, isDealSoldOut } from "@/lib/deals";
import { inventoryFromDeal } from "@/lib/products/inventory";
import { getTierProgress } from "@/lib/pricing/tiers";
import { recordRecentPurchase } from "@/lib/mock/cart-recommendations";
import type { PriceTier } from "@/lib/types";

type ProductDetailPurchaseBarProps = {
  deal: Deal;
  tiers: PriceTier[];
  initialSaved?: boolean;
};

function resolveMaxQuantity(deal: Deal): number {
  const inventory = inventoryFromDeal(deal);
  let max = 99;

  if (inventory.maxOrderQuantity > 0) {
    max = Math.min(max, inventory.maxOrderQuantity);
  }
  if (inventory.stockQuantity != null && inventory.stockQuantity > 0) {
    max = Math.min(max, inventory.stockQuantity);
  }
  if (inventory.maxQuantity != null && inventory.maxQuantity > 0) {
    max = Math.min(max, inventory.maxQuantity);
  }

  return Math.max(1, max);
}

export function ProductDetailPurchaseBar({
  deal,
  tiers,
}: ProductDetailPurchaseBarProps) {
  const { openLastLook } = useCartPreviewSheet();
  const { openSheet } = useAddToCartSheet();
  const maxQuantity = resolveMaxQuantity(deal);
  const [quantity, setQuantity] = useState(1);
  const soldOut = isDealSoldOut(deal);
  const { applicablePrice } = getTierProgress(deal, tiers);

  const lineTotal = useMemo(
    () => applicablePrice * quantity,
    [applicablePrice, quantity],
  );

  const checkoutHref =
    quantity > 1 ? `/checkout/${deal.slug}?qty=${quantity}` : `/checkout/${deal.slug}`;

  function handleBuyClick() {
    openLastLook(checkoutHref);
  }

  function handleCartClick() {
    const previousQty = getCartQuantityBySlug(deal.slug);
    if (previousQty >= 99) {
      return;
    }

    const nextQty = Math.min(99, previousQty + quantity);
    setCartQuantity(deal, nextQty);
    recordRecentPurchase(deal.slug);
    openSheet(deal, quantity);

    void addToJoinCartAction(deal.slug, quantity).then((result) => {
      if ("error" in result && result.error === "login_required") {
        return;
      }

      if ("error" in result && result.error === "deal_closed") {
        setCartQuantity(deal, previousQty);
        return;
      }

      if (!result.success && process.env.NODE_ENV !== "production") {
        console.warn("[cart] PDP add server sync skipped", result);
      }
    });
  }

  function handleTierSelect(nextQuantity: number) {
    setQuantity(Math.max(1, Math.min(maxQuantity, nextQuantity)));
  }

  return (
    <>
      <section className="space-y-4 border-t border-[#E8ECEA] px-6 py-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[14px] font-semibold text-[#111111]">수량 선택</p>
            <p className="mt-0.5 text-[12px] text-[#666666]">
              예상 금액 {currency.format(lineTotal)}원
            </p>
          </div>
          <QuantityStepper
            disabled={soldOut}
            max={maxQuantity}
            onChange={setQuantity}
            value={quantity}
          />
        </div>

        <ProductQuantityTierOptions
          max={maxQuantity}
          onSelectQuantity={handleTierSelect}
          quantity={quantity}
        />
      </section>

      <div className="fixed inset-x-0 bottom-0 z-[110] mx-auto max-w-[430px] border-t border-[#E8ECEA] bg-white px-6 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
        {soldOut ?
          <span
            aria-label="품절"
            className="flex h-14 w-full cursor-not-allowed items-center justify-center rounded-[16px] bg-[#F5F7F6] text-[14px] font-semibold text-[#999999]"
            role="status"
          >
            품절
          </span>
        : <div className="flex items-center gap-2">
            <button
              aria-label="구매하기"
              className="flex h-14 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-[16px] border border-[#2E5E4E] bg-white text-[15px] font-semibold text-[#2E5E4E] active:scale-[0.99]"
              onClick={handleBuyClick}
              type="button"
            >
              구매하기
            </button>
            <button
              aria-label="장바구니에 담기"
              className="flex h-14 min-w-0 flex-[1.05] cursor-pointer items-center justify-center rounded-[16px] border border-[#2E5E4E] bg-[#2E5E4E] text-[15px] font-semibold text-white active:scale-[0.99]"
              onClick={handleCartClick}
              type="button"
            >
              장바구니
            </button>
          </div>}
      </div>
    </>
  );
}
