import { redirect } from "next/navigation";
import { MypageBenefitsContent } from "@/components/mypage-benefits-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getUserCouponUsages } from "@/lib/data/benefits";
import { getPointBalance, getPointTransactionsForUser } from "@/lib/discounts/points";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function MypageBenefitsPage() {
  const user = await getServerAuthUser();

  if (!user) {
    redirect("/login?next=/mypage/benefits");
  }

  const [pointsBalance, transactionsResult, couponUsages] = await Promise.all([
    getPointBalance(user.id),
    getPointTransactionsForUser(user.id),
    getUserCouponUsages(user.id),
  ]);

  const transactions = Array.isArray(transactionsResult)
    ? transactionsResult
    : transactionsResult.items;

  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="쿠폰·포인트" />
      <div className={`${ui.pageBody} space-y-3`}>
        <MypageBenefitsContent
          couponUsages={couponUsages}
          pointsBalance={pointsBalance}
          transactions={transactions}
        />
      </div>
    </PageShell>
  );
}
