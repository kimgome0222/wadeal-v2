import type { Deal } from "@/lib/deals";
import {
  getDealReviewScoreLabel,
  getDealTodayParticipantLabel,
} from "@/lib/deals/card-display";

type DealCardMetaProps = {
  deal: Deal;
  compact?: boolean;
};

export function DealCardMeta({ deal, compact = false }: DealCardMetaProps) {
  const review = getDealReviewScoreLabel(deal);

  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${compact ? "text-[10px]" : "text-[11px]"}`}>
      <span className="font-black text-amber-500">★ {review.score}</span>
      <span className="font-bold text-wadeal-muted">({review.count.toLocaleString("ko-KR")})</span>
      <span className="font-bold text-wadeal-muted">·</span>
      <span className="font-bold text-wadeal-ink">{getDealTodayParticipantLabel(deal)}</span>
    </div>
  );
}
