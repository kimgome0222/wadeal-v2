"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CellohBrandBanner } from "@/components/celloh-brand-banner";
import { HomeTrustStrip } from "@/components/home-trust-strip";
import { DealSection } from "@/components/deal-section";
import { DealsEmptyState } from "@/components/deals-empty-state";
import { Header } from "@/components/header";
import { HomeCategoryIcons } from "@/components/home-category-icons";
import { HomeProductRailSection } from "@/components/home-product-rail-section";
import { CELLOH_EMPTY_STATES } from "@/lib/copy/empty-states";
import { ds } from "@/lib/design-system";
import { HOME_SECTION_COPY } from "@/lib/sellers/trust-copy";
import type { HeaderUserInfo } from "@/lib/auth/user-display";
import type { Deal } from "@/lib/deals";
import type { PopularSearchTerm } from "@/lib/search/types";

type HomeSection = {
  title: string;
  subtitle?: string;
  deals: Deal[];
};

type HomeCatalogProps = {
  sections: HomeSection[];
  recommendedSellerDeals?: Deal[];
  popularSellerDeals?: Deal[];
  specialPriceDeals?: Deal[];
  newSellerDeals?: Deal[];
  headerUser?: HeaderUserInfo | null;
  unreadNotificationCount?: number;
  joinCartCount?: number;
  popularSearchTerms?: PopularSearchTerm[];
  heroFeatured?: {
    href: string;
  } | null;
};

export function HomeCatalog({
  sections,
  recommendedSellerDeals = [],
  popularSellerDeals = [],
  specialPriceDeals = [],
  newSellerDeals = [],
  headerUser = null,
  unreadNotificationCount = 0,
  joinCartCount = 0,
  popularSearchTerms = [],
  heroFeatured = null,
}: HomeCatalogProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const hasProductSections =
    recommendedSellerDeals.length > 0 ||
    popularSellerDeals.length > 0 ||
    specialPriceDeals.length > 0 ||
    newSellerDeals.length > 0 ||
    sections.some((section) => section.deals.length > 0);

  return (
    <>
      <div className={`sticky top-0 z-30 ${ds.chrome.header}`}>
        <Header
          joinCartCount={joinCartCount}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          popularSearchTerms={popularSearchTerms}
          searchQuery={searchQuery}
          unreadNotificationCount={unreadNotificationCount}
          user={headerUser}
          variant="home"
        />
      </div>

      <div className={`bg-white pb-8 ${ds.page.gutter}`}>
        {/* Hero story: 카테고리 → 배너 → 신뢰 */}
        <div className={ds.section.homeHero}>
          <HomeCategoryIcons />
          <CellohBrandBanner href={heroFeatured?.href ?? "/category/all"} />
          <HomeTrustStrip />
        </div>

        {/* 추천 → 인기 → 특가 → 전체 → 신규 */}
        <HomeProductRailSection
          deals={recommendedSellerDeals}
          emptyDescription={CELLOH_EMPTY_STATES.recommendedSellerProducts.description}
          emptyTitle={CELLOH_EMPTY_STATES.recommendedSellerProducts.title}
          maxItems={20}
          subtitle={HOME_SECTION_COPY.recommendedSellerProducts.subtitle}
          title={HOME_SECTION_COPY.recommendedSellerProducts.title}
          variant="primary"
        />

        <HomeProductRailSection
          deals={popularSellerDeals}
          emptyDescription={CELLOH_EMPTY_STATES.popularSellerProducts.description}
          emptyTitle={CELLOH_EMPTY_STATES.popularSellerProducts.title}
          maxItems={20}
          subtitle={HOME_SECTION_COPY.popularSellerProducts.subtitle}
          title={HOME_SECTION_COPY.popularSellerProducts.title}
          variant="primary"
        />

        <HomeProductRailSection
          deals={specialPriceDeals}
          emptyDescription={CELLOH_EMPTY_STATES.specialPriceProducts.description}
          emptyTitle={CELLOH_EMPTY_STATES.specialPriceProducts.title}
          maxItems={20}
          subtitle={HOME_SECTION_COPY.specialPriceProducts.subtitle}
          title={HOME_SECTION_COPY.specialPriceProducts.title}
          variant="primary"
        />

        {!hasProductSections ?
          <DealsEmptyState />
        : sections.map((section) => (
            <DealSection
              deals={section.deals}
              key={section.title}
              subtitle={section.subtitle}
              title={section.title}
            />
          ))
        }

        <HomeProductRailSection
          deals={newSellerDeals}
          emptyDescription={CELLOH_EMPTY_STATES.newSellerProducts.description}
          emptyTitle={CELLOH_EMPTY_STATES.newSellerProducts.title}
          maxItems={12}
          moreHref="/search?q=신규"
          showMore
          subtitle={HOME_SECTION_COPY.newSellerProducts.subtitle}
          title={HOME_SECTION_COPY.newSellerProducts.title}
          variant="auxiliary"
        />
      </div>
    </>
  );
}
