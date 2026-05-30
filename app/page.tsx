import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { HomeCatalog } from "@/components/home-catalog";
import { SiteFooter } from "@/components/site-footer";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAllActiveDeals } from "@/lib/data";
import { getcellohDataSource, logPageDataSource } from "@/lib/data/source";
import { getUnreadCountForUser } from "@/lib/data/notifications";
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

export const dynamic = "force-dynamic";

export default async function Home() {
  const [allDeals, user, adminBanner] = await Promise.all([
    getAllActiveDeals(),
    getServerAuthUser(),
    getPrimaryHomeBanner(),
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

  const allProductsDeals = getHomeAllProductsDeals(allDeals);

  const unreadNotificationCount = user ? await getUnreadCountForUser(user.id) : 0;

  return (
    <AppBuyerLayout unreadNotificationCount={unreadNotificationCount}>
      <HomeCatalog
        allProductsDeals={allProductsDeals}
        heroFeatured={heroFeatured}
        newSellerDeals={newSellerDeals}
        popularSellerDeals={popularSellerDeals}
        recommendedSellerDeals={recommendedSellerDeals}
        specialPriceDeals={specialPriceDeals}
      />
      <SiteFooter />
    </AppBuyerLayout>
  );
}
