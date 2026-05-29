import { headers } from "next/headers";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailAnchorScroll } from "@/components/product-detail-anchor-scroll";
import { ProductDetailBottomSections } from "@/components/product-detail-bottom-sections";
import { ProductDetailCTA } from "@/components/product-detail-cta";
import { ProductDetailHighlights } from "@/components/product-detail-highlights";
import { ProductDetailSectionNav } from "@/components/product-detail-section-nav";
import { ProductDetailVisualSection } from "@/components/product-detail-visual-section";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { ProductReviewsSection } from "@/components/product-reviews-section";
import { ProductShippingInfoBlock } from "@/components/product-shipping-info";
import { ProductSellerPanel } from "@/components/product-seller-panel";
import { ProductSummaryPanel } from "@/components/product-summary-panel";
import { ProductViewTracker } from "@/components/product-view-tracker";
import { SellerStorySection } from "@/components/seller-story-section";
import { SubHeader } from "@/components/sub-header";
import { getUserOrderForProduct } from "@/lib/data/orders";
import { canWriteReview } from "@/lib/orders/shipping-status";
import {
  buildReviewSummary,
  getReviewsByProductId,
  userHasReviewForProduct,
} from "@/lib/data/reviews";
import { getUserReportedReviewIds } from "@/lib/data/review-reports";
import { getReviewLikeSnapshot } from "@/lib/data/review-likes";
import { getAllActiveDeals, getDealById } from "@/lib/data";
import { isDealSavedByUser } from "@/lib/data/saved-deals";
import { getProductDetailHref } from "@/lib/deals/card-display";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getProductQuestionsForDisplay } from "@/lib/data/product-questions";
import { getcellohDataSource, logPageDataSource } from "@/lib/data/source";
import { buildProductMetadata } from "@/lib/seo/site";
import {
  buildShareMessageContent,
  extractClientIp,
  getOrCreateReferralCode,
  hashIpAddress,
  logReferralVisit,
} from "@/lib/share";
import { ds } from "@/lib/design-system";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ review?: string; ref?: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const deal = await getDealById(id);

  if (!deal) {
    return {
      title: "상품을 찾을 수 없어요",
      robots: { index: false, follow: false },
    };
  }

  return buildProductMetadata(deal);
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { id } = await params;
  const { review, ref } = await searchParams;
  const deal = await getDealById(id);

  if (!deal) {
    notFound();
  }

  const [user, reviews, catalog] = await Promise.all([
    getServerAuthUser(),
    getReviewsByProductId(deal.slug),
    getAllActiveDeals(),
  ]);

  const reviewSummary = buildReviewSummary(reviews);

  const [order, hasWrittenReview, reportedReviewIds, likeSnapshot, isSaved] =
    await Promise.all([
    user ? getUserOrderForProduct(user.id, deal.slug) : Promise.resolve(null),
    user ? userHasReviewForProduct(user.id, deal.slug) : Promise.resolve(false),
    user ?
      getUserReportedReviewIds(
        user.id,
        reviews.map((item) => item.id),
      )
    : Promise.resolve([]),
    getReviewLikeSnapshot(
      reviews.map((item) => item.id),
      user?.id ?? null,
    ),
    user ? isDealSavedByUser(user.id, deal.slug) : Promise.resolve(false),
  ]);

  const canWriteReviewFlag =
    order != null && canWriteReview(order) && !hasWrittenReview;

  logPageDataSource(`/product/${id}`, getcellohDataSource() ?? "unconfigured");

  const referralCode = user ? await getOrCreateReferralCode(user.id) : null;
  const shareContent = buildShareMessageContent(deal, referralCode);

  if (ref?.trim()) {
    const headerStore = await headers();
    await logReferralVisit({
      referralCode: ref.trim(),
      productSlug: deal.slug,
      visitorUserId: user?.id ?? null,
      ipHash: hashIpAddress(extractClientIp(headerStore.get("x-forwarded-for"))),
      userAgent: headerStore.get("user-agent"),
    });
  }

  const questions = await getProductQuestionsForDisplay(deal.slug);

  return (
    <main className={`${ui.pageWrap} pb-[calc(5.5rem+env(safe-area-inset-bottom))] bg-white`}>
      <ProductViewTracker deal={deal} isLoggedIn={!!user} />
      <ProductDetailAnchorScroll />
      <SubHeader backHref="/" title="상품 상세" />

      {/* 1. 상품 이미지 */}
      <ProductImageGallery deal={deal} />

      {/* 2–6. 상품명 · 평점 · 가격 · 구매 · 찜 */}
      <ProductSummaryPanel
        deal={deal}
        initialSaved={isSaved}
        reviewSummary={reviewSummary}
      />

      {/* 6. compact 판매자 정보 */}
      <div className={`${ui.pageBody} !py-2`}>
        <ProductSellerPanel
          deal={deal}
          isLoggedIn={!!user}
          loginNext={getProductDetailHref(deal)}
          reviewSummary={reviewSummary}
          summary
        />
      </div>

      {/* 7. 상품 상세 이미지 */}
      <ProductDetailVisualSection deal={deal} />

      {/* 판매자 스토리 — 기본 접힘 */}
      <div className={`${ui.pageBody} !py-2`}>
        <SellerStorySection deal={deal} />
      </div>

      <section className={`${ui.pageBody} ${ds.section.detail} border-t border-[#DDE8E2] pt-4`}>
        <ProductDetailSectionNav
          qnaCount={questions.length}
          reviewCount={reviewSummary.totalCount}
        />

        {/* 10. 상품 핵심 정보 */}
        <ProductDetailHighlights deal={deal} />

        {/* 11–12. 배송 · 교환/환불 */}
        <ProductShippingInfoBlock />

        {/* 13. 상품 리뷰 */}
        <ProductReviewsSection
          canWriteReview={canWriteReviewFlag}
          currentUserId={user?.id ?? null}
          hasWrittenReview={hasWrittenReview}
          initialLikeCounts={likeSnapshot.counts}
          initialLikedReviewIds={likeSnapshot.likedReviewIds}
          openFormInitially={review === "true"}
          order={order}
          productId={deal.slug}
          productName={deal.title}
          reportedReviewIds={reportedReviewIds}
          reviews={reviews}
          summary={reviewSummary}
        />

        {/* 14–17. 판매자 만족도 · 판매자 리뷰 · 다른 상품 · 문의 */}
        <ProductDetailBottomSections
          catalog={catalog}
          deal={deal}
          isLoggedIn={!!user}
          questions={questions}
          reviewSummary={reviewSummary}
        />
      </section>

      <ProductDetailCTA
        deal={deal}
        initialSaved={isSaved}
        referralCode={referralCode}
        shareContent={shareContent}
      />
    </main>
  );
}
