import { notFound, redirect } from "next/navigation";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { AdminSettlementDetailContent } from "@/components/admin-settlement-detail-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAdminSettlementById } from "@/lib/data/settlements";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type AdminSettlementDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminSettlementDetailPage({
  params,
}: AdminSettlementDetailPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/settlements");
  }

  const isAdmin = await isAdminUser(user);

  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/admin/settlements" title="정산 상세" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const { id } = await params;
  const settlement = await getAdminSettlementById(id);

  if (!settlement) {
    notFound();
  }

  return (
    <PageShell>
      <SubHeader backHref="/admin/settlements" title="정산 상세" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/settlements" />
        <AdminSettlementDetailContent settlement={settlement} />
      </div>
    </PageShell>
  );
}
