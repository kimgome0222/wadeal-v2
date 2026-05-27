import { PaymentSetupForm } from "@/components/payment-setup-form";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";

export default function PaymentNewPage() {
  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="결제수단 등록" />
      <div className="px-4 py-4">
        <PaymentSetupForm />
      </div>
    </PageShell>
  );
}
