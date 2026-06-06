import type { ReviewSummary } from "@/lib/data/reviews";
import type { Deal } from "@/lib/deals";
import { buildSellerSatisfaction, type SellerSatisfactionMetrics } from "@/lib/sellers/satisfaction";
import {
  buildSellerDetailExtras,
  type SellerFeaturedProduct,
} from "@/lib/sellers/seller-detail-mock";
import {
  resolveSellerTrustMetrics,
  type SellerTrustMetrics,
} from "@/lib/sellers/trust-display";

export type SellerDetailViewModel = {
  metrics: SellerTrustMetrics;
  satisfaction: SellerSatisfactionMetrics;
  categories: string[];
  featuredProducts: SellerFeaturedProduct[];
};

/** 모달·향후 `/sellers/[id]` 페이지가 공유하는 판매자 상세 view model. */
export function buildSellerDetailView(
  deal: Deal,
  reviewSummary?: Pick<ReviewSummary, "totalCount" | "averageRating"> | null,
): SellerDetailViewModel {
  const metrics = resolveSellerTrustMetrics(deal, reviewSummary);
  const extras = buildSellerDetailExtras(deal);

  return {
    metrics,
    satisfaction: buildSellerSatisfaction(metrics.seller),
    categories: extras.categories,
    featuredProducts: extras.featuredProducts,
  };
}
