"use client";

import { useMemo, useState } from "react";

import { AddToJoinCartButton } from "@/components/add-to-join-cart-button";
import { PriceTierSteps } from "@/components/price-tier-steps";
import { QuantityStepper } from "@/components/product/quantity-stepper";
import { useCartPreviewSheet } from "@/lib/cart/cart-preview-sheet-context";
import type { Deal } from "@/lib/deals";
import { currency, isDealSoldOut } from "@/lib/deals";
import { inventoryFromDeal } from "@/lib/products/inventory";
import { getTierProgress } from "@/lib/pricing/tiers";
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

        <PriceTierSteps deal={deal} selectedQuantity={quantity} tiers={tiers} />
      </section>

      <div className="fixed inset-x-0 bottom-0 z-[110] mx-auto max-w-[430px] border-t border-[#E8ECEA] bg-white px-6 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
        {soldOut ?
          <span className="flex h-12 w-full cursor-not-allowed items-center justify-center rounded-[14px] bg-[#F5F7F6] text-[14px] font-semibold text-[#999999]">
            품절
          </span>
        : <div className="flex items-center gap-2">
            <AddToJoinCartButton
              className="!h-12 !min-w-0 !flex-1 !rounded-[14px] !border-[#E8ECEA] !bg-white !px-2 !text-[14px] !font-semibold !text-[#111111]"
              deal={deal}
              quantity={quantity}
            />
            <button
              className="flex h-12 min-w-0 flex-1 items-center justify-center rounded-[14px] bg-[#2E5E4E] text-[15px] font-semibold text-white active:scale-[0.99]"
              onClick={handleBuyClick}
              type="button"
            >
              구매하기
            </button>
          </div>}
      </div>
    </>
  );
}
