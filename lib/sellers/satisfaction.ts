import type { SellerProfile } from "./types";

export type SellerReviewSnippet = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAtLabel: string;
};

export type SellerSatisfactionMetrics = {
  sellerRating: number;
  responseSatisfaction: number;
  shippingSatisfaction: number;
  descriptionAccuracy: number;
  recentReviews: SellerReviewSnippet[];
};

const REVIEW_SAMPLES = [
  "문의 응답이 빠르고 배송 안내가 친절했어요.",
  "상품 설명과 실제 상품이 거의 같았어요.",
  "응답이 빠르고 상품 설명과 동일했어요.",
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

export function buildSellerSatisfaction(
  seller: Pick<SellerProfile, "name" | "rating" | "reviewCount">,
): SellerSatisfactionMetrics {
  const seed = hashSeed(seller.name);
  const base = seller.rating;

  return {
    sellerRating: base,
    responseSatisfaction: Math.min(99, 82 + (seed % 17)),
    shippingSatisfaction: Math.min(99, 80 + ((seed >> 3) % 18)),
    descriptionAccuracy: Math.min(99, 78 + ((seed >> 5) % 20)),
    recentReviews: [0, 1, 2].map((index) => ({
      id: `${seller.name}-${index}`,
      author: `구매자${((seed + index * 7) % 900) + 100}`,
      rating: Math.min(5, base - 0.2 + (index % 2) * 0.3),
      comment: REVIEW_SAMPLES[(seed + index) % REVIEW_SAMPLES.length]!,
      createdAtLabel: index === 0 ? "3일 전" : index === 1 ? "1주 전" : "2주 전",
    })),
  };
}
