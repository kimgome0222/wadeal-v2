import { HomeRecommendedDealCard } from "@/components/home-recommended-deal-card";
import { HomeProductRailItem, HomeProductRailTrack } from "@/components/home-product-rail-track";
import { SectionHeader } from "@/components/ds/section-header";
import type { Deal } from "@/lib/deals";
import { motion } from "@/lib/ui";

type HomeSpecialPriceSectionProps = {
  deals: Deal[];
};

export function HomeSpecialPriceSection({ deals }: HomeSpecialPriceSectionProps) {
  if (deals.length === 0) {
    return null;
  }

  return (
    <section aria-label="오늘의 특가" className={`${motion.sectionEnter} pt-10`}>
      <div className="px-6">
        <SectionHeader title="오늘의 특가" />
      </div>
      <HomeProductRailTrack ariaLabel="오늘의 특가">
        {deals.map((deal) => (
          <HomeProductRailItem key={deal.slug}>
            <HomeRecommendedDealCard deal={deal} />
          </HomeProductRailItem>
        ))}
      </HomeProductRailTrack>
    </section>
  );
}
