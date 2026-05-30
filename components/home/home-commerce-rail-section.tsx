"use client";

import { SectionHeader } from "@/components/ds/section-header";
import { HomeCommerceRailItem, HomeCommerceRailTrack } from "@/components/home/home-commerce-rail-track";
import { HomeRecommendedDealCard } from "@/components/home-recommended-deal-card";
import type { Deal } from "@/lib/deals";
import type { ProductCardPromoBadge } from "@/lib/growth/cart-growth-mock";
import { motion } from "@/lib/ui";

type HomeCommerceRailSectionProps = {
  deals: Deal[];
  title: string;
  subtitle?: string;
  ariaLabel?: string;
  sectionId?: string;
  className?: string;
  maxItems?: number;
  resolveBadge?: (deal: Deal) => ProductCardPromoBadge | null;
  showCouponPrice?: boolean;
  moreHref?: string;
  moreLabel?: string;
};

/** 메인 2.5-up commerce rail 섹션 */
export function HomeCommerceRailSection({
  deals,
  title,
  subtitle,
  ariaLabel,
  sectionId,
  className = "pt-10",
  maxItems = 12,
  resolveBadge,
  showCouponPrice = false,
  moreHref,
  moreLabel,
}: HomeCommerceRailSectionProps) {
  if (deals.length === 0) {
    return null;
  }

  const displayed = deals.slice(0, maxItems);

  return (
    <section
      aria-label={ariaLabel ?? title}
      className={`${motion.sectionEnter} overflow-visible ${className}`}
      id={sectionId}
    >
      <div className="px-6">
        <SectionHeader moreHref={moreHref} moreLabel={moreLabel} subtitle={subtitle} title={title} />
      </div>
      <HomeCommerceRailTrack ariaLabel={ariaLabel ?? title} className="mt-4">
        {displayed.map((deal) => (
          <HomeCommerceRailItem key={deal.slug}>
            <HomeRecommendedDealCard
              deal={deal}
              imageAspect="square"
              promoBadge={resolveBadge?.(deal) ?? null}
              showCouponPrice={showCouponPrice}
            />
          </HomeCommerceRailItem>
        ))}
      </HomeCommerceRailTrack>
    </section>
  );
}
