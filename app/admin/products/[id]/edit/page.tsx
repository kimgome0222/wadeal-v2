import { notFound, redirect } from "next/navigation";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminFinalizeDealButton } from "@/components/admin-finalize-deal-button";
import { AdminNav } from "@/components/admin-nav";
import { AdminProductForm } from "@/components/admin-product-form";
import { AdminProductReviewActions } from "@/components/admin-product-review-actions";
import { AdminProductReviewChecklist } from "@/components/admin-product-review-checklist";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { detectAllReviewKeywords } from "@/lib/content/prohibited-keywords";
import {
  getCategoryReviewRulesBySlug,
  getProductCategorySlug,
} from "@/lib/data/category-review-rules";
import { getAdminProductById } from "@/lib/data/admin-products";
import { getProductReviewChecksForAdmin } from "@/lib/data/product-review-checklist";
import { categoryTitles, type CategorySlug } from "@/lib/categories";
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

  const categorySlug = await getProductCategorySlug(id);
  const categoryRules = await getCategoryReviewRulesBySlug(categorySlug);
  const reviewChecks = await getProductReviewChecksForAdmin(id);
  const keywordScan = detectAllReviewKeywords(product.name);
  const categoryLabel =
    categorySlug && categorySlug in categoryTitles
      ? categoryTitles[categorySlug as CategorySlug]
      : null;

  return (
    <PageShell>
      <SubHeader backHref="/admin/products" title="상품 수정" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/products" />
        {product.status === "active" && product.approvalStatus === "approved" ?
          <AdminFinalizeDealButton dealId={product.dealId} />
        : null}
        <AdminProductReviewActions layout="detail" product={product} />
        <AdminProductReviewChecklist
          approvalStatus={product.approvalStatus}
          categoryRules={categoryRules}
          categorySlug={categoryLabel}
          initialChecks={reviewChecks}
          productId={product.productId}
          productName={product.name}
          prohibitedKeywords={keywordScan.prohibited}
          warningKeywords={keywordScan.warning}
        />
        <AdminProductForm cancelHref="/admin/products" mode="edit" product={product} />
      </div>
    </PageShell>
  );
}
