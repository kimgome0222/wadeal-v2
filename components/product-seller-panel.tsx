"use client";

import Link from "next/link";

import { FollowSellerButton } from "@/components/follow-seller-button";
import { SellerDetailModal } from "@/components/seller-detail-modal";
import { SellerMockDataNote } from "@/components/seller-mock-data-note";
import { SellerProfileSummary } from "@/components/seller-profile-summary";
import { SellerRealtimeTrustPanel } from "@/components/seller-realtime-trust-panel";
import { SellerStatsGrid } from "@/components/seller-stats-grid";
import { SellerTrustBadges } from "@/components/seller-trust-badges";
import { SellerTrustScoreCard } from "@/components/seller-trust-score-card";
import { useSellerDetailInteraction } from "@/components/use-seller-detail-interaction";
import type { ReviewSummary } from "@/lib/data/reviews";
import type { Deal } from "@/lib/deals";
import { getSellerSearchHref } from "@/lib/sellers/routes";
import { buildSellerTrustProfile } from "@/lib/sellers/seller-trust-profile";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";
import { ui } from "@/lib/ui";

type ProductSellerPanelProps = {
  deal: Deal;
  reviewSummary: ReviewSummary;
  isLoggedIn?: boolean;
  loginNext?: string;
};

export function ProductSellerPanel({
  deal,
  reviewSummary,
  isLoggedIn = false,
  loginNext,
}: ProductSellerPanelProps) {
  const { view, modalOpen, openDetail, closeDetail } = useSellerDetailInteraction({
    deal,
    reviewSummary,
  });
  const { metrics } = view;
  const trustProfile = buildSellerTrustProfile(deal, reviewSummary);

  return (
    <>
      <section className={`${ui.card} mt-4 min-w-0 overflow-hidden p-5`} id="seller-info">
        <p className="text-[11px] font-bold tracking-[0.1em] text-wadeal-red/80">
          {SELLER_UI_COPY.infoTitle}
        </p>
        <p className="mt-1 text-xs font-medium leading-relaxed text-wadeal-muted">
          {SELLER_UI_COPY.detailHint}
        </p>

        <div className="mt-4">
          <SellerProfileSummary metrics={metrics} onClick={openDetail} />
        </div>

        <SellerTrustBadges badges={metrics.seller.badges} cardPriority className="mt-4" limit={6} />

        <SellerTrustScoreCard metrics={metrics} />

        <SellerRealtimeTrustPanel className="mt-4" profile={trustProfile} />

        <div className="mt-5">
          <SellerStatsGrid
            rating={metrics.rating}
            reviewCount={metrics.reviewCount}
            seller={metrics.seller}
          />
        </div>

        <SellerMockDataNote className="mt-4" />

        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <FollowSellerButton
            isLoggedIn={isLoggedIn}
            loginNext={loginNext}
            seller={metrics.seller}
          />
          <Link
            className={`${ui.btnOutline} h-10 text-[13px]`}
            href={getSellerSearchHref(metrics.seller)}
          >
            {SELLER_UI_COPY.moreProducts}
          </Link>
          <button
            className={`${ui.btnOutline} h-10 cursor-pointer text-[13px] sm:col-span-2`}
            onClick={openDetail}
            type="button"
          >
            {SELLER_UI_COPY.infoTitle} 자세히
          </button>
        </div>
      </section>

      <SellerDetailModal onClose={closeDetail} open={modalOpen} view={view} />
    </>
  );
}
