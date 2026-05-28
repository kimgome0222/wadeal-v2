import { notFound, redirect } from "next/navigation";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { AdminSupplierForm } from "@/components/admin-supplier-form";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAdminSupplierById } from "@/lib/data/suppliers";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type AdminSupplierEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminSupplierEditPage({ params }: AdminSupplierEditPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/suppliers");
  }

  const isAdmin = await isAdminUser(user);

  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/admin/suppliers" title="공급사 수정" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const { id } = await params;
  const supplier = await getAdminSupplierById(id);

  if (!supplier) {
    notFound();
  }

  return (
    <PageShell>
      <SubHeader backHref="/admin/suppliers" title="공급사 수정" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/suppliers" />
        <AdminSupplierForm cancelHref="/admin/suppliers" mode="edit" supplier={supplier} />
      </div>
    </PageShell>
  );
}
