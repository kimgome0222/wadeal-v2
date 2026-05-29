import Link from "next/link";
import { Suspense } from "react";

import { EmptyState } from "@/components/empty-state";
import { SellerCenterNoSellerState } from "@/components/seller-center-no-seller-state";
import { SellerReviewsFilter } from "@/components/seller-reviews-filter";
import { SellerShell } from "@/components/seller-shell";
import { getSellerCenterPageContext } from "@/lib/auth/seller-access";
import {
  getSellerReviews,
  isSellerReviewFilter,
  type SellerReviewFilter,
} from "@/lib/data/seller-reviews";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

function resolveFilter(value: string | undefined): SellerReviewFilter {
  if (value && isSellerReviewFilter(value)) {
    return value;
  }
  return "all";
}

export default async function SellerReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { seller } = await getSellerCenterPageContext("/seller/reviews");

  if (!seller) {
    return (
      <SellerShell title="리뷰 관리">
        <SellerCenterNoSellerState />
      </SellerShell>
    );
  }

  const params = await searchParams;
  const filter = resolveFilter(params.filter);
  const reviews = await getSellerReviews(seller.userId, filter);

  return (
    <SellerShell title="리뷰 관리">
      <div className="space-y-4">
        <Suspense fallback={null}>
          <SellerReviewsFilter current={filter} />
        </Suspense>

        {reviews.length === 0 ?
          <EmptyState
            description="고객 리뷰가 등록되면 이곳에서 답글을 작성할 수 있어요."
            title="아직 리뷰가 없어요."
          />
        : reviews.map((review) => (
            <Link
              className={`${ui.panel} block space-y-2`}
              href={`/seller/reviews/${review.id}`}
              key={review.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-wadeal-ink">{review.productName}</p>
                  <p className="mt-1 text-xs font-bold text-wadeal-muted">
                    {review.author} · {review.createdAt}
                    {review.isVerifiedPurchase ? " · 구매확정" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-wadeal-red">{review.rating}점</p>
                  <p className="text-[10px] font-bold text-wadeal-muted">
                    {review.hasReply ? "답글 완료" : "답글 없음"}
                  </p>
                </div>
              </div>
              <p className="text-xs font-bold leading-relaxed text-wadeal-ink">{review.contentPreview}</p>
              {review.isReported ?
                <span className="inline-block rounded bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-700">
                  신고된 리뷰
                </span>
              : null}
            </Link>
          ))
        }
      </div>
    </SellerShell>
  );
}
