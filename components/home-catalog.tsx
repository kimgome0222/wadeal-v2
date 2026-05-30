"use client";

import { CellohBrandBanner } from "@/components/celloh-brand-banner";
import { HomeTrustStrip } from "@/components/home-trust-strip";
import { DealsEmptyState } from "@/components/deals-empty-state";
import { HomeAllProductsSection } from "@/components/home-all-products-section";
import { HomeCategoryIcons } from "@/components/home-category-icons";
import { HomeProductRailSection } from "@/components/home-product-rail-section";
import { CELLOH_EMPTY_STATES } from "@/lib/copy/empty-states";
import { ds } from "@/lib/design-system";
import { HOME_SECTION_COPY } from "@/lib/sellers/trust-copy";
import type { Deal } from "@/lib/deals";

type HomeCatalogProps = {
  allProductsDeals?: Deal[];
  recommendedSellerDeals?: Deal[];
  popularSellerDeals?: Deal[];
  specialPriceDeals?: Deal[];
  newSellerDeals?: Deal[];
  heroFeatured?: {
    href: string;
  } | null;
};

export function HomeCatalog({
  allProductsDeals = [],
  recommendedSellerDeals = [],
  popularSellerDeals = [],
  specialPriceDeals = [],
  newSellerDeals = [],
  heroFeatured = null,
}: HomeCatalogProps) {
  const hasProductSections =
    recommendedSellerDeals.length > 0 ||
    popularSellerDeals.length > 0 ||
    specialPriceDeals.length > 0 ||
    newSellerDeals.length > 0 ||
    allProductsDeals.length > 0;

  return (
    <>
      <div className={`bg-white pb-8 ${ds.page.gutter}`}>
        <div className={ds.section.homeHero}>
          <HomeCategoryIcons />
          <CellohBrandBanner href={heroFeatured?.href ?? "/category/all"} />
          <HomeTrustStrip />
        </div>

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
        : <HomeAllProductsSection
            deals={allProductsDeals}
            subtitle={HOME_SECTION_COPY.allProducts.subtitle}
            title={HOME_SECTION_COPY.allProducts.title}
          />}

        <HomeProductRailSection
          deals={newSellerDeals}
          emptyDescription={CELLOH_EMPTY_STATES.newSellerProducts.description}
          emptyTitle={CELLOH_EMPTY_STATES.newSellerProducts.title}
          maxItems={12}
          subtitle={HOME_SECTION_COPY.newSellerProducts.subtitle}
          title={HOME_SECTION_COPY.newSellerProducts.title}
          variant="auxiliary"
        />
      </div>
    </>
  );
}
