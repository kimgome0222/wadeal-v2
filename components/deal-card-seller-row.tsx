"use client";

import { FollowSellerButton } from "@/components/follow-seller-button";
import { SellerDetailModal } from "@/components/seller-detail-modal";
import { SellerTrustBadges } from "@/components/seller-trust-badges";
import { SellerVerifiedChip } from "@/components/seller-verified-chip";
import { useSellerDetailInteraction } from "@/components/use-seller-detail-interaction";
import type { Deal } from "@/lib/deals";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";
import { sellerNameClass } from "@/lib/sellers/trust-display";

type DealCardSellerRowProps = {
  deal: Deal;
  compact?: boolean;
  showBadges?: boolean;
  showFollow?: boolean;
};

export function DealCardSellerRow({
  deal,
  compact = false,
  showBadges = true,
  showFollow = true,
}: DealCardSellerRowProps) {
  const { view, modalOpen, openDetail, closeDetail } = useSellerDetailInteraction({ deal });
  const { metrics } = view;
  const textSize = compact ? "text-[10px]" : "text-[11px]";

  return (
    <>
      <div className={`deal-card-seller min-w-0 space-y-1 ${textSize}`}>
        <div className="flex min-w-0 items-center gap-1">
          <button
            className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
            onClick={(event) => openDetail(event)}
            type="button"
          >
            <span className={`${sellerNameClass} min-w-0`}>{metrics.seller.name}</span>
            {metrics.isVerified ?
              <SellerVerifiedChip label={SELLER_UI_COPY.verifiedBadge} />
            : null}
          </button>
          {showFollow ?
            <FollowSellerButton icon seller={metrics.seller} />
          : null}
        </div>
        <p className="font-semibold text-wadeal-muted">
          <span className="font-bold text-wadeal-ink">★ {metrics.rating}</span>
          <span aria-hidden className="mx-1">
            ·
          </span>
          <span>리뷰 {metrics.reviewCount.toLocaleString("ko-KR")}</span>
        </p>
        {showBadges ?
          <SellerTrustBadges
            badges={metrics.seller.badges}
            cardPriority
            className="pt-0.5"
            limit={compact ? 2 : 3}
          />
        : null}
      </div>

      <SellerDetailModal onClose={closeDetail} open={modalOpen} view={view} />
    </>
  );
}
