import { redirect } from "next/navigation";

import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { MypageSettingsContent } from "@/components/mypage-settings-content";
import { SiteFooter } from "@/components/site-footer";
import {
  getServerAuthUser,
  getSocialAuthLoginMessage,
  isSocialAuthUser,
} from "@/lib/auth/server-session";
import { getDefaultAddress } from "@/lib/data/addresses";
import { getUnreadCountForUser } from "@/lib/data/notifications";
import { getUserProfile } from "@/lib/data/profile";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function MypageSettingsPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/mypage/settings");
  }

  const [profile, unreadNotificationCount, defaultAddress] = await Promise.all([
    getUserProfile(user.id, user),
    getUnreadCountForUser(user.id),
    getDefaultAddress(user.id),
  ]);

  if (!profile) {
    redirect("/login?next=/mypage/settings");
  }

  return (
    <AppBuyerLayout
      showCategoryBar={false}
      showSearch={false}
      unreadNotificationCount={unreadNotificationCount}
    >
      <div className={ui.pageBody}>
        <MypageSettingsContent
          defaultAddress={defaultAddress}
          isSocialUser={isSocialAuthUser(user)}
          profile={profile}
          socialLoginMessage={getSocialAuthLoginMessage(user)}
        />
      </div>
      <SiteFooter />
    </AppBuyerLayout>
  );
}
