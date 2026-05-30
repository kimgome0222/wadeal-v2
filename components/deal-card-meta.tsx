import type { Deal } from "@/lib/deals";
import {
  getDealPurchaseCountLabel,
  getDealReviewScoreLabel,
} from "@/lib/deals/card-display";
import { ds } from "@/lib/design-system";

type DealCardMetaProps = {
  deal: Deal;
  compact?: boolean;
  className?: string;
};

export function DealCardMeta({ deal, compact = false, className = "" }: DealCardMetaProps) {
  const review = getDealReviewScoreLabel(deal);
  const purchaseLabel = getDealPurchaseCountLabel(deal);
  const textSize = className ? "" : compact ? "text-[11px]" : "text-[12px]";

  return (
    <p
      className={`flex flex-wrap items-center gap-x-1 gap-y-0.5 font-normal leading-snug text-wadeal-muted ${textSize} ${className}`.trim()}
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
