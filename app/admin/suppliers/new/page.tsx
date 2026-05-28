import { redirect } from "next/navigation";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { AdminSupplierForm } from "@/components/admin-supplier-form";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminSupplierNewPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/suppliers/new");
  }

  const isAdmin = await isAdminUser(user);

  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/admin/suppliers" title="공급사 등록" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <SubHeader backHref="/admin/suppliers" title="공급사 등록" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/suppliers" />
        <AdminSupplierForm cancelHref="/admin/suppliers" mode="create" />
      </div>
    </PageShell>
  );
}
