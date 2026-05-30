import {
  buildReviewSummary,
  type ProductReviewItem,
  type ReviewSummary,
} from "@/lib/data/reviews";
import type { Deal } from "@/lib/deals";
import type { HomeSellerStory } from "@/lib/home/seller-stories";
import { getDealReviewScoreLabel } from "@/lib/deals/card-display";

import {
  buildSellerPhotoReviewThumbnails,
  buildSellerProfileStories,
  buildSellerServiceReviews,
  pickFeaturedDeals,
  pickPopularDeals,
  resolveSellerCoverImage,
  resolveSellerRegionLabel,
  type SellerServiceReview,
} from "./seller-profile-data";
import type { SellerProfile } from "./types";

export type SellerProfileViewModel = {
  profile: SellerProfile;
  rating: string;
  reviewCount: number;
  totalSales: number;
  coverImageUrl: string | null;
  regionLabel: string | null;
  featuredDeals: Deal[];
  popularDeals: Deal[];
  allDeals: Deal[];
  stories: HomeSellerStory[];
  productReviews: ProductReviewItem[];
  reviewSummary: ReviewSummary;
  photoThumbnails: string[];
  sellerServiceReviews: SellerServiceReview[];
};

export function buildSellerProfileView(
  profile: SellerProfile,
  sellerDeals: Deal[],
  productReviews: ProductReviewItem[],
): SellerProfileViewModel {
  const anchor = sellerDeals[0];
  const reviewLabel = anchor ? getDealReviewScoreLabel(anchor) : null;
  const reviewSummary = buildReviewSummary(productReviews);
  const rating =
    reviewSummary.totalCount > 0 ?
      reviewSummary.averageRating.toFixed(1)
    : reviewLabel?.score ?? profile.rating.toFixed(1);
  const reviewCount = Math.max(
    reviewSummary.totalCount,
    profile.reviewCount,
    reviewLabel?.count ?? 0,
  );

  return {
    profile,
    rating,
    reviewCount,
    totalSales: profile.totalSales,
    coverImageUrl: resolveSellerCoverImage(sellerDeals),
    regionLabel: resolveSellerRegionLabel(profile),
    featuredDeals: pickFeaturedDeals(sellerDeals, 8),
    popularDeals: pickPopularDeals(sellerDeals, 8),
    allDeals: sellerDeals,
    stories: buildSellerProfileStories(profile, sellerDeals, 6),
    productReviews,
    reviewSummary,
    photoThumbnails: buildSellerPhotoReviewThumbnails(productReviews, sellerDeals, 16),
    sellerServiceReviews: buildSellerServiceReviews(profile, 15),
  };
}
