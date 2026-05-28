import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAdminNotifications } from "@/lib/data/admin-notifications";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/notifications");
  }

  const isAdmin = await isAdminUser(user);
  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="알림센터" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const notifications = await getAdminNotifications(100);

  return (
    <PageShell>
      <SubHeader backHref="/admin/dashboard" title="관리자 알림센터" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/notifications" />
        <p className="text-xs font-bold text-wadeal-muted">
          판매자 승인, 상품 검수, 주문·결제 이슈 등 관리자 대상 알림을 확인할 수 있어요.
        </p>

        <div className="space-y-3">
          {notifications.map((item) => (
            <div className={`${ui.panel} flex items-center justify-between gap-4`} key={item.id}>
              <div className="min-w-0">
                <p className="text-sm font-black text-wadeal-ink">{item.title}</p>
                <p className="mt-1 text-xs font-bold text-wadeal-muted">{item.message}</p>
                <p className="mt-2 text-[11px] font-bold text-wadeal-muted">
                  {new Date(item.createdAt).toLocaleString("ko-KR")}
                </p>
              </div>

              {item.linkUrl ?
                <Link className={`${ui.btnOutline} h-9 shrink-0 px-3 text-xs`} href={item.linkUrl}>
                  보기
                </Link>
              : null}
            </div>
          ))}

          {notifications.length === 0 ?
            <div className={`${ui.panel} py-10 text-center`}>
              <p className="text-sm font-bold text-wadeal-muted">아직 관리자 알림이 없습니다.</p>
            </div>
          : null}
        </div>
      </div>
    </PageShell>
  );
}
