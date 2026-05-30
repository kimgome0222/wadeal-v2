"use client";

import Link from "next/link";

import { HomeRecommendedDealCard } from "@/components/home-recommended-deal-card";
import { ProductCarousel } from "@/components/product-carousel";
import { ds } from "@/lib/design-system";
import type { Deal } from "@/lib/deals";

type MypageProductRailSectionProps = {
  title: string;
  deals: Deal[];
  emptyMessage?: string;
  moreHref?: string;
  ariaLabel?: string;
};

/** 마이셀로 상품 rail — 홈과 동일 2-up 규격 */
export function MypageProductRailSection({
  title,
  deals,
  emptyMessage = "상품이 없어요.",
  moreHref,
  ariaLabel,
}: MypageProductRailSectionProps) {
  if (deals.length === 0) {
    return (
      <section className="space-y-4 px-6 pt-10">
        <h2 className="text-[20px] font-bold text-[#111111]">{title}</h2>
        <p className="rounded-[16px] bg-[#F5F7F6] py-6 text-center text-[13px] text-[#666666]">
          {emptyMessage}
        </p>
      </section>
    );
  }

  return (
    <section aria-label={ariaLabel ?? title} className="space-y-4 pt-10">
      <div className="flex items-end justify-between gap-3 px-6">
        <h2 className="text-[20px] font-bold text-[#111111]">{title}</h2>
        {moreHref ?
          <Link className="text-[13px] font-medium text-[#666666]" href={moreHref}>
            더보기
          </Link>
        : null}
      </div>
      <div className={ds.carousel.wrap}>
        <ProductCarousel ariaLabel={title} scrollStep="page">
          {deals.map((deal) => (
            <div className={ds.carousel.item} data-carousel-item key={deal.slug} role="listitem">
              <HomeRecommendedDealCard deal={deal} />
            </div>
          ))}
        </ProductCarousel>
      </div>
    </section>
  );
}
