import { PaymentSetupForm } from "@/components/payment-setup-form";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { ui } from "@/lib/ui";

export default function PaymentNewPage() {
  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="결제수단 등록" />
      <div className={ui.pageBody}>
        <PaymentSetupForm />
      </div>
    </PageShell>
  );
}
