"use client";

import { ProductInquirySection } from "@/components/product/product-inquiry-section";
import { SellerProfileActions } from "@/components/seller/seller-profile-actions";
import { SellerProfileAllProducts } from "@/components/seller-profile-all-products";
import { SellerProfileCover } from "@/components/seller/seller-profile-cover";
import { SellerProfileDealsSection } from "@/components/seller/seller-profile-deals-section";
import { SellerProfileHeader } from "@/components/seller/seller-profile-header";
import { SellerProfileProductReviews } from "@/components/seller/seller-profile-product-reviews";
import { SellerProfileServiceReviews } from "@/components/seller/seller-profile-service-reviews";
import { SellerProfileBadges } from "@/components/seller/seller-profile-badges";
import { SellerProfileStats } from "@/components/seller/seller-profile-stats";
import { SellerProfileTrustPanel } from "@/components/seller/seller-profile-trust-panel";
import { SellerProfileStoriesCompact } from "@/components/seller/seller-profile-stories-compact";
import type { ProductQuestionItem } from "@/lib/data/product-questions";
import { getProductDetailHref } from "@/lib/deals/card-display";
import type { SellerProfileViewModel } from "@/lib/sellers/build-seller-profile-view";
import { getShowcaseSellerStory } from "@/lib/sellers/showcase-seller-profiles";

type SellerProfilePageContentProps = {
  view: SellerProfileViewModel;
  isLoggedIn: boolean;
  questions: ProductQuestionItem[];
};

export function SellerProfilePageContent({
  view,
  isLoggedIn,
  questions,
}: SellerProfilePageContentProps) {
  const { profile } = view;
  const sellerStory = getShowcaseSellerStory(profile.id);
  const anchorDeal = view.allDeals[0];
  const inquiryHref = anchorDeal ?
    `${getProductDetailHref(anchorDeal)}#product-qna`
  : "#seller-inquiry";

  return (
    <div className="space-y-5 pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]">
      <SellerProfileCover imageUrl={view.coverImageUrl} sellerName={profile.name} />

      <SellerProfileHeader
        name={profile.name}
        regionLabel={view.regionLabel}
        tagline={profile.tagline}
      />

      <SellerProfileStats
        rating={view.rating}
        reviewCount={view.reviewCount}
        totalSales={view.totalSales}
      />

      <SellerProfileBadges badges={profile.badges} />

      <SellerProfileTrustPanel profile={profile} />

      <SellerProfileActions
        inquiryHref={inquiryHref}
        isLoggedIn={isLoggedIn}
        seller={profile}
      />

      <SellerProfileDealsSection
        deals={view.featuredDeals}
        id="seller-featured"
        title="대표 상품"
      />

      <SellerProfileAllProducts deals={view.allDeals} />

      <section className="space-y-2 px-6">
        <h2 className="text-[18px] font-bold text-[#111111]">판매자 소개</h2>
        <p className="text-[14px] leading-relaxed text-[#666666]">{profile.tagline}</p>
        {sellerStory ?
          <p className="text-[14px] leading-relaxed text-[#444444]">{sellerStory}</p>
        : null}
        {view.regionLabel ?
          <p className="text-[12px] text-[#666666]">{view.regionLabel}</p>
        : null}
      </section>

      <SellerProfileStoriesCompact stories={view.stories} />

      <SellerProfileProductReviews
        anchorProductId={anchorDeal?.slug ?? profile.featuredProductSlug}
        compactEmpty
        photoThumbnails={view.photoThumbnails}
        productReviews={view.productReviews}
        reviewSummary={view.reviewSummary}
        sellerName={profile.name}
      />

      <SellerProfileServiceReviews
        compactEmpty
        reviews={view.sellerServiceReviews}
        sellerName={profile.name}
      />

      {anchorDeal ?
        <div className="px-6">
          <ProductInquirySection
            isLoggedIn={isLoggedIn}
            productId={anchorDeal.slug}
            productName={anchorDeal.title}
            questions={questions}
          />
        </div>
      : null}
    </div>
  );
}
