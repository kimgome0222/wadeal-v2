import { EmptyState } from "@/components/empty-state";
import { CELLOH_EMPTY_STATES } from "@/lib/copy/empty-states";
import type { SellerReview } from "@/lib/sellers/seller-reviews";
import { formatSellerReviewDate } from "@/lib/sellers/seller-reviews";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";
import { ui } from "@/lib/ui";

type SellerReviewsListSectionProps = {
  sellerName: string;
  reviews: SellerReview[];
};

export function SellerReviewsListSection({ sellerName, reviews }: SellerReviewsListSectionProps) {
  return (
    <section className={`${ui.card} space-y-3 p-4`} id="seller-reviews">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className={ui.sectionTitleAccent}>{SELLER_UI_COPY.reviewsTitle}</h2>
          <span className="rounded-full bg-wadeal-cream px-2 py-0.5 text-[10px] font-bold text-wadeal-coral">
            예시 데이터
          </span>
        </div>
        <p className="mt-1 text-xs font-medium text-wadeal-muted">
          {sellerName} 판매자 · 응답·배송·설명 일치·신뢰에 대한 구매자 후기입니다.
        </p>
      </div>

      {reviews.length === 0 ?
        <EmptyState
          description={CELLOH_EMPTY_STATES.sellerReviews.description}
          title={CELLOH_EMPTY_STATES.sellerReviews.title}
        />
      : <div className="space-y-2.5">
          {reviews.map((review) => (
            <article
              className="rounded-xl border border-wadeal-line bg-white px-3.5 py-3"
              key={review.id}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-wadeal-ink">
                  {review.authorLabel ?? "구매자"}
                </p>
                <p className="text-[11px] font-semibold text-wadeal-muted">
                  {formatSellerReviewDate(review.createdAt)}
                </p>
              </div>
              <p className="mt-1 text-[11px] font-bold text-wadeal-coral">
                ★ {review.rating.toFixed(1)}
              </p>
              <dl className="mt-2 grid grid-cols-3 gap-1 text-[10px] font-bold text-wadeal-muted">
                <div>
                  <dt>응답</dt>
                  <dd className="font-black text-wadeal-ink">{review.responseSatisfaction}%</dd>
                </div>
                <div>
                  <dt>배송</dt>
                  <dd className="font-black text-wadeal-ink">{review.shippingSatisfaction}%</dd>
                </div>
                <div>
                  <dt>설명 일치</dt>
                  <dd className="font-black text-wadeal-ink">{review.descriptionMatch}%</dd>
                </div>
              </dl>
              <p className="mt-2 text-xs font-medium leading-relaxed text-wadeal-muted">
                &ldquo;{review.comment}&rdquo;
              </p>
            </article>
          ))}
        </div>
      }
    </section>
  );
}
