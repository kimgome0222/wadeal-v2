import type { Deal } from "@/lib/deals";
import { getFrequentlyAddedDeals, getCartUpsellDeals } from "@/lib/growth/cart-growth-mock";
import { readRecentProductSlugs } from "@/lib/personalization/recent-products";
import { getTierProgress } from "@/lib/pricing/tiers";
import { formatReviewCountLabel, getProductCardReviewMeta } from "@/lib/product/card-badge-meta";

export type CartRecommendationItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discountRate?: number;
  reviewCount?: number;
  rating?: number;
  badgeLabel?: string;
};

const RECENT_PURCHASES_KEY = "celloh-recent-purchases-v1";
const MAX_RECENT_PURCHASES = 20;

function readRecentPurchaseSlugs(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(RECENT_PURCHASES_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** 담기 시 최근 구매 mock 기록 — client only */
export function recordRecentPurchase(slug: string) {
  if (typeof window === "undefined" || !slug) {
    return;
  }

  const next = [slug, ...readRecentPurchaseSlugs().filter((item) => item !== slug)].slice(
    0,
    MAX_RECENT_PURCHASES,
  );
  window.localStorage.setItem(RECENT_PURCHASES_KEY, JSON.stringify(next));
}

export function dealToCartRecommendationItem(deal: Deal): CartRecommendationItem {
  const { applicablePrice } = getTierProgress(deal);
  const discountRate =
    deal.originalPrice > applicablePrice ?
      Math.round(((deal.originalPrice - applicablePrice) / deal.originalPrice) * 100)
    : undefined;
  const review = getProductCardReviewMeta(deal);
  const reviewCount =
    review.countLabel.endsWith("+") ?
      Number.parseInt(review.countLabel, 10) || 1
    : Number.parseInt(review.countLabel.replace(/,/g, ""), 10) || 1;

  return {
    id: String(deal.id),
    slug: deal.slug,
    name: deal.title,
    image: deal.imageUrl?.trim() || "",
    price: applicablePrice,
    originalPrice: deal.originalPrice > applicablePrice ? deal.originalPrice : undefined,
    discountRate: discountRate && discountRate > 0 ? discountRate : undefined,
    reviewCount,
    rating: Number(review.score),
    badgeLabel: deal.badge?.trim() || undefined,
  };
}

function toRecommendationItems(deals: Deal[]): CartRecommendationItem[] {
  return deals.map(dealToCartRecommendationItem);
}

/** 다른 사람들이 함께 구매한 상품 — mock upsell */
export function getTogetherPurchasedRecommendations(
  catalog: Deal[],
  addedSlug: string,
  limit = 12,
): CartRecommendationItem[] {
  const deals = getCartUpsellDeals(catalog, [addedSlug], limit);
  return toRecommendationItems(deals);
}

export type RecentPurchasedResult = {
  title: string;
  items: CartRecommendationItem[];
};

/** 최근 구매했던 상품 — localStorage mock, 없으면 최근 본 상품 → fallback */
export function getRecentPurchasedRecommendations(
  catalog: Deal[],
  excludeSlugs: string[] = [],
  limit = 12,
): RecentPurchasedResult {
  const purchaseSlugs = readRecentPurchaseSlugs().filter((slug) => !excludeSlugs.includes(slug));
  const viewSlugs = readRecentProductSlugs().filter(
    (slug) => !excludeSlugs.includes(slug) && !purchaseSlugs.includes(slug),
  );

  const matchedPurchases = purchaseSlugs
    .map((slug) => catalog.find((deal) => deal.slug === slug))
    .filter((deal): deal is Deal => deal != null);

  if (matchedPurchases.length > 0) {
    const items = toRecommendationItems(matchedPurchases.slice(0, limit));
    if (items.length >= limit) {
      return { title: "최근 구매했던 상품", items };
    }

    const fill = getFrequentlyAddedDeals(
      catalog.filter(
        (deal) =>
          !excludeSlugs.includes(deal.slug) &&
          !purchaseSlugs.includes(deal.slug),
      ),
      limit - items.length,
    );
    return {
      title: "최근 구매했던 상품",
      items: [...items, ...toRecommendationItems(fill)],
    };
  }

  const matchedViews = viewSlugs
    .map((slug) => catalog.find((deal) => deal.slug === slug))
    .filter((deal): deal is Deal => deal != null);

  if (matchedViews.length > 0) {
    const items = toRecommendationItems(matchedViews.slice(0, limit));
    if (items.length >= limit) {
      return { title: "최근 본 상품", items };
    }

    const fill = getFrequentlyAddedDeals(
      catalog.filter(
        (deal) =>
          !excludeSlugs.includes(deal.slug) && !viewSlugs.includes(deal.slug),
      ),
      limit - items.length,
    );
    return {
      title: "최근 본 상품",
      items: [...items, ...toRecommendationItems(fill)],
    };
  }

  const fallback = getFrequentlyAddedDeals(
    catalog.filter((deal) => !excludeSlugs.includes(deal.slug)),
    limit,
  );

  return {
    title: "고객님을 위한 추천",
    items: toRecommendationItems(fallback),
  };
}

export function formatCartRecommendationReviewCount(count?: number): string {
  if (!count || count <= 0) {
    return "1+";
  }
  return formatReviewCountLabel(count);
}
