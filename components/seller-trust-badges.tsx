import { pickSellerBadgesForCard } from "@/lib/sellers/badge-priority";
import { SELLER_BADGE_LABELS, type SellerBadgeId } from "@/lib/sellers/types";

const BADGE_STYLES: Partial<Record<SellerBadgeId, string>> = {
  verified: "border-wadeal-red/30 bg-wadeal-red/12 text-wadeal-red ring-1 ring-wadeal-red/15",
  popular: "border-wadeal-coral/30 bg-wadeal-coral/12 text-wadeal-coral ring-1 ring-wadeal-coral/15",
  best_seller: "border-wadeal-coral/25 bg-wadeal-coral/10 text-wadeal-coral",
  high_repurchase: "border-wadeal-line bg-wadeal-surface text-wadeal-red",
  fast_response: "border-wadeal-red/20 bg-white text-wadeal-ink ring-1 ring-wadeal-line",
  new_seller: "border-wadeal-coral/25 bg-wadeal-cream text-wadeal-coral ring-1 ring-wadeal-coral/10",
};

const EMPHASIZED_BADGES = new Set<SellerBadgeId>([
  "verified",
  "new_seller",
  "popular",
  "fast_response",
]);

type SellerTrustBadgesProps = {
  badges: SellerBadgeId[];
  className?: string;
  limit?: number;
  /** 카드·레일용: 인증/신규/인기/빠른응답 우선 노출 */
  cardPriority?: boolean;
};

export function SellerTrustBadges({
  badges,
  className = "",
  limit = 3,
  cardPriority = false,
}: SellerTrustBadgesProps) {
  if (badges.length === 0) {
    return null;
  }

  const source = cardPriority ? pickSellerBadgesForCard(badges, limit) : badges;

  const seenLabels = new Set<string>();
  const uniqueBadges: SellerBadgeId[] = [];

  for (const badge of source) {
    const label = SELLER_BADGE_LABELS[badge];
    if (seenLabels.has(label)) {
      continue;
    }
    seenLabels.add(label);
    uniqueBadges.push(badge);
    if (uniqueBadges.length >= limit) {
      break;
    }
  }

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`.trim()}>
      {uniqueBadges.map((badge) => {
        const emphasized = EMPHASIZED_BADGES.has(badge);

        return (
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-all duration-[250ms] ease-smooth hover:-translate-y-0.5 hover:shadow-sm ${
              BADGE_STYLES[badge] ?? "border-wadeal-line bg-wadeal-surface text-wadeal-muted"
            } ${emphasized ? "shadow-sm" : ""}`}
            key={badge}
          >
            {SELLER_BADGE_LABELS[badge]}
          </span>
        );
      })}
    </div>
  );
}
