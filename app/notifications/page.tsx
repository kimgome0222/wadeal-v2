import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { AuthLoginPrompt } from "@/components/auth-login-prompt";
import { NotificationsList } from "@/components/notifications-list";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  getNotificationsForUser,
  getUnreadCountForUser,
} from "@/lib/data/notifications";

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
    <AppBuyerLayout showCategoryBar={false} unreadNotificationCount={unreadCount}>
      {user ?
        <div className="px-6 pt-6">
          <h1 className="mb-4 text-[24px] font-bold text-[#111111]">알림</h1>
          <NotificationsList
            initialNotifications={notifications}
            initialUnreadCount={unreadCount}
          />
        </div>
      : <AuthLoginPrompt
          description="로그인 후 서비스를 이용해보세요."
          nextPath="/notifications"
        />}
    </AppBuyerLayout>
  );
}
