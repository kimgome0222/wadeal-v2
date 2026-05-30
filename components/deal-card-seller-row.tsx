"use client";

import { SaveDealButton } from "@/components/save-deal-button";
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
  showSave?: boolean;
  className?: string;
};

export function DealCardSellerRow({
  deal,
  compact = false,
  showBadges = true,
  showSave = true,
  className = "",
}: DealCardSellerRowProps) {
  const { view, modalOpen, openDetail, closeDetail } = useSellerDetailInteraction({ deal });
  const { metrics } = view;
  const textSize = className ? "" : compact ? "text-[12px]" : "text-[12px]";

  return (
    <>
      <div className={`deal-card-seller relative z-20 min-w-0 space-y-1 pointer-events-auto ${textSize} ${className}`.trim()}>
        <div className="flex min-w-0 items-center gap-1.5">
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
          {showSave ?
            <SaveDealButton deal={deal} size="sm" variant="inline" />
          : null}
        </div>
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
