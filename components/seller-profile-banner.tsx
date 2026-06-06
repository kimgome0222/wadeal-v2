import { SellerProfileAvatar } from "@/components/seller-profile-avatar";
import { SellerTrustBadges } from "@/components/seller-trust-badges";
import { SellerVerifiedChip } from "@/components/seller-verified-chip";
import type { SellerTrustMetrics } from "@/lib/sellers/trust-display";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";
import { ds } from "@/lib/design-system";

type SellerProfileBannerProps = {
  metrics: SellerTrustMetrics;
};

export function SellerProfileBanner({ metrics }: SellerProfileBannerProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#DDE8E2] bg-gradient-to-b from-[#FAFBFA] to-white p-4">
      <div className="flex items-start gap-3">
        <SellerProfileAvatar name={metrics.seller.name} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h1 className={`${ds.type.h1} font-semibold`}>{metrics.seller.name}</h1>
            {metrics.isVerified ?
              <SellerVerifiedChip label={SELLER_UI_COPY.verifiedBadge} />
            : null}
          </div>
          <p className={`mt-1.5 ${ds.type.bodySm} line-clamp-2 leading-relaxed`}>
            {metrics.seller.tagline}
          </p>
          {metrics.seller.badges.length > 0 ?
            <SellerTrustBadges
              badges={metrics.seller.badges}
              className="mt-2.5"
              limit={4}
            />
          : null}
        </div>
      </div>
    </section>
  );
}
