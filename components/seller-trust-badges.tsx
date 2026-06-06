import { ds } from "@/lib/design-system";
import { pickSellerBadgesForCard } from "@/lib/sellers/badge-priority";
import { SELLER_BADGE_LABELS, type SellerBadgeId } from "@/lib/sellers/types";

const BADGE_STYLES: Partial<Record<SellerBadgeId, string>> = {
  verified: `${ds.badge.trust} ${ds.badge.verified}`,
  popular: `${ds.badge.trust} ${ds.badge.warm}`,
  best_seller: `${ds.badge.trust} ${ds.badge.warm}`,
  high_repurchase: `${ds.badge.trust} ${ds.badge.accent}`,
  fast_response: `${ds.badge.trust} ${ds.badge.muted}`,
  new_seller: `${ds.badge.trust} ${ds.badge.warm}`,
};

type SellerTrustBadgesProps = {
  badges: SellerBadgeId[];
  className?: string;
  limit?: number;
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
      {uniqueBadges.map((badge) => (
        <span
          className={
            BADGE_STYLES[badge] ?? `${ds.badge.trust} ${ds.badge.muted}`
          }
          key={badge}
        >
          {SELLER_BADGE_LABELS[badge]}
        </span>
      ))}
    </div>
  );
}
