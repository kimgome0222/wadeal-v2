import { PlpRecommendedSellers } from "@/components/plp/plp-recommended-sellers";
import { SearchTermChips } from "@/components/search/search-term-chips";
import type { SellerProfile } from "@/lib/sellers/types";

type SearchEmptyResultsProps = {
  query: string;
  recommendedTerms: string[];
  recommendedSellers?: SellerProfile[];
};

export function SearchEmptyResults({
  query,
  recommendedTerms,
  recommendedSellers = [],
}: SearchEmptyResultsProps) {
  return (
    <div className="space-y-10">
      <div className="space-y-2 py-6 text-center">
        <h2 className="text-[20px] font-bold text-[#111111]">검색 결과가 없어요</h2>
        <p className="text-[14px] text-[#666666]">다른 검색어로 다시 찾아보세요.</p>
        <p className="sr-only">&apos;{query}&apos; 검색 결과 없음</p>
      </div>

      {recommendedTerms.length > 0 ?
        <section aria-label="추천 검색어" className="space-y-4">
          <h3 className="text-[20px] font-bold text-[#111111]">추천 검색어</h3>
          <SearchTermChips terms={recommendedTerms.slice(0, 10)} />
        </section>
      : null}

      {recommendedSellers.length > 0 ?
        <PlpRecommendedSellers sellers={recommendedSellers.slice(0, 8)} />
      : null}
    </div>
  );
}
