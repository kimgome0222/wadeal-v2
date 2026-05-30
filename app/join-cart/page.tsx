import { redirect } from "next/navigation";

import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { CartSheetCatalogSync } from "@/components/cart/cart-sheet-catalog-sync";
import { JoinCartContent } from "@/components/join-cart-content";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { addToJoinCartForUser, getJoinCartForUser } from "@/lib/data/join-cart";
import { getAllActiveDeals } from "@/lib/data";
import { getUnreadCountForUser } from "@/lib/data/notifications";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type JoinCartPageProps = {
  searchParams: Promise<{ pending?: string }>;
};

export default async function JoinCartPage({ searchParams }: JoinCartPageProps) {
  const { pending } = await searchParams;
  const pendingSlug = pending?.trim();
  const user = await getServerAuthUser();

  if (user && pendingSlug) {
    await addToJoinCartForUser(user.id, pendingSlug, 1);
    redirect("/join-cart");
  }

  const [items, catalog] = await Promise.all([
    user ? getJoinCartForUser(user.id) : Promise.resolve([]),
    getAllActiveDeals(),
  ]);
  const unreadNotificationCount = user ? await getUnreadCountForUser(user.id) : 0;

  return (
    <AppBuyerLayout unreadNotificationCount={unreadNotificationCount}>
      <CartSheetCatalogSync catalog={catalog} />
      <div className={`${ui.appPageBody}`}>
        <h1 className="mb-6 text-[24px] font-bold text-[#111111]">장바구니</h1>
        <JoinCartContent catalog={catalog} initialLoggedIn={!!user} items={items} />
      </div>
    </AppBuyerLayout>
  );
}
