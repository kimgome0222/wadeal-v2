import { redirect } from "next/navigation";
import { AddressBookForm } from "@/components/address-book-form";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { safeRedirectPath } from "@/lib/auth/safe-redirect";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { ui } from "@/lib/ui";

type AddressNewPageProps = {
  searchParams: Promise<{ return?: string }>;
};

export default async function AddressNewPage({ searchParams }: AddressNewPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/mypage/addresses/new");
  }

  const { return: returnParam } = await searchParams;
  const returnPath = safeRedirectPath(returnParam ?? "/mypage/addresses");

  return (
    <PageShell>
      <SubHeader backHref={returnPath} title="배송지 등록" />
      <div className={ui.pageBody}>
        <AddressBookForm returnPath={returnPath} />
      </div>
    </PageShell>
  );
}
