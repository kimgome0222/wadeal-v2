import type { Deal } from "@/lib/deals";
import { getTierProgress } from "@/lib/pricing/tiers";
import {
  getCouponApplicableDeals,
  getFrequentlyAddedDeals,
} from "@/lib/growth/cart-growth-mock";
import { getDealReviewScoreLabel } from "@/lib/deals/card-display";
import { formatReviewCount } from "@/lib/product/card-badge-meta";

export type CartPreviewProduct = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discountRate?: number;
  reviewCount?: string;
  badgeLabel?: string;
};

export type CartPreviewTabId =
  | "frequentlyBought"
  | "personalizedDiscounts"
  | "reorderPopular"
  | "boughtTogether"
  | "under10000";

export const CART_PREVIEW_TABS: { id: CartPreviewTabId; label: string }[] = [
  { id: "frequentlyBought", label: "자주 산 상품" },
  { id: "personalizedDiscounts", label: "맞춤 할인상품" },
  { id: "reorderPopular", label: "재주문 많은 상품" },
  { id: "boughtTogether", label: "함께 산 상품" },
  { id: "under10000", label: "만원이하 상품" },
];

function uniqueDeals(deals: Deal[], limit: number): Deal[] {
  const seen = new Set<string>();
  const result: Deal[] = [];
  for (const deal of deals) {
    if (seen.has(deal.slug) || result.length >= limit) {
      continue;
    }
    seen.add(deal.slug);
    result.push(deal);
  }
  return result;
}

function fillFromCatalog(target: Deal[], catalog: Deal[], limit: number): Deal[] {
  return uniqueDeals([...target, ...catalog], limit);
}

function dealToPreviewProduct(deal: Deal, badgeLabel?: string): CartPreviewProduct {
  const { applicablePrice } = getTierProgress(deal);
  const discountRate =
    deal.originalPrice > applicablePrice ?
      Math.round(((deal.originalPrice - applicablePrice) / deal.originalPrice) * 100)
    : undefined;
  const review = getDealReviewScoreLabel(deal);

  return {
    id: String(deal.id),
    slug: deal.slug,
    name: deal.title,
    image: deal.imageUrl?.trim() || "",
    price: applicablePrice,
    originalPrice: deal.originalPrice > applicablePrice ? deal.originalPrice : undefined,
    discountRate: discountRate && discountRate > 0 ? discountRate : undefined,
    reviewCount:
      review.count > 0 ? formatReviewCount(review.count) : undefined,
    badgeLabel,
  };
}

function toPreviewList(deals: Deal[], badgeFn?: (deal: Deal, index: number) => string | undefined) {
  return deals.map((deal, index) => dealToPreviewProduct(deal, badgeFn?.(deal, index)));
}

export function getFrequentlyBoughtPreview(catalog: Deal[], limit = 20): CartPreviewProduct[] {
  const deals = fillFromCatalog(getFrequentlyAddedDeals(catalog, limit), catalog, limit);
  return toPreviewList(deals, (_, i) =>
    i % 4 === 0 ? "재구매 인기" : i % 5 === 0 ? "자주 산 상품" : undefined,
  );
}

export function getPersonalizedDiscountsPreview(
  catalog: Deal[],
  limit = 20,
): CartPreviewProduct[] {
  const deals = fillFromCatalog(getCouponApplicableDeals(catalog, limit), catalog, limit);
  return toPreviewList(deals, (_, i) =>
    i % 3 === 0 ? "20% 쿠폰" : i % 4 === 0 ? "맞춤 할인" : undefined,
  );
}

export function getReorderPopularPreview(catalog: Deal[], limit = 20): CartPreviewProduct[] {
  const sorted = [...catalog].sort(
    (a, b) => b.participants - a.participants || b.id - a.id,
  );
  const deals = fillFromCatalog(sorted.slice(2), catalog, limit);
  return toPreviewList(deals, () => "재주문 많은");
}

export function getBoughtTogetherPreview(catalog: Deal[], limit = 20): CartPreviewProduct[] {
  const sorted = [...catalog].sort((a, b) => b.participants - a.participants);
  const deals = fillFromCatalog(sorted.slice(4), catalog, limit);
  return toPreviewList(deals, (_, i) => (i % 3 === 0 ? "같이 담기" : undefined));
}

export function getUnder10000Preview(catalog: Deal[], limit = 20): CartPreviewProduct[] {
  const matched = catalog.filter((deal) => getTierProgress(deal).applicablePrice <= 10_000);
  const deals = fillFromCatalog(matched, catalog, limit);
  return toPreviewList(deals, (_, i) =>
    i % 4 === 0 ? "만원이하" : i % 5 === 0 ? "마감세일" : undefined,
  );
}

export function getCartPreviewProductsByTab(
  tabId: CartPreviewTabId,
  catalog: Deal[],
): CartPreviewProduct[] {
  switch (tabId) {
    case "frequentlyBought":
      return getFrequentlyBoughtPreview(catalog);
    case "personalizedDiscounts":
      return getPersonalizedDiscountsPreview(catalog);
    case "reorderPopular":
      return getReorderPopularPreview(catalog);
    case "boughtTogether":
      return getBoughtTogetherPreview(catalog);
    case "under10000":
      return getUnder10000Preview(catalog);
    default:
      return getFrequentlyBoughtPreview(catalog);
  }
}
