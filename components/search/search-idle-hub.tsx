"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PlpRecommendedSellers } from "@/components/plp/plp-recommended-sellers";
import { SearchTermChips } from "@/components/search/search-term-chips";
import { SearchTrendingSection } from "@/components/search-trending-section";
import { RECOMMENDED_SEARCH_TERMS } from "@/lib/search/search-data";
import {
  clearRecentSearches,
  readRecentSearches,
  removeRecentSearch,
} from "@/lib/search/recent-searches";
import type { SellerProfile } from "@/lib/sellers/types";

type SearchIdleHubProps = {
  recommendedSellers: SellerProfile[];
};

function SearchRecentTermsSection() {
  const [terms, setTerms] = useState<string[]>([]);

  useEffect(() => {
    setTerms(readRecentSearches());
  }, []);

  if (terms.length === 0) {
    return null;
  }

  return (
    <section aria-label="최근 검색어" className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[20px] font-bold text-[#111111]">최근 검색어</h2>
        <button
          className="text-[13px] font-medium text-[#666666] hover:text-[#111111]"
          onClick={() => {
            clearRecentSearches();
            setTerms([]);
          }}
          type="button"
        >
          전체 삭제
        </button>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {terms.map((term) => (
          <span className="inline-flex items-center gap-1" key={term}>
            <Link
              className="inline-flex h-9 shrink-0 cursor-pointer items-center rounded-[18px] border border-[#E8ECEA] bg-white px-3.5 text-[13px] font-medium text-[#111111] transition-colors active:scale-[0.98] hover:border-[#2E5E4E]/30"
              href={`/search?q=${encodeURIComponent(term)}`}
            >
              {term}
            </Link>
            <button
              aria-label={`${term} 검색어 삭제`}
              className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[#666666] hover:bg-[#F5F7F6] hover:text-[#111111]"
              onClick={() => setTerms(removeRecentSearch(term))}
              type="button"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </section>
  );
}

export function SearchIdleHub({ recommendedSellers }: SearchIdleHubProps) {
  return (
    <div className="space-y-10 pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)] pt-8">
      <SearchRecentTermsSection />

      <section aria-label="추천 검색어" className="space-y-4">
        <h2 className="text-[20px] font-bold text-[#111111]">추천 검색어</h2>
        <SearchTermChips terms={RECOMMENDED_SEARCH_TERMS} />
      </section>

      <SearchTrendingSection />

      <PlpRecommendedSellers sellers={recommendedSellers.slice(0, 8)} />
    </div>
  );
}
