"use client";

import { HomeSellerStoriesSection } from "@/components/home/home-seller-stories-section";
import { ProductInquirySection } from "@/components/product/product-inquiry-section";
import { SellerProfileActions } from "@/components/seller/seller-profile-actions";
import { SellerProfileAllProducts } from "@/components/seller-profile-all-products";
import { SellerProfileCover } from "@/components/seller/seller-profile-cover";
import { SellerProfileDealsSection } from "@/components/seller/seller-profile-deals-section";
import { SellerProfileHeader } from "@/components/seller/seller-profile-header";
import { SellerProfileProductReviews } from "@/components/seller/seller-profile-product-reviews";
import { SellerProfileServiceReviews } from "@/components/seller/seller-profile-service-reviews";
import { SellerProfileStats } from "@/components/seller/seller-profile-stats";
import type { ProductQuestionItem } from "@/lib/data/product-questions";
import { getProductDetailHref } from "@/lib/deals/card-display";
import type { SellerProfileViewModel } from "@/lib/sellers/build-seller-profile-view";

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
  const anchorDeal = view.allDeals[0];
  const inquiryHref = anchorDeal ?
    `${getProductDetailHref(anchorDeal)}#product-qna`
  : "#seller-inquiry";

  return (
    <div className="space-y-6 pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]">
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

      <SellerProfileDealsSection deals={view.popularDeals} title="인기 상품" />

      <SellerProfileAllProducts deals={view.allDeals} />

      {view.stories.length > 0 ?
        <div className="px-6">
          <HomeSellerStoriesSection stories={view.stories} />
        </div>
      : null}

      <SellerProfileProductReviews
        anchorProductId={anchorDeal?.slug ?? profile.featuredProductSlug}
        photoThumbnails={view.photoThumbnails}
        productReviews={view.productReviews}
        reviewSummary={view.reviewSummary}
        sellerName={profile.name}
      />

      <SellerProfileServiceReviews
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
