import { AppBottomNavigation } from "@/components/app-bottom-navigation";
import { HomeCatalog } from "@/components/home-catalog";
import { SiteFooter } from "@/components/site-footer";
import { getAccessContext } from "@/lib/auth/access";
import { getRoleNavLinks } from "@/lib/auth/role-nav";
import { buildHeaderUserInfo, getServerAuthUser } from "@/lib/auth/server-session";
import { normalizeHomeDisplayTitle } from "@/lib/copy/home-display";
import { getAllActiveDeals } from "@/lib/data";
import { getJoinCartCountForUser } from "@/lib/data/join-cart";
import { getFeaturedSearchTerms } from "@/lib/data/search";
import { getcellohDataSource, logPageDataSource } from "@/lib/data/source";
import { getUnreadCountForUser } from "@/lib/data/notifications";
import { getUserProfile } from "@/lib/data/profile";
import {
  getHomeAllProductsDeals,
  getReviewedDeals,
  getTopRatedDeals,
} from "@/lib/deals";
import { getPrimaryHomeBanner } from "@/lib/data/admin-commerce";
import {
  getNewSellerDeals,
  getNewSellers,
  getPopularSellers,
  getRecommendedSellerDeals,
  getRecommendedSellers,
  getTrustedSellers,
} from "@/lib/sellers/home-sellers";
import { HOME_SECTION_COPY } from "@/lib/sellers/trust-copy";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [allDeals, user, adminBanner, popularSearchTerms] = await Promise.all([
    getAllActiveDeals(),
    getServerAuthUser(),
    getPrimaryHomeBanner(),
    getFeaturedSearchTerms(8),
  ]);

  logPageDataSource("/", getcellohDataSource() ?? "unconfigured");

  const recommendedSellerDeals = getRecommendedSellerDeals(allDeals, 8);
  const topRatedDeals = getTopRatedDeals(allDeals, 8);
  const mostReviewedDeals = getReviewedDeals(allDeals, 8);
  const newSellerDeals = getNewSellerDeals(allDeals, 6);
  const featuredSellers = getRecommendedSellers(allDeals, 6);
  const popularSellers = getPopularSellers(allDeals, 4);
  const trustedSellers = getTrustedSellers(allDeals, 4);
  const newSellers = getNewSellers(allDeals, 4);

  const heroFeatured =
    adminBanner ?
      {
        href: adminBanner.linkUrl,
        title: normalizeHomeDisplayTitle(adminBanner.title),
        imageUrl: adminBanner.imageUrl,
      }
    : recommendedSellerDeals[0] ?
      {
        href: `/product/${recommendedSellerDeals[0].slug}`,
        imageUrl: recommendedSellerDeals[0].imageUrl ?? null,
      }
    : null;

  const sections = [
    {
      title: HOME_SECTION_COPY.allProducts.title,
      subtitle: HOME_SECTION_COPY.allProducts.subtitle,
      deals: getHomeAllProductsDeals(allDeals),
    },
  ];

  const [unreadNotificationCount, joinCartCount, profile, accessContext] =
    user ?
      await Promise.all([
        getUnreadCountForUser(user.id),
        getJoinCartCountForUser(user.id),
        getUserProfile(user.id, user),
        getAccessContext(),
      ])
    : [0, 0, null, null];
  const roleLinks = getRoleNavLinks(accessContext);

  const headerUser = user ? buildHeaderUserInfo(user, profile) : null;

  return (
    <main className={`${ui.pageWrap} pb-24 shadow-soft`}>
      <HomeCatalog
        featuredSellers={featuredSellers}
        headerUser={headerUser}
        heroFeatured={heroFeatured}
        joinCartCount={joinCartCount}
        mostReviewedDeals={mostReviewedDeals}
        newSellerDeals={newSellerDeals}
        newSellers={newSellers}
        popularSearchTerms={popularSearchTerms}
        popularSellers={popularSellers}
        recommendedSellerDeals={recommendedSellerDeals}
        roleLinks={roleLinks}
        sections={sections}
        topRatedDeals={topRatedDeals}
        trustedSellers={trustedSellers}
        unreadNotificationCount={unreadNotificationCount}
      />
      <SiteFooter />
      <AppBottomNavigation unreadCount={unreadNotificationCount} />
    </main>
  );
}
