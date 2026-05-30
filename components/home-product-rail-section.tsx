"use client";

import Link from "next/link";

import { SectionHeader } from "@/components/ds/section-header";
import { EmptyState } from "@/components/empty-state";
import { HomeProductRailItem, HomeProductRailTrack } from "@/components/home-product-rail-track";
import { HomeRecommendedDealCard } from "@/components/home-recommended-deal-card";
import type { Deal } from "@/lib/deals";
import { motion } from "@/lib/ui";

type HomeProductRailSectionProps = {
  deals: Deal[];
  title: string;
  subtitle?: string;
  ariaLabel?: string;
  moreHref?: string;
  showMore?: boolean;
  maxItems?: number;
  variant?: "primary" | "auxiliary";
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
};

export function HomeProductRailSection({
  deals,
  title,
  subtitle,
  ariaLabel,
  moreHref = "/category/all",
  showMore = true,
  maxItems = 12,
  variant = "primary",
  emptyTitle,
  emptyDescription,
  className = "pt-10",
}: HomeProductRailSectionProps) {
  const isAuxiliary = variant === "auxiliary";

  if (deals.length === 0) {
    if (!emptyTitle) {
      return null;
    }

    return (
      <section aria-label={title} className={`${motion.sectionEnter} pt-10`}>
        <div className="px-6">
          <SectionHeader muted={isAuxiliary} subtitle={subtitle} title={title} />
        </div>
        <div className="px-6">
          <EmptyState description={emptyDescription} title={emptyTitle} />
        </div>
      </section>
    );
  }

  const displayedDeals = deals.slice(0, Math.max(maxItems, 10));

  return (
    <section
      aria-label={ariaLabel ?? title}
      className={`${motion.sectionEnter} ${className}`}
    >
      <div className="px-6">
        <SectionHeader
          moreHref={showMore && !isAuxiliary ? moreHref : undefined}
          muted={isAuxiliary}
          subtitle={!isAuxiliary ? subtitle : undefined}
          title={title}
        />
      </div>

      <HomeProductRailTrack ariaLabel={ariaLabel ?? title}>
        {displayedDeals.map((deal) => (
          <HomeProductRailItem key={deal.slug}>
            <HomeRecommendedDealCard deal={deal} />
          </HomeProductRailItem>
        ))}
      </HomeProductRailTrack>

      {showMore && isAuxiliary ?
        <Link className="mt-3 inline-flex min-h-[44px] items-center px-6 text-[13px] font-medium text-[#666666]" href={moreHref}>
          신규 판매자 상품 더보기 →
        </Link>
      : null}
    </section>
  );
}

/** @deprecated Use HomeProductRailSection */
export function HomeMainDealsSection(
  props: Omit<HomeProductRailSectionProps, "title"> & { title?: string },
) {
  return (
    <HomeProductRailSection
      {...props}
      title={props.title ?? "추천 판매자의 상품"}
    />
  );
}
