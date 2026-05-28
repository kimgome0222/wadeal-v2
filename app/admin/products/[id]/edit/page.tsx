import { notFound, redirect } from "next/navigation";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminFinalizeDealButton } from "@/components/admin-finalize-deal-button";
import { AdminNav } from "@/components/admin-nav";
import { AdminProductForm } from "@/components/admin-product-form";
import { AdminProductReviewActions } from "@/components/admin-product-review-actions";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAdminProductById } from "@/lib/data/admin-products";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type AdminProductEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductEditPage({ params }: AdminProductEditPageProps) {
  const { id } = await params;
  const user = await getServerAuthUser();

  if (!user) {
    redirect(`/login?next=/admin/products/${id}/edit`);
  }

  const isAdmin = await isAdminUser(user);

  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/admin/products" title="상품 수정" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const product = await getAdminProductById(id);
  if (!product) {
    notFound();
  }

  return (
    <PageShell>
      <SubHeader backHref="/admin/products" title="상품 수정" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/products" />
        {product.status === "active" && product.approvalStatus === "approved" ?
          <AdminFinalizeDealButton dealId={product.dealId} />
        : null}
        <AdminProductReviewActions layout="detail" product={product} />
        <AdminProductForm cancelHref="/admin/products" mode="edit" product={product} />
      </div>
    </PageShell>
  );
}
