import { BottomNavigation } from "@/components/bottom-navigation";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getUnreadCountForUser } from "@/lib/data/notifications";

type AppBottomNavigationProps = {
  unreadCount?: number;
};

export async function AppBottomNavigation({ unreadCount }: AppBottomNavigationProps = {}) {
  let count = unreadCount;

  if (count == null) {
    const user = await getServerAuthUser();
    count = user ? await getUnreadCountForUser(user.id) : 0;
  }

  return <BottomNavigation unreadCount={count} />;
}
