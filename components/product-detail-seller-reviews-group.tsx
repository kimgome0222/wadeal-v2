import { SellerReviewsListSection } from "@/components/seller-reviews-list-section";
import { SellerSatisfactionSection } from "@/components/seller-satisfaction-section";
import type { ReviewSummary } from "@/lib/data/reviews";
import type { Deal } from "@/lib/deals";
import { buildSellerSatisfaction } from "@/lib/sellers/satisfaction";
import { getMockSellerReviews } from "@/lib/sellers/seller-reviews";
import { buildSellerTrustProfile } from "@/lib/sellers/seller-trust-profile";
import { ds } from "@/lib/design-system";

type ProductDetailSellerReviewsGroupProps = {
  deal: Deal;
  reviewSummary: ReviewSummary;
};

export function ProductDetailSellerReviewsGroup({
  deal,
  reviewSummary,
}: ProductDetailSellerReviewsGroupProps) {
  const profile = buildSellerTrustProfile(deal, reviewSummary);
  const satisfaction = buildSellerSatisfaction({
    name: profile.sellerName,
    rating: profile.rating,
    reviewCount: profile.reviewCount,
  });
  const sellerReviews = getMockSellerReviews(profile, 6);

  return (
    <div className="mt-6 space-y-6 pb-2">
      <SellerSatisfactionSection
        satisfaction={satisfaction}
        sellerName={profile.sellerName}
        sellerRating={profile.rating.toFixed(1)}
      />
      <SellerReviewsListSection
        initialVisible={3}
        reviews={sellerReviews}
        sellerName={profile.sellerName}
      />
    </div>
  );
}
