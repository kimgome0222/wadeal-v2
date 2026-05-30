import { HomeRecommendedDealCard } from "@/components/home-recommended-deal-card";
import { HomeProductRailItem, HomeProductRailTrack } from "@/components/home-product-rail-track";
import { SectionHeader } from "@/components/ds/section-header";
import type { Deal } from "@/lib/deals";
import type { CategorySlug } from "@/lib/categories";
import { motion } from "@/lib/ui";

type DealSectionProps = {
  deals: Deal[];
  title: string;
  subtitle?: string;
  moreHref?: string;
};

const sectionMoreLinks: Record<string, CategorySlug> = {
  "추천 판매자의 상품": "all",
  "오늘의 추천 상품": "all",
  "별점 높은 상품": "all",
  "리뷰 많은 상품": "all",
  "신규 판매자 상품": "all",
  "전체 상품": "all",
  "지금 주목할 상품": "closing-soon",
  "인기 상품": "closing-soon",
  "실시간 인기 상품": "all",
  "리뷰 좋은 상품": "all",
  "최근 인기 상품": "all",
  "신규 상품": "all",
};

export function DealSection({ deals, title, subtitle, moreHref }: DealSectionProps) {
  if (deals.length === 0) {
    return null;
  }

  const href = moreHref ?? `/category/${sectionMoreLinks[title] ?? "all"}`;
  const displayedDeals = deals.slice(0, Math.min(deals.length, 12));

  return (
    <section aria-label={title} className={`${motion.sectionEnter} pt-10`}>
      <div className="px-6">
        <SectionHeader moreHref={href} moreLabel="전체보기" subtitle={subtitle} title={title} />
      </div>

      <HomeProductRailTrack ariaLabel={title}>
        {displayedDeals.map((deal) => (
          <HomeProductRailItem key={deal.slug}>
            <HomeRecommendedDealCard deal={deal} />
          </HomeProductRailItem>
        ))}
      </HomeProductRailTrack>
    </section>
  );
}
