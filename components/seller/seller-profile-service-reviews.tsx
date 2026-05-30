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
  compactEmpty?: boolean;
};

export function SellerProfileServiceReviews({
  sellerName,
  reviews,
  initialVisible = 10,
  compactEmpty = false,
}: SellerProfileServiceReviewsProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? reviews : reviews.slice(0, initialVisible);
  const hasMore = reviews.length > initialVisible;

  return (
    <section className="scroll-mt-28 space-y-4 px-6 pt-6" id="seller-reviews">
      <div>
        <h2 className="text-[20px] font-bold text-[#111111]">판매자 후기</h2>
        <p className="mt-1 text-[13px] text-[#666666]">
          {sellerName} 판매자 서비스·배송·응대에 대한 후기
        </p>
      </div>

      {reviews.length === 0 ?
        <EmptyState
          compact={compactEmpty}
          description={CELLOH_EMPTY_STATES.sellerReviews.description}
          title={CELLOH_EMPTY_STATES.sellerReviews.title}
        />
      : <>
          <div className="-mx-6 snap-x snap-mandatory overflow-x-auto no-scrollbar px-6">
            <div className="flex snap-x snap-mandatory gap-3" role="list">
              {reviews.slice(0, 8).map((review) => (
                <article
                  className="flex w-[calc((100vw-72px)/2.5)] min-w-[calc((100vw-72px)/2.5)] max-w-[calc((100vw-72px)/2.5)] flex-none snap-start flex-col rounded-2xl border border-[#E8ECEA] bg-white p-4"
                  key={review.id}
                  role="listitem"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[13px] font-medium text-[#111111]">
                      {review.authorLabel}
                    </p>
                    <p className="shrink-0 text-[12px] text-[#666666]">
                      {formatSellerReviewDate(review.createdAt)}
                    </p>
                  </div>
                  <p className="mt-1 text-[13px] font-medium text-[#E28A3B]">
                    ★ {review.rating.toFixed(1)}
                  </p>
                  <p className="mt-2 line-clamp-4 text-[13px] leading-relaxed text-[#666666]">
                    {review.comment}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {expanded ?
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
          : null}

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
