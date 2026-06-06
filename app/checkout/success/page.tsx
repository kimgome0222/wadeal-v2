import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { CellohPaySuccessContent } from "@/components/celloh-pay/celloh-pay-success-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getUnreadCountForUser } from "@/lib/data/notifications";

export const dynamic = "force-dynamic";

/** 셀로페이 mock 주문완료 */
export default async function CheckoutSuccessPage() {
  const user = await getServerAuthUser();
  const unreadNotificationCount = user ? await getUnreadCountForUser(user.id) : 0;

  return (
    <AppBuyerLayout
      showBottomNav={false}
      showCategoryBar={false}
      showSearch={false}
      unreadNotificationCount={unreadNotificationCount}
    >
      <PageShell>
        <SubHeader backHref="/" title="주문 완료" />
        <CellohPaySuccessContent />
      </PageShell>
    </AppBuyerLayout>
  );
}
