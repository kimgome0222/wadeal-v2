import { AddressSetupForm } from "@/components/address-setup-form";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";

export default function AddressNewPage() {
  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="배송지 등록" />
      <div className="px-4 py-4">
        <AddressSetupForm />
      </div>
    </PageShell>
  );
}
