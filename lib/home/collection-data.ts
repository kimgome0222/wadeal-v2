import type { Deal } from "@/lib/deals";
import { HOME_SECTION_COPY } from "@/lib/copy/home-section-copy";
import {
  buildHomeViewModel,
  getSeasonalSectionCopy,
  type HomeViewModel,
} from "@/lib/home/build-home-view";
import {
  NEW_SELLER_SHOWCASE,
  POPULAR_SELLER_SHOWCASE,
  type SellerShowcaseItem,
} from "@/lib/home/seller-showcase-mock";
import {
  getMockCouponBadge,
  getMockPopularBadge,
} from "@/lib/growth/cart-growth-mock";
import { getRepurchaseRateDeals } from "@/lib/recommendations/repurchase-deals";
import { getCollectionBadgeLabel } from "@/lib/promotions/promotion-copy";
import type { ProductCardPromoBadge } from "@/lib/growth/cart-growth-mock";

export type CollectionKind = "deals" | "ranking" | "sellers" | "live";

export type CollectionDefinition = {
  slug: string;
  title: string;
  description: string;
  kind: CollectionKind;
  resolveDeals?: (view: HomeViewModel) => Deal[];
  resolveSellers?: () => SellerShowcaseItem[];
  showCouponPrice?: boolean;
  resolveBadge?: (deal: Deal) => ProductCardPromoBadge | null;
  badgeLabel?: string;
};

export const COLLECTION_SITEMAP_SLUGS = [
  "today-special",
  "recommended",
  "ranking",
  "only-celloh",
  "coupon-sale",
  "popular",
] as const;

function section(slug: keyof typeof HOME_SECTION_COPY): Pick<CollectionDefinition, "title" | "description"> {
  const copy = HOME_SECTION_COPY[slug];
  return { title: copy.title, description: copy.shortDescription };
}

const COLLECTION_DEFINITIONS: CollectionDefinition[] = [
  {
    slug: "only-celloh",
    ...section("only-celloh"),
    kind: "deals",
    resolveDeals: (view) => view.onlyCellohDeals,
    badgeLabel: getCollectionBadgeLabel("only-celloh"),
  },
  {
    slug: "today-special",
    ...section("today-special"),
    kind: "deals",
    resolveDeals: (view) => view.specialPriceDeals,
  },
  {
    slug: "coupon-sale",
    ...section("coupon-sale"),
    kind: "deals",
    resolveDeals: (view) => view.couponDeals,
    showCouponPrice: true,
    resolveBadge: getMockCouponBadge,
    badgeLabel: getCollectionBadgeLabel("coupon-sale"),
  },
  {
    slug: "ending-sale",
    ...section("ending-sale"),
    kind: "deals",
    resolveDeals: (view) => view.endingSoonDeals,
    badgeLabel: getCollectionBadgeLabel("ending-sale"),
  },
  {
    slug: "weekend-special",
    ...section("weekend-special"),
    kind: "deals",
    resolveDeals: (view) => view.weekendDeals,
  },
  {
    slug: "frequent",
    ...section("frequent"),
    kind: "deals",
    resolveDeals: (view) => view.frequentlyAddedDeals,
    resolveBadge: getMockPopularBadge,
  },
  {
    slug: "popular",
    ...section("popular"),
    kind: "deals",
    resolveDeals: (view) => view.popularDeals,
  },
  {
    slug: "recommended",
    ...section("recommended"),
    kind: "deals",
    resolveDeals: (view) => view.recommendedDeals,
  },
  {
    slug: "seasonal",
    title: HOME_SECTION_COPY.seasonal.title,
    description: HOME_SECTION_COPY.seasonal.shortDescription,
    kind: "deals",
    resolveDeals: (view) => view.seasonalDeals,
  },
  {
    slug: "ranking",
    ...section("ranking"),
    kind: "ranking",
  },
  {
    slug: "lowest",
    ...section("lowest"),
    kind: "deals",
    resolveDeals: (view) => view.lowestPriceDeals,
  },
  {
    slug: "new",
    ...section("new"),
    kind: "deals",
    resolveDeals: (view) =>
      [...view.recommendedDeals].sort((a, b) => b.id - a.id),
    badgeLabel: getCollectionBadgeLabel("new"),
  },
  {
    slug: "popular-sellers",
    ...section("popular-sellers"),
    kind: "sellers",
    resolveSellers: () => POPULAR_SELLER_SHOWCASE,
  },
  {
    slug: "new-sellers",
    ...section("new-sellers"),
    kind: "sellers",
    resolveSellers: () => NEW_SELLER_SHOWCASE,
  },
  {
    slug: "repurchase",
    ...section("repurchase"),
    kind: "deals",
    resolveDeals: (view) => view.repurchaseDeals,
    resolveBadge: getMockPopularBadge,
    badgeLabel: getCollectionBadgeLabel("repurchase"),
  },
  {
    slug: "live",
    ...section("live"),
    kind: "live",
    resolveDeals: (view) => view.recommendedDeals,
  },
  {
    slug: "celloh-coupon",
    ...section("celloh-coupon"),
    kind: "deals",
    resolveDeals: (view) => view.couponDeals,
    showCouponPrice: true,
    resolveBadge: getMockCouponBadge,
    badgeLabel: getCollectionBadgeLabel("celloh-coupon"),
  },
];

const COLLECTION_BY_SLUG = new Map(
  COLLECTION_DEFINITIONS.map((definition) => [definition.slug, definition]),
);

export function getCollectionDefinition(slug: string): CollectionDefinition {
  const found = COLLECTION_BY_SLUG.get(slug);
  if (found) {
    return found;
  }

  return {
    slug,
    title: HOME_SECTION_COPY.recommended.title,
    description: HOME_SECTION_COPY.recommended.shortDescription,
    kind: "deals",
    resolveDeals: (view) => view.recommendedDeals,
  };
}

export function resolveCollectionDeals(catalog: Deal[], slug: string): Deal[] {
  const definition = getCollectionDefinition(slug);
  const view = buildHomeViewModel(catalog);

  if (definition.kind === "sellers" || definition.kind === "ranking") {
    return [];
  }

  if (slug === "repurchase") {
    return getRepurchaseRateDeals(catalog, 24);
  }

  const deals = definition.resolveDeals?.(view) ?? view.recommendedDeals;
  return deals.length > 0 ? deals : view.recommendedDeals;
}

export function resolveCollectionSellers(slug: string): SellerShowcaseItem[] {
  const definition = getCollectionDefinition(slug);
  if (definition.kind !== "sellers") {
    return [];
  }
  const sellers = definition.resolveSellers?.() ?? NEW_SELLER_SHOWCASE;
  return sellers.length > 0 ? sellers : POPULAR_SELLER_SHOWCASE;
}

export function getSeasonalCollectionTitle(): string {
  return getSeasonalSectionCopy().title;
}
