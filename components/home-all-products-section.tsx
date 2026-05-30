"use client";

import { useEffect, useRef, useState } from "react";

import { DealCard } from "@/components/deal-card";
import { SectionHeader } from "@/components/ds/section-header";
import type { Deal } from "@/lib/deals";
import { ds } from "@/lib/design-system";
import { motion } from "@/lib/ui";

const PAGE_SIZE = 20;

type HomeAllProductsSectionProps = {
  deals: Deal[];
  title: string;
  subtitle?: string;
  moreHref?: string;
};

/** 홈 "전체 상품" — 2열 그리드 + 아래 방향 무한 스크롤 */
export function HomeAllProductsSection({
  deals,
  title,
  subtitle,
  moreHref = "/category/all",
}: HomeAllProductsSectionProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [deals]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || visibleCount >= deals.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((count) => Math.min(count + PAGE_SIZE, deals.length));
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [deals.length, visibleCount]);

  if (deals.length === 0) {
    return null;
  }

  const visibleDeals = deals.slice(0, visibleCount);
  const hasMore = visibleCount < deals.length;

  return (
    <section aria-label={title} className={`${motion.sectionEnter} pt-10`}>
      <div className="px-6">
        <SectionHeader moreHref={moreHref} moreLabel="전체보기" subtitle={subtitle} title={title} />
      </div>

      <div className={`px-6 ${ds.spacing.productGrid}`}>
        {visibleDeals.map((deal) => (
          <DealCard deal={deal} key={deal.slug} />
        ))}
      </div>

      {hasMore ?
        <div
          aria-hidden
          className="flex h-10 items-center justify-center pt-2 text-[12px] font-medium text-wadeal-muted"
          ref={sentinelRef}
        >
          불러오는 중…
        </div>
      : null}
    </section>
  );
}
