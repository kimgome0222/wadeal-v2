import type { CategorySlug } from "@/lib/categories";
import type { ProductReviewItem } from "@/lib/data/reviews";
import type { Deal } from "@/lib/deals";
import { getProductImages } from "@/lib/product-images";

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
  const isFree =
    deal.groupPrice >= 30000 || deal.productType === "normal";

  return [
    { label: "배송", value: isFree ? "무료배송" : "3,000원 (30,000원 이상 무료)" },
    { label: "도착", value: "내일 도착" },
    { label: "안내", value: "판매자 확인 후 순차 출고" },
  ];
}

const CATEGORY_HINTS: Partial<Record<CategorySlug, Record<string, string>>> = {
  food: {
    원산지: "국내산·수입산 (상품별 상이)",
    "중량/용량": "상품 상세 참고",
    보관방법: "직사광선을 피하고 서늘한 곳에 보관",
    배송방법: "택배 배송",
    "교환/환불": "수령 후 7일 이내, 미개봉 상품",
  },
  living: {
    원산지: "상품 상세 참고",
    "중량/용량": "상품별 상이",
    보관방법: "건조하고 통풍이 잘 되는 곳",
    배송방법: "택배 배송",
    "교환/환불": "수령 후 7일 이내",
  },
};

export function buildDetailInfoRows(deal: Deal): DetailInfoRow[] {
  const tag =
    deal.categoryTags.find((slug) => CATEGORY_HINTS[slug] != null) ??
    deal.categoryTags[0] ??
    "living";
  const hints = CATEGORY_HINTS[tag] ?? CATEGORY_HINTS.living ?? {};

  return [
    { label: "상품명", value: deal.title },
    { label: "원산지", value: hints.원산지 ?? "상품 상세 참고" },
    { label: "중량/용량", value: hints["중량/용량"] ?? "상품별 상이" },
    { label: "보관방법", value: hints.보관방법 ?? "상품 설명 참고" },
    { label: "배송방법", value: hints.배송방법 ?? "택배 배송" },
    { label: "교환/환불", value: hints["교환/환불"] ?? "수령 후 7일 이내 신청" },
  ];
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
    deal.imageUrl,
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
