import { HomeRecommendedDealCard } from "@/components/home-recommended-deal-card";
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
      <SectionHeader title="오늘의 특가" />
      <div className="no-scrollbar -mx-6 flex gap-3 overflow-x-auto px-6 pb-0.5">
        {deals.map((deal) => (
          <div className="w-[190px] shrink-0" key={deal.slug}>
            <HomeRecommendedDealCard deal={deal} />
          </div>
        ))}
      </div>
    </section>
  );
}
