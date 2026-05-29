import { redirect } from "next/navigation";

import { AppBottomNavigation } from "@/components/app-bottom-navigation";
import { MypageWithdrawalContent } from "@/components/mypage-withdrawal-content";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SubHeader } from "@/components/sub-header";
import {
  getServerAuthUser,
  isSocialAuthUser,
} from "@/lib/auth/server-session";
import { getUnreadCountForUser } from "@/lib/data/notifications";
import { getUserProfile } from "@/lib/data/profile";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function MypageWithdrawalPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/mypage/withdrawal");
  }

  const [profile, unreadNotificationCount] = await Promise.all([
    getUserProfile(user.id, user),
    getUnreadCountForUser(user.id),
  ]);

  if (!profile) {
    redirect("/login?next=/mypage/withdrawal");
  }

  return (
    <PageShell withBottomNav>
      <SubHeader backHref="/mypage/profile/edit" title="서비스 탈퇴" />
      <div className={ui.pageBody}>
        <MypageWithdrawalContent
          isSocialUser={isSocialAuthUser(user)}
          profile={profile}
        />
      </div>
      <SiteFooter />
      <AppBottomNavigation unreadCount={unreadNotificationCount} />
    </PageShell>
  );
}
