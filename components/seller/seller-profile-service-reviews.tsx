"use client";

import { useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { CELLOH_EMPTY_STATES } from "@/lib/copy/empty-states";
import { formatSellerReviewDate } from "@/lib/sellers/seller-reviews";
import type { SellerServiceReview } from "@/lib/sellers/seller-profile-data";

type SellerProfileServiceReviewsProps = {
  sellerName: string;
  reviews: SellerServiceReview[];
  initialVisible?: number;
};

export function SellerProfileServiceReviews({
  sellerName,
  reviews,
  initialVisible = 10,
}: SellerProfileServiceReviewsProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? reviews : reviews.slice(0, initialVisible);
  const hasMore = reviews.length > initialVisible;

  return (
    <section className="scroll-mt-28 space-y-4 px-6 pt-10" id="seller-reviews">
      <div>
        <h2 className="text-[20px] font-bold text-[#111111]">판매자 후기</h2>
        <p className="mt-1 text-[13px] text-[#666666]">
          {sellerName} 판매자 서비스·배송·응대에 대한 후기
        </p>
      </div>

      {reviews.length === 0 ?
        <EmptyState
          description={CELLOH_EMPTY_STATES.sellerReviews.description}
          title={CELLOH_EMPTY_STATES.sellerReviews.title}
        />
      : <>
          <div className="space-y-2.5">
            {visible.map((review) => (
              <article
                className="rounded-2xl border border-[#E8ECEA] bg-white p-4"
                key={review.id}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] font-medium text-[#111111]">{review.authorLabel}</p>
                  <p className="text-[12px] text-[#666666]">
                    {formatSellerReviewDate(review.createdAt)}
                  </p>
                </div>
                <p className="mt-1 text-[13px] font-medium text-[#E28A3B]">
                  ★ {review.rating.toFixed(1)}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {review.tags.map((tag) => (
                    <span
                      className="rounded-full border border-[#E8ECEA] bg-[#F5F7F6] px-2.5 py-1 text-[11px] font-medium text-[#666666]"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-[#666666]">
                  {review.comment}
                </p>
              </article>
            ))}
          </div>

          {hasMore && !expanded ?
            <button
              className="w-full cursor-pointer py-2 text-center text-[14px] font-medium text-[#666666]"
              onClick={() => setExpanded(true)}
              type="button"
            >
              판매자 후기 더보기 ({reviews.length - initialVisible}개)
            </button>
          : null}
        </>
      }
    </section>
  );
}
