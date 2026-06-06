"use client";

import { SellerProfileAvatar } from "@/components/seller-profile-avatar";
import { SellerVerifiedChip } from "@/components/seller-verified-chip";
import type { SellerTrustMetrics } from "@/lib/sellers/trust-display";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";
import { sellerNameClass } from "@/lib/sellers/trust-display";

type SellerProfileSummaryProps = {
  metrics: SellerTrustMetrics;
  onClick?: () => void;
  as?: "button" | "div";
  avatarSize?: "md" | "lg";
};

export function SellerProfileSummary({
  metrics,
  onClick,
  as = "button",
  avatarSize = "lg",
}: SellerProfileSummaryProps) {
  const interactive = Boolean(onClick);
  const className = `celloh-transition flex w-full items-start gap-3.5 rounded-xl border border-transparent p-1 text-left ${
    interactive ?
      "cursor-pointer hover:-translate-y-0.5 hover:border-wadeal-line hover:bg-wadeal-surface hover:shadow-card"
    : ""
  }`;

  const body = (
    <>
      <SellerProfileAvatar name={metrics.seller.name} size={avatarSize} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-base ${interactive ? sellerNameClass : "font-bold text-wadeal-ink"}`}>
            {metrics.seller.name}
          </span>
          {metrics.isVerified ?
            <SellerVerifiedChip label={SELLER_UI_COPY.verifiedBadge} />
          : null}
        </div>
        <p className="mt-1.5 text-xs font-medium leading-relaxed text-wadeal-muted">
          {metrics.seller.tagline}
        </p>
        {metrics.isVerified ?
          <p className="mt-2 text-[10px] font-semibold text-wadeal-red">
            {SELLER_UI_COPY.businessVerified}
          </p>
        : null}
      </div>
    </>
  );

  if (as === "div" || !onClick) {
    return <div className={className}>{body}</div>;
  }

  return (
    <button className={className} onClick={onClick} type="button">
      {body}
    </button>
  );
}
