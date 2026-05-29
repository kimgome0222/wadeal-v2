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
  getRecommendedSellerDeals,
} from "@/lib/sellers/home-sellers";
import { HOME_SECTION_COPY } from "@/lib/sellers/trust-copy";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function Home() {
  const allDeals = await getAllActiveDeals();
  const user = await getServerAuthUser();

  logPageDataSource("/", getcellohDataSource() ?? "unconfigured");

  const recommendedSellerDeals = getRecommendedSellerDeals(allDeals, 8);
  const topRatedDeals = getTopRatedDeals(allDeals, 8);
  const mostReviewedDeals = getReviewedDeals(allDeals, 8);
  const newSellerDeals = getNewSellerDeals(allDeals, 6);

  const adminBanner = await getPrimaryHomeBanner();
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

  const unreadNotificationCount = user ? await getUnreadCountForUser(user.id) : 0;
  const joinCartCount = user ? await getJoinCartCountForUser(user.id) : 0;
  const popularSearchTerms = await getFeaturedSearchTerms(8);
  const profile = user ? await getUserProfile(user.id, user) : null;
  const accessContext = user ? await getAccessContext() : null;
  const roleLinks = getRoleNavLinks(accessContext);

  const headerUser = user ? buildHeaderUserInfo(user, profile) : null;

  return (
    <main className={`${ui.pageWrap} pb-24 shadow-soft`}>
      <HomeCatalog
        headerUser={headerUser}
        heroFeatured={heroFeatured}
        joinCartCount={joinCartCount}
        mostReviewedDeals={mostReviewedDeals}
        newSellerDeals={newSellerDeals}
        popularSearchTerms={popularSearchTerms}
        recommendedSellerDeals={recommendedSellerDeals}
        roleLinks={roleLinks}
        sections={sections}
        topRatedDeals={topRatedDeals}
        unreadNotificationCount={unreadNotificationCount}
      />
      <SiteFooter />
      <AppBottomNavigation unreadCount={unreadNotificationCount} />
    </main>
  );
}
