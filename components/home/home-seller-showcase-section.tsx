"use client";

import Link from "next/link";

import { HomeSellerShowcaseCard } from "@/components/home/home-seller-showcase-card";
import { SectionHeader } from "@/components/ds/section-header";
import type { SellerShowcaseItem } from "@/lib/home/seller-showcase-mock";
import { motion } from "@/lib/ui";

type HomeSellerShowcaseSectionProps = {
  title: string;
  ariaLabel: string;
  sellers: SellerShowcaseItem[];
  sectionId?: string;
  moreHref?: string;
};

/** 신규 입점 / 인기 판매자 — 소개 + 대표상품 카드 rail */
export function HomeSellerShowcaseSection({
  title,
  ariaLabel,
  sellers,
  sectionId,
  moreHref,
}: HomeSellerShowcaseSectionProps) {
  if (sellers.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={ariaLabel}
      className={`${motion.sectionEnter} overflow-visible pt-10`}
      id={sectionId}
    >
      <div className="px-6">
        <SectionHeader title={title} />
      </div>
      <div className="mt-4 snap-x snap-mandatory overflow-x-auto no-scrollbar">
        <div aria-label={ariaLabel} className="flex snap-x snap-mandatory gap-4 px-6" role="list">
          {sellers.map((seller) => (
            <HomeSellerShowcaseCard key={seller.id} seller={seller} />
          ))}
        </div>
      </div>
      {moreHref ?
        <Link className="mt-3 inline-flex min-h-[44px] items-center px-6 text-[13px] font-medium text-[#666666]" href={moreHref}>
          더보기 →
        </Link>
      : null}
    </section>
  );
}
