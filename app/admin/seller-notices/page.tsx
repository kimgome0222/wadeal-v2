import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAdminSellerNotices } from "@/lib/data/seller-notices";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminSellerNoticesPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/seller-notices");
  }

  if (!(await isAdminUser(user))) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="판매자 공지" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const notices = await getAdminSellerNotices();

  return (
    <PageShell>
      <SubHeader backHref="/" title="판매자 공지" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/seller-notices" />
        <Link className={`${ui.btnPrimary} h-11 cursor-pointer`} href="/admin/seller-notices/new">
          공지 작성
        </Link>
        <div className="space-y-3">
          {notices.length === 0 ?
            <div className={`${ui.panel} py-8 text-center text-sm font-bold text-wadeal-muted`}>
              등록된 공지가 없어요.
            </div>
          : notices.map((notice) => (
              <Link
                className={`${ui.panel} block space-y-1`}
                href={`/admin/seller-notices/${notice.id}/edit`}
                key={notice.id}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black text-wadeal-ink">
                    {notice.isImportant ? "[중요] " : ""}
                    {notice.title}
                  </p>
                  <span className="text-[10px] font-bold text-wadeal-muted">{notice.statusLabel}</span>
                </div>
                <p className="text-xs font-bold text-wadeal-muted">
                  {notice.categoryLabel} · {new Date(notice.updatedAt).toLocaleDateString("ko-KR")}
                </p>
              </Link>
            ))
          }
        </div>
      </div>
    </PageShell>
  );
}
