import { HomeSellerIconCard } from "@/components/home/home-seller-icon-card";
import { HomeSellerRailTrack } from "@/components/home/home-seller-rail-track";
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

  const displayed = sellers.slice(0, 12);

  return (
    <section aria-label="인기 판매자" className={`${motion.sectionEnter} pt-10`}>
      <div className="px-6">
        <SectionHeader
          subtitle="평점과 판매 이력이 좋은 판매자예요"
          title="인기 판매자"
        />
      </div>
      <HomeSellerRailTrack ariaLabel="인기 판매자">
        {displayed.map((seller) => (
          <HomeSellerIconCard
            coverImageUrl={seller.coverImageUrl}
            id={seller.id}
            key={seller.id}
            name={seller.name}
            rating={seller.rating}
          />
        ))}
      </HomeSellerRailTrack>
    </section>
  );
}
