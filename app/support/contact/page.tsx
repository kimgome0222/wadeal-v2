import Link from "next/link";

import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { SupportContactMockForm } from "@/components/support/support-contact-mock-form";
import { SubHeader } from "@/components/sub-header";
import { ui } from "@/lib/ui";

export default function SupportContactPage() {
  return (
    <AppBuyerLayout showCategoryBar={false} showSearch={false}>
      <SubHeader backHref="/support" title="1:1 문의" />
      <div className={`${ui.pageBody} space-y-4 pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]`}>
        <p className="text-xs font-medium text-wadeal-muted">
          로그인 후 주문 연동 문의는{" "}
          <Link className="font-semibold text-wadeal-red" href="/support/new">
            기존 1:1 문의
          </Link>
          를 이용할 수 있습니다.
        </p>
        <SupportContactMockForm />
      </div>
    </AppBuyerLayout>
  );
}
