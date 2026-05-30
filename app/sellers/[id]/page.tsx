import type { Metadata } from "next";
import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { SellerProfilePageContent } from "@/components/seller-profile-page-content";
import { SellerProfileUnavailable } from "@/components/seller-profile-unavailable";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAllActiveDeals } from "@/lib/data";
import { getProductQuestionsForDisplay } from "@/lib/data/product-questions";
import { getReviewsByProductId } from "@/lib/data/reviews";
import { getUnreadCountForUser } from "@/lib/data/notifications";
import { buildSellerProfileView } from "@/lib/sellers/build-seller-profile-view";
import {
  getDealsForSellerProfile,
  resolveSellerProfileByRouteId,
} from "@/lib/sellers/home-sellers";
import { mergeSellerProductReviews } from "@/lib/sellers/seller-profile-data";
import { buildSellerMetadata } from "@/lib/seo/site";

export const dynamic = "force-dynamic";

type SellerProfilePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: SellerProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const allDeals = await getAllActiveDeals();
  const profile = resolveSellerProfileByRouteId(id, allDeals);

  if (!profile) {
    return {
      title: "판매자를 찾을 수 없어요",
      robots: { index: false, follow: false },
    };
  }

  return buildSellerMetadata({
    routeId: id,
    name: profile.name,
    tagline: profile.tagline,
  });
}

export default async function SellerPublicProfilePage({ params }: SellerProfilePageProps) {
  const { id } = await params;
  const [allDeals, user] = await Promise.all([getAllActiveDeals(), getServerAuthUser()]);
  const unreadNotificationCount = user ? await getUnreadCountForUser(user.id) : 0;
  const profile = resolveSellerProfileByRouteId(id, allDeals);

  if (!profile) {
    return (
      <AppBuyerLayout
        showCategoryBar={false}
        showSearch={false}
        unreadNotificationCount={unreadNotificationCount}
      >
        <SubHeader backHref="/" title="판매자 프로필" />
        <SellerProfileUnavailable routeId={id} />
      </AppBuyerLayout>
    );
  }

  const sellerDeals = getDealsForSellerProfile(profile, allDeals);
  const anchorDeal = sellerDeals[0];

  if (!anchorDeal) {
    return (
      <AppBuyerLayout
        showCategoryBar={false}
        showSearch={false}
        unreadNotificationCount={unreadNotificationCount}
      >
        <SubHeader backHref="/" title="판매자 프로필" />
        <SellerProfileUnavailable routeId={id} />
      </AppBuyerLayout>
    );
  }

  const reviewSlugs = sellerDeals.slice(0, 8).map((deal) => deal.slug);
  const [reviewBatches, questions] = await Promise.all([
    Promise.all(reviewSlugs.map((slug) => getReviewsByProductId(slug))),
    getProductQuestionsForDisplay(anchorDeal.slug),
  ]);

  const productReviews = mergeSellerProductReviews(reviewBatches);
  const view = buildSellerProfileView(profile, sellerDeals, productReviews);

  return (
    <AppBuyerLayout
      showCategoryBar={false}
      showSearch={false}
      unreadNotificationCount={unreadNotificationCount}
    >
      <SubHeader backHref="/" title="판매자 프로필" />
      <SellerProfilePageContent
        isLoggedIn={!!user}
        questions={questions}
        view={view}
      />
    </AppBuyerLayout>
  );
}
