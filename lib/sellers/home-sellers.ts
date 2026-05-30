import { getDealReviewScoreLabel } from "@/lib/deals/card-display";
import type { Deal } from "@/lib/deals";
import { getTierProgress } from "@/lib/pricing/tiers";

import {
  buildSellerId,
  legacySellerRouteId,
  normalizeSellerRouteId,
  resolveSellerNameFromRouteId,
} from "./seller-id";
import { sortDealsByRecommendation } from "./recommendation";
import type { SellerBadgeId, SellerProfile } from "./types";

const SELLER_TAGLINES: Record<string, string> = {
  올리브하우스: "제주에서 정성껏 만든 식품을 전합니다",
  TechPouch: "실용적인 생활 가전을 직접 설계합니다",
  제주Farm: "제주 농가와 함께 키운 신선한 식재료",
  GlowLab: "피부에 닿는 성분부터 고르는 뷰티 브랜드",
  PetNature: "반려동물 건강을 연구하는 사료 전문 셀러",
  BabyFresh: "아이 식탁을 위한 안심 재료를 고릅니다",
  완도바다: "완도 앞바다에서 건져 올린 싱싱한 식재료",
  HomeLinens: "집안 분위기를 바꾸는 리빙 소품",
};

function hashSeed(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function resolveSellerName(deal: Deal): string {
  return deal.brandName?.trim() || "celloh 셀러";
}

function buildBadges(input: {
  name: string;
  totalSales: number;
  repurchaseRate: number;
  inquiryResponseRate: number;
  rating: number;
  index: number;
}): SellerBadgeId[] {
  const badges: SellerBadgeId[] = [];
  const seed = hashSeed(input.name);

  if (input.index < 4 || seed % 3 === 0) {
    badges.push("verified");
  }
  if (input.totalSales >= 300 || input.rating >= 4.7) {
    badges.push("popular");
  }
  if (input.repurchaseRate >= 38) {
    badges.push("high_repurchase");
  }
  if (input.inquiryResponseRate >= 88) {
    badges.push("fast_response");
  }
  if (input.totalSales >= 500 || input.rating >= 4.8) {
    badges.push("best_seller");
  }
  if (input.index >= 4 || input.totalSales < 200) {
    badges.push("new_seller");
  }

  return [...new Set(badges)].slice(0, 4);
}

function buildSellerProfile(name: string, deals: Deal[], index: number): SellerProfile {
  const seed = hashSeed(name);
  const featured = [...deals].sort((a, b) => b.participants - a.participants)[0]!;
  const totalParticipants = deals.reduce((sum, deal) => sum + deal.participants, 0);
  const totalSold = deals.reduce((sum, deal) => sum + (deal.soldQuantity ?? 0), 0);
  const review = getDealReviewScoreLabel(featured);
  const rating = Math.min(5, Number(review.score));
  const reviewCount = Math.max(
    review.count,
    deals.reduce((sum, deal) => sum + Math.round(deal.participants / 3), 0),
  );
  const totalSales = Math.max(totalParticipants * 8 + totalSold * 3, 120 + (seed % 400));
  const repurchaseRate = 32 + (seed % 28);
  const inquiryResponseRate = 82 + (seed % 17);

  return {
    id: buildSellerId(name),
    name,
    tagline: SELLER_TAGLINES[name] ?? "좋은 판매자의 상품을 celloh에서 만나보세요",
    rating,
    reviewCount,
    totalSales,
    repurchaseRate,
    inquiryResponseRate,
    isVerified: index < 4 || seed % 3 === 0,
    badges: buildBadges({
      name,
      totalSales,
      repurchaseRate,
      inquiryResponseRate,
      rating,
      index,
    }),
    featuredProductSlug: featured.slug,
    featuredProductTitle: featured.title,
    productCount: deals.length,
  };
}

export function buildSellerProfilesFromDeals(deals: Deal[]): SellerProfile[] {
  const grouped = new Map<string, Deal[]>();

  for (const deal of deals) {
    const name = resolveSellerName(deal);
    const bucket = grouped.get(name) ?? [];
    bucket.push(deal);
    grouped.set(name, bucket);
  }

  return [...grouped.entries()]
    .map(([name, sellerDeals], index) => buildSellerProfile(name, sellerDeals, index))
    .sort((a, b) => b.totalSales - a.totalSales);
}

export function getRecommendedSellers(deals: Deal[], limit = 6): SellerProfile[] {
  return buildSellerProfilesFromDeals(deals).slice(0, limit);
}

export function getPopularSellers(deals: Deal[], limit = 4): SellerProfile[] {
  return buildSellerProfilesFromDeals(deals)
    .sort((a, b) => b.totalSales - a.totalSales || b.rating - a.rating)
    .slice(0, limit);
}

export function getTrustedSellers(deals: Deal[], limit = 4): SellerProfile[] {
  return buildSellerProfilesFromDeals(deals)
    .filter(
      (seller) =>
        seller.isVerified &&
        seller.repurchaseRate >= 35 &&
        seller.inquiryResponseRate >= 85,
    )
    .sort(
      (a, b) =>
        b.repurchaseRate +
        b.inquiryResponseRate +
        b.rating -
        (a.repurchaseRate + a.inquiryResponseRate + a.rating),
    )
    .slice(0, limit);
}

export function getNewSellers(deals: Deal[], limit = 4): SellerProfile[] {
  const grouped = new Map<string, Deal[]>();

  for (const deal of deals) {
    const name = resolveSellerName(deal);
    const bucket = grouped.get(name) ?? [];
    bucket.push(deal);
    grouped.set(name, bucket);
  }

  return [...grouped.entries()]
    .sort((a, b) => {
      const aNewest = Math.max(...a[1].map((deal) => deal.id));
      const bNewest = Math.max(...b[1].map((deal) => deal.id));
      return bNewest - aNewest;
    })
    .slice(0, limit)
    .map(([name, sellerDeals], index) => buildSellerProfile(name, sellerDeals, index + 4));
}

export function resolveSellerProfileForDeal(
  deal: Deal,
  catalog: Deal[] = [],
): SellerProfile {
  const name = resolveSellerName(deal);
  const related = catalog.filter((item) => resolveSellerName(item) === name);
  const pool = related.length > 0 ? related : [deal];
  const profiles = buildSellerProfilesFromDeals(pool);
  return profiles.find((profile) => profile.name === name) ?? buildSellerProfile(name, pool, 0);
}

/** @deprecated Use `getSellerSearchHref` from `@/lib/sellers/routes` */
export { getSellerSearchHref } from "@/lib/sellers/routes";

function getDealsForSellerProfiles(
  deals: Deal[],
  sellers: SellerProfile[],
  perSeller: number,
  limit: number,
): Deal[] {
  const seen = new Set<string>();
  const result: Deal[] = [];

  for (const seller of sellers) {
    const sellerDeals = deals
      .filter((deal) => resolveSellerName(deal) === seller.name)
      .sort((a, b) => b.participants - a.participants);

    for (const deal of sellerDeals.slice(0, perSeller)) {
      if (seen.has(deal.slug)) {
        continue;
      }
      seen.add(deal.slug);
      result.push(deal);
      if (result.length >= limit) {
        return result;
      }
    }
  }

  return result;
}

export function getSellerProfileById(id: string, deals: Deal[]): SellerProfile | null {
  return resolveSellerProfileByRouteId(id, deals);
}

/** URL 경로 id → 판매자 프로필 (신·구 slug 모두 조회) */
export function resolveSellerProfileByRouteId(
  routeId: string,
  deals: Deal[],
): SellerProfile | null {
  const decoded = normalizeSellerRouteId(routeId);
  const profiles = buildSellerProfilesFromDeals(deals);

  const normalizedRouteId = decoded.toLowerCase();
  const byId = profiles.find(
    (profile) => profile.id.toLowerCase() === normalizedRouteId,
  );
  if (byId) {
    return byId;
  }

  const aliasName = resolveSellerNameFromRouteId(decoded);
  if (aliasName) {
    const byAlias = profiles.find((profile) => profile.name === aliasName);
    if (byAlias) {
      return byAlias;
    }
  }

  const byName = profiles.find((profile) => profile.name === decoded);
  if (byName) {
    return byName;
  }

  const byLegacyId = profiles.find(
    (profile) => legacySellerRouteId(profile.name) === decoded,
  );
  if (byLegacyId) {
    return byLegacyId;
  }

  const cellohRouteIds = new Set(["celloh", "celloh-셀러", "celloh-seller"]);
  if (cellohRouteIds.has(normalizedRouteId) || cellohRouteIds.has(decoded) || aliasName === "celloh 셀러") {
    if (deals.length > 0) {
      return buildSellerProfile("celloh 셀러", deals, 0);
    }
  }

  return null;
}

export function getDealsForSellerProfile(profile: SellerProfile, deals: Deal[]): Deal[] {
  const matched = deals
    .filter((deal) => resolveSellerName(deal) === profile.name)
    .sort((a, b) => b.participants - a.participants);

  if (matched.length > 0) {
    return matched;
  }

  // celloh 플랫폼 판매자(레거시 slug celloh-셀러 등) — 그룹 상품 없을 때 catalog 노출
  if (profile.name === "celloh 셀러" && deals.length > 0) {
    return [...deals].sort((a, b) => b.participants - a.participants);
  }

  return matched;
}

/** Home 「추천 판매자의 상품」 — one or two picks per top seller. */
export function getRecommendedSellerDeals(deals: Deal[], limit = 20): Deal[] {
  const rankedDeals = sortDealsByRecommendation(deals);
  const sellers = getRecommendedSellers(rankedDeals, Math.min(12, Math.ceil(limit / 1.5)));
  const picked = getDealsForSellerProfiles(rankedDeals, sellers, 2, limit);
  return picked.length > 0 ? picked : rankedDeals.slice(0, limit);
}

/** Home 「인기 판매자 상품」 — picks from top sellers by sales and rating. */
export function getPopularSellerDeals(deals: Deal[], limit = 20): Deal[] {
  const sellers = getPopularSellers(deals, Math.min(12, Math.ceil(limit / 1.5)));
  const picked = getDealsForSellerProfiles(deals, sellers, 2, limit);
  return picked.length > 0 ? picked : sortDealsByRecommendation(deals).slice(0, limit);
}

/** Home 「신규 판매자 상품」 — picks from recently joined sellers. */
export function getNewSellerDeals(deals: Deal[], limit = 10): Deal[] {
  const sellers = getNewSellers(deals, Math.min(8, Math.ceil(limit / 1.5)));
  const picked = getDealsForSellerProfiles(deals, sellers, 2, limit);
  return picked.length > 0 ? picked : [...deals].sort((a, b) => b.id - a.id).slice(0, limit);
}

function getDealDiscountRate(deal: Deal): number {
  const { applicablePrice } = getTierProgress(deal);
  if (deal.originalPrice <= applicablePrice) {
    return 0;
  }
  return Math.round(((deal.originalPrice - applicablePrice) / deal.originalPrice) * 100);
}

/** Home 「특가 상품」 — 할인율·인기 순 (공동구매/마감세일 톤 없음) */
export function getSpecialPriceDeals(deals: Deal[], limit = 20): Deal[] {
  return [...deals]
    .map((deal) => ({ deal, rate: getDealDiscountRate(deal) }))
    .filter(({ rate }) => rate > 0)
    .sort(
      (a, b) =>
        b.rate - a.rate ||
        b.deal.participants - a.deal.participants ||
        getDealReviewScoreLabel(b.deal).count - getDealReviewScoreLabel(a.deal).count,
    )
    .slice(0, limit)
    .map(({ deal }) => deal);
}

/** 특가 섹션 최소 노출 — 할인 상품만 보충 */
export function ensureMinimumSpecialPriceDeals(
  deals: Deal[],
  catalog: Deal[],
  minimum = 6,
): Deal[] {
  if (deals.length >= minimum) {
    return deals;
  }

  const seen = new Set(deals.map((deal) => deal.slug));
  const result = [...deals];

  for (const deal of getSpecialPriceDeals(catalog, catalog.length)) {
    if (result.length >= minimum) {
      break;
    }
    if (seen.has(deal.slug)) {
      continue;
    }
    seen.add(deal.slug);
    result.push(deal);
  }

  return result;
}

/** 홈 carousel 섹션 최소 노출 개수(실데이터 부족 시 catalog에서 보충). */
export function ensureMinimumHomeRailDeals(
  deals: Deal[],
  catalog: Deal[],
  minimum = 6,
): Deal[] {
  if (deals.length >= minimum) {
    return deals;
  }

  const seen = new Set(deals.map((deal) => deal.slug));
  const result = [...deals];

  for (const deal of catalog) {
    if (result.length >= minimum) {
      break;
    }
    if (seen.has(deal.slug)) {
      continue;
    }
    seen.add(deal.slug);
    result.push(deal);
  }

  return result;
}
