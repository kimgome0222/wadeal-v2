import type { ReactNode } from "react";
import Link from "next/link";

import { ProductSellerReviewsSection } from "@/components/product-seller-reviews-section";
import { SellerOtherProductsSection } from "@/components/seller-other-products-section";
import type { ReviewSummary } from "@/lib/data/reviews";
import type { Deal } from "@/lib/deals";
import { ui } from "@/lib/ui";

type ProductDetailBottomSectionsProps = {
  deal: Deal;
  reviewSummary: ReviewSummary;
  /** 문의 탭(#product-qna)으로 안내 — 전체 Q&A UI는 탭에서만 렌더 */
  qnaCount: number;
};

/** 상품 상세 하단: 다른 상품 → 판매자 만족/리뷰 → 문의 안내 */
export function ProductDetailBottomSections({
  deal,
  reviewSummary,
  qnaCount,
}: ProductDetailBottomSectionsProps) {
  return (
    <div className="space-y-4 pb-2">
      <SellerOtherProductsSection deal={deal} />
      <ProductSellerReviewsSection deal={deal} reviewSummary={reviewSummary} />
      <section className={`${ui.card} scroll-mt-24 space-y-3 p-4`} id="product-detail-qna">
        <div>
          <h2 className={ui.sectionTitleAccent}>상품 문의</h2>
          <p className="mt-1 text-xs font-medium text-wadeal-muted">
            배송·옵션·교환 등 궁금한 점을 판매자에게 문의하세요.
          </p>
        </div>
        <Link className={`${ui.btnOutline} inline-flex h-10 items-center justify-center px-4 text-[13px]`} href="#product-qna">
          {qnaCount > 0 ? `문의 ${qnaCount}건 · 탭에서 보기` : "문의 작성 · 탭에서 보기"}
        </Link>
      </section>
    </div>
  );
}
