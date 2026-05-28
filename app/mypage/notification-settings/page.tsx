import { redirect } from "next/navigation";
import { MypageNotificationSettingsContent } from "@/components/mypage-notification-settings-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getNotificationSettingsForUser } from "@/lib/data/notification-settings";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function MypageNotificationSettingsPage() {
  const user = await getServerAuthUser();

  if (!user) {
    redirect("/login?next=/mypage/notification-settings");
  }

  const settings = await getNotificationSettingsForUser(user.id);

  return (
    <PageShell>
      <SubHeader backHref="/mypage/settings" title="알림 설정" />
      <div className={`${ui.pageBody} space-y-3`}>
        <MypageNotificationSettingsContent initialSettings={settings} />
      </div>
    </PageShell>
  );
}
