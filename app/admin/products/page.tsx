import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { AdminProductsContent } from "@/components/admin-products-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAdminProducts } from "@/lib/data/admin-products";
import {
  isProductApprovalStatus,
  type ProductApprovalFilter,
} from "@/lib/products/approval-status";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type AdminProductsPageProps = {
  searchParams: Promise<{ approval?: string }>;
};

function parseApprovalFilter(value?: string): ProductApprovalFilter {
  if (!value || value === "all") {
    return "all";
  }

  return isProductApprovalStatus(value) ? value : "all";
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/products");
  }

  const isAdmin = await isAdminUser(user);

  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="상품 관리" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const params = await searchParams;
  const approvalFilter = parseApprovalFilter(params.approval);
  const products = await getAdminProducts(approvalFilter);

  return (
    <PageShell>
      <SubHeader backHref="/" title="상품 관리" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/products" />
        <p className="text-xs font-bold text-wadeal-muted">
          공동구매 상품을 등록하고 검수·승인할 수 있어요.
        </p>
        <Link className={`${ui.btnPrimary} h-11 cursor-pointer`} href="/admin/products/new">
          상품 등록
        </Link>
        <AdminProductsContent approvalFilter={approvalFilter} products={products} />
      </div>
    </PageShell>
  );
}
