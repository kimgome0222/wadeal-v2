import { ProductQASection } from "@/components/product-qa-section";
import { ProductRecentlyViewedSection } from "@/components/product-recently-viewed-section";
import { ProductDetailSellerReviewsGroup } from "@/components/product-detail-seller-reviews-group";
import { SimilarProductsSection } from "@/components/similar-products-section";
import type { ReviewSummary } from "@/lib/data/reviews";
import type { Deal } from "@/lib/deals";
import type { ProductQuestionItem } from "@/lib/data/product-questions";
import { ds } from "@/lib/design-system";

type ProductDetailBottomSectionsProps = {
  deal: Deal;
  reviewSummary: ReviewSummary;
  questions: ProductQuestionItem[];
  isLoggedIn: boolean;
  catalog: Deal[];
  includeSellerReviews?: boolean;
};

/** 하단: (판매자 리뷰) → 문의 → 같은 판매자·비슷한 상품 → 최근 본 (섹션 간 mt-6) */
export function ProductDetailBottomSections({
  deal,
  reviewSummary,
  questions,
  isLoggedIn,
  catalog,
  includeSellerReviews = true,
}: ProductDetailBottomSectionsProps) {
  return (
    <div className="mt-6 space-y-6 pb-2">
      {includeSellerReviews ?
        <ProductDetailSellerReviewsGroup deal={deal} reviewSummary={reviewSummary} />
      : null}

      <div className="scroll-mt-28" id="product-qna">
        <h2 className={ds.type.h2}>Q&amp;A</h2>
        <p className={`mt-1 mb-3 ${ds.type.caption}`}>
          상품에 대한 궁금한 점을 남겨주세요.
        </p>
        <ProductQASection
          compactEmpty
          isLoggedIn={isLoggedIn}
          productId={deal.slug}
          productName={deal.title}
          questions={questions}
        />
      </div>

      <SimilarProductsSection catalog={catalog} deal={deal} maxItems={4} />

      <ProductRecentlyViewedSection
        catalog={catalog}
        excludeSlug={deal.slug}
        maxItems={4}
      />
    </div>
  );
}
