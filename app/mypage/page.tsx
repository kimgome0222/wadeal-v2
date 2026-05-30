import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { MypagePageContent } from "@/components/mypage-page-content";
import { SiteFooter } from "@/components/site-footer";
import { getAccessContext } from "@/lib/auth/access";
import { getRoleNavLinks } from "@/lib/auth/role-nav";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getMypageDashboardSummary } from "@/lib/data/mypage-dashboard";
import { getUnreadCountForUser } from "@/lib/data/notifications";
import { getUserProfile } from "@/lib/data/profile";
import { buildMypageHubData } from "@/lib/mypage/hub-data";
import { getOrCreateReferralCode, getShareStatsForUser } from "@/lib/share";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function MypagePage() {
  const user = await getServerAuthUser();
  const unreadNotificationCount = user ? await getUnreadCountForUser(user.id) : 0;
  const shareStats = user ? await getShareStatsForUser(user.id) : null;
  const referralCode = user ? await getOrCreateReferralCode(user.id) : null;
  const [profile, dashboardSummary, hubData] =
    user ?
      await Promise.all([
        getUserProfile(user.id, user),
        getMypageDashboardSummary(user.id),
        buildMypageHubData(user.id),
      ])
    : [null, null, null];
  const accessContext = user ? await getAccessContext() : null;
  const roleLinks = getRoleNavLinks(accessContext);

  return (
    <AppBuyerLayout unreadNotificationCount={unreadNotificationCount}>
      <div className={ui.appPageBody}>
        <MypagePageContent
          dashboardSummary={dashboardSummary}
          hubData={hubData}
          initialUser={user}
          profile={profile}
          referralCode={referralCode}
          roleLinks={roleLinks}
          shareStats={shareStats}
          unreadNotificationCount={unreadNotificationCount}
        />
      </div>
      {user ?
        <SiteFooter />
      : null}
    </AppBuyerLayout>
  );
}
