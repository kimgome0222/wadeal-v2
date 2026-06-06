/**
 * 판매자 리뷰 (상품 리뷰와 별도).
 * TODO(DB): seller_reviews 테이블 + API 연동.
 */
import type { SellerTrustProfile } from "./seller-trust-profile";

export type SellerReview = {
  id: string;
  /** TODO(DB): seller_reviews.seller_id → sellers.id */
  sellerId: string;
  rating: number;
  responseSatisfaction: number;
  shippingSatisfaction: number;
  descriptionMatch: number;
  comment: string;
  /** ISO 8601 */
  createdAt: string;
  /** UI 표시용 */
  authorLabel?: string;
};

const MOCK_COMMENTS = [
  "문의 응답이 빠르고 배송 안내가 친절했어요.",
  "상품 설명과 실제 상품이 거의 같았어요.",
  "포장이 꼼꼼하고 배송도 빨랐습니다.",
  "판매자님이 친절하게 문의에 답변해 주셨어요.",
  "재구매 의사가 있을 만큼 만족스러웠습니다.",
];

function hashSeed(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** mock sellerReviews — DB 연동 전 placeholder. */
export function getMockSellerReviews(
  profile: Pick<SellerTrustProfile, "sellerId" | "sellerName" | "rating">,
  limit = 3,
): SellerReview[] {
  const seed = hashSeed(profile.sellerName);
  const base = profile.rating;

  return Array.from({ length: limit }, (_, index) => ({
    id: `${profile.sellerId}-review-${index}`,
    sellerId: profile.sellerId,
    rating: Math.min(5, base - 0.2 + (index % 2) * 0.3),
    responseSatisfaction: Math.min(99, 82 + ((seed + index) % 17)),
    shippingSatisfaction: Math.min(99, 80 + ((seed + index * 3) % 18)),
    descriptionMatch: Math.min(99, 78 + ((seed + index * 5) % 20)),
    comment: MOCK_COMMENTS[(seed + index) % MOCK_COMMENTS.length]!,
    createdAt: new Date(Date.now() - (index + 1) * 86400000 * 3).toISOString(),
    authorLabel: `구매자${((seed + index * 7) % 900) + 100}`,
  }));
}

export function formatSellerReviewDate(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / 86400000);

  if (days <= 0) {
    return "오늘";
  }
  if (days === 1) {
    return "1일 전";
  }
  if (days < 7) {
    return `${days}일 전`;
  }
  if (days < 14) {
    return "1주 전";
  }
  return "2주 전";
}
