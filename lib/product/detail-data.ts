import type { ProductReviewItem } from "@/lib/data/reviews";
import type { Deal } from "@/lib/deals";
import { getProductImages } from "@/lib/product-images";
import { buildProductDisclosureRows } from "@/lib/product/product-disclosure";
import { resolveProductImageUrl } from "@/lib/product/display-fallbacks";

export type DetailInfoRow = {
  label: string;
  value: string;
};

export const WHY_SELLER_ITEMS = [
  { icon: "⭐", title: "평점이 높은 판매자" },
  { icon: "📦", title: "판매 이력이 많은 판매자" },
  { icon: "🎁", title: "포장이 꼼꼼한 판매자" },
  { icon: "🔁", title: "재구매가 많은 판매자" },
] as const;

export const SELLER_REVIEW_TAGS = [
  "포장이 꼼꼼해요",
  "배송이 빨라요",
  "응답이 친절해요",
  "재구매 의사 있어요",
] as const;

export function buildShippingSummaryLines(deal: Deal): { label: string; value: string }[] {
  const isFree = deal.groupPrice >= 30000 || deal.productType === "normal";

  return [
    { label: "배송", value: isFree ? "무료배송" : "3,000원 (30,000원 이상 무료)" },
    { label: "도착", value: "내일 도착" },
    { label: "무료배송", value: "30,000원 이상 주문 시 무료 (상품별 상이)" },
    { label: "교환/반품", value: "수령 후 7일 이내 · /support/refund 참고" },
  ];
}

export function buildDetailInfoRows(deal: Deal): DetailInfoRow[] {
  return buildProductDisclosureRows(deal);
}

/** 포토후기 썸네일 — 리뷰 이미지 우선, 부족하면 상품 이미지 mock */
export function buildPhotoReviewThumbnails(
  reviews: ProductReviewItem[],
  deal: Deal,
  limit = 16,
): string[] {
  const fromReviews = reviews.flatMap((review) => review.images);
  const { gallery, details } = getProductImages(deal);
  const pool = [
    ...fromReviews,
    ...gallery,
    ...details,
    resolveProductImageUrl(deal),
  ].filter(Boolean);

  const unique: string[] = [];
  const seen = new Set<string>();

  for (const url of pool) {
    if (seen.has(url) || unique.length >= limit) {
      continue;
    }
    seen.add(url);
    unique.push(url);
  }

  return unique.slice(0, limit);
}
