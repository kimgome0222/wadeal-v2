import type { Deal } from "@/lib/deals";
import {
  getDealBadgeLabel,
  getDealProgress,
  getDealRemaining,
  isDealGroupBuySucceeded,
  shouldShowDealUrgency,
} from "@/lib/deals";
import { badgeTone } from "@/lib/ui";

type GroupBuyProgressProps = {
  deal: Deal;
  variant?: "compact" | "default";
  showBadge?: boolean;
  showUrgency?: boolean;
  showEndsIn?: boolean;
  className?: string;
};

export function GroupBuyProgress({
  deal,
  variant = "default",
  showBadge = false,
  showUrgency = true,
  showEndsIn = false,
  className = "",
}: GroupBuyProgressProps) {
  const succeeded = isDealGroupBuySucceeded(deal);
  const progress = getDealProgress(deal);
  const remaining = getDealRemaining(deal);
  const urgent = showUrgency && shouldShowDealUrgency(deal);
  const badgeLabel = getDealBadgeLabel(deal);
  const isCompact = variant === "compact";

  return (
    <div className={`space-y-1.5 ${className}`.trim()}>
      {showBadge ?
        <span
          className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-black ${badgeTone(badgeLabel)}`}
        >
          {badgeLabel}
        </span>
      : null}

      {succeeded ?
        <p
          className={`rounded-lg bg-green-50 px-2 py-1.5 text-center font-extrabold text-green-700 ${
            isCompact ? "text-[10px]" : "text-[11px]"
          }`}
        >
          혜택가가 확정됐어요
        </p>
      : null}

      <div className="flex items-center justify-between gap-2">
        <span
          className={
            isCompact ?
              "text-[11px] font-extrabold text-wadeal-muted"
            : "text-xs font-bold text-wadeal-ink"
          }
        >
          {succeeded ?
            `${deal.participants}명 구매 · 최대 혜택 적용`
          : `${deal.participants}명 구매 · 혜택 기준 ${deal.targetParticipants}명`}
        </span>
        {showEndsIn && !succeeded ?
          <span className="shrink-0 text-[10px] font-bold text-wadeal-coral sm:text-[11px]">
            혜택 종료 전
          </span>
        : null}
      </div>

      <div
        className={`overflow-hidden rounded-full bg-gray-100 ${isCompact ? "h-1.5" : "h-2"}`}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`판매 진행 ${progress}%`}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            succeeded ? "bg-green-600" : "bg-wadeal-red"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {urgent ?
        <p
          className={
            isCompact ?
              "text-[10px] font-extrabold leading-snug text-wadeal-muted"
            : "text-[11px] font-bold leading-snug text-wadeal-muted"
          }
        >
          판매 정보 · 혜택 확인
        </p>
      : null}
    </div>
  );
}
