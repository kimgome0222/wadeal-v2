"use client";

import Link from "next/link";

import { FollowSellerButton } from "@/components/follow-seller-button";
import { useSellerDetailInteraction } from "@/components/use-seller-detail-interaction";
import type { ReviewSummary } from "@/lib/data/reviews";
import type { Deal } from "@/lib/deals";
import { getSellerPublicProfileHref, isSellerPublicProfileEnabled } from "@/lib/sellers/routes";

type ProductDetailSellerCardProps = {
  deal: Deal;
  reviewSummary: ReviewSummary;
  isLoggedIn?: boolean;
  loginNext?: string;
};

export function ProductDetailSellerCard({
  deal,
  reviewSummary,
  isLoggedIn = false,
  loginNext,
}: ProductDetailSellerCardProps) {
  const { view } = useSellerDetailInteraction({ deal, reviewSummary });
  const { metrics } = view;
  const profileHref =
    isSellerPublicProfileEnabled() ?
      getSellerPublicProfileHref(metrics.seller)
    : null;

  const reviewCount =
    reviewSummary.totalCount > 0 ?
      reviewSummary.totalCount
    : metrics.reviewCount;

  return (
    <section
      aria-label="판매자 정보"
      className="mt-8 rounded-[20px] border border-[#E8ECEA] bg-[#F5F7F6] p-4"
      id="seller-info"
    >
      <div className="space-y-1">
        <p className="truncate text-[16px] font-semibold text-[#111111]">{metrics.seller.name}</p>
        <p className="line-clamp-2 text-[13px] font-medium leading-snug text-[#666666]">
          {metrics.seller.tagline}
        </p>
      </div>

      <div className="mt-3 space-y-1 text-[13px] text-[#666666]">
        <p>⭐ {metrics.rating}</p>
        <p>📦 {metrics.seller.totalSales.toLocaleString("ko-KR")}건 판매</p>
        <p>💬 후기 {reviewCount.toLocaleString("ko-KR")}개</p>
      </div>

      <div className="mt-4 flex gap-2">
        {profileHref ?
          <Link
            className="flex h-11 flex-1 items-center justify-center rounded-[14px] bg-[#2E5E4E] text-[14px] font-semibold text-white active:scale-[0.99]"
            href={profileHref}
          >
            판매자관 보기
          </Link>
        : null}
        <FollowSellerButton
          className="!h-11 !min-h-[44px] !flex-1 !rounded-[14px] !text-[14px]"
          compact
          isLoggedIn={isLoggedIn}
          loginNext={loginNext}
          seller={metrics.seller}
        />
      </div>
    </section>
  );
}
