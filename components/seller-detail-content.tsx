"use client";

import Link from "next/link";

import { FollowSellerButton } from "@/components/follow-seller-button";
import { SellerFeaturedProductsRail } from "@/components/seller-featured-products-rail";
import { SellerProfileAvatar } from "@/components/seller-profile-avatar";
import { SellerStatsGrid } from "@/components/seller-stats-grid";
import { SellerTrustBadges } from "@/components/seller-trust-badges";
import { SellerTrustScore } from "@/components/seller-trust-score";
import { SellerVerifiedChip } from "@/components/seller-verified-chip";
import type { SellerDetailViewModel } from "@/lib/sellers/build-seller-detail-view";
import { getSellerSearchHref } from "@/lib/sellers/routes";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";
import { ui } from "@/lib/ui";

type SellerDetailContentProps = {
  view: SellerDetailViewModel;
  /** 모달 닫기 등 네비게이션 직전 콜백 */
  onBeforeNavigate?: () => void;
  /** modal: 헤더·닫기 없음(모달 shell 담당) / page: 페이지용 헤더 포함 */
  variant?: "modal" | "page";
  titleId?: string;
};

export function SellerDetailContent({
  view,
  onBeforeNavigate,
  variant = "modal",
  titleId = "seller-detail-title",
}: SellerDetailContentProps) {
  const { metrics, satisfaction, categories, featuredProducts } = view;

  const handleNavigate = () => {
    onBeforeNavigate?.();
  };

  return (
    <>
      {variant === "page" ?
        <header className="space-y-1">
          <p className="text-[11px] font-bold tracking-[0.1em] text-wadeal-red/80">
            {SELLER_UI_COPY.infoTitle}
          </p>
          <p className="text-xs font-medium text-wadeal-muted">{SELLER_UI_COPY.detailHint}</p>
        </header>
      : null}

      <div className={`flex items-start gap-3 ${variant === "page" ? "mt-5" : "mt-4"}`}>
        <SellerProfileAvatar name={metrics.seller.name} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-black text-wadeal-ink" id={titleId}>
              {metrics.seller.name}
            </h2>
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
      </div>

        <SellerTrustBadges badges={metrics.seller.badges} cardPriority className="mt-4" limit={6} />

        <SellerTrustScore metrics={metrics} />

        <div className="mt-4">
        <SellerStatsGrid
          rating={metrics.rating}
          reviewCount={metrics.reviewCount}
          seller={metrics.seller}
        />
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-bold text-wadeal-muted">주요 판매 카테고리</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {categories.map((category) => (
            <span
              className="rounded-full border border-wadeal-line bg-wadeal-surface px-2.5 py-1 text-[10px] font-semibold text-wadeal-ink"
              key={category}
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <SellerFeaturedProductsRail
          maxItems={variant === "modal" ? 3 : 6}
          onNavigate={handleNavigate}
          products={featuredProducts}
          title="대표 상품"
        />
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-[11px] font-bold text-wadeal-muted">{SELLER_UI_COPY.satisfactionTitle}</p>
        <dl className="grid grid-cols-3 gap-2 text-[10px] font-bold text-wadeal-muted">
          <div className="rounded-lg bg-wadeal-surface px-2 py-2 text-center">
            <dt>응답</dt>
            <dd className="mt-0.5 font-black text-wadeal-ink">
              {satisfaction.responseSatisfaction}%
            </dd>
          </div>
          <div className="rounded-lg bg-wadeal-surface px-2 py-2 text-center">
            <dt>배송</dt>
            <dd className="mt-0.5 font-black text-wadeal-ink">
              {satisfaction.shippingSatisfaction}%
            </dd>
          </div>
          <div className="rounded-lg bg-wadeal-surface px-2 py-2 text-center">
            <dt>설명 일치</dt>
            <dd className="mt-0.5 font-black text-wadeal-ink">
              {satisfaction.descriptionAccuracy}%
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-[11px] font-bold text-wadeal-muted">{SELLER_UI_COPY.reviewsTitle}</p>
        {satisfaction.recentReviews.map((review) => (
          <article
            className="rounded-xl border border-wadeal-line bg-wadeal-surface/50 px-3 py-2.5"
            key={review.id}
          >
            <p className="text-[11px] font-bold text-wadeal-coral">★ {review.rating.toFixed(1)}</p>
            <p className="mt-1 text-xs font-medium leading-relaxed text-wadeal-muted">
              {review.comment}
            </p>
          </article>
        ))}
      </div>

        <div className="mt-5 grid grid-cols-1 gap-2">
          <FollowSellerButton seller={metrics.seller} />
          <Link
          className={`${ui.btnPrimary} h-10 text-[13px]`}
          href={getSellerSearchHref(metrics.seller)}
          onClick={handleNavigate}
        >
          {SELLER_UI_COPY.moreProducts}
        </Link>
      </div>
    </>
  );
}
