import type { Deal } from "@/lib/deals";
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
};

const COLLECTION_DEFINITIONS: CollectionDefinition[] = [
  {
    slug: "only-celloh",
    title: "셀로단독특가",
    description: "해당 섹션 상품을 모아봤어요",
    kind: "deals",
    resolveDeals: (view) => view.onlyCellohDeals,
  },
  {
    slug: "today-special",
    title: "오늘의특가",
    description: "해당 섹션 상품을 모아봤어요",
    kind: "deals",
    resolveDeals: (view) => view.specialPriceDeals,
  },
  {
    slug: "coupon-sale",
    title: "쿠폰세일",
    description: "해당 섹션 상품을 모아봤어요",
    kind: "deals",
    resolveDeals: (view) => view.couponDeals,
    showCouponPrice: true,
    resolveBadge: getMockCouponBadge,
  },
  {
    slug: "ending-sale",
    title: "마감세일",
    description: "해당 섹션 상품을 모아봤어요",
    kind: "deals",
    resolveDeals: (view) => view.endingSoonDeals,
  },
  {
    slug: "weekend-special",
    title: "주말특가",
    description: "해당 섹션 상품을 모아봤어요",
    kind: "deals",
    resolveDeals: (view) => view.weekendDeals,
  },
  {
    slug: "frequent",
    title: "많이담은상품",
    description: "해당 섹션 상품을 모아봤어요",
    kind: "deals",
    resolveDeals: (view) => view.frequentlyAddedDeals,
    resolveBadge: getMockPopularBadge,
  },
  {
    slug: "popular",
    title: "실시간인기상품",
    description: "해당 섹션 상품을 모아봤어요",
    kind: "deals",
    resolveDeals: (view) => view.popularDeals,
  },
  {
    slug: "recommended",
    title: "추천상품",
    description: "해당 섹션 상품을 모아봤어요",
    kind: "deals",
    resolveDeals: (view) => view.recommendedDeals,
  },
  {
    slug: "seasonal",
    title: "AI기반 계절상품",
    description: "해당 섹션 상품을 모아봤어요",
    kind: "deals",
    resolveDeals: (view) => view.seasonalDeals,
  },
  {
    slug: "ranking",
    title: "카테고리 랭킹",
    description: "카테고리별 인기 상품을 한곳에서 확인하세요.",
    kind: "ranking",
  },
  {
    slug: "lowest",
    title: "오늘의 최저가 상품",
    description: "해당 섹션 상품을 모아봤어요",
    kind: "deals",
    resolveDeals: (view) => view.lowestPriceDeals,
  },
  {
    slug: "new",
    title: "신규상품",
    description: "해당 섹션 상품을 모아봤어요",
    kind: "deals",
    resolveDeals: (view) =>
      [...view.recommendedDeals].sort((a, b) => b.id - a.id),
  },
  {
    slug: "popular-sellers",
    title: "인기 판매자",
    description: "인기 판매자를 모아봤어요",
    kind: "sellers",
    resolveSellers: () => POPULAR_SELLER_SHOWCASE,
  },
  {
    slug: "new-sellers",
    title: "신규 입점 판매자",
    description: "새롭게 입점한 판매자를 만나보세요.",
    kind: "sellers",
    resolveSellers: () => NEW_SELLER_SHOWCASE,
  },
  {
    slug: "repurchase",
    title: "재구매율 높은 상품",
    description: "재구매가 많은 인기 상품을 모아봤어요",
    kind: "deals",
    resolveDeals: (view) => view.frequentlyAddedDeals,
    resolveBadge: getMockPopularBadge,
  },
  {
    slug: "live",
    title: "라이브커머스",
    description: "라이브커머스 준비 중이에요. 함께 보면 좋은 추천상품을 둘러보세요.",
    kind: "live",
    resolveDeals: (view) => view.recommendedDeals,
  },
  {
    slug: "celloh-coupon",
    title: "셀로쿠폰",
    description: "쿠폰 적용 상품을 모아봤어요",
    kind: "deals",
    resolveDeals: (view) => view.couponDeals,
    showCouponPrice: true,
    resolveBadge: getMockCouponBadge,
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
    title: "추천 상품",
    description: "해당 섹션 상품을 모아봤어요",
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

  return definition.resolveDeals?.(view) ?? view.recommendedDeals;
}

export function resolveCollectionSellers(slug: string): SellerShowcaseItem[] {
  const definition = getCollectionDefinition(slug);
  if (definition.kind !== "sellers") {
    return [];
  }
  return definition.resolveSellers?.() ?? NEW_SELLER_SHOWCASE;
}

export function getSeasonalCollectionTitle(): string {
  return getSeasonalSectionCopy().title;
}
