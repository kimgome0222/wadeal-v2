import { redirect } from "next/navigation";
import { MypageGroupbuysContent } from "@/components/mypage-groupbuys-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getUserOrdersDetailed } from "@/lib/data/orders";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function MypageGroupbuysPage() {
  const user = await getServerAuthUser();

  if (!user) {
    redirect("/login?next=/mypage/groupbuys");
  }

  const orders = await getUserOrdersDetailed(user.id);

  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="공동구매 참여" />
      <div className={`${ui.pageBody} space-y-3`}>
        <p className="text-xs font-bold text-wadeal-muted">
          참여 중인 공동구매, 결제 상태, 확정가를 확인할 수 있어요.
        </p>
        <MypageGroupbuysContent orders={orders} />
      </div>
    </PageShell>
  );
}
