import { AppBottomNavigation } from "@/components/app-bottom-navigation";
import { HomeCatalog } from "@/components/home-catalog";
import { SiteFooter } from "@/components/site-footer";
import { getAccessContext } from "@/lib/auth/access";
import { getRoleNavLinks } from "@/lib/auth/role-nav";
import {
  getAuthDisplayName,
  getAuthIdentityLine,
  getAuthProviderLabel,
  getServerAuthUser,
} from "@/lib/auth/server-session";
import { getAllActiveDeals } from "@/lib/data";
import { getWadealDataSource, logPageDataSource } from "@/lib/data/source";
import { getUnreadCountForUser } from "@/lib/data/notifications";
import { getUserProfile } from "@/lib/data/profile";
import {
  getClosingSoonDeals,
  getNewDeals,
  getPopularDeals,
  getTodayGroupBuyDeals,
} from "@/lib/deals";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function Home() {
  const allDeals = await getAllActiveDeals();
  const user = await getServerAuthUser();

  logPageDataSource("/", getWadealDataSource() ?? "unconfigured");

  const sections = [
    { title: "오늘의 공동구매", deals: getTodayGroupBuyDeals(allDeals) },
    { title: "마감임박", deals: getClosingSoonDeals(allDeals) },
    { title: "인기상품", deals: getPopularDeals(allDeals) },
    { title: "신규상품", deals: getNewDeals(allDeals) },
  ];

  const unreadNotificationCount = user ? await getUnreadCountForUser(user.id) : 0;
  const profile = user ? await getUserProfile(user.id, user) : null;
  const accessContext = user ? await getAccessContext() : null;
  const roleLinks = getRoleNavLinks(accessContext);

  const headerUser =
    user ?
      {
        displayName: profile?.nickname ?? profile?.realName ?? getAuthDisplayName(user),
        identityLine:
          profile?.email && !profile.email.endsWith("@wadeal.local") ?
            profile.email
          : getAuthProviderLabel(user) ?
            `${getAuthProviderLabel(user)} 로그인`
          : getAuthIdentityLine(user),
        memberGrade: profile?.memberGrade ?? "일반",
      }
    : null;

  return (
    <main className={`${ui.pageWrap} pb-24 shadow-soft`}>
      <HomeCatalog
        headerUser={headerUser}
        roleLinks={roleLinks}
        sections={sections}
        unreadNotificationCount={unreadNotificationCount}
      />
      <SiteFooter />
      <AppBottomNavigation unreadCount={unreadNotificationCount} />
    </main>
  );
}
