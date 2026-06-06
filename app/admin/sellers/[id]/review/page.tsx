import { notFound, redirect } from "next/navigation";

import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { AdminSellerReviewForm } from "@/components/admin-seller-review-form";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  getSellerDocumentsForAdmin,
  getSellerReviewChecksForAdmin,
} from "@/lib/data/seller-review";
import { getSellerById } from "@/lib/data/sellers";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type AdminSellerReviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminSellerReviewPage({ params }: AdminSellerReviewPageProps) {
  const { id: sellerId } = await params;
  const user = await getServerAuthUser();
  if (!user) {
    redirect(`/login?next=/admin/sellers/${sellerId}/review`);
  }

  const isAdmin = await isAdminUser(user);
  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="입점 심사" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const seller = await getSellerById(sellerId);
  if (!seller) {
    notFound();
  }

  const [documents, checks] = await Promise.all([
    getSellerDocumentsForAdmin(sellerId),
    getSellerReviewChecksForAdmin(sellerId),
  ]);

  return (
    <PageShell>
      <SubHeader backHref="/admin/sellers" title="입점 심사" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/sellers" />
        <AdminSellerReviewForm documents={documents} initialChecks={checks} seller={seller} />
      </div>
    </PageShell>
  );
}
