"use client";

import Image from "next/image";
import { useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { CELLOH_EMPTY_STATES } from "@/lib/copy/empty-states";
import type { SellerReview } from "@/lib/sellers/seller-reviews";
import { formatSellerReviewDate } from "@/lib/sellers/seller-reviews";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";
import { ds } from "@/lib/design-system";

export type SellerProfileReviewItem = SellerReview & {
  photoUrl?: string;
  isVerifiedPurchase?: boolean;
  isBest?: boolean;
};

type SellerProfileReviewsSectionProps = {
  sellerName: string;
  reviews: SellerProfileReviewItem[];
  initialVisible?: number;
};

export function SellerProfileReviewsSection({
  sellerName,
  reviews,
  initialVisible = 3,
}: SellerProfileReviewsSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleReviews = expanded ? reviews : reviews.slice(0, initialVisible);
  const hasMore = reviews.length > initialVisible;

  return (
    <section
      className="scroll-mt-28 space-y-3 rounded-xl border border-[#DDE8E2] bg-white p-4"
      id="seller-reviews"
    >
      <div>
        <h2 className={`${ds.type.h2} font-semibold`}>{SELLER_UI_COPY.reviewsTitle}</h2>
        <p className={`mt-1 ${ds.type.caption}`}>
          {sellerName} 판매자 · 포토·텍스트 리뷰
        </p>
      </div>

      {reviews.length === 0 ?
        <EmptyState
          description={CELLOH_EMPTY_STATES.sellerReviews.description}
          title={CELLOH_EMPTY_STATES.sellerReviews.title}
        />
      : <>
          <div className="space-y-2">
            {visibleReviews.map((review) => (
              <article
                className="rounded-lg border border-[#DDE8E2]/80 bg-[#FAFBFA] px-3 py-2.5"
                key={review.id}
              >
                <div className="flex items-start gap-2.5">
                  {review.photoUrl ?
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white">
                      <Image
                        alt="리뷰 사진"
                        className="object-cover"
                        fill
                        sizes="56px"
                        src={review.photoUrl}
                      />
                    </div>
                  : null}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className={`${ds.type.caption} font-medium text-wadeal-ink`}>
                        {review.authorLabel ?? "구매자"}
                      </p>
                      {review.isVerifiedPurchase !== false ?
                        <span className={`${ds.badge.base} border border-wadeal-red/25 bg-wadeal-red/8 text-wadeal-red`}>
                          실구매
                        </span>
                      : null}
                      {review.isBest ?
                        <span className={`${ds.badge.base} ${ds.badge.accent}`}>BEST</span>
                      : null}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className={`mt-0.5 ${ds.type.caption} font-medium ${ds.type.star}`}>
                        ★ {review.rating.toFixed(1)}
                      </p>
                      <p className={ds.type.caption}>{formatSellerReviewDate(review.createdAt)}</p>
                    </div>
                    <dl className="mt-1.5 grid grid-cols-3 gap-1">
                      <div>
                        <dt className={ds.type.statLabel}>응답</dt>
                        <dd className={`${ds.type.caption} font-medium text-wadeal-ink`}>
                          {review.responseSatisfaction}%
                        </dd>
                      </div>
                      <div>
                        <dt className={ds.type.statLabel}>배송</dt>
                        <dd className={`${ds.type.caption} font-medium text-wadeal-ink`}>
                          {review.shippingSatisfaction}%
                        </dd>
                      </div>
                      <div>
                        <dt className={ds.type.statLabel}>설명 일치</dt>
                        <dd className={`${ds.type.caption} font-medium text-wadeal-ink`}>
                          {review.descriptionMatch}%
                        </dd>
                      </div>
                    </dl>
                    <p className={`mt-1.5 ${ds.type.caption} leading-relaxed text-wadeal-muted`}>
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {hasMore && !expanded ?
            <button
              className={`${ds.type.link} w-full cursor-pointer py-1 text-center`}
              onClick={() => setExpanded(true)}
              type="button"
            >
              리뷰 더보기 ({reviews.length - initialVisible}개)
            </button>
          : null}
        </>
      }
    </section>
  );
}
