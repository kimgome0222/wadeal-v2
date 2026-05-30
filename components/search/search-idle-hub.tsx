"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { HomeProductRailSection } from "@/components/home-product-rail-section";
import { SearchTrendingSection } from "@/components/search-trending-section";
import { HomeSellersCarouselSection } from "@/components/home-sellers-carousel-section";
import { EmptyState } from "@/components/empty-state";
import { FeaturedSearchTerms } from "@/components/search/featured-search-terms";
import { ds } from "@/lib/design-system";
import type { Deal } from "@/lib/deals";
import type { PopularSearchTerm } from "@/lib/search/types";
import {
  clearRecentSearches,
  readRecentSearches,
  removeRecentSearch,
} from "@/lib/search/recent-searches";
import type { SellerProfile } from "@/lib/sellers/types";

type SearchIdleHubProps = {
  featuredTerms: PopularSearchTerm[];
  popularTerms: PopularSearchTerm[];
  recommendedDeals: Deal[];
  recommendedSellers: SellerProfile[];
};

function SearchRecentTerms() {
  const [terms, setTerms] = useState<string[]>([]);

  useEffect(() => {
    setTerms(readRecentSearches());
  }, []);

  if (terms.length === 0) {
    return null;
  }

  return (
    <section className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <h2 className={ds.type.label}>최근 검색어</h2>
        <button
          className={`${ds.type.caption} text-wadeal-muted hover:text-wadeal-ink`}
          onClick={() => {
            clearRecentSearches();
            setTerms([]);
          }}
          type="button"
        >
          전체 삭제
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {terms.map((term) => (
          <span className="inline-flex items-center gap-1" key={term}>
            <Link
              className={`${ds.chip.base} ${ds.chip.idle} inline-flex min-h-[36px] items-center px-3.5 py-2`}
              href={`/search?q=${encodeURIComponent(term)}`}
            >
              {term}
            </Link>
            <button
              aria-label={`${term} 검색어 삭제`}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-wadeal-muted hover:bg-wadeal-surface hover:text-wadeal-ink"
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

function PopularSearchTermsSection({ terms }: { terms: PopularSearchTerm[] }) {
  if (terms.length === 0) {
    return null;
  }

  return (
    <section className="space-y-2.5">
      <h2 className={ds.type.label}>인기 검색어</h2>
      <div className="flex flex-wrap gap-2">
        {terms.map((term, index) => (
          <Link
            className={`${ds.chip.base} ${ds.chip.idle} inline-flex min-h-[36px] items-center gap-1.5 px-3.5 py-2`}
            href={`/search?q=${encodeURIComponent(term.query)}`}
            key={term.query}
          >
            <span
              aria-hidden
              className={`text-[11px] font-semibold tabular-nums ${
                index < 3 ? "text-wadeal-coral" : "text-wadeal-muted"
              }`}
            >
              {index + 1}
            </span>
            <span>{term.query}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function SearchIdleHub({
  featuredTerms,
  popularTerms,
  recommendedDeals,
  recommendedSellers,
}: SearchIdleHubProps) {
  const hasTerms = featuredTerms.length > 0 || popularTerms.length > 0;
  const hasRails = recommendedDeals.length > 0 || recommendedSellers.length > 0;

  return (
    <div className="space-y-8 pb-4">
      <SearchRecentTerms />

      {featuredTerms.length > 0 ?
        <FeaturedSearchTerms terms={featuredTerms} />
      : null}

      <PopularSearchTermsSection terms={popularTerms} />

      <SearchTrendingSection />

      {!hasTerms && !hasRails ?
        <EmptyState
          description="검색창에 상품명이나 판매자를 입력해 보세요."
          title="무엇을 찾고 계세요?"
          variant="search"
        />
      : null}

      {recommendedDeals.length > 0 ?
        <HomeProductRailSection
          deals={recommendedDeals}
          maxItems={8}
          moreHref="/category/all"
          showMore
          subtitle="지금 celloh에서 인기 있는 상품이에요."
          title="추천 상품"
          variant="auxiliary"
        />
      : null}

      {recommendedSellers.length > 0 ?
        <HomeSellersCarouselSection
          ariaLabel="추천 판매자"
          kicker="판매자"
          moreHref="/search?q=판매자"
          moreLabel="더보기"
          sellers={recommendedSellers}
          subtitle="믿고 구매할 수 있는 판매자를 만나보세요."
          title="추천 판매자"
          variant="compact"
        />
      : null}
    </div>
  );
}
