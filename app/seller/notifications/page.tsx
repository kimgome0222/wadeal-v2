import { NotificationsList } from "@/components/notifications-list";
import { SellerShell } from "@/components/seller-shell";
import { getSellerAccessContext } from "@/lib/auth/seller-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  getNotificationsForSeller,
  getUnreadCountForSeller,
} from "@/lib/data/seller-notifications";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SellerNotificationsPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/seller/notifications");
  }

  const { seller } = await getSellerAccessContext(user);
  if (!seller) {
    redirect("/seller/apply");
  }

  const [notifications, unreadCount] = await Promise.all([
    getNotificationsForSeller(seller.id, "all"),
    getUnreadCountForSeller(seller.id),
  ]);

  return (
    <SellerShell title="알림">
      <NotificationsList
        initialNotifications={notifications}
        initialUnreadCount={unreadCount}
      />
    </SellerShell>
  );
}
