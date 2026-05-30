import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { HomeCatalog } from "@/components/home-catalog";
import { SiteFooter } from "@/components/site-footer";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAllActiveDeals } from "@/lib/data";
import { getcellohDataSource, logPageDataSource } from "@/lib/data/source";
import { getUnreadCountForUser } from "@/lib/data/notifications";
import { buildHomeViewModel } from "@/lib/home/build-home-view";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [catalog, user] = await Promise.all([
    getAllActiveDeals(),
    getServerAuthUser(),
  ]);

  logPageDataSource("/", getcellohDataSource() ?? "unconfigured");

  const home = buildHomeViewModel(catalog);
  const unreadNotificationCount = user ? await getUnreadCountForUser(user.id) : 0;

  return (
    <AppBuyerLayout unreadNotificationCount={unreadNotificationCount}>
      <HomeCatalog {...home} />
      <SiteFooter />
    </AppBuyerLayout>
  );
}
