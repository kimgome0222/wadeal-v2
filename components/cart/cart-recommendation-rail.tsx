"use client";

import type { Deal } from "@/lib/deals";
import type { CartRecommendationItem } from "@/lib/mock/cart-recommendations";

import { CartRecommendationCard } from "@/components/cart/cart-recommendation-card";
import { catalogDealFromRecommendation } from "@/lib/cart/catalog-from-recommendation";
import { useAddToCartSheet } from "@/lib/cart/add-to-cart-sheet-context";

import { CART_RAIL_ITEM_CLASS } from "@/components/home/home-commerce-rail-track";

type CartRecommendationRailProps = {
  title: string;
  items: CartRecommendationItem[];
  ariaLabel?: string;
};

/** Bottom sheet 2.5-up 추천 rail */
export function CartRecommendationRail({
  title,
  items,
  ariaLabel,
}: CartRecommendationRailProps) {
  const { catalog } = useAddToCartSheet();

  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-label={ariaLabel ?? title} className="mt-6">
      <h3 className="text-[16px] font-bold text-[#111111]">{title}</h3>
      <div className="no-scrollbar mt-3 touch-pan-x snap-x snap-mandatory overflow-x-auto overflow-y-visible">
        <div
          aria-label={ariaLabel ?? title}
          className="flex snap-x snap-mandatory gap-3"
          role="list"
        >
          {items.map((item) => {
            const deal: Deal | undefined = catalogDealFromRecommendation(catalog, item);
            return (
              <div className={CART_RAIL_ITEM_CLASS} data-rail-item key={item.slug} role="listitem">
                <CartRecommendationCard deal={deal} item={item} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
