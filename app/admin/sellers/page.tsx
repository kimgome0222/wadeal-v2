import { redirect } from "next/navigation";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { AdminReviewGuidesPanel } from "@/components/admin/admin-review-guides-panel";
import { AdminSellersContent } from "@/components/admin-sellers-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getSellersByStatusForAdmin } from "@/lib/data/sellers";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminSellersPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/sellers");
  }

  const isAdmin = await isAdminUser(user);

  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="판매자 관리" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const [pendingSellers, allSellers] = await Promise.all([
    getSellersByStatusForAdmin("pending_review"),
    getSellersByStatusForAdmin(),
  ]);

  return (
    <PageShell>
      <SubHeader backHref="/admin/dashboard" title="판매자 관리" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/sellers" />
        <AdminReviewGuidesPanel variant="seller" />
        <p className="text-xs font-bold text-wadeal-muted">
          판매자 가입 신청을 검토하고 승인 또는 반려할 수 있어요.
        </p>
        <section className="space-y-3">
          <h2 className={ui.sectionTitle}>승인 대기 ({pendingSellers.length})</h2>
          <AdminSellersContent sellers={pendingSellers} showPendingOnly />
        </section>
        <section className="space-y-3">
          <h2 className={ui.sectionTitle}>전체 판매자 ({allSellers.length})</h2>
          <AdminSellersContent sellers={allSellers} />
        </section>
      </div>
    </PageShell>
  );
}
