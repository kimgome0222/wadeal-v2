"use client";

import Link from "next/link";

import { SectionHeader } from "@/components/ds/section-header";
import { EmptyState } from "@/components/empty-state";
import { HomeRecommendedDealCard } from "@/components/home-recommended-deal-card";
import { ProductCarousel } from "@/components/product-carousel";
import { ds } from "@/lib/design-system";
import type { Deal } from "@/lib/deals";
import { motion } from "@/lib/ui";

type HomeProductRailSectionProps = {
  deals: Deal[];
  title: string;
  subtitle?: string;
  moreHref?: string;
  showMore?: boolean;
  maxItems?: number;
  variant?: "primary" | "auxiliary";
  emptyTitle?: string;
  emptyDescription?: string;
};

export function HomeProductRailSection({
  deals,
  title,
  subtitle,
  moreHref = "/category/all",
  showMore = true,
  maxItems = 20,
  variant = "primary",
  emptyTitle,
  emptyDescription,
}: HomeProductRailSectionProps) {
  const isAuxiliary = variant === "auxiliary";

  if (deals.length === 0) {
    if (!emptyTitle) {
      return null;
    }

    return (
      <section
        aria-label={title}
        className={`${motion.sectionEnter} ${ds.section.home}`}
      >
        <SectionHeader muted={isAuxiliary} subtitle={subtitle} title={title} />
        <EmptyState description={emptyDescription} title={emptyTitle} />
      </section>
    );
  }

  const displayedDeals = deals.slice(0, Math.max(maxItems, 6));

  return (
    <section
      aria-label={title}
      className={`${motion.sectionEnter} ${ds.section.home}`}
    >
      <SectionHeader
        moreHref={showMore && !isAuxiliary ? moreHref : undefined}
        muted={isAuxiliary}
        subtitle={!isAuxiliary ? subtitle : undefined}
        title={title}
      />

      <div className={ds.carousel.wrap}>
        <ProductCarousel ariaLabel={title} scrollStep="page">
          {displayedDeals.map((deal) => (
            <div className={ds.carousel.item} data-carousel-item key={deal.slug} role="listitem">
              <HomeRecommendedDealCard deal={deal} />
            </div>
          ))}
        </ProductCarousel>
      </div>

      {showMore && isAuxiliary ?
        <Link className={`${ds.type.link} mt-3 inline-flex min-h-[44px] items-center`} href={moreHref}>
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
