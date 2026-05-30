"use client";

import Link from "next/link";

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
      className="mt-6 rounded-[16px] border border-[#E8ECEA] bg-[#F5F7F6] p-3.5"
      id="seller-info"
    >
      <p className="truncate text-[15px] font-semibold text-[#111111]">{metrics.seller.name}</p>

      <p className="mt-2 text-[12px] text-[#666666]">
        ⭐ {metrics.rating} · 📦 {metrics.seller.totalSales.toLocaleString("ko-KR")}건 · 💬 후기{" "}
        {reviewCount.toLocaleString("ko-KR")}개
      </p>

      {profileHref ?
        <Link
          className="mt-3 flex h-11 w-full items-center justify-center rounded-[14px] bg-[#2E5E4E] text-[14px] font-semibold text-white active:scale-[0.99]"
          href={profileHref}
        >
          판매자관 보기
        </Link>
      : null}
    </section>
  );
}
