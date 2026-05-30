import type { Deal } from "@/lib/deals";
import { getProductCardReviewMeta } from "@/lib/product/card-badge-meta";

function parseReviewCount(deal: Deal): number {
  const { countLabel } = getProductCardReviewMeta(deal);
  const normalized = countLabel.replace(/,/g, "").replace("+", "");
  return Number.parseInt(normalized, 10) || 1;
}

function resolveSoldCount(deal: Deal): number {
  if (deal.soldQuantity != null && deal.soldQuantity > 0) {
    return deal.soldQuantity;
  }
  if (deal.participants > 0) {
    return deal.participants;
  }
  const seed = deal.id + deal.slug.length * 7;
  return (seed % 9000) + 1;
}

/** mock 재구매율 — deterministic, DB/AI 없음 */
export function getMockRepurchaseRate(deal: Deal): number {
  const seed = deal.id + deal.slug.length;
  return 28 + (seed % 42) + Math.min(20, Math.floor(deal.participants / 50));
}

function repurchaseScore(deal: Deal): number {
  const repurchaseRate = getMockRepurchaseRate(deal);
  const reviewCount = parseReviewCount(deal);
  const soldCount = resolveSoldCount(deal);
  return repurchaseRate * 100 + reviewCount * 2 + soldCount;
}

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

/** 재구매율·리뷰·판매 mock 점수 기준 정렬 */
export function getRepurchaseRateDeals(catalog: Deal[], limit = 12): Deal[] {
  const sorted = [...catalog].sort(
    (a, b) => repurchaseScore(b) - repurchaseScore(a) || b.participants - a.participants,
  );
  return uniqueDeals(sorted, limit);
}
