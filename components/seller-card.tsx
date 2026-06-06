import Link from "next/link";

import { SellerProfileAvatar } from "@/components/seller-profile-avatar";
import { SellerStatsGrid } from "@/components/seller-stats-grid";
import { SellerTrustBadges } from "@/components/seller-trust-badges";
import { SellerVerifiedChip } from "@/components/seller-verified-chip";
import {
  getSellerPublicProfileHref,
  getSellerSearchHref,
  isSellerPublicProfileEnabled,
} from "@/lib/sellers/routes";
import type { SellerProfile } from "@/lib/sellers/types";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";
import { sellerInteractiveClass } from "@/lib/sellers/trust-display";
import { ui } from "@/lib/ui";

type SellerCardProps = {
  seller: SellerProfile;
  variant?: "featured" | "compact";
};

export function SellerCard({ seller, variant = "featured" }: SellerCardProps) {
  const isCompact = variant === "compact";
  const profileHref =
    isSellerPublicProfileEnabled() ? getSellerPublicProfileHref(seller) : null;

  const sellerName = (
    <span className={`truncate text-sm font-black ${sellerInteractiveClass}`}>{seller.name}</span>
  );

  return (
    <article
      className={`${ui.cardInteractive} flex shrink-0 flex-col ${
        isCompact ? "w-[252px] p-4" : "w-[288px] p-5"
      }`}
    >
      <div className="flex items-start gap-3">
        <SellerProfileAvatar name={seller.name} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {profileHref ?
              <Link className="min-w-0 truncate" href={profileHref}>
                {sellerName}
              </Link>
            : sellerName}
            {seller.isVerified ?
              <SellerVerifiedChip label={SELLER_UI_COPY.verifiedBadge} />
            : null}
          </div>
          <p className="mt-1.5 line-clamp-2 text-[11px] font-medium leading-relaxed text-wadeal-muted">
            {seller.tagline}
          </p>
        </div>
      </div>

      <SellerTrustBadges badges={seller.badges} className="mt-3.5" limit={isCompact ? 2 : 4} />

      <div className="mt-4">
        <SellerStatsGrid compact={isCompact} seller={seller} />
      </div>

      <Link
        className={`${ui.btnPrimary} mt-5 h-10 text-[13px]`}
        href={`/product/${seller.featuredProductSlug}`}
      >
        상품 보기
      </Link>
      <Link
        className={`mt-2.5 text-center text-[11px] font-semibold text-wadeal-muted ${sellerInteractiveClass}`}
        href={getSellerSearchHref(seller)}
      >
        {SELLER_UI_COPY.moreProducts}
      </Link>
    </article>
  );
}
