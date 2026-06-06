import { redirect } from "next/navigation";

import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { AdminSellerProductRequestsContent } from "@/components/admin-seller-product-requests-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAdminSellerProductRequests } from "@/lib/data/admin-seller-product-requests";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminProductRequestsPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/product-requests");
  }

  const isAdmin = await isAdminUser(user);
  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="상품 승인센터" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const requests = await getAdminSellerProductRequests({ status: "pending_queue" });

  return (
    <PageShell>
      <SubHeader backHref="/" title="상품 승인센터" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/product-requests" />
        <p className="text-xs font-bold text-wadeal-muted">
          판매자 상품 등록 요청을 검토하고 승인·반려할 수 있어요.
        </p>
        <AdminSellerProductRequestsContent requests={requests} />
      </div>
    </PageShell>
  );
}
