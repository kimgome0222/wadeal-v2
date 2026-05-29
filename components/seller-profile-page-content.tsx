"use client";

import Link from "next/link";

import { FollowSellerButton } from "@/components/follow-seller-button";
import { SellerFeaturedProductsRail } from "@/components/seller-featured-products-rail";
import { SellerProfileAllProducts } from "@/components/seller-profile-all-products";
import { SellerProfileBanner } from "@/components/seller-profile-banner";
import { SellerProfileReviewsSection } from "@/components/seller-profile-reviews-section";
import type { SellerProfileReviewItem } from "@/components/seller-profile-reviews-section";
import { SellerProfileSectionNav } from "@/components/seller-profile-section-nav";
import { SellerProfileStickyCta } from "@/components/seller-profile-sticky-cta";
import { SellerProfileTrustCard } from "@/components/seller-profile-trust-card";
import { SellerStorySection } from "@/components/seller-story-section";
import type { SellerDetailViewModel } from "@/lib/sellers/build-seller-detail-view";
import type { Deal } from "@/lib/deals";
import { getProductDetailHref } from "@/lib/deals/card-display";
import { ds } from "@/lib/design-system";
import { buildSellerTrustProfile } from "@/lib/sellers/seller-trust-profile";
import { getMockSellerReviews } from "@/lib/sellers/seller-reviews";
import { ui } from "@/lib/ui";

type SellerProfilePageContentProps = {
  view: SellerDetailViewModel;
  sellerDeals: Deal[];
  isLoggedIn: boolean;
};

function enrichSellerReviews(
  deals: Deal[],
  profile: ReturnType<typeof buildSellerTrustProfile>,
): SellerProfileReviewItem[] {
  return getMockSellerReviews(profile, 6).map((review, index) => ({
    ...review,
    photoUrl:
      index % 2 === 0 && deals.length > 0 ?
        deals[index % deals.length]?.imageUrl
      : undefined,
    isVerifiedPurchase: true,
    isBest: index === 0,
  }));
}

export function SellerProfilePageContent({
  view,
  sellerDeals,
  isLoggedIn,
}: SellerProfilePageContentProps) {
  const { metrics, featuredProducts } = view;
  const storyDeal = sellerDeals[0];
  const trustProfile = storyDeal ? buildSellerTrustProfile(storyDeal) : null;
  const sellerReviews = trustProfile ? enrichSellerReviews(sellerDeals, trustProfile) : [];

  const dealBySlug = new Map(sellerDeals.map((deal) => [deal.slug, deal]));

  const inquiryHref =
    storyDeal ?
      `${getProductDetailHref(storyDeal)}#product-qna`
    : "/support";

  return (
    <>
      <div className={`${ds.page.sectionGap} pb-[calc(5rem+env(safe-area-inset-bottom))]`}>
        {/* 1. 상단 배너 */}
        <SellerProfileBanner metrics={metrics} />

        {/* 2. 신뢰 지표 */}
        <SellerProfileTrustCard metrics={metrics} />

        {/* 7. 상단 CTA (배너 아래) */}
        <div className="grid grid-cols-3 gap-1.5">
          <FollowSellerButton
            className="!h-9 !min-w-0 !px-2 !text-[11px]"
            compact
            isLoggedIn={isLoggedIn}
            seller={metrics.seller}
          />
          <Link
            className={`${ui.btnOutline} flex h-9 items-center justify-center px-2 text-[11px] font-medium`}
            href="#seller-products"
          >
            상품 보기
          </Link>
          <Link
            className={`${ui.btnOutline} flex h-9 items-center justify-center px-2 text-[11px] font-medium`}
            href={inquiryHref}
          >
            문의하기
          </Link>
        </div>

        <SellerProfileSectionNav
          hasFeatured={featuredProducts.length > 0}
          hasReviews={sellerReviews.length > 0}
          hasStory={!!storyDeal}
        />

        {/* 3. 대표 상품 */}
        {featuredProducts.length > 0 ?
          <section
            className="scroll-mt-28 rounded-xl border border-[#DDE8E2] bg-white p-4"
            id="seller-featured"
          >
            <SellerFeaturedProductsRail
              maxItems={6}
              minItems={3}
              dealBySlug={dealBySlug}
              products={featuredProducts}
            />
          </section>
        : null}

        {/* 4. 전체 상품 */}
        <SellerProfileAllProducts deals={sellerDeals} />

        {/* 5. 판매자 리뷰 */}
        {trustProfile ?
          <SellerProfileReviewsSection
            reviews={sellerReviews}
            sellerName={trustProfile.sellerName}
          />
        : null}

        {/* 6. 판매자 스토리 — 기본 접힘 */}
        {storyDeal ?
          <SellerStorySection deal={storyDeal} />
        : null}

        {/* 문의 안내 */}
        <section
          className="scroll-mt-28 rounded-xl border border-[#DDE8E2] bg-white p-4"
          id="seller-inquiry"
        >
          <h2 className={`${ds.type.h2} font-semibold`}>판매자 문의</h2>
          <p className={`mt-1.5 ${ds.type.caption} leading-relaxed`}>
            상품 페이지에서 문의를 남기면 판매자가 확인해요. 긴급한 문의는 고객센터를 이용해
            주세요.
          </p>
          <Link
            className={`${ui.btnOutline} mt-3 flex h-10 w-full items-center justify-center text-[12px] font-medium`}
            href={inquiryHref}
          >
            문의하기
          </Link>
        </section>
      </div>

      <SellerProfileStickyCta
        inquiryHref={inquiryHref}
        isLoggedIn={isLoggedIn}
        seller={metrics.seller}
      />
    </>
  );
}
