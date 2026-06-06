import { redirect } from "next/navigation";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { AdminProductForm } from "@/components/admin-product-form";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminProductNewPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/products/new");
  }

  const isAdmin = await isAdminUser(user);

  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/admin/products" title="상품 등록" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <SubHeader backHref="/admin/products" title="상품 등록" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/products" />
        <AdminProductForm cancelHref="/admin/products" mode="create" />
      </div>
    </PageShell>
  );
}
