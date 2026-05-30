import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { CartPreviewContent } from "@/components/cart/cart-preview-content";
import { CartSheetCatalogSync } from "@/components/cart/cart-sheet-catalog-sync";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAllActiveDeals } from "@/lib/data";
import { getUnreadCountForUser } from "@/lib/data/notifications";

export const dynamic = "force-dynamic";

export default async function CartPreviewPage() {
  const [catalog, user] = await Promise.all([getAllActiveDeals(), getServerAuthUser()]);
  const unreadNotificationCount = user ? await getUnreadCountForUser(user.id) : 0;

  return (
    <AppBuyerLayout
      showBottomNav={false}
      showCategoryBar={false}
      showSearch={false}
      unreadNotificationCount={unreadNotificationCount}
    >
      <CartSheetCatalogSync catalog={catalog} />
      <CartPreviewContent catalog={catalog} />
    </AppBuyerLayout>
  );
}
