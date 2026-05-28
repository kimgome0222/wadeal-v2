import type { Deal } from "@/lib/deals";
import { getDealAvailabilityLabel, shouldShowDealDeadline } from "@/lib/deals/lifecycle";

type DealDeadlineDeal = Pick<
  Deal,
  | "id"
  | "endsIn"
  | "endsInMinutes"
  | "badge"
  | "productType"
  | "stockQuantity"
  | "soldQuantity"
  | "targetQuantity"
  | "currentQuantity"
  | "maxQuantity"
  | "dealStatus"
  | "isSoldOut"
>;

export type DealDeadlineVariant = "card" | "detail" | "join";

type DealDeadlineProps = {
  deal: DealDeadlineDeal;
  variant: DealDeadlineVariant;
  className?: string;
};

function StockIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      viewBox="0 0 12 12"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 4h7v5.5a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5V4Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path d="M4 4V3a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export function DealDeadline({ deal, variant, className = "" }: DealDeadlineProps) {
  const availability = getDealAvailabilityLabel(deal as Deal);

  if (availability) {
    const lowStock = availability.includes("남음") && !availability.includes("품절");
    const urgent = lowStock && parseInt(availability, 10) <= 10;

    if (variant === "card") {
      return (
        <p
          className={`flex items-center gap-1 text-[11px] font-medium leading-none ${
            urgent ? "text-wadeal-red" : "text-wadeal-muted"
          } ${className}`.trim()}
        >
          <StockIcon className="h-3 w-3 shrink-0 opacity-70" />
          <span>{availability}</span>
        </p>
      );
    }

    return (
      <div
        className={`rounded-xl border border-wadeal-line bg-wadeal-surface px-4 py-3 ${className}`.trim()}
      >
        <p
          className={`flex items-start gap-2 text-sm font-medium leading-snug ${
            urgent ? "text-wadeal-red" : "text-wadeal-ink"
          }`}
        >
          <StockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-wadeal-muted" />
          <span>{availability}</span>
        </p>
      </div>
    );
  }

  if (!shouldShowDealDeadline(deal as Deal)) {
    return null;
  }

  return null;
}

/** @deprecated Time-based copy removed — kept for type compatibility */
export function getCardDeadlineText(_deal: DealDeadlineDeal): string {
  return "";
}

export function getDetailDeadlineText(_deal: DealDeadlineDeal): string {
  return "";
}

export function getJoinDeadlineText(_deal: DealDeadlineDeal): string {
  return "";
}
