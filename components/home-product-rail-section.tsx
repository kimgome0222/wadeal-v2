import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { HomeRecommendedDealCard } from "@/components/home-recommended-deal-card";
import type { Deal } from "@/lib/deals";
import { motion, ui } from "@/lib/ui";

type HomeProductRailSectionProps = {
  deals: Deal[];
  title: string;
  subtitle?: string;
  moreHref?: string;
  showMore?: boolean;
  /** 데이터 없을 때 빈 상태 (null이면 섹션 숨김) */
  emptyTitle?: string;
  emptyDescription?: string;
};

export function HomeProductRailSection({
  deals,
  title,
  subtitle,
  moreHref = "/category/all",
  showMore = true,
  emptyTitle,
  emptyDescription,
}: HomeProductRailSectionProps) {
  if (deals.length === 0) {
    if (!emptyTitle) {
      return null;
    }

    return (
      <section
        aria-label={title}
        className={`${motion.sectionEnter} space-y-3 border-t border-wadeal-line/80 bg-white pt-5`}
      >
        <div>
          <h2 className={ui.sectionTitleAccent}>{title}</h2>
          {subtitle ?
            <p className="mt-1.5 text-xs font-medium leading-relaxed text-wadeal-muted">
              {subtitle}
            </p>
          : null}
        </div>
        <EmptyState description={emptyDescription} title={emptyTitle} />
      </section>
    );
  }

  const displayedDeals = deals.slice(0, 6);

  return (
    <section
      aria-label={title}
      className={`${motion.sectionEnter} space-y-3 border-t border-wadeal-line/80 bg-white pt-5`}
    >
      <div>
        <h2 className={ui.sectionTitleAccent}>{title}</h2>
        {subtitle ?
          <p className="mt-1.5 text-xs font-medium leading-relaxed text-wadeal-muted">
            {subtitle}
          </p>
        : null}
      </div>

      <div className="celloh-rail-scroll no-scrollbar -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1">
        {displayedDeals.map((deal) => (
          <HomeRecommendedDealCard deal={deal} key={deal.slug} />
        ))}
      </div>

      {showMore ?
        <Link
          className={`${ui.btnOutline} flex h-10 w-full items-center justify-center text-[13px] font-bold`}
          href={moreHref}
        >
          더 보기
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
