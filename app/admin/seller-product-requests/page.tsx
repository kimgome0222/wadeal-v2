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

export default async function AdminSellerProductRequestsPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/seller-product-requests");
  }

  const isAdmin = await isAdminUser(user);
  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="판매자 상품 승인" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const requests = await getAdminSellerProductRequests({ status: "pending_queue" });

  return (
    <PageShell>
      <SubHeader backHref="/" title="판매자 상품 승인" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/seller-product-requests" />
        <p className="text-xs font-bold text-wadeal-muted">
          판매자가 등록 요청한 상품을 검토하고 승인·반려할 수 있어요.
        </p>
        <AdminSellerProductRequestsContent requests={requests} />
      </div>
    </PageShell>
  );
}
