import { ds } from "@/lib/design-system";
import type { SellerProfile } from "@/lib/sellers/types";

type SellerMetricsStripProps = {
  seller: Pick<
    SellerProfile,
    "rating" | "reviewCount" | "totalSales" | "repurchaseRate" | "inquiryResponseRate"
  >;
  rating?: string;
  reviewCount?: number;
  /** rail / card — 3 stats only */
  variant?: "full" | "compact";
  className?: string;
};

export function SellerMetricsStrip({
  seller,
  rating,
  reviewCount,
  variant = "full",
  className = "",
}: SellerMetricsStripProps) {
  const displayRating = rating ?? seller.rating.toFixed(1);
  const displayReviews = reviewCount ?? seller.reviewCount;

  const items =
    variant === "compact" ?
      [
        { label: "평점", value: `★ ${displayRating}` },
        { label: "판매", value: seller.totalSales.toLocaleString("ko-KR") },
        { label: "응답", value: `${seller.inquiryResponseRate}%` },
      ]
    : [
        { label: "평점", value: `★ ${displayRating}` },
        { label: "판매", value: seller.totalSales.toLocaleString("ko-KR") },
        { label: "응답", value: `${seller.inquiryResponseRate}%` },
        { label: "재구매", value: `${seller.repurchaseRate}%` },
      ];

  return (
    <dl
      className={`grid ${variant === "compact" ? "grid-cols-3" : "grid-cols-4"} gap-2 ${className}`.trim()}
    >
      {items.map((item) => (
        <div className={ds.seller.metricCell} key={item.label}>
          <dt className={ds.type.statLabel}>{item.label}</dt>
          <dd className={`mt-0.5 ${ds.type.statSm}`}>{item.value}</dd>
        </div>
      ))}
      {variant === "full" ?
        <div className="col-span-4 flex items-center justify-center gap-3 pt-0.5">
          <span className={ds.type.caption}>
            리뷰 {displayReviews.toLocaleString("ko-KR")}
          </span>
        </div>
      : null}
    </dl>
  );
}
