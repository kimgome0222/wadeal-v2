import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { NotificationsList } from "@/components/notifications-list";
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
    <AppBuyerLayout unreadNotificationCount={unreadCount}>
      <div className={ui.pageBody}>
        <h1 className="mb-3 text-lg font-bold text-wadeal-ink">알림</h1>
        {user ?
          <NotificationsList
            initialNotifications={notifications}
            initialUnreadCount={unreadCount}
          />
        : <NotificationsList initialNotifications={[]} initialUnreadCount={0} />}
      </div>
    </AppBuyerLayout>
  );
}
