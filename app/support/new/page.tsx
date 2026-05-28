import { redirect } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { SupportTicketCreateForm } from "@/components/support-ticket-create-form";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getUserOrdersDetailed } from "@/lib/data/orders";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type SupportNewPageProps = {
  searchParams: Promise<{
    orderId?: string;
    productId?: string;
    type?: string;
    mode?: string;
  }>;
};

export default async function SupportNewPage({ searchParams }: SupportNewPageProps) {
  const user = await getServerAuthUser();

  if (!user) {
    redirect("/login?next=/support/new");
  }

  const params = await searchParams;
  const orders = await getUserOrdersDetailed(user.id);
  const mode =
    params.mode === "cancel" || params.type === "cancel" ? "cancel"
    : params.mode === "refund" || params.type === "refund" ? "refund"
    : "general";

  return (
    <PageShell>
      <SubHeader backHref="/support" title="문의 등록" />
      <div className={ui.pageBody}>
        <p className="mb-4 text-xs font-bold text-wadeal-muted">
          {mode === "cancel" ?
            "배송 전 주문 취소를 요청할 수 있어요."
          : mode === "refund" ?
            "배송 후 환불/교환 요청을 접수할 수 있어요."
          : "문의 유형과 내용을 입력해 주세요."}
        </p>
        <SupportTicketCreateForm
          initialOrderId={params.orderId ?? null}
          initialProductId={params.productId ?? null}
          initialType={params.type ?? null}
          mode={mode}
          orders={orders}
        />
      </div>
    </PageShell>
  );
}
