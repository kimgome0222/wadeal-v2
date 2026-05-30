"use client";

import { HomeCommerceRailItem, HomeCommerceRailTrack } from "@/components/home/home-commerce-rail-track";
import { HomeCommerceRailSection } from "@/components/home/home-commerce-rail-section";
import { HomeRecommendedDealCard } from "@/components/home-recommended-deal-card";
import { SectionHeader } from "@/components/ds/section-header";
import type { Deal } from "@/lib/deals";
import type { ProductCardPromoBadge } from "@/lib/growth/cart-growth-mock";
import { motion } from "@/lib/ui";

type GrowthProductRailSectionProps = {
  deals: Deal[];
  title: string;
  subtitle?: string;
  ariaLabel?: string;
  className?: string;
  maxItems?: number;
  resolveBadge?: (deal: Deal) => ProductCardPromoBadge | null;
  showCouponPrice?: boolean;
};

/** Growth rail — 2.5-up commerce rail + badge */
export function GrowthProductRailSection({
  deals,
  title,
  subtitle,
  ariaLabel,
  className = "pt-10",
  maxItems = 12,
  resolveBadge,
  showCouponPrice = false,
}: GrowthProductRailSectionProps) {
  if (deals.length === 0) {
    return null;
  }

  if (!resolveBadge) {
    return (
      <HomeCommerceRailSection
        ariaLabel={ariaLabel}
        className={className}
        deals={deals}
        maxItems={maxItems}
        showCouponPrice={showCouponPrice}
        subtitle={subtitle}
        title={title}
      />
    );
  }

  const displayed = deals.slice(0, maxItems);

  return (
    <section
      aria-label={ariaLabel ?? title}
      className={`${motion.sectionEnter} overflow-visible ${className}`}
    >
      <div className="px-6">
        <SectionHeader subtitle={subtitle} title={title} />
      </div>
      <HomeCommerceRailTrack ariaLabel={ariaLabel ?? title} className="mt-4">
        {displayed.map((deal) => (
          <HomeCommerceRailItem key={deal.slug}>
            <HomeRecommendedDealCard
              deal={deal}
              imageAspect="square"
              promoBadge={resolveBadge(deal)}
              showCouponPrice={showCouponPrice}
            />
          </HomeCommerceRailItem>
        ))}
      </HomeCommerceRailTrack>
    </section>
  );
}
