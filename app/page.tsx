import { AppBottomNavigation } from "@/components/app-bottom-navigation";
import { HomeCatalog } from "@/components/home-catalog";
import { SiteFooter } from "@/components/site-footer";
import { buildHeaderUserInfo, getServerAuthUser } from "@/lib/auth/server-session";
import { getAllActiveDeals } from "@/lib/data";
import { getJoinCartCountForUser } from "@/lib/data/join-cart";
import { getFeaturedSearchTerms } from "@/lib/data/search";
import { getcellohDataSource, logPageDataSource } from "@/lib/data/source";
import { getUnreadCountForUser } from "@/lib/data/notifications";
import { getUserProfile } from "@/lib/data/profile";
import { getHomeAllProductsDeals } from "@/lib/deals";
import { getPrimaryHomeBanner } from "@/lib/data/admin-commerce";
import {
  ensureMinimumHomeRailDeals,
  ensureMinimumSpecialPriceDeals,
  getNewSellerDeals,
  getPopularSellerDeals,
  getRecommendedSellerDeals,
  getSpecialPriceDeals,
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

  const recommendedSellerDeals = ensureMinimumHomeRailDeals(
    getRecommendedSellerDeals(allDeals, 20),
    allDeals,
    6,
  );
  const popularSellerDeals = ensureMinimumHomeRailDeals(
    getPopularSellerDeals(allDeals, 20),
    allDeals,
    6,
  );
  const specialPriceDeals = ensureMinimumSpecialPriceDeals(
    getSpecialPriceDeals(allDeals, 20),
    allDeals,
    6,
  );
  const newSellerDeals = ensureMinimumHomeRailDeals(
    getNewSellerDeals(allDeals, 12),
    allDeals,
    6,
  );

  const heroFeatured =
    adminBanner ?
      { href: adminBanner.linkUrl }
    : recommendedSellerDeals[0] ?
      { href: `/product/${recommendedSellerDeals[0].slug}` }
    : null;

  const sections = [
    {
      title: HOME_SECTION_COPY.allProducts.title,
      subtitle: HOME_SECTION_COPY.allProducts.subtitle,
      deals: getHomeAllProductsDeals(allDeals),
    },
  ];

  const [unreadNotificationCount, joinCartCount, profile] =
    user ?
      await Promise.all([
        getUnreadCountForUser(user.id),
        getJoinCartCountForUser(user.id),
        getUserProfile(user.id, user),
      ])
    : [0, 0, null];

  const headerUser = user ? buildHeaderUserInfo(user, profile) : null;

  return (
    <main className={`${ui.pageWrap} pb-24 bg-white`}>
      <HomeCatalog
        headerUser={headerUser}
        heroFeatured={heroFeatured}
        joinCartCount={joinCartCount}
        newSellerDeals={newSellerDeals}
        popularSearchTerms={popularSearchTerms}
        popularSellerDeals={popularSellerDeals}
        recommendedSellerDeals={recommendedSellerDeals}
        specialPriceDeals={specialPriceDeals}
        sections={sections}
        unreadNotificationCount={unreadNotificationCount}
      />
      <SiteFooter />
      <AppBottomNavigation unreadCount={unreadNotificationCount} />
    </main>
  );
}
