import { redirect } from "next/navigation";

import { BottomNavigation } from "@/components/bottom-navigation";
import { JoinCartContent } from "@/components/join-cart-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { addToJoinCartForUser, getJoinCartForUser } from "@/lib/data/join-cart";
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

  return (
    <PageShell withBottomNav>
      <SubHeader backHref="/mypage" title="구매 검토함" />
      <div className={`${ui.pageBody} space-y-3`}>
        <JoinCartContent initialLoggedIn={!!user} items={items} />
      </div>
      <BottomNavigation />
    </PageShell>
  );
}
