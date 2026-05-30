import { HomeRecommendedDealCard } from "@/components/home-recommended-deal-card";
import { ProductCarousel } from "@/components/product-carousel";
import { SectionHeader } from "@/components/ds/section-header";
import type { Deal } from "@/lib/deals";
import type { CategorySlug } from "@/lib/categories";
import { ds } from "@/lib/design-system";
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
    <section aria-label={title} className={`${motion.sectionEnter} ${ds.section.home}`}>
      <SectionHeader moreHref={href} moreLabel="전체보기" subtitle={subtitle} title={title} />

      <div className={ds.carousel.wrap}>
        <ProductCarousel ariaLabel={title} scrollStep="page">
          {displayedDeals.map((deal) => (
            <div className={ds.carousel.item} data-carousel-item key={deal.slug} role="listitem">
              <HomeRecommendedDealCard deal={deal} />
            </div>
          ))}
        </ProductCarousel>
      </div>
    </section>
  );
}
