"use client";

import { ReviewCard } from "@/components/review-card";
import type { ProductReviewItem } from "@/lib/data/reviews";
import { ds } from "@/lib/design-system";

type ReviewBestSectionProps = {
  reviews: ProductReviewItem[];
  productId: string;
  bestReviewIds: Set<string>;
  currentUserId?: string | null;
  reportedReviewIds: Set<string>;
  likeCounts: Record<string, number>;
  likedReviewIds: Set<string>;
  onToggleLike: (reviewId: string) => void;
};

export function ReviewBestSection({
  reviews,
  productId,
  bestReviewIds,
  currentUserId = null,
  reportedReviewIds,
  likeCounts,
  likedReviewIds,
  onToggleLike,
}: ReviewBestSectionProps) {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <section aria-label="베스트 리뷰" className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className={`${ds.type.h3} font-semibold`}>베스트 리뷰</h3>
        <span className={`${ds.badge.base} ${ds.badge.accent}`}>PICK</span>
      </div>
      <div className="space-y-2.5">
        {reviews.map((review) => (
          <ReviewCard
            currentUserId={currentUserId}
            hasReported={reportedReviewIds.has(review.id)}
            isBestReview={bestReviewIds.has(review.id)}
            isLiked={likedReviewIds.has(review.id)}
            key={`best-${review.id}`}
            likeCount={likeCounts[review.id] ?? 0}
            onToggleLike={() => onToggleLike(review.id)}
            productId={productId}
            review={review}
          />
        ))}
      </div>
    </section>
  );
}
