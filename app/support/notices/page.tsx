import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { SupportNoticesMockList } from "@/components/support/support-notices-mock-list";
import { SubHeader } from "@/components/sub-header";
import { ui } from "@/lib/ui";

export default function SupportNoticesPage() {
  return (
    <AppBuyerLayout showCategoryBar={false} showSearch={false}>
      <SubHeader backHref="/support" title="공지사항" />
      <div className={`${ui.pageBody} pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]`}>
        <SupportNoticesMockList />
      </div>
    </AppBuyerLayout>
  );
}
