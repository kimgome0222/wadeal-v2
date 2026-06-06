export type ReviewRatingInput = {
  rating: number;
};

export type ReviewRatingBar = {
  star: number;
  count: number;
  percent: number;
};

export function getAverageRating(reviews: ReviewRatingInput[]): number {
  if (reviews.length === 0) {
    return 0;
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

export function getRatingDistribution(reviews: ReviewRatingInput[]): ReviewRatingBar[] {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  for (const review of reviews) {
    const star = Math.max(1, Math.min(5, Math.round(review.rating)));
    counts[star] += 1;
  }

  const total = reviews.length;

  return [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: counts[star],
    percent: total > 0 ? Math.round((counts[star] / total) * 100) : 0,
  }));
}

export const REVIEW_MODERATION_STATUSES = [
  "visible",
  "hidden",
  "reported",
  "deleted",
] as const;

export type ReviewModerationStatus = (typeof REVIEW_MODERATION_STATUSES)[number];

export function getReviewModerationStatusLabel(status: ReviewModerationStatus): string {
  if (status === "visible") {
    return "노출";
  }
  if (status === "hidden") {
    return "숨김";
  }
  if (status === "reported") {
    return "신고됨";
  }
  return "삭제됨";
}
