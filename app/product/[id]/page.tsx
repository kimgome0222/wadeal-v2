import { headers } from "next/headers";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailBottomSections } from "@/components/product-detail-bottom-sections";
import { ProductDetailCTA } from "@/components/product-detail-cta";
import { ProductQASection } from "@/components/product-qa-section";
import { ProductDetailSection } from "@/components/product-detail-section";
import { ProductDetailTabs } from "@/components/product-detail-tabs";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { ProductInviteSection } from "@/components/product-invite-section";
import { ProductReviewsSection } from "@/components/product-reviews-section";
import { ProductShippingInfo } from "@/components/product-shipping-info";
import { ProductSummaryPanel } from "@/components/product-summary-panel";
import { ProductViewTracker } from "@/components/product-view-tracker";
import { SubHeader } from "@/components/sub-header";
import { TierPricing } from "@/components/tier-pricing";
import { getUserOrderForProduct } from "@/lib/data/orders";
import { canWriteReview } from "@/lib/orders/shipping-status";
import {
  buildReviewSummary,
  getReviewsByProductId,
  userHasReviewForProduct,
} from "@/lib/data/reviews";
import { getUserReportedReviewIds } from "@/lib/data/review-reports";
import { getReviewLikeSnapshot } from "@/lib/data/review-likes";
import { getDealById, getPriceTiersByDealId } from "@/lib/data";
import { isDealSavedByUser } from "@/lib/data/saved-deals";
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

  const [tiers, user, reviews] = await Promise.all([
    getPriceTiersByDealId(id),
    getServerAuthUser(),
    getReviewsByProductId(deal.slug),
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
    <main className={`${ui.pageWrap} pb-[calc(5.5rem+env(safe-area-inset-bottom))] shadow-soft`}>
      <ProductViewTracker deal={deal} isLoggedIn={!!user} />
      <SubHeader backHref="/" title="상품 상세" />

      <ProductImageGallery deal={deal} initialSaved={isSaved} />
      <ProductSummaryPanel
        deal={deal}
        isLoggedIn={!!user}
        loginNext={`/product/${deal.slug}`}
        reviewSummary={reviewSummary}
      />

      <section className={`${ui.pageBody} space-y-4 pt-4`}>
        <ProductInviteSection
          deal={deal}
          referralCode={referralCode}
          shareContent={shareContent}
        />
        <TierPricing deal={deal} tiers={tiers} />
        <ProductDetailTabs
          detailContent={<ProductDetailSection deal={deal} />}
          initialTab={review === "true" ? "reviews" : undefined}
          qnaContent={
            <div className="scroll-mt-24" id="product-qna">
              <ProductQASection
                isLoggedIn={!!user}
                productId={deal.slug}
                productName={deal.title}
                questions={questions}
              />
            </div>
          }
          qnaCount={questions.length}
          reviewCount={reviewSummary.totalCount}
          reviewsContent={
            <>
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
            </>
          }
          shippingContent={<ProductShippingInfo />}
        />
        <ProductDetailBottomSections deal={deal} qnaCount={questions.length} reviewSummary={reviewSummary} />
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
