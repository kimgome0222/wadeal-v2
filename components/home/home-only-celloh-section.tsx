"use client";

import Link from "next/link";

import {
  HOME_ONLY_CELLOH_ITEM_CLASS,
  HomeCommerceRailTrack,
} from "@/components/home/home-commerce-rail-track";
import { ProductCardContent } from "@/components/product-card-content";
import { ProductCardImage } from "@/components/product-card-image";
import { CartQuantityControl } from "@/components/cart/cart-quantity-control";
import type { Deal } from "@/lib/deals";
import { getProductDetailHref } from "@/lib/deals/card-display";
import { SectionHeader } from "@/components/ds/section-header";
import { HOME_SECTION_COPY } from "@/lib/copy/home-section-copy";
import { motion } from "@/lib/ui";

type HomeOnlyCellohSectionProps = {
  deals: Deal[];
};

function OnlyCellohCard({ deal }: { deal: Deal }) {
  const href = getProductDetailHref(deal);

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E8ECEA] bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <span className="inline-flex rounded-lg bg-[#2E5E4E] px-2 py-1 text-[11px] font-bold text-white">
        ONLY CELLOH
      </span>
      <div className="relative mt-3 aspect-[4/5] w-full">
        <div className="h-full overflow-hidden rounded-[24px] bg-[#F5F7F6]">
          <Link
            aria-label={`${deal.title} 상세보기`}
            className="block h-full cursor-pointer"
            href={href}
          >
            <ProductCardImage deal={deal} sizes="(max-width: 430px) 334px, 334px" variant="rail" />
          </Link>
        </div>
        <CartQuantityControl deal={deal} />
      </div>
      <Link
        aria-hidden
        className="block min-w-0 cursor-pointer"
        href={href}
        tabIndex={-1}
      >
        <ProductCardContent deal={deal} variant="rail" />
      </Link>
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
      aria-label="셀로단독특가"
      className={`${motion.sectionEnter} overflow-visible pt-10`}
      id="home-section-only-celloh"
    >
      <div className="px-6">
        <SectionHeader
          moreHref={HOME_SECTION_COPY["only-celloh"].moreHref}
          moreLabel={HOME_SECTION_COPY["only-celloh"].moreLabel}
          subtitle={HOME_SECTION_COPY["only-celloh"].subtitle}
          title={HOME_SECTION_COPY["only-celloh"].title}
        />
      </div>
      <HomeCommerceRailTrack ariaLabel="Only Celloh" className="mt-4" snapCenter trackGap="4">
        {deals.slice(0, 8).map((deal) => (
          <div className={HOME_ONLY_CELLOH_ITEM_CLASS} key={deal.slug} role="listitem">
            <OnlyCellohCard deal={deal} />
          </div>
        ))}
      </HomeCommerceRailTrack>
    </section>
  );
}
