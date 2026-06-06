import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { AdminReviewsContent } from "@/components/admin-reviews-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAdminReviews, type AdminReviewFilter } from "@/lib/data/admin-reviews";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type AdminReviewsPageProps = {
  searchParams: Promise<{ filter?: string }>;
};

function parseFilter(value: string | undefined): AdminReviewFilter {
  return value === "reported" ? "reported" : "all";
}

export default async function AdminReviewsPage({ searchParams }: AdminReviewsPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/reviews");
  }

  const isAdmin = await isAdminUser(user);

  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="리뷰 관리" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const { filter: filterParam } = await searchParams;
  const filter = parseFilter(filterParam);
  const reviews = await getAdminReviews(filter);

  return (
    <PageShell>
      <SubHeader backHref="/" title="리뷰 관리" />
      <div className={`${ui.pageBody} space-y-3`}>
        <AdminNav current="/admin/reviews" />
        <p className="text-xs font-bold text-wadeal-muted">
          전체 리뷰를 확인하고 노출 상태를 관리할 수 있어요.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Link
            className={`${ui.btnOutline} h-10 text-xs ${filter === "all" ? "border-wadeal-red text-wadeal-red" : ""}`}
            href="/admin/reviews"
          >
            전체 리뷰
          </Link>
          <Link
            className={`${ui.btnOutline} h-10 text-xs ${filter === "reported" ? "border-wadeal-red text-wadeal-red" : ""}`}
            href="/admin/reviews?filter=reported"
          >
            신고된 리뷰
          </Link>
        </div>
        <AdminReviewsContent filter={filter} reviews={reviews} />
      </div>
    </PageShell>
  );
}
