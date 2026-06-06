import { redirect } from "next/navigation";

import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { AdminRefundsContent } from "@/components/admin-refunds-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getPendingRefundsForAdmin } from "@/lib/data/refunds";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminRefundsPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/refunds");
  }

  const isAdmin = await isAdminUser(user);
  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="환불 요청" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const refunds = await getPendingRefundsForAdmin();

  return (
    <PageShell>
      <SubHeader backHref="/admin/orders" title="환불 요청" />
      <div className={`${ui.pageBody} space-y-3`}>
        <AdminNav current="/admin/refunds" />
        <p className="text-xs font-bold text-wadeal-muted">
          고객 취소/환불 요청을 확인하고 승인 또는 반려할 수 있어요. Toss 실제 환불 API는 추후 연동됩니다.
        </p>
        <AdminRefundsContent refunds={refunds} />
      </div>
    </PageShell>
  );
}
