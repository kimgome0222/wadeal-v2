import { redirect } from "next/navigation";

import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { NotificationsList } from "@/components/notifications-list";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  getAdminNotifications,
  getUnreadCountForAdmin,
} from "@/lib/data/admin-notifications";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/notifications");
  }

  const isAdmin = await isAdminUser(user);
  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="알림센터" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const [notifications, unreadCount] = await Promise.all([
    getAdminNotifications("all"),
    getUnreadCountForAdmin(),
  ]);

  return (
    <PageShell>
      <SubHeader backHref="/admin/dashboard" title="관리자 알림센터" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/notifications" />
        <p className="text-xs font-bold text-wadeal-muted">
          판매자 승인, 상품 검수, 주문·결제 이슈 등 관리자 대상 알림을 확인할 수 있어요.
        </p>
        <NotificationsList
          initialNotifications={notifications}
          initialUnreadCount={unreadCount}
        />
      </div>
    </PageShell>
  );
}
