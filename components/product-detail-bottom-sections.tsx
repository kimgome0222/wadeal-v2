import { ProductQASection } from "@/components/product-qa-section";
import { ProductRecentlyViewedSection } from "@/components/product-recently-viewed-section";
import { SellerReviewsListSection } from "@/components/seller-reviews-list-section";
import { SellerOtherProductsSection } from "@/components/seller-other-products-section";
import { SellerSatisfactionSection } from "@/components/seller-satisfaction-section";
import { SimilarProductsSection } from "@/components/similar-products-section";
import type { ReviewSummary } from "@/lib/data/reviews";
import type { Deal } from "@/lib/deals";
import type { ProductQuestionItem } from "@/lib/data/product-questions";
import { buildSellerSatisfaction } from "@/lib/sellers/satisfaction";
import { getMockSellerReviews } from "@/lib/sellers/seller-reviews";
import { buildSellerTrustProfile } from "@/lib/sellers/seller-trust-profile";
import { ds } from "@/lib/design-system";

type ProductDetailBottomSectionsProps = {
  deal: Deal;
  reviewSummary: ReviewSummary;
  questions: ProductQuestionItem[];
  isLoggedIn: boolean;
  catalog: Deal[];
};

/** 하단: 판매자 만족도 → 판매자 리뷰 → 다른 상품 → 문의 (+ 비슷한·최근 본) */
export function ProductDetailBottomSections({
  deal,
  reviewSummary,
  questions,
  isLoggedIn,
  catalog,
}: ProductDetailBottomSectionsProps) {
  const profile = buildSellerTrustProfile(deal, reviewSummary);
  const satisfaction = buildSellerSatisfaction({
    name: profile.sellerName,
    rating: profile.rating,
    reviewCount: profile.reviewCount,
  });
  const sellerReviews = getMockSellerReviews(profile, 6);

  return (
    <div className={`${ds.page.sectionGap} pb-2`}>
      <SellerSatisfactionSection
        satisfaction={satisfaction}
        sellerName={profile.sellerName}
        sellerRating={profile.rating.toFixed(1)}
      />

      <SellerReviewsListSection
        reviews={sellerReviews}
        sellerName={profile.sellerName}
      />

      <SellerOtherProductsSection deal={deal} />

      <div className="scroll-mt-28" id="product-qna">
        <h2 className={`${ds.type.h2} font-semibold`}>Q&amp;A</h2>
        <p className={`mt-0.5 mb-3 ${ds.type.caption}`}>
          상품에 대한 궁금한 점을 남겨주세요.
        </p>
        <ProductQASection
          isLoggedIn={isLoggedIn}
          productId={deal.slug}
          productName={deal.title}
          questions={questions}
        />
      </div>

      <SimilarProductsSection catalog={catalog} deal={deal} />

      <ProductRecentlyViewedSection excludeSlug={deal.slug} />
    </div>
  );
}
