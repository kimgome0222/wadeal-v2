import { DealCard } from "@/components/deal-card";
import { EmptyState } from "@/components/empty-state";
import { HomeProductRailSection } from "@/components/home-product-rail-section";
import { HomeSellersCarouselSection } from "@/components/home-sellers-carousel-section";
import { ds } from "@/lib/design-system";
import type { Deal } from "@/lib/deals";
import type { SellerProfile } from "@/lib/sellers/types";

type SearchEmptyResultsProps = {
  query: string;
  similarDeals: Deal[];
  recommendedSellers?: SellerProfile[];
};

export function SearchEmptyResults({
  query,
  similarDeals,
  recommendedSellers = [],
}: SearchEmptyResultsProps) {
  return (
    <div className="space-y-8">
      <EmptyState
        description={`'${query}'에 맞는 검색 결과가 없어요. 다른 키워드로 다시 검색해 보세요.`}
        title="검색 결과가 없습니다"
        variant="search"
      />

      {similarDeals.length > 0 ?
        <section className="space-y-3" id="search-fallback-products">
          <div>
            <h2 className={ds.type.h2}>추천 상품</h2>
            <p className={`mt-1 ${ds.type.caption}`}>
              지금 많이 찾는 인기 상품을 추천해 드려요.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {similarDeals.map((deal) => (
              <DealCard deal={deal} key={deal.slug} />
            ))}
          </div>
        </section>
      : null}

      {recommendedSellers.length > 0 ?
        <HomeSellersCarouselSection
          ariaLabel="추천 판매자"
          kicker="판매자"
          moreHref="/search?q=판매자"
          moreLabel="더보기"
          sellers={recommendedSellers}
          subtitle="이 판매자들의 상품도 둘러보세요."
          title="추천 판매자"
          variant="compact"
        />
      : null}
    </div>
  );
}
