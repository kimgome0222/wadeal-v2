import { AddressSetupForm } from "@/components/address-setup-form";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { DEFAULT_CHECKOUT_RETURN } from "@/lib/mock-storage";
import { ui } from "@/lib/ui";

type AddressNewPageProps = {
  searchParams: Promise<{ return?: string }>;
};

export default async function AddressNewPage({ searchParams }: AddressNewPageProps) {
  const { return: returnParam } = await searchParams;
  const returnPath = returnParam ?? DEFAULT_CHECKOUT_RETURN;

  return (
    <PageShell>
      <SubHeader backHref={returnPath} title="배송지 등록" />
      <div className={ui.pageBody}>
        <AddressSetupForm returnPath={returnPath} />
      </div>
    </PageShell>
  );
}
