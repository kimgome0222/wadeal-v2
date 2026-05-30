import Link from "next/link";

import { HomeProductRailSection } from "@/components/home-product-rail-section";
import { PlpRecommendedSellers } from "@/components/plp/plp-recommended-sellers";
import { SearchTermChips } from "@/components/search/search-term-chips";
import { CELLOH_BUTTONS, CELLOH_EMPTY } from "@/lib/copy/ux-writing";
import type { Deal } from "@/lib/deals";
import type { SellerProfile } from "@/lib/sellers/types";

type SearchEmptyResultsProps = {
  query: string;
  recommendedTerms: string[];
  recommendedSellers?: SellerProfile[];
  recommendedDeals?: Deal[];
};

export function SearchEmptyResults({
  query,
  recommendedTerms,
  recommendedSellers = [],
  recommendedDeals = [],
}: SearchEmptyResultsProps) {
  return (
    <div className="space-y-10">
      <div className="space-y-3 py-8 text-center">
        <h2 className="text-[20px] font-bold text-[#111111]">{CELLOH_EMPTY.search.title}</h2>
        <p className="text-[14px] text-[#666666]">{CELLOH_EMPTY.search.description}</p>
        <Link
          className="inline-flex min-h-[44px] items-center text-[14px] font-semibold text-[#2E5E4E] active:scale-[0.99]"
          href="/"
        >
          {CELLOH_BUTTONS.goHome}
        </Link>
        <p className="sr-only">&apos;{query}&apos; 검색 결과 없음</p>
      </div>

      {recommendedTerms.length > 0 ?
        <section aria-label="추천 검색어" className="space-y-4">
          <h3 className="text-[20px] font-bold text-[#111111]">추천 검색어</h3>
          <SearchTermChips terms={recommendedTerms.slice(0, 10)} />
        </section>
      : null}

      {recommendedDeals.length > 0 ?
        <HomeProductRailSection
          deals={recommendedDeals}
          moreHref="/category/popular"
          title="추천 상품"
        />
      : null}

      {recommendedSellers.length > 0 ?
        <PlpRecommendedSellers sellers={recommendedSellers.slice(0, 8)} />
      : null}
    </div>
  );
}
