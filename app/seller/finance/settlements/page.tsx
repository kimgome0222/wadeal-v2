import { SellerSettlementsContent } from "@/components/seller-settlements-content";
import { SellerShell } from "@/components/seller-shell";
import { getSellerAccessContext } from "@/lib/auth/seller-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getSellerSettlementRecords } from "@/lib/data/seller-settlement-records";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type SellerFinanceSettlementsPageProps = {
  searchParams: Promise<{ record?: string }>;
};

export default async function SellerFinanceSettlementsPage({
  searchParams,
}: SellerFinanceSettlementsPageProps) {
  const user = await getServerAuthUser();
  const { seller, isApproved } = await getSellerAccessContext(user);

  if (!seller || !isApproved) {
    redirect("/seller/apply");
  }

  const { record } = await searchParams;
  const records = await getSellerSettlementRecords(seller.id);

  return (
    <SellerShell title="정산 내역">
      <SellerSettlementsContent records={records} selectedRecordId={record ?? null} />
    </SellerShell>
  );
}
