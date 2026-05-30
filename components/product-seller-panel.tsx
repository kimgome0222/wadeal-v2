"use client";

import Link from "next/link";

import { SellerMetricsStrip } from "@/components/ds/seller-metrics-strip";
import { FollowSellerButton } from "@/components/follow-seller-button";
import { SellerDetailModal } from "@/components/seller-detail-modal";
import { SellerVerifiedChip } from "@/components/seller-verified-chip";
import { useSellerDetailInteraction } from "@/components/use-seller-detail-interaction";
import type { ReviewSummary } from "@/lib/data/reviews";
import type { Deal } from "@/lib/deals";
import { ds } from "@/lib/design-system";
import {
  getSellerPublicProfileHref,
  getSellerSearchHref,
  isSellerPublicProfileEnabled,
} from "@/lib/sellers/routes";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";
import { ui } from "@/lib/ui";

type ProductSellerPanelProps = {
  deal: Deal;
  reviewSummary: ReviewSummary;
  isLoggedIn?: boolean;
  loginNext?: string;
  compact?: boolean;
  /** 상품 상세 상단 — compact 요약 카드 */
  summary?: boolean;
};

const summaryMetricClass =
  "rounded-md bg-white px-1.5 py-1 text-center border border-[#DDE8E2]/80";

export function ProductSellerPanel({
  deal,
  reviewSummary,
  isLoggedIn = false,
  loginNext,
  compact = false,
  summary = false,
}: ProductSellerPanelProps) {
  const { view, modalOpen, openDetail, closeDetail } = useSellerDetailInteraction({
    deal,
    reviewSummary,
  });
  const { metrics } = view;
  const profileHref =
    isSellerPublicProfileEnabled() ?
      getSellerPublicProfileHref(metrics.seller)
    : null;
  const sellerProductsHref = getSellerSearchHref(metrics.seller);

  return (
    <>
      <section
        className={
          summary ?
            "mt-5 rounded-[18px] border border-[#DDE8E2] bg-white p-4"
          : compact ?
            "rounded-[18px] border border-[#DDE8E2] bg-white p-4"
          : ds.seller.panel
        }
        id="seller-info"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={summary ? ds.type.h3 : compact ? ds.type.h3 : ds.seller.name}>
            {metrics.seller.name}
          </span>
          {metrics.isVerified ?
            <SellerVerifiedChip label={SELLER_UI_COPY.verifiedBadge} />
          : null}
        </div>

        {summary ?
          <dl className="mt-2.5 grid grid-cols-5 gap-1.5">
            <div className={summaryMetricClass}>
              <dt className={`${ds.type.statLabel} text-[10px]`}>평점</dt>
              <dd className={`mt-0.5 text-[11px] font-medium text-wadeal-ink`}>
                ★ {metrics.rating}
              </dd>
            </div>
            <div className={summaryMetricClass}>
              <dt className={ds.type.statLabel}>리뷰</dt>
              <dd className={`mt-0.5 ${ds.type.caption} font-medium text-wadeal-ink`}>
                {metrics.reviewCount.toLocaleString("ko-KR")}
              </dd>
            </div>
            <div className={summaryMetricClass}>
              <dt className={ds.type.statLabel}>판매</dt>
              <dd className={`mt-0.5 ${ds.type.caption} font-medium text-wadeal-ink`}>
                {metrics.seller.totalSales.toLocaleString("ko-KR")}
              </dd>
            </div>
            <div className={summaryMetricClass}>
              <dt className={ds.type.statLabel}>재구매</dt>
              <dd className={`mt-0.5 ${ds.type.caption} font-medium text-wadeal-ink`}>
                {metrics.seller.repurchaseRate}%
              </dd>
            </div>
            <div className={summaryMetricClass}>
              <dt className={ds.type.statLabel}>응답</dt>
              <dd className={`mt-0.5 ${ds.type.caption} font-medium text-wadeal-ink`}>
                {metrics.seller.inquiryResponseRate}%
              </dd>
            </div>
          </dl>
        : <div className={compact ? "mt-3" : "mt-4"}>
            <SellerMetricsStrip
              rating={metrics.rating}
              reviewCount={metrics.reviewCount}
              seller={metrics.seller}
              variant={compact ? "compact" : "full"}
            />
          </div>
        }

        {summary ?
          <div className="mt-2.5 grid grid-cols-3 gap-1.5">
            <FollowSellerButton
              className="!min-h-[40px] !h-10 !min-w-0 !px-2 !text-[11px]"
              compact
              isLoggedIn={isLoggedIn}
              loginNext={loginNext}
              seller={metrics.seller}
            />
            <Link
              className={`${ui.btnOutline} !min-h-[40px] !h-10 !min-w-0 !px-2 !text-[11px] font-medium`}
              href={sellerProductsHref}
            >
              상품 보기
            </Link>
            {profileHref ?
              <Link
                className={`${ui.btnOutline} !min-h-[40px] !h-10 !min-w-0 !px-2 !text-[11px] font-medium`}
                href={profileHref}
              >
                자세히 보기
              </Link>
            : <button
                className={`${ui.btnOutline} !min-h-[40px] !h-10 !min-w-0 !px-2 !text-[11px] font-medium`}
                onClick={openDetail}
                type="button"
              >
                자세히 보기
              </button>
            }
          </div>
        : null}

        {!summary && compact ?
          <div className="mt-3 flex gap-2">
            <FollowSellerButton
              compact
              isLoggedIn={isLoggedIn}
              loginNext={loginNext}
              seller={metrics.seller}
            />
            {profileHref ?
              <Link
                className={`${ui.btnOutline} h-9 flex-1 text-[12px]`}
                href={profileHref}
              >
                판매자 프로필
              </Link>
            : <button
                className={`${ui.btnOutline} h-9 flex-1 cursor-pointer text-[12px]`}
                onClick={openDetail}
                type="button"
              >
                판매자 정보
              </button>
            }
          </div>
        : !summary && !compact ?
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <FollowSellerButton
                compact
                isLoggedIn={isLoggedIn}
                loginNext={loginNext}
                seller={metrics.seller}
              />
              {profileHref ?
                <Link
                  className={`${ui.btnOutline} h-10 text-[12px]`}
                  href={profileHref}
                >
                  판매자 프로필
                </Link>
              : <button
                  className={`${ui.btnOutline} h-10 cursor-pointer text-[12px]`}
                  onClick={openDetail}
                  type="button"
                >
                  판매자 정보
                </button>
              }
            </div>
          : null}
      </section>

      <SellerDetailModal onClose={closeDetail} open={modalOpen} view={view} />
    </>
  );
}
