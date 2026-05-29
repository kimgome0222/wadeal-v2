import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { AdminSellerSettlementsContent } from "@/components/admin-seller-settlements-content";
import { AdminSettlementsContent } from "@/components/admin-settlements-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  filterAdminSettlementsByStatus,
  getAdminSettlements,
  parseAdminSettlementStatusFilter,
} from "@/lib/data/settlements";
import { getAdminSellerSettlementRecords } from "@/lib/data/seller-settlement-records";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type AdminSettlementsPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminSettlementsPage({ searchParams }: AdminSettlementsPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/settlements");
  }

  const isAdmin = await isAdminUser(user);

  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="정산 관리" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const params = await searchParams;
  const statusFilter = parseAdminSettlementStatusFilter(params.status);
  const allSettlements = await getAdminSettlements();
  const filteredSettlements = filterAdminSettlementsByStatus(allSettlements, statusFilter);
  const sellerSettlementRecords = await getAdminSellerSettlementRecords();

  return (
    <PageShell>
      <SubHeader backHref="/" title="정산 관리" />
      <div className={`${ui.pageBody} space-y-3`}>
        <AdminNav current="/admin/settlements" />
        <p className="text-xs font-bold text-wadeal-muted">
          판매 종료 후 생성된 정산을 확인하고 지급 처리할 수 있어요.
        </p>
        <Suspense fallback={null}>
          <AdminSettlementsContent
            initialFilter={statusFilter}
            settlements={filteredSettlements}
          />
        </Suspense>
        <section className="space-y-3">
          <h2 className={ui.sectionTitle}>판매자 정산 (자동 차감)</h2>
          <p className="text-xs font-bold text-wadeal-muted">
            판매자별 정산 명세를 확정하고 입금 완료 처리할 수 있어요.
          </p>
          <AdminSellerSettlementsContent records={sellerSettlementRecords} />
        </section>
      </div>
    </PageShell>
  );
}
