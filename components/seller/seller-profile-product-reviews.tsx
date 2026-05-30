"use client";

import { useMemo, useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { ProductPhotoReviewsGrid } from "@/components/product/product-photo-reviews-grid";
import { ReviewBestSection } from "@/components/review-best-section";
import { ReviewCard } from "@/components/review-card";
import { ReviewSummaryHeader } from "@/components/review-summary-header";
import type { ProductReviewItem, ReviewSummary } from "@/lib/data/reviews";
import {
  getBestReviewIds,
  getFeaturedBestReviews,
  sortReviews,
} from "@/lib/reviews/review-sort";
import { ui } from "@/lib/ui";

const INITIAL_VISIBLE = 20;

type SellerProfileProductReviewsProps = {
  sellerName: string;
  productReviews: ProductReviewItem[];
  reviewSummary: ReviewSummary;
  photoThumbnails: string[];
  anchorProductId: string;
};

export function SellerProfileProductReviews({
  sellerName,
  productReviews,
  reviewSummary,
  photoThumbnails,
  anchorProductId,
}: SellerProfileProductReviewsProps) {
  const [expanded, setExpanded] = useState(false);

  const sortedReviews = useMemo(
    () => sortReviews(productReviews, "rating", {}),
    [productReviews],
  );

  const bestReviewIds = useMemo(
    () => getBestReviewIds(productReviews, {}),
    [productReviews],
  );

  const featuredBestReviews = useMemo(
    () => getFeaturedBestReviews(productReviews, {}, 10),
    [productReviews],
  );

  const visibleReviews = expanded ?
    sortedReviews
  : sortedReviews.slice(0, INITIAL_VISIBLE);
  const hasMore = sortedReviews.length > INITIAL_VISIBLE;

  return (
    <section className="scroll-mt-28 space-y-8 px-6 pt-10" id="seller-product-reviews">
      <div className="space-y-1">
        <h2 className="text-[20px] font-bold text-[#111111]">상품 후기</h2>
        <p className="text-[13px] text-[#666666]">
          {sellerName} 판매자 상품에 남긴 후기 모음
        </p>
      </div>

      {productReviews.length === 0 ?
        <EmptyState
          description="판매자 상품의 첫 후기를 기다리고 있어요."
          title="등록된 상품 후기가 아직 없어요"
        />
      : <>
          <ReviewSummaryHeader summary={reviewSummary} />

          {photoThumbnails.length > 0 ?
            <ProductPhotoReviewsGrid
              images={photoThumbnails}
              productTitle={sellerName}
            />
          : null}

          {featuredBestReviews.length > 0 ?
            <div className="space-y-3">
              <h3 className="text-[16px] font-semibold text-[#111111]">베스트 후기</h3>
              <ReviewBestSection
                bestReviewIds={bestReviewIds}
                likeCounts={{}}
                likedReviewIds={new Set()}
                onToggleLike={() => {}}
                productId={anchorProductId}
                reportedReviewIds={new Set()}
                reviews={featuredBestReviews}
              />
            </div>
          : null}

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[16px] font-semibold text-[#111111]">전체 후기</p>
              <p className="text-[13px] text-[#666666]">
                총 {reviewSummary.totalCount.toLocaleString("ko-KR")}개
              </p>
            </div>

            <div className="space-y-3">
              {visibleReviews.map((review) => (
                <ReviewCard
                  hasReported={false}
                  isBestReview={bestReviewIds.has(review.id)}
                  isLiked={false}
                  key={review.id}
                  likeCount={0}
                  onToggleLike={() => {}}
                  productId={anchorProductId}
                  review={review}
                />
              ))}
            </div>

            {hasMore && !expanded ?
              <button
                className={`${ui.btnOutline} min-h-[44px] w-full cursor-pointer text-[13px] font-medium`}
                onClick={() => setExpanded(true)}
                type="button"
              >
                후기 더보기 ({sortedReviews.length - INITIAL_VISIBLE}개)
              </button>
            : null}
          </div>
        </>
      }
    </section>
  );
}
