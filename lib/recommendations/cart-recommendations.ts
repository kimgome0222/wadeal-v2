import type { Deal } from "@/lib/deals";
import {
  FREE_SHIPPING_THRESHOLD,
  getCartUpsellDeals,
  getFrequentlyAddedDeals,
  getFreeShippingFillDeals,
} from "@/lib/growth/cart-growth-mock";
import { getTierProgress } from "@/lib/pricing/tiers";

export type CartRecommendationInput = {
  productSlug: string;
  sellerName?: string;
  estimatedUnitPrice?: number;
};

export type CartRecommendationSection = {
  title: string;
  subtitle?: string;
  deals: Deal[];
};

export type CartRecommendationsResult = {
  sections: CartRecommendationSection[];
  /** join-cart primary rail용 */
  primaryDeals: Deal[];
};

function uniqueDeals(deals: Deal[], limit: number, exclude = new Set<string>()): Deal[] {
  const result: Deal[] = [];

  for (const deal of deals) {
    if (exclude.has(deal.slug) || result.some((item) => item.slug === deal.slug)) {
      continue;
    }
    exclude.add(deal.slug);
    result.push(deal);
    if (result.length >= limit) {
      break;
    }
  }

  return result;
}

function resolveCartDeals(catalog: Deal[], cartSlugs: string[]): Deal[] {
  return cartSlugs
    .map((slug) => catalog.find((deal) => deal.slug === slug))
    .filter((deal): deal is Deal => deal != null);
}

function getSameCategoryDeals(
  catalog: Deal[],
  cartDeals: Deal[],
  cartSlugs: string[],
  limit: number,
): Deal[] {
  const tags = new Set(cartDeals.flatMap((deal) => deal.categoryTags));
  if (tags.size === 0) {
    return [];
  }

  const matched = catalog.filter(
    (deal) =>
      !cartSlugs.includes(deal.slug) &&
      deal.categoryTags.some((tag) => tags.has(tag)),
  );

  return uniqueDeals(
    [...matched].sort((a, b) => b.participants - a.participants),
    limit,
  );
}

function resolveSellerName(deal: Deal): string {
  return deal.brandName?.trim() || "celloh 셀러";
}

function getSameSellerDeals(
  catalog: Deal[],
  cartDeals: Deal[],
  cartSlugs: string[],
  limit: number,
): Deal[] {
  const sellers = new Set(cartDeals.map((deal) => resolveSellerName(deal)));

  const matched = catalog.filter((deal) => {
    if (cartSlugs.includes(deal.slug)) {
      return false;
    }
    return sellers.has(resolveSellerName(deal));
  });

  return uniqueDeals(
    [...matched].sort((a, b) => b.participants - a.participants),
    limit,
  );
}

function getPriceBandDeals(
  catalog: Deal[],
  cartDeals: Deal[],
  cartSlugs: string[],
  limit: number,
): Deal[] {
  if (cartDeals.length === 0) {
    return [];
  }

  const avgPrice =
    cartDeals.reduce((sum, deal) => sum + getTierProgress(deal).applicablePrice, 0) /
    cartDeals.length;
  const min = avgPrice * 0.6;
  const max = avgPrice * 1.4;

  const matched = catalog.filter((deal) => {
    if (cartSlugs.includes(deal.slug)) {
      return false;
    }
    const price = getTierProgress(deal).applicablePrice;
    return price >= min && price <= max;
  });

  return uniqueDeals(
    [...matched].sort(
      (a, b) =>
        Math.abs(getTierProgress(a).applicablePrice - avgPrice) -
          Math.abs(getTierProgress(b).applicablePrice - avgPrice) ||
        b.participants - a.participants,
    ),
    limit,
  );
}

function getCouponGapDeals(
  catalog: Deal[],
  cartSlugs: string[],
  subtotal: number,
  limit: number,
): Deal[] {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  if (remaining <= 0 || remaining > 15_000) {
    return [];
  }

  const fill = getFreeShippingFillDeals(
    catalog.filter((deal) => !cartSlugs.includes(deal.slug)),
    limit * 2,
  );

  return uniqueDeals(
    fill.filter((deal) => {
      const price = getTierProgress(deal).applicablePrice;
      return price >= remaining * 0.5 && price <= remaining * 1.5;
    }),
    limit,
  );
}

/**
 * 장바구니 mock 추천 — category/seller/price/coupon heuristic.
 * 실제 AI/주문 co-purchase API 없음.
 */
export function getCartRecommendations(
  catalog: Deal[],
  cartItems: CartRecommendationInput[],
  options: { subtotal?: number; limit?: number } = {},
): CartRecommendationsResult {
  const limit = options.limit ?? 12;
  const cartSlugs = cartItems.map((item) => item.productSlug);
  const subtotal = options.subtotal ?? 0;

  if (cartSlugs.length === 0) {
    const popular = getFrequentlyAddedDeals(catalog, limit);
    return {
      sections: [
        {
          title: "추천상품",
          subtitle: "인기 상품을 둘러보세요",
          deals: popular,
        },
      ],
      primaryDeals: popular,
    };
  }

  const cartDeals = resolveCartDeals(catalog, cartSlugs);
  const exclude = new Set(cartSlugs);
  const sections: CartRecommendationSection[] = [];

  const together = getCartUpsellDeals(catalog, cartSlugs, limit);
  if (together.length > 0) {
    sections.push({
      title: "함께 구매하면 좋아요",
      subtitle: "함께 담으면 좋은 상품이에요",
      deals: together,
    });
    together.forEach((deal) => exclude.add(deal.slug));
  }

  const sameCategory = getSameCategoryDeals(catalog, cartDeals, cartSlugs, 8);
  const categoryDeals = uniqueDeals(sameCategory, 8, exclude);
  if (categoryDeals.length > 0) {
    sections.push({
      title: "같은 카테고리 추천",
      deals: categoryDeals,
    });
    categoryDeals.forEach((deal) => exclude.add(deal.slug));
  }

  const sameSeller = getSameSellerDeals(catalog, cartDeals, cartSlugs, 8);
  const sellerDeals = uniqueDeals(sameSeller, 8, exclude);
  if (sellerDeals.length > 0) {
    sections.push({
      title: "같은 판매자 상품",
      deals: sellerDeals,
    });
    sellerDeals.forEach((deal) => exclude.add(deal.slug));
  }

  const priceBand = getPriceBandDeals(catalog, cartDeals, cartSlugs, 8);
  const priceDeals = uniqueDeals(priceBand, 8, exclude);
  if (priceDeals.length > 0) {
    sections.push({
      title: "비슷한 가격대 추천",
      deals: priceDeals,
    });
    priceDeals.forEach((deal) => exclude.add(deal.slug));
  }

  const couponGap = getCouponGapDeals(catalog, cartSlugs, subtotal, 8);
  const couponDeals = uniqueDeals(couponGap, 8, exclude);
  if (couponDeals.length > 0) {
    sections.push({
      title: "쿠폰·무료배송 채우기",
      subtitle: "조금 더 담으면 혜택을 받을 수 있어요",
      deals: couponDeals,
    });
  }

  const primaryDeals =
    sections[0]?.deals.length ?
      sections[0].deals
    : getFrequentlyAddedDeals(
        catalog.filter((deal) => !cartSlugs.includes(deal.slug)),
        limit,
      );

  return { sections, primaryDeals };
}
