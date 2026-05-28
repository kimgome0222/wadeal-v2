import { redirect } from "next/navigation";
import { AppBottomNavigation } from "@/components/app-bottom-navigation";
import { MypageSettingsContent } from "@/components/mypage-settings-content";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SubHeader } from "@/components/sub-header";
import {
  getServerAuthUser,
  getSocialAuthLoginMessage,
  isSocialAuthUser,
} from "@/lib/auth/server-session";
import { getUnreadCountForUser } from "@/lib/data/notifications";
import { getUserProfile } from "@/lib/data/profile";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function MypageSettingsPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/mypage/settings");
  }

  const [profile, unreadNotificationCount] = await Promise.all([
    getUserProfile(user.id, user),
    getUnreadCountForUser(user.id),
  ]);

  if (!profile) {
    redirect("/login?next=/mypage/settings");
  }

  return (
    <PageShell withBottomNav>
      <SubHeader backHref="/mypage" title="계정 설정" />
      <div className={ui.pageBody}>
        <MypageSettingsContent
          isSocialUser={isSocialAuthUser(user)}
          profile={profile}
          socialLoginMessage={getSocialAuthLoginMessage(user)}
        />
      </div>
      <SiteFooter />
      <AppBottomNavigation unreadCount={unreadNotificationCount} />
    </PageShell>
  );
}
