"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CellohBrandBanner } from "@/components/celloh-brand-banner";
import { DealSection } from "@/components/deal-section";
import { DealsEmptyState } from "@/components/deals-empty-state";
import { Header } from "@/components/header";
import { HeroBanner } from "@/components/hero-banner";
import { HomeCategoryIcons } from "@/components/home-category-icons";
import { HomeFeaturedSellersSection } from "@/components/home-featured-sellers-section";
import { HomeNewSellersSection } from "@/components/home-new-sellers-section";
import { HomePopularSellersSection } from "@/components/home-popular-sellers-section";
import { HomeProductRailSection } from "@/components/home-product-rail-section";
import { HomeTrustedSellersSection } from "@/components/home-trusted-sellers-section";
import { RecentDealsSection } from "@/components/recent-deals-section";
import { normalizeHomeDisplayTitle } from "@/lib/copy/home-display";
import { CELLOH_EMPTY_STATES } from "@/lib/copy/empty-states";
import { HOME_SECTION_COPY } from "@/lib/sellers/trust-copy";
import type { RoleNavLink } from "@/lib/auth/role-nav";
import type { HeaderUserInfo } from "@/lib/auth/user-display";
import type { Deal } from "@/lib/deals";
import type { PopularSearchTerm } from "@/lib/search/types";
import type { SellerProfile } from "@/lib/sellers/types";

type HomeSection = {
  title: string;
  subtitle?: string;
  deals: Deal[];
};

type HomeCatalogProps = {
  sections: HomeSection[];
  recommendedSellerDeals?: Deal[];
  newSellerDeals?: Deal[];
  topRatedDeals?: Deal[];
  mostReviewedDeals?: Deal[];
  featuredSellers?: SellerProfile[];
  popularSellers?: SellerProfile[];
  trustedSellers?: SellerProfile[];
  newSellers?: SellerProfile[];
  headerUser?: HeaderUserInfo | null;
  unreadNotificationCount?: number;
  joinCartCount?: number;
  roleLinks?: RoleNavLink[];
  popularSearchTerms?: PopularSearchTerm[];
  heroFeatured?: {
    href: string;
    title?: string;
    imageUrl?: string | null;
    subtitle?: string | null;
  } | null;
};

export function HomeCatalog({
  sections,
  recommendedSellerDeals = [],
  newSellerDeals = [],
  topRatedDeals = [],
  mostReviewedDeals = [],
  featuredSellers = [],
  popularSellers = [],
  trustedSellers = [],
  newSellers = [],
  headerUser = null,
  unreadNotificationCount = 0,
  joinCartCount = 0,
  roleLinks = [],
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
    newSellerDeals.length > 0 ||
    topRatedDeals.length > 0 ||
    mostReviewedDeals.length > 0 ||
    sections.some((section) => section.deals.length > 0);

  const promoTitle =
    heroFeatured?.title ? normalizeHomeDisplayTitle(heroFeatured.title) : undefined;

  const showPromoBanner =
    heroFeatured &&
    (heroFeatured.imageUrl || promoTitle) &&
    promoTitle !== "누가 만들었는지 알고 사세요." &&
    promoTitle !== "추천 판매자의 상품";

  return (
    <>
      <div className="sticky top-0 z-30 border-b border-wadeal-line bg-white">
        <Header
          joinCartCount={joinCartCount}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          popularSearchTerms={popularSearchTerms}
          roleLinks={roleLinks}
          searchQuery={searchQuery}
          unreadNotificationCount={unreadNotificationCount}
          user={headerUser}
          variant="home"
        />
      </div>

      <div className="space-y-0 bg-white px-4 pb-5 pt-1">
        <CellohBrandBanner href={heroFeatured?.href ?? "/category/all"} />

        <div className="space-y-5 pt-4">
          <HomeFeaturedSellersSection sellers={featuredSellers} />
          <HomePopularSellersSection sellers={popularSellers} />
          <HomeTrustedSellersSection sellers={trustedSellers} />
          <HomeNewSellersSection sellers={newSellers} />
        </div>

        <HomeProductRailSection
          deals={recommendedSellerDeals}
          emptyDescription={CELLOH_EMPTY_STATES.recommendedSellerProducts.description}
          emptyTitle={CELLOH_EMPTY_STATES.recommendedSellerProducts.title}
          subtitle={HOME_SECTION_COPY.recommendedSellerProducts.subtitle}
          title={HOME_SECTION_COPY.recommendedSellerProducts.title}
        />

        <HomeProductRailSection
          deals={topRatedDeals}
          subtitle={HOME_SECTION_COPY.topRatedProducts.subtitle}
          title={HOME_SECTION_COPY.topRatedProducts.title}
        />

        <HomeProductRailSection
          deals={mostReviewedDeals}
          subtitle={HOME_SECTION_COPY.mostReviewedProducts.subtitle}
          title={HOME_SECTION_COPY.mostReviewedProducts.title}
        />

        <HomeProductRailSection
          deals={newSellerDeals}
          emptyDescription={CELLOH_EMPTY_STATES.newSellerProducts.description}
          emptyTitle={CELLOH_EMPTY_STATES.newSellerProducts.title}
          subtitle={HOME_SECTION_COPY.newSellerProducts.subtitle}
          title={HOME_SECTION_COPY.newSellerProducts.title}
        />

        <div className="border-t border-wadeal-line/80 pt-5">
          <HomeCategoryIcons />
        </div>

        {!hasProductSections ?
          <DealsEmptyState />
        : <>
            {showPromoBanner ?
              <HeroBanner
                featuredHref={heroFeatured!.href}
                featuredTitle={promoTitle}
                imageUrl={heroFeatured!.imageUrl}
                subtitle={heroFeatured!.subtitle}
              />
            : null}

            {sections.map((section) => (
              <DealSection
                deals={section.deals}
                key={section.title}
                subtitle={section.subtitle}
                title={section.title}
              />
            ))}
            <RecentDealsSection />
          </>
        }
      </div>
    </>
  );
}
