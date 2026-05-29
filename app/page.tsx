import { AppBottomNavigation } from "@/components/app-bottom-navigation";
import { HomeCatalog } from "@/components/home-catalog";
import { SiteFooter } from "@/components/site-footer";
import { getAccessContext } from "@/lib/auth/access";
import { getRoleNavLinks } from "@/lib/auth/role-nav";
import { buildHeaderUserInfo, getServerAuthUser } from "@/lib/auth/server-session";
import { getAllActiveDeals } from "@/lib/data";
import { getJoinCartCountForUser } from "@/lib/data/join-cart";
import { getFeaturedSearchTerms } from "@/lib/data/search";
import { getWadealDataSource, logPageDataSource } from "@/lib/data/source";
import { getUnreadCountForUser } from "@/lib/data/notifications";
import { getUserProfile } from "@/lib/data/profile";
import {
  getClosingSoonDeals,
  getNewDeals,
  getPopularDeals,
  getRecentJoinedDeals,
  getReviewedDeals,
  getTodayGroupBuyDeals,
} from "@/lib/deals";
import { getPrimaryHomeBanner } from "@/lib/data/admin-commerce";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function Home() {
  const allDeals = await getAllActiveDeals();
  const user = await getServerAuthUser();

  logPageDataSource("/", getWadealDataSource() ?? "unconfigured");

  const mainDeals = getTodayGroupBuyDeals(allDeals).slice(0, 4);
  const adminBanner = await getPrimaryHomeBanner();
  const heroFeatured =
    adminBanner ?
      {
        href: adminBanner.linkUrl,
        title: adminBanner.title,
        imageUrl: adminBanner.imageUrl,
        subtitle: "와딜 운영 배너",
      }
    : mainDeals[0] ?
      { href: `/product/${mainDeals[0].slug}`, title: mainDeals[0].title }
    : null;

  const sections = [
    { title: "마감임박", deals: getClosingSoonDeals(allDeals) },
    { title: "실시간 인기 공동구매", deals: getPopularDeals(allDeals) },
    { title: "리뷰 좋은 딜", deals: getReviewedDeals(allDeals) },
    { title: "최근 많이 참여한 딜", deals: getRecentJoinedDeals(allDeals) },
    { title: "신규상품", deals: getNewDeals(allDeals) },
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
        mainDeals={mainDeals}
        popularSearchTerms={popularSearchTerms}
        roleLinks={roleLinks}
        sections={sections}
        unreadNotificationCount={unreadNotificationCount}
      />
      <SiteFooter />
      <AppBottomNavigation unreadCount={unreadNotificationCount} />
    </main>
  );
}
