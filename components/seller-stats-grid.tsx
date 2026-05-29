import type { SellerProfile } from "@/lib/sellers/types";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";

type SellerStatsGridProps = {
  seller: Pick<
    SellerProfile,
    "rating" | "reviewCount" | "totalSales" | "repurchaseRate" | "inquiryResponseRate"
  >;
  rating?: string;
  reviewCount?: number;
  compact?: boolean;
};

export function SellerStatsGrid({
  seller,
  rating,
  reviewCount,
  compact = false,
}: SellerStatsGridProps) {
  const displayRating = rating ?? seller.rating.toFixed(1);
  const displayReviews = reviewCount ?? seller.reviewCount;
  const textSize = compact ? "text-[10px]" : "text-xs";
  const gap = compact ? "gap-x-2 gap-y-1.5" : "gap-3";

  return (
    <dl className={`grid grid-cols-2 ${gap} font-bold text-wadeal-muted ${textSize}`}>
      <div className={compact ? "" : "rounded-xl bg-gray-50 px-3 py-2.5"}>
        <dt>{SELLER_UI_COPY.rating}</dt>
        <dd className="mt-0.5 font-black text-wadeal-ink">★ {displayRating}</dd>
      </div>
      <div className={compact ? "" : "rounded-xl bg-gray-50 px-3 py-2.5"}>
        <dt>{SELLER_UI_COPY.reviewCount}</dt>
        <dd className="mt-0.5 font-black text-wadeal-ink">
          {displayReviews.toLocaleString("ko-KR")}
        </dd>
      </div>
      <div className={compact ? "" : "rounded-xl bg-gray-50 px-3 py-2.5"}>
        <dt>{SELLER_UI_COPY.cumulativeSales}</dt>
        <dd className="mt-0.5 font-black text-wadeal-ink">
          {seller.totalSales.toLocaleString("ko-KR")}
        </dd>
      </div>
      <div className={compact ? "" : "rounded-xl bg-gray-50 px-3 py-2.5"}>
        <dt>{SELLER_UI_COPY.repurchaseRate}</dt>
        <dd className="mt-0.5 font-black text-wadeal-ink">{seller.repurchaseRate}%</dd>
      </div>
      <div className={`col-span-2 ${compact ? "" : "rounded-xl bg-gray-50 px-3 py-2.5"}`}>
        <dt>{SELLER_UI_COPY.inquiryResponseRate}</dt>
        <dd className="mt-0.5 font-black text-wadeal-ink">{seller.inquiryResponseRate}%</dd>
      </div>
    </dl>
  );
}
