import { SellerReviewsListSection } from "@/components/seller-reviews-list-section";
import { SellerSatisfactionSection } from "@/components/seller-satisfaction-section";
import type { ReviewSummary } from "@/lib/data/reviews";
import type { Deal } from "@/lib/deals";
import { buildSellerSatisfaction } from "@/lib/sellers/satisfaction";
import { getMockSellerReviews } from "@/lib/sellers/seller-reviews";
import { buildSellerTrustProfile } from "@/lib/sellers/seller-trust-profile";

type ProductSellerReviewsSectionProps = {
  deal: Deal;
  reviewSummary: ReviewSummary;
};

export function ProductSellerReviewsSection({
  deal,
  reviewSummary,
}: ProductSellerReviewsSectionProps) {
  const profile = buildSellerTrustProfile(deal, reviewSummary);
  const satisfaction = buildSellerSatisfaction({
    name: profile.sellerName,
    rating: profile.rating,
    reviewCount: profile.reviewCount,
  });
  const sellerReviews = getMockSellerReviews(profile, 3);

  return (
    <div className="mt-6 space-y-4">
      <SellerSatisfactionSection
        satisfaction={satisfaction}
        sellerName={profile.sellerName}
        sellerRating={profile.rating.toFixed(1)}
      />
      <SellerReviewsListSection
        reviews={sellerReviews}
        sellerName={profile.sellerName}
      />
    </div>
  );
}
