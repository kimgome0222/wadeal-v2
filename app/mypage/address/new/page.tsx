import { AddressSetupForm } from "@/components/address-setup-form";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { ui } from "@/lib/ui";

export default function AddressNewPage() {
  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="배송지 등록" />
      <div className={ui.pageBody}>
        <AddressSetupForm />
      </div>
    </PageShell>
  );
}
