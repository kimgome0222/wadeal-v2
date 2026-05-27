import { PaymentSetupForm } from "@/components/payment-setup-form";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { DEFAULT_CHECKOUT_RETURN } from "@/lib/mock-storage";
import { ui } from "@/lib/ui";

type PaymentNewPageProps = {
  searchParams: Promise<{ return?: string }>;
};

export default async function PaymentNewPage({ searchParams }: PaymentNewPageProps) {
  const { return: returnParam } = await searchParams;
  const returnPath = returnParam ?? DEFAULT_CHECKOUT_RETURN;

  return (
    <PageShell>
      <SubHeader backHref={returnPath} title="결제수단 등록" />
      <div className={ui.pageBody}>
        <PaymentSetupForm returnPath={returnPath} />
      </div>
    </PageShell>
  );
}
