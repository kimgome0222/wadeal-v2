import { headers } from "next/headers";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CartSheetCatalogSync } from "@/components/cart/cart-sheet-catalog-sync";
import { ProductDetailAnchorScroll } from "@/components/product-detail-anchor-scroll";
import { ProductDetailBottomSections } from "@/components/product-detail-bottom-sections";
import { ProductDetailSectionNav } from "@/components/product-detail-section-nav";
import { ProductDetailVisualSection } from "@/components/product-detail-visual-section";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { ProductReviewsSection } from "@/components/product-reviews-section";
import { ProductSummaryPanel } from "@/components/product-summary-panel";
import { ProductViewTracker } from "@/components/product-view-tracker";
import { ProductDetailInfoTable } from "@/components/product/product-detail-info-table";
import { ProductDetailHeaderWithCart } from "@/components/product/product-detail-header-with-cart";
import { ProductDetailPurchaseBar } from "@/components/product/product-detail-purchase-bar";
import { ProductDetailSellerCard } from "@/components/product/product-detail-seller-card";
import { ProductDetailShippingSummary } from "@/components/product/product-detail-shipping-summary";
import { ProductInquirySection } from "@/components/product/product-inquiry-section";
import { ProductWhySellerSection } from "@/components/product/product-why-seller-section";
import { getUserOrderForProduct } from "@/lib/data/orders";
import { canWriteReview } from "@/lib/orders/shipping-status";
import {
  buildReviewSummary,
  getReviewsByProductId,
  userHasReviewForProduct,
} from "@/lib/data/reviews";
import { getUserReportedReviewIds } from "@/lib/data/review-reports";
import { getReviewLikeSnapshot } from "@/lib/data/review-likes";
import { getAllActiveDeals, getDealById, getPriceTiersByDealId } from "@/lib/data";
import { getJoinCartForUser } from "@/lib/data/join-cart";
import { isDealSavedByUser } from "@/lib/data/saved-deals";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getProductQuestionsForDisplay } from "@/lib/data/product-questions";
import { getcellohDataSource, logPageDataSource } from "@/lib/data/source";
import { buildProductMetadata } from "@/lib/seo/site";
import {
  extractClientIp,
  getOrCreateReferralCode,
  hashIpAddress,
  logReferralVisit,
} from "@/lib/share";
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

  const user = await getServerAuthUser();

  const [reviews, catalog, tiers, cartItems] = await Promise.all([
    getReviewsByProductId(deal.slug),
    getAllActiveDeals(),
    getPriceTiersByDealId(deal.slug),
    user ? getJoinCartForUser(user.id) : Promise.resolve([]),
  ]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
    <>
      <CartSheetCatalogSync catalog={catalog} />
      <main className={`${ui.pageWrap} bg-white pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]`}>
      <ProductViewTracker deal={deal} isLoggedIn={!!user} />
      <ProductDetailAnchorScroll />
      <ProductDetailHeaderWithCart backHref="back" serverCartCount={cartCount} />

      <ProductImageGallery deal={deal} />

      <ProductSummaryPanel
        deal={deal}
        initialSaved={isSaved}
        reviewSummary={reviewSummary}
      />

      <div className={`${ui.pageBody} !pt-0`}>
        <ProductDetailShippingSummary deal={deal} />

        <ProductDetailPurchaseBar deal={deal} initialSaved={isSaved} tiers={tiers} />

        <ProductDetailSellerCard
          deal={deal}
          reviewSummary={reviewSummary}
        />

        <ProductWhySellerSection />
      </div>

      <section className={`${ui.pageBody} space-y-0`}>
        <ProductDetailSectionNav
          qnaCount={questions.length}
          reviewCount={reviewSummary.totalCount}
        />

        <ProductDetailVisualSection deal={deal} />

        <ProductDetailInfoTable deal={deal} />

        <ProductReviewsSection
          canWriteReview={canWriteReviewFlag}
          currentUserId={user?.id ?? null}
          deal={deal}
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

        <ProductInquirySection
          isLoggedIn={!!user}
          productId={deal.slug}
          productName={deal.title}
          questions={questions}
        />

        <ProductDetailBottomSections catalog={catalog} deal={deal} />
      </section>
      </main>
    </>
  );
}
