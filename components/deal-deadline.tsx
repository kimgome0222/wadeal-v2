import type { Deal } from "@/lib/deals";

type DealDeadlineDeal = Pick<Deal, "id" | "endsIn" | "endsInMinutes" | "badge">;

export type DealDeadlineVariant = "card" | "detail" | "join";

type DealDeadlineProps = {
  deal: DealDeadlineDeal;
  variant: DealDeadlineVariant;
  className?: string;
};

function getDeadlineParts(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return { hours, mins };
}

/** Static Korean copy for cards — short, no live countdown. */
export function getCardDeadlineText(deal: DealDeadlineDeal): string {
  const { hours, mins } = getDeadlineParts(deal.endsInMinutes);

  if (deal.endsInMinutes <= 120 || deal.badge === "마감임박") {
    return "오늘 23:59 마감";
  }

  const style = deal.id % 3;
  if (style === 0 && hours >= 1) {
    return `${hours}시간 남음`;
  }
  if (style === 1 && hours >= 1 && mins > 0) {
    return `${hours}시간 ${mins}분 남음`;
  }
  if (hours >= 1) {
    return `${hours}시간 남음`;
  }
  return `${Math.max(mins, 1)}분 남음`;
}

/** Static Korean copy for detail / join surfaces. */
export function getDetailDeadlineText(deal: DealDeadlineDeal): string {
  const { hours, mins } = getDeadlineParts(deal.endsInMinutes);

  if (hours >= 1 && mins > 0) {
    return `공동구매 마감까지 ${hours}시간 ${mins}분 남았어요`;
  }
  if (hours >= 1) {
    return `공동구매 마감까지 ${hours}시간 남았어요`;
  }
  if (deal.endsInMinutes <= 120 || deal.badge === "마감임박") {
    return "공동구매가 오늘 23:59에 마감돼요";
  }
  return `공동구매 마감까지 ${Math.max(mins, 1)}분 남았어요`;
}

/** Slightly shorter copy for the join flow. */
export function getJoinDeadlineText(deal: DealDeadlineDeal): string {
  const { hours, mins } = getDeadlineParts(deal.endsInMinutes);

  if (hours >= 1 && mins > 0) {
    return `마감까지 ${hours}시간 ${mins}분 남았어요`;
  }
  if (hours >= 1) {
    return `마감까지 ${hours}시간 남았어요`;
  }
  if (deal.endsInMinutes <= 120 || deal.badge === "마감임박") {
    return "오늘 23:59에 마감돼요";
  }
  return `마감까지 ${Math.max(mins, 1)}분 남았어요`;
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      viewBox="0 0 12 12"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="6" cy="6" r="4.75" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M6 3.5V6l1.75 1.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.1"
      />
    </svg>
  );
}

export function DealDeadline({ deal, variant, className = "" }: DealDeadlineProps) {
  if (variant === "card") {
    const text = getCardDeadlineText(deal);
    const urgent = deal.endsInMinutes <= 180 || deal.badge === "마감임박";

    return (
      <p
        className={`flex items-center gap-1 text-[11px] font-bold leading-none ${urgent ? "text-wadeal-red" : "text-wadeal-muted"} ${className}`.trim()}
      >
        <ClockIcon className="h-3 w-3 shrink-0 opacity-70" />
        <span>{text}</span>
      </p>
    );
  }

  const text = variant === "join" ? getJoinDeadlineText(deal) : getDetailDeadlineText(deal);
  const urgent = deal.endsInMinutes <= 180 || deal.badge === "마감임박";
  const isJoin = variant === "join";

  return (
    <div
      className={
        isJoin ?
          `rounded-xl border border-wadeal-line bg-wadeal-surface px-4 py-3 ${className}`.trim()
        : `rounded-xl border border-wadeal-line bg-white px-4 py-3.5 ${className}`.trim()
      }
    >
      <p
        className={`flex items-start gap-2 text-sm font-bold leading-snug ${urgent ? "text-wadeal-red" : "text-wadeal-ink"}`}
      >
        <ClockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-wadeal-muted" />
        <span>{text}</span>
      </p>
    </div>
  );
}
