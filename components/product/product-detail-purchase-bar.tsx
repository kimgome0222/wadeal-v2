"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AddToJoinCartButton } from "@/components/add-to-join-cart-button";
import { PriceTierSteps } from "@/components/price-tier-steps";
import { QuantityStepper } from "@/components/product/quantity-stepper";
import { SaveDealButton } from "@/components/save-deal-button";
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
  initialSaved,
}: ProductDetailPurchaseBarProps) {
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

  return (
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

      <div className="flex items-center gap-2 pt-2">
        <SaveDealButton
          className="!h-12 !w-12 shrink-0 !rounded-[14px]"
          deal={deal}
          initialSaved={initialSaved}
          size="md"
        />

        {soldOut ?
          <span className="flex h-12 flex-1 cursor-not-allowed items-center justify-center rounded-[14px] bg-gray-100 text-[14px] font-semibold text-gray-500">
            품절
          </span>
        : <>
            <AddToJoinCartButton
              className="!h-12 !min-w-0 !flex-1 !rounded-[14px] !border-[#E8ECEA] !bg-white !px-2 !text-[14px] !font-semibold !text-[#111111]"
              deal={deal}
              quantity={quantity}
            />
            <Link
              className="flex h-12 min-w-0 flex-1 items-center justify-center rounded-[14px] bg-[#2E5E4E] text-[15px] font-semibold text-white active:scale-[0.99]"
              href={checkoutHref}
            >
              구매하기
            </Link>
          </>}
      </div>
    </section>
  );
}
