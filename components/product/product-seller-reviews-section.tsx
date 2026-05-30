import type { Deal } from "@/lib/deals";
import { SELLER_REVIEW_TAGS } from "@/lib/product/detail-data";
import { resolveSellerProfileForDeal } from "@/lib/sellers/home-sellers";
import { buildSellerServiceReviews } from "@/lib/sellers/seller-profile-data";
import { formatSellerReviewDate } from "@/lib/sellers/seller-reviews";

type ProductSellerReviewsSectionProps = {
  deal: Deal;
};

export function ProductSellerReviewsSection({ deal }: ProductSellerReviewsSectionProps) {
  const seller = resolveSellerProfileForDeal(deal);
  const reviews = buildSellerServiceReviews(seller, 12);

  return (
    <section aria-label="판매자 후기" className="space-y-4">
      <div>
        <h3 className="text-[16px] font-semibold text-[#111111]">판매자 후기</h3>
        <p className="mt-1 text-[13px] text-[#666666]">
          {seller.name} 판매자 서비스·배송·응대에 대한 후기
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SELLER_REVIEW_TAGS.map((tag) => (
          <span
            className="rounded-full border border-[#E8ECEA] bg-[#F5F7F6] px-3 py-1.5 text-[12px] font-medium text-[#666666]"
            key={tag}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="space-y-2.5">
        {reviews.slice(0, 10).map((review) => (
          <article
            className="rounded-[20px] border border-[#E8ECEA] bg-white p-4"
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
            <p className="mt-2 text-[14px] leading-relaxed text-[#666666]">{review.comment}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
