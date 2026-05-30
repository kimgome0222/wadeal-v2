import type { CategorySlug } from "@/lib/categories";
import type { Deal } from "@/lib/deals";
import { getTierProgress } from "@/lib/pricing/tiers";
import { resolveSellerProfileForDeal } from "@/lib/sellers/home-sellers";

export const PRODUCT_IMAGE_PLACEHOLDER = "/wadeal-wordmark.svg";

export type ResolvedProductPrice = {
  salePrice: number;
  originalPrice: number | null;
  discountRate: number | null;
  priceLabel: string;
  showOriginal: boolean;
  showDiscount: boolean;
};

export function resolveCategoryLabel(deal: Deal): string {
  const tag = deal.categoryTags.find((slug) => slug !== "all" && slug !== "recommended");
  const labels: Partial<Record<CategorySlug, string>> = {
    food: "식품",
    living: "생활용품",
    beauty: "뷰티",
    fashion: "패션",
    digital: "디지털",
    pet: "반려동물",
    baby: "유아",
    local: "로컬",
  };
  return labels[tag ?? "living"] ?? "기타";
}

export function resolveSalePrice(deal: Pick<Deal, "groupPrice" | "lowestPrice">): number {
  const tierPrice = getTierProgress(deal as Deal).applicablePrice;
  if (Number.isFinite(tierPrice) && tierPrice > 0) {
    return tierPrice;
  }
  if (Number.isFinite(deal.groupPrice) && deal.groupPrice > 0) {
    return deal.groupPrice;
  }
  if (Number.isFinite(deal.lowestPrice) && deal.lowestPrice > 0) {
    return deal.lowestPrice;
  }
  return 0;
}

export function resolveOriginalPrice(deal: Pick<Deal, "originalPrice">): number | null {
  if (!Number.isFinite(deal.originalPrice) || deal.originalPrice <= 0) {
    return null;
  }
  return deal.originalPrice;
}

export function resolveDiscountRate(originalPrice: number | null, salePrice: number): number | null {
  if (originalPrice == null || salePrice <= 0 || originalPrice <= salePrice) {
    return null;
  }
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

export function resolveProductPrice(deal: Deal): ResolvedProductPrice {
  const salePrice = resolveSalePrice(deal);
  const originalPrice = resolveOriginalPrice(deal);
  const discountRate = resolveDiscountRate(originalPrice, salePrice);

  return {
    salePrice,
    originalPrice,
    discountRate,
    priceLabel: salePrice > 0 ? `${salePrice.toLocaleString("ko-KR")}원` : "가격 문의",
    showOriginal: originalPrice != null && salePrice > 0 && originalPrice > salePrice,
    showDiscount: discountRate != null && discountRate > 0,
  };
}

export function resolveProductImageUrl(deal: Pick<Deal, "imageUrl" | "title">): string {
  const url = deal.imageUrl?.trim();
  return url ? url : PRODUCT_IMAGE_PLACEHOLDER;
}

export function resolveProductImageAlt(deal: Pick<Deal, "title">): string {
  return deal.title?.trim() || "상품 이미지";
}

export function resolveSellerName(deal: Deal): string {
  return resolveSellerProfileForDeal(deal).name || "celloh 추천 셀러";
}

export function resolveReviewCountFallback(deal: Deal, actualCount?: number): number {
  if (actualCount != null && actualCount > 0) {
    return actualCount;
  }
  if (deal.participants > 0) {
    return Math.max(1, Math.round(deal.participants / 3));
  }
  const seed = deal.id + deal.slug.length;
  return (seed % 9000) + 1;
}

export function resolveSoldCountFallback(deal: Deal): number {
  const sold = deal.soldQuantity ?? 0;
  if (sold > 0) {
    return sold;
  }
  if (deal.participants > 0) {
    return deal.participants;
  }
  const seed = deal.id + deal.slug.length * 7;
  return (seed % 9000) + 1;
}

export function formatSoldCountLabel(count: number): string {
  if (count <= 0) {
    return "판매 1+";
  }
  if (count < 10) {
    return `판매 ${count}+`;
  }
  if (count < 10_000) {
    return `판매 ${count.toLocaleString("ko-KR")}`;
  }
  return "판매 9,999+";
}
