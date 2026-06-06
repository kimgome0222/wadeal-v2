import { redirect } from "next/navigation";
import { SavedPaymentMethodsContent } from "@/components/saved-payment-methods-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { safeRedirectPath } from "@/lib/auth/safe-redirect";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { listSavedPaymentMethodsForUser } from "@/lib/data/saved-payment-methods";
import { ui } from "@/lib/ui";

type PaymentPageProps = {
  searchParams: Promise<{ return?: string }>;
};

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/mypage/payment");
  }

  const { return: returnParam } = await searchParams;
  const returnPath = safeRedirectPath(returnParam ?? "/mypage");
  const savedMethods = await listSavedPaymentMethodsForUser(user.id);
  const paymentNewHref =
    returnParam ?
      `/mypage/payment/new?return=${encodeURIComponent(returnPath)}`
    : "/mypage/payment/new";

  return (
    <PageShell>
      <SubHeader backHref={returnPath} title="결제수단 관리" />
      <div className={`${ui.pageBody} space-y-3`}>
        <SavedPaymentMethodsContent methods={savedMethods} paymentNewHref={paymentNewHref} />
        <p className="text-[11px] font-bold leading-relaxed text-wadeal-muted">
          자동결제 예약에 사용할 카드를 등록·관리할 수 있어요. celloh는 카드번호·CVC를 직접
          저장하지 않으며, 카드 뒤 4자리만 표시됩니다. 빌링키는 PG 연동 후 서버에 안전하게
          저장돼요.
        </p>
      </div>
    </PageShell>
  );
}
