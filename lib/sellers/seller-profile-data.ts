import type { ProductReviewItem } from "@/lib/data/reviews";
import type { Deal } from "@/lib/deals";
import type { HomeSellerStory } from "@/lib/home/seller-stories";
import { buildPhotoReviewThumbnails, SELLER_REVIEW_TAGS } from "@/lib/product/detail-data";

import { getMockSellerReviews } from "./seller-reviews";
import type { SellerProfile } from "./types";

export type SellerServiceReview = {
  id: string;
  authorLabel: string;
  rating: number;
  comment: string;
  tags: string[];
  createdAt: string;
};

const SELLER_REGIONS: Record<string, string> = {
  올리브하우스: "제주 · 식품",
  제주Farm: "제주 · 농산물",
  GlowLab: "뷰티 · 스킨케어",
  TechPouch: "생활 · 가전",
  PetNature: "반려 · 사료",
  BabyFresh: "유아 · 식품",
  완도바다: "완도 · 수산",
  HomeLinens: "리빙 · 홈데코",
  "celloh 셀러": "전국 · 다양한 카테고리",
};

const STORY_COPY = [
  {
    title: "한라농장이 좋은 감귤을 고르는 법",
    summary: "제주 햇살 아래 익은 감귤만 선별해 보내는 이유와 과수원 이야기.",
  },
  {
    title: "매일 아침 직접 선별하는 이유",
    summary: "소량 생산·신선 배송을 고집하는 판매자의 하루.",
  },
  {
    title: "오래 팔 수 있는 상품만 고집하는 이유",
    summary: "단기 매출보다 재구매와 신뢰를 우선하는 기준.",
  },
  {
    title: "포장을 꼼꼼히 하는 이유",
    summary: "배송 중에도 신선함과 모양을 지키기 위한 포장 과정.",
  },
  {
    title: "고객 문의에 빠르게 답하는 이유",
    summary: "구매 전후 궁금증을 남기지 않기 위한 응대 방식.",
  },
  {
    title: "좋은 재료를 고르는 기준",
    summary: "원산지와 생산 과정을 직접 확인하는 판매자의 철학.",
  },
] as const;

function hashSeed(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function resolveSellerRegionLabel(profile: SellerProfile): string | null {
  return SELLER_REGIONS[profile.name] ?? null;
}

export function resolveSellerCoverImage(deals: Deal[]): string | null {
  if (deals.length === 0) {
    return null;
  }

  const sorted = [...deals].sort((a, b) => b.participants - a.participants);
  return sorted[0]?.imageUrl ?? null;
}

export function pickFeaturedDeals(deals: Deal[], limit = 8): Deal[] {
  return [...deals]
    .sort((a, b) => b.participants - a.participants)
    .slice(0, limit);
}

export function pickPopularDeals(deals: Deal[], limit = 8): Deal[] {
  return [...deals]
    .sort(
      (a, b) =>
        (b.soldQuantity ?? 0) - (a.soldQuantity ?? 0) ||
        b.participants - a.participants,
    )
    .slice(0, limit);
}

export function buildSellerProfileStories(
  profile: SellerProfile,
  deals: Deal[],
  limit = 6,
): HomeSellerStory[] {
  const pool = deals.length > 0 ? deals : [];
  const seed = hashSeed(profile.id);

  return Array.from({ length: Math.min(limit, STORY_COPY.length) }, (_, index) => {
    const copy = STORY_COPY[(seed + index) % STORY_COPY.length]!;
    const deal = pool[(seed + index) % Math.max(pool.length, 1)];

    return {
      id: `${profile.id}-story-${index}`,
      sellerId: profile.id,
      sellerName: profile.name,
      title: copy.title,
      summary: copy.summary,
      imageUrl: deal?.imageUrl ?? "",
      href: `/sellers/${encodeURIComponent(profile.id)}`,
    };
  });
}

export function buildSellerServiceReviews(
  profile: SellerProfile,
  limit = 15,
): SellerServiceReview[] {
  const mock = getMockSellerReviews(
    { sellerId: profile.id, sellerName: profile.name, rating: profile.rating },
    limit,
  );

  return mock.map((review, index) => ({
    id: review.id,
    authorLabel: review.authorLabel ?? `구매자${index + 1}`,
    rating: review.rating,
    comment: review.comment,
    tags: [
      SELLER_REVIEW_TAGS[index % SELLER_REVIEW_TAGS.length]!,
      SELLER_REVIEW_TAGS[(index + 1) % SELLER_REVIEW_TAGS.length]!,
    ],
    createdAt: review.createdAt,
  }));
}

export function mergeSellerProductReviews(
  reviewBatches: ProductReviewItem[][],
  limit = 40,
): ProductReviewItem[] {
  const seen = new Set<string>();
  const merged: ProductReviewItem[] = [];

  for (const batch of reviewBatches) {
    for (const review of batch) {
      if (seen.has(review.id)) {
        continue;
      }
      seen.add(review.id);
      merged.push(review);
      if (merged.length >= limit) {
        return merged.sort(
          (a, b) =>
            new Date(b.createdAtIso).getTime() - new Date(a.createdAtIso).getTime(),
        );
      }
    }
  }

  return merged.sort(
    (a, b) => new Date(b.createdAtIso).getTime() - new Date(a.createdAtIso).getTime(),
  );
}

export function buildSellerPhotoReviewThumbnails(
  reviews: ProductReviewItem[],
  deals: Deal[],
  limit = 16,
): string[] {
  const anchor = deals[0];
  if (!anchor) {
    return reviews.flatMap((review) => review.images).slice(0, limit);
  }

  const primary = buildPhotoReviewThumbnails(reviews, anchor, limit);
  if (primary.length >= limit) {
    return primary;
  }

  const pool = deals.map((deal) => deal.imageUrl).filter(Boolean);
  const seen = new Set(primary);
  const result = [...primary];

  for (const url of pool) {
    if (result.length >= limit) {
      break;
    }
    if (seen.has(url)) {
      continue;
    }
    seen.add(url);
    result.push(url);
  }

  return result;
}
