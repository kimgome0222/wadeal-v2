import { redirect } from "next/navigation";

import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { JoinCartContent } from "@/components/join-cart-content";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { addToJoinCartForUser, getJoinCartForUser } from "@/lib/data/join-cart";
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

  const items = user ? await getJoinCartForUser(user.id) : [];
  const unreadNotificationCount = user ? await getUnreadCountForUser(user.id) : 0;

  return (
    <AppBuyerLayout unreadNotificationCount={unreadNotificationCount}>
      <div className={`${ui.pageBody} space-y-3`}>
        <h1 className="text-lg font-bold text-wadeal-ink">구매 검토함</h1>
        <JoinCartContent initialLoggedIn={!!user} items={items} />
      </div>
    </AppBuyerLayout>
  );
}
