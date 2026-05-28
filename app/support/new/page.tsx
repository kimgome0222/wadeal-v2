import { Suspense } from "react";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { SupportTicketCreateForm } from "@/components/support-ticket-create-form";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getUserOrdersDetailed } from "@/lib/data/orders";
import {
  findInquirySubcategory,
  type InquiryChannel,
} from "@/lib/support/inquiry-options";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type SupportNewPageProps = {
  searchParams: Promise<{
    orderId?: string;
    productId?: string;
    type?: string;
    mode?: string;
    sub?: string;
    channel?: string;
  }>;
};

export default async function SupportNewPage({ searchParams }: SupportNewPageProps) {
  const user = await getServerAuthUser();

  if (!user) {
    redirect("/login?next=/support/new");
  }

  const params = await searchParams;
  const orders = await getUserOrdersDetailed(user.id);
  const presetSub = findInquirySubcategory(params.sub);
  const mode =
    params.mode === "cancel" || params.type === "cancel" ? "cancel"
    : params.mode === "refund" || params.type === "refund" ? "refund"
    : "general";
  const channel =
    params.channel === "kakao" || params.channel === "email" || params.channel === "app" ?
      (params.channel as InquiryChannel)
    : null;

  return (
    <PageShell>
      <SubHeader backHref="/support" title="1:1 문의 등록" />
      <div className={ui.pageBody}>
        <p className="mb-4 text-xs font-medium text-wadeal-muted">
          {presetSub ?
            `${presetSub.label} · ${presetSub.requiresOrder ? "최근 15일 구매 상품 선택" : "내용 입력"}`
          : mode === "cancel" ?
            "배송 전 주문 취소를 요청할 수 있어요."
          : mode === "refund" ?
            "배송 후 환불/교환 요청을 접수할 수 있어요."
          : "문의 유형과 내용을 입력해 주세요."}
        </p>
        <Suspense fallback={<p className="text-sm text-wadeal-muted">불러오는 중...</p>}>
          <SupportTicketCreateForm
            initialChannel={channel}
            initialOrderId={params.orderId ?? null}
            initialProductId={params.productId ?? null}
            initialSubId={params.sub ?? null}
            initialType={presetSub?.ticketType ?? params.type ?? null}
            mode={mode}
            orders={orders}
          />
        </Suspense>
      </div>
    </PageShell>
  );
}
