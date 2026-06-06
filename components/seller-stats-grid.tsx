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
  const textSize = compact ? "text-[10px]" : "text-[11px]";
  const gap = compact ? "gap-2" : "gap-2.5";

  const items = [
    { label: SELLER_UI_COPY.rating, value: `★ ${displayRating}` },
    {
      label: SELLER_UI_COPY.reviewCount,
      value: displayReviews.toLocaleString("ko-KR"),
    },
    {
      label: SELLER_UI_COPY.cumulativeSales,
      value: `${seller.totalSales.toLocaleString("ko-KR")}건`,
    },
    {
      label: SELLER_UI_COPY.repurchaseRate,
      value: `${seller.repurchaseRate}%`,
    },
    {
      label: SELLER_UI_COPY.inquiryResponseRate,
      value: `${seller.inquiryResponseRate}%`,
    },
  ];

  return (
    <dl className={`grid grid-cols-2 ${gap} ${textSize}`}>
      {items.map((item, index) => (
        <div
          className={`rounded-xl border border-wadeal-line/80 bg-[#F8FAF8] px-3 py-2.5 ${
            index === items.length - 1 ? "col-span-2" : ""
          }`}
          key={item.label}
        >
          <dt className="font-normal text-wadeal-muted">{item.label}</dt>
          <dd className="mt-0.5 font-semibold text-wadeal-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
