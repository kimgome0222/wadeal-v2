"use client";

import Link from "next/link";

import {
  HOME_ONLY_CELLOH_ITEM_CLASS,
  HomeCommerceRailTrack,
} from "@/components/home/home-commerce-rail-track";
import { ProductCardImage } from "@/components/product-card-image";
import { CartQuantityControl } from "@/components/cart/cart-quantity-control";
import type { Deal } from "@/lib/deals";
import { currency } from "@/lib/deals";
import { getProductDetailHref } from "@/lib/deals/card-display";
import { getTierProgress } from "@/lib/pricing/tiers";
import { SectionHeader } from "@/components/ds/section-header";
import { motion } from "@/lib/ui";

type HomeOnlyCellohSectionProps = {
  deals: Deal[];
};

function OnlyCellohCard({ deal }: { deal: Deal }) {
  const { applicablePrice } = getTierProgress(deal);
  const discount = Math.round(
    ((deal.originalPrice - applicablePrice) / deal.originalPrice) * 100,
  );
  const href = getProductDetailHref(deal);

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E8ECEA] bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <Link aria-label={deal.title} className="absolute inset-0 z-0" href={href} tabIndex={-1} />
      <div className="relative z-10">
        <span className="inline-flex rounded-lg bg-[#2E5E4E] px-2 py-1 text-[11px] font-bold text-white">
          ONLY CELLOH
        </span>
        <div className="relative mt-3 aspect-[4/5] w-full overflow-hidden rounded-[24px] bg-[#F5F7F6]">
          <ProductCardImage deal={deal} sizes="(max-width: 430px) 85vw, 320px" variant="rail" />
          <CartQuantityControl deal={deal} />
        </div>
        <h3 className="mt-3 line-clamp-2 text-[16px] font-bold text-[#111111]">{deal.title}</h3>
        <p className="mt-1 line-clamp-1 text-[13px] text-[#666666]">단독 셀로 판매</p>
        <div className="mt-3">
          {discount > 0 ?
            <span className="text-[16px] font-bold text-[#E28A3B]">{discount}% </span>
          : null}
          <span className="text-[18px] font-bold text-[#111111]">
            {currency.format(applicablePrice)}원
          </span>
        </div>
      </div>
    </article>
  );
}

/** Only Celloh — center 1 + peek 0.5 */
export function HomeOnlyCellohSection({ deals }: HomeOnlyCellohSectionProps) {
  if (deals.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Only Celloh 단독 상품"
      className={`${motion.sectionEnter} overflow-visible pt-10`}
      id="home-section-only-celloh"
    >
      <div className="px-6">
        <SectionHeader title="Only Celloh 단독 상품" />
      </div>
      <HomeCommerceRailTrack ariaLabel="Only Celloh" className="mt-4" snapCenter>
        {deals.slice(0, 8).map((deal) => (
          <div className={HOME_ONLY_CELLOH_ITEM_CLASS} key={deal.slug} role="listitem">
            <OnlyCellohCard deal={deal} />
          </div>
        ))}
      </HomeCommerceRailTrack>
    </section>
  );
}
