import { PaymentSetupForm } from "@/components/payment-setup-form";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { safeRedirectPath } from "@/lib/auth/safe-redirect";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { ui } from "@/lib/ui";
import { redirect } from "next/navigation";

type PaymentNewPageProps = {
  searchParams: Promise<{ return?: string }>;
};

export default async function PaymentNewPage({ searchParams }: PaymentNewPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/mypage/payment/new");
  }

  const { return: returnParam } = await searchParams;
  const returnPath = safeRedirectPath(returnParam ?? "/mypage/payment");

  return (
    <PageShell>
      <SubHeader backHref={returnPath} title="결제수단 등록" />
      <div className={ui.pageBody}>
        <PaymentSetupForm returnPath={returnPath} />
      </div>
    </PageShell>
  );
}
