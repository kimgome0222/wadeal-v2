import type { Deal } from "@/lib/deals";
import { getTierProgress } from "@/lib/pricing/tiers";

export const FREE_SHIPPING_THRESHOLD = 30_000;

export type ProductCardPromoBadge = {
  label: string;
  variant: "coupon" | "popular" | "neutral";
};

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

function discountPercent(deal: Deal): number {
  const { applicablePrice } = getTierProgress(deal);
  if (deal.originalPrice <= 0) {
    return 0;
  }
  return Math.round(((deal.originalPrice - applicablePrice) / deal.originalPrice) * 100);
}

/** mock 쿠폰 라벨 — slug 기반 deterministic */
export function getMockCouponBadge(deal: Deal): ProductCardPromoBadge {
  const seed = deal.id + deal.slug.length;
  if (seed % 3 === 0) {
    return { label: "10% 쿠폰", variant: "coupon" };
  }
  if (seed % 3 === 1) {
    return { label: "쿠폰 3,000원", variant: "coupon" };
  }
  return { label: "쿠폰 5,000원", variant: "coupon" };
}

export function getMockCouponAppliedPrice(deal: Deal): number {
  const { applicablePrice } = getTierProgress(deal);
  const badge = getMockCouponBadge(deal);
  if (badge.label.includes("%")) {
    return Math.max(0, Math.round(applicablePrice * 0.9));
  }
  const amount = badge.label.includes("5,000") ? 5000 : 3000;
  return Math.max(0, applicablePrice - amount);
}

export function getMockPopularBadge(deal: Deal): ProductCardPromoBadge {
  return deal.participants % 2 === 0 ?
      { label: "많이 담는 중", variant: "popular" }
    : { label: "장바구니 인기", variant: "popular" };
}

/** 쿠폰 적용 상품 — 할인율 높은 순 mock */
export function getCouponApplicableDeals(catalog: Deal[], limit = 12): Deal[] {
  const sorted = [...catalog].sort(
    (a, b) => discountPercent(b) - discountPercent(a) || b.participants - a.participants,
  );
  return fillFromCatalog(sorted, catalog, limit);
}

/** 많이 담은 상품 — participants mock */
export function getFrequentlyAddedDeals(catalog: Deal[], limit = 12): Deal[] {
  const sorted = [...catalog].sort(
    (a, b) => b.participants - a.participants || b.id - a.id,
  );
  return fillFromCatalog(sorted, catalog, limit);
}

/** 최근 본 slug 기준 유사 상품 mock */
export function getSimilarToRecentDeals(
  catalog: Deal[],
  recentSlugs: string[],
  limit = 12,
): Deal[] {
  if (recentSlugs.length === 0) {
    return getFrequentlyAddedDeals(catalog, limit);
  }

  const recent = catalog.filter((deal) => recentSlugs.includes(deal.slug));
  const categoryTags = new Set(recent.flatMap((deal) => deal.categoryTags));

  const matched = catalog.filter(
    (deal) =>
      !recentSlugs.includes(deal.slug) &&
      deal.categoryTags.some((tag) => categoryTags.has(tag)),
  );

  return fillFromCatalog(
    matched.length > 0 ? matched : catalog.filter((d) => !recentSlugs.includes(d.slug)),
    catalog,
    limit,
  );
}

/** 무료배송 채우기 — 저가 상품 mock */
export function getFreeShippingFillDeals(catalog: Deal[], limit = 10): Deal[] {
  const sorted = [...catalog].sort((a, b) => {
    const priceA = getTierProgress(a).applicablePrice;
    const priceB = getTierProgress(b).applicablePrice;
    return priceA - priceB || b.participants - a.participants;
  });
  return fillFromCatalog(sorted, catalog, limit);
}

export function getFreeShippingRemaining(subtotal: number): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
}

/** 장바구니 upsell — cart slug 제외 */
export function getCartUpsellDeals(
  catalog: Deal[],
  cartSlugs: string[],
  limit = 12,
): Deal[] {
  const pool = catalog.filter((deal) => !cartSlugs.includes(deal.slug));
  const sorted = [...pool].sort((a, b) => b.participants - a.participants);
  return fillFromCatalog(sorted, catalog, limit);
}

/** 결제 직전 추천 */
export function getCheckoutLastMinuteDeals(
  catalog: Deal[],
  currentSlug: string,
  limit = 8,
): Deal[] {
  const current = catalog.find((deal) => deal.slug === currentSlug);
  const pool = catalog.filter((deal) => deal.slug !== currentSlug);

  if (!current) {
    return fillFromCatalog(pool, catalog, limit);
  }

  const related = pool.filter((deal) =>
    deal.categoryTags.some((tag) => current.categoryTags.includes(tag)),
  );

  return fillFromCatalog(related, catalog, limit);
}

/** 다시 살 만한 — 주문/인기 mock */
export function getRepeatPurchaseDeals(catalog: Deal[], limit = 12): Deal[] {
  return getFrequentlyAddedDeals(catalog, limit);
}

/** 찜과 비슷한 — saved slug mock from popular in same category */
export function getWishlistSimilarDeals(
  catalog: Deal[],
  savedSlugs: string[],
  limit = 12,
): Deal[] {
  return getSimilarToRecentDeals(catalog, savedSlugs, limit);
}
