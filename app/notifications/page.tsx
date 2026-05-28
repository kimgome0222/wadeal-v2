import { AppBottomNavigation } from "@/components/app-bottom-navigation";
import { NotificationsList } from "@/components/notifications-list";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  getNotificationsForUser,
  getUnreadCountForUser,
} from "@/lib/data/notifications";
import { ui } from "@/lib/ui";

export default async function NotificationsPage() {
  const user = await getServerAuthUser();
  const [notifications, unreadCount] =
    user ?
      await Promise.all([
        getNotificationsForUser(user.id, "all"),
        getUnreadCountForUser(user.id),
      ])
    : [[], 0];

  return (
    <PageShell withBottomNav>
      <SubHeader backHref="/" title="알림" />
      <div className={ui.pageBody}>
        {user ?
          <NotificationsList
            initialNotifications={notifications}
            initialUnreadCount={unreadCount}
          />
        : <NotificationsList initialNotifications={[]} initialUnreadCount={0} />}
      </div>
      <AppBottomNavigation unreadCount={unreadCount} />
    </PageShell>
  );
}
