/** 포토후기 썸네일 → 리뷰 섹션 스크롤 (PDP) */
export function scrollToProductReview(reviewId?: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  window.location.hash = reviewId ? `#review-${reviewId}` : "#product-reviews";

  requestAnimationFrame(() => {
    const targetId = reviewId ? `review-${reviewId}` : "product-reviews";
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
