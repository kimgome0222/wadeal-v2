import { redirect } from "next/navigation";
import { AddressesBookContent } from "@/components/addresses-book-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { safeRedirectPath } from "@/lib/auth/safe-redirect";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getUserAddresses } from "@/lib/data/addresses";
import { ui } from "@/lib/ui";

type AddressesPageProps = {
  searchParams: Promise<{ return?: string }>;
};

export default async function AddressesPage({ searchParams }: AddressesPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/mypage/addresses");
  }

  const { return: returnParam } = await searchParams;
  const returnPath = safeRedirectPath(returnParam ?? "/mypage");
  const addresses = await getUserAddresses(user.id);
  const newAddressHref =
    returnParam ?
      `/mypage/addresses/new?return=${encodeURIComponent(returnPath)}`
    : "/mypage/addresses/new";

  return (
    <PageShell>
      <SubHeader backHref={returnPath} title="배송지 관리" />
      <div className={ui.pageBody}>
        <AddressesBookContent addresses={addresses} newAddressHref={newAddressHref} />
      </div>
    </PageShell>
  );
}
