import { notFound, redirect } from "next/navigation";
import { AddressBookForm } from "@/components/address-book-form";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAddressById } from "@/lib/data/addresses";
import { ui } from "@/lib/ui";

type AddressEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AddressEditPage({ params }: AddressEditPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/mypage/addresses");
  }

  const { id } = await params;
  const address = await getAddressById(id, user.id);

  if (!address) {
    notFound();
  }

  return (
    <PageShell>
      <SubHeader backHref="/mypage/addresses" title="배송지 수정" />
      <div className={ui.pageBody}>
        <AddressBookForm initialAddress={address} returnPath="/mypage/addresses" />
      </div>
    </PageShell>
  );
}
