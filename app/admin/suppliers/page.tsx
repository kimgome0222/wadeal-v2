import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { AdminSuppliersContent } from "@/components/admin-suppliers-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAdminSuppliers } from "@/lib/data/suppliers";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminSuppliersPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/suppliers");
  }

  const isAdmin = await isAdminUser(user);

  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="공급사 관리" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const suppliers = await getAdminSuppliers();

  return (
    <PageShell>
      <SubHeader backHref="/" title="공급사 관리" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/suppliers" />
        <p className="text-xs font-bold text-wadeal-muted">
          공급사 정보와 정산 수수료율을 관리할 수 있어요.
        </p>
        <Link className={`${ui.btnPrimary} h-11 cursor-pointer`} href="/admin/suppliers/new">
          공급사 등록
        </Link>
        <AdminSuppliersContent suppliers={suppliers} />
      </div>
    </PageShell>
  );
}
