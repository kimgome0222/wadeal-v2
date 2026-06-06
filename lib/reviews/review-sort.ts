import type { ProductReviewItem } from "@/lib/data/reviews";

export type ReviewSortMode = "latest" | "rating" | "helpful";

export const REVIEW_SORT_OPTIONS: { value: ReviewSortMode; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "rating", label: "별점 높은순" },
  { value: "helpful", label: "도움순" },
];

export function sortReviews(
  reviews: ProductReviewItem[],
  mode: ReviewSortMode,
  likeCounts: Record<string, number>,
): ProductReviewItem[] {
  const sorted = [...reviews];

  if (mode === "latest") {
    return sorted.sort(
      (a, b) =>
        new Date(b.createdAtIso).getTime() - new Date(a.createdAtIso).getTime(),
    );
  }

  if (mode === "rating") {
    return sorted.sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }

      return new Date(b.createdAtIso).getTime() - new Date(a.createdAtIso).getTime();
    });
  }

  return sorted.sort((a, b) => {
    const likeDiff = (likeCounts[b.id] ?? 0) - (likeCounts[a.id] ?? 0);
    if (likeDiff !== 0) {
      return likeDiff;
    }

    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }

    return new Date(b.createdAtIso).getTime() - new Date(a.createdAtIso).getTime();
  });
}

export function getBestReviewIds(
  reviews: ProductReviewItem[],
  likeCounts: Record<string, number>,
): Set<string> {
  if (reviews.length === 0) {
    return new Set();
  }

  const maxLikes = Math.max(...reviews.map((review) => likeCounts[review.id] ?? 0));
  if (maxLikes <= 0) {
    return new Set();
  }

  return new Set(
    reviews
      .filter((review) => (likeCounts[review.id] ?? 0) === maxLikes)
      .map((review) => review.id),
  );
}

/** 베스트 리뷰 — 도움순·별점·포토 우선, 최대 limit건 */
export function getFeaturedBestReviews(
  reviews: ProductReviewItem[],
  likeCounts: Record<string, number>,
  limit = 3,
): ProductReviewItem[] {
  if (reviews.length === 0) {
    return [];
  }

  const bestIds = getBestReviewIds(reviews, likeCounts);
  const scored = [...reviews].map((review) => {
    const likes = likeCounts[review.id] ?? 0;
    const photoBonus = review.images.length > 0 ? 2 : 0;
    const verifiedBonus = review.isVerifiedPurchase ? 1 : 0;
    const bestBonus = bestIds.has(review.id) ? 3 : 0;
    return {
      review,
      score: likes * 10 + review.rating * 2 + photoBonus + verifiedBonus + bestBonus,
    };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return (
      new Date(b.review.createdAtIso).getTime() - new Date(a.review.createdAtIso).getTime()
    );
  });

  return scored.slice(0, limit).map((item) => item.review);
}
