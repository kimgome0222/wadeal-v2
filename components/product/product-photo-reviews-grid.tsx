"use client";

import Image from "next/image";

import { scrollToProductReview } from "@/lib/product/review-navigation";

export type PhotoReviewThumbnailItem = {
  url: string;
  reviewId: string | null;
};

type ProductPhotoReviewsGridProps = {
  items: PhotoReviewThumbnailItem[];
  productTitle: string;
};

export function ProductPhotoReviewsGrid({
  items,
  productTitle,
}: ProductPhotoReviewsGridProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-[16px] font-semibold text-[#111111]">포토후기</h3>
      <div className="grid grid-cols-4 gap-1.5">
        {items.map((item, index) => (
          <button
            aria-label={
              item.reviewId ?
                `${productTitle} 포토후기 ${index + 1} — 리뷰 보기`
              : `${productTitle} 포토후기 ${index + 1}`
            }
            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-[#F5F7F6] active:opacity-90"
            key={`${item.url}-${index}`}
            onClick={() => scrollToProductReview(item.reviewId)}
            type="button"
          >
            <Image
              alt={`${productTitle} 포토후기 ${index + 1}`}
              className="object-cover"
              fill
              sizes="(max-width: 430px) 22vw, 96px"
              src={item.url}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
