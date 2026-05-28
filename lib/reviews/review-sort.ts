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
