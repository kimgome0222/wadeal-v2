import type { Deal } from "@/lib/deals";
import {
  getDealCardRating,
  getDealPurchaseCountLabel,
} from "@/lib/deals/card-display";
import { ds } from "@/lib/design-system";

type DealCardMetaProps = {
  deal: Deal;
  compact?: boolean;
  className?: string;
  /** card: 평점만 (⭐ 4.9 (234)), 구매건수 숨김 */
  variant?: "default" | "card";
};

export function DealCardMeta({
  deal,
  compact = false,
  className = "",
  variant = "default",
}: DealCardMetaProps) {
  if (variant === "card") {
    const rating = getDealCardRating(deal);
    if (!rating) {
      return null;
    }

    return (
      <p
        className={`text-[13px] font-normal leading-snug text-[#666666] ${className}`.trim()}
      >
        ⭐ {rating.score} ({rating.count.toLocaleString("ko-KR")})
      </p>
    );
  }

  const rating = getDealCardRating(deal);
  const review = rating ?? { score: "—", count: 0 };
  const purchaseLabel = getDealPurchaseCountLabel(deal);
  const textSize = className ? "" : compact ? "text-[11px]" : "text-[12px]";
  const metaLine = `★ ${review.score} · 리뷰 ${review.count.toLocaleString("ko-KR")} · ${purchaseLabel}`;

  if (compact) {
    return (
      <p
        className={`min-w-0 truncate font-normal leading-snug text-wadeal-muted ${textSize} ${className}`.trim()}
        title={metaLine}
      >
        <span className={ds.type.star}>★</span>{" "}
        <span>{review.score}</span>
        <span aria-hidden> · </span>
        리뷰 {review.count.toLocaleString("ko-KR")}
        <span aria-hidden> · </span>
        {purchaseLabel}
      </p>
    );
  }

  return (
    <p
      className={`flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0.5 font-normal leading-snug text-wadeal-muted ${textSize} ${className}`.trim()}
    >
      <span className="whitespace-nowrap">
        <span className={ds.type.star}>★</span>{" "}
        <span>{review.score}</span>
      </span>
      <span aria-hidden className="text-wadeal-line">
        ·
      </span>
      <span className="whitespace-nowrap">
        리뷰 {review.count.toLocaleString("ko-KR")}
      </span>
      <span aria-hidden className="text-wadeal-line">
        ·
      </span>
      <span className="whitespace-nowrap">{purchaseLabel}</span>
    </p>
  );
}
