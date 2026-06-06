"use client";

import { HomeCommerceRailItem, HomeCommerceRailTrack } from "@/components/home/home-commerce-rail-track";
import { HomeRailDealCard } from "@/components/home-rail-deal-card";
import type { Deal } from "@/lib/deals";

type ProductDetailDealRailProps = {
  title: string;
  subtitle?: string;
  deals: Deal[];
  sectionId?: string;
};

/** PDP 하단 — 2.5 peek commerce rail (+/stepper 포함) */
export function ProductDetailDealRail({
  title,
  subtitle,
  deals,
  sectionId,
}: ProductDetailDealRailProps) {
  if (deals.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4 py-6" id={sectionId}>
      <div className="space-y-1 px-6">
        <h2 className="text-[20px] font-bold text-[#111111]">{title}</h2>
        {subtitle ?
          <p className="text-[13px] text-[#666666]">{subtitle}</p>
        : null}
      </div>
      <HomeCommerceRailTrack ariaLabel={title}>
        {deals.map((deal) => (
          <HomeCommerceRailItem key={deal.slug}>
            <HomeRailDealCard deal={deal} />
          </HomeCommerceRailItem>
        ))}
      </HomeCommerceRailTrack>
    </section>
  );
}
