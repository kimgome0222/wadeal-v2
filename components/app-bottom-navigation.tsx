import { BottomNavigation } from "@/components/bottom-navigation";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getJoinCartForUser } from "@/lib/data/join-cart";
import { getUnreadCountForUser } from "@/lib/data/notifications";

type AppBottomNavigationProps = {
  unreadCount?: number;
  serverCartCount?: number;
};

export async function AppBottomNavigation({
  unreadCount,
  serverCartCount,
}: AppBottomNavigationProps = {}) {
  let count = unreadCount;
  let cartCount = serverCartCount;

  const user = await getServerAuthUser();

  if (count == null) {
    count = user ? await getUnreadCountForUser(user.id) : 0;
  }

  if (cartCount == null) {
    if (user) {
      const items = await getJoinCartForUser(user.id);
      cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    } else {
      cartCount = 0;
    }
  }

  return <BottomNavigation serverCartCount={cartCount} unreadCount={count} />;
}
