import Link from "next/link";

import { HomeSellerIconCard } from "@/components/home/home-seller-icon-card";
import { HomeSellerRailTrack } from "@/components/home/home-seller-rail-track";
import { SectionHeader } from "@/components/ds/section-header";
import type { SellerProfile } from "@/lib/sellers/types";
import { motion } from "@/lib/ui";

type HomeSellerRailSectionProps = {
  sellers: SellerProfile[];
  title: string;
  subtitle?: string;
  ariaLabel: string;
  showNew?: boolean;
  className?: string;
  maxItems?: number;
};

export function HomeSellerRailSection({
  sellers,
  title,
  subtitle,
  ariaLabel,
  showNew = false,
  className = "pt-10",
  maxItems = 8,
}: HomeSellerRailSectionProps) {
  if (sellers.length === 0) {
    return null;
  }

  const displayed = sellers.slice(0, maxItems);

  return (
    <section aria-label={ariaLabel} className={`${motion.sectionEnter} overflow-visible ${className}`}>
      <div className="px-6">
        <SectionHeader subtitle={subtitle} title={title} />
      </div>
      <HomeSellerRailTrack ariaLabel={ariaLabel}>
        {displayed.map((seller) => (
          <HomeSellerIconCard
            id={seller.id}
            key={seller.id}
            name={seller.name}
            rating={seller.rating}
            showNew={showNew}
          />
        ))}
      </HomeSellerRailTrack>
      {showNew ?
        <Link className="mt-3 inline-flex min-h-[44px] items-center px-6 text-[13px] font-medium text-[#666666]" href="/category/new-sellers">
          신규 판매자 더보기 →
        </Link>
      : null}
    </section>
  );
}
