import Link from "next/link";

import { HomeTopSellerCard } from "@/components/home/home-top-seller-card";
import { SectionHeader } from "@/components/ds/section-header";
import type { HomeSellerWithCover } from "@/lib/home/build-home-view";
import { motion } from "@/lib/ui";

type HomeTopSellersSectionProps = {
  sellers: HomeSellerWithCover[];
};

export function HomeTopSellersSection({ sellers }: HomeTopSellersSectionProps) {
  if (sellers.length === 0) {
    return null;
  }

  return (
    <section aria-label="TOP SELLERS" className={`${motion.sectionEnter} pt-10`}>
      <SectionHeader
        subtitle="좋은 판매자를 발견해보세요"
        title="TOP SELLERS"
      />
      <div className="no-scrollbar -mx-6 flex gap-3 overflow-x-auto px-6 pb-0.5">
        {sellers.map((seller) => (
          <HomeTopSellerCard key={seller.id} seller={seller} />
        ))}
      </div>
    </section>
  );
}
