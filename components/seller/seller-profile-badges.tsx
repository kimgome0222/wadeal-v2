import { SELLER_TRUST_BADGE_LABELS } from "@/lib/copy/seller-trust-copy";
import type { SellerBadgeId } from "@/lib/sellers/types";

type SellerProfileBadgesProps = {
  badges: SellerBadgeId[];
};

export function SellerProfileBadges({ badges }: SellerProfileBadgesProps) {
  if (badges.length === 0) {
    return null;
  }

  const display = badges.slice(0, 4);

  return (
    <div aria-label="판매자 신뢰 배지" className="flex flex-wrap gap-2 px-6">
      {display.map((badge) => (
        <span
          className="rounded-full border border-[#2E5E4E]/20 bg-[#F5F7F6] px-2.5 py-1 text-[11px] font-semibold text-[#2E5E4E]"
          key={badge}
        >
          {SELLER_TRUST_BADGE_LABELS[badge]}
        </span>
      ))}
    </div>
  );
}
