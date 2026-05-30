import { redirect } from "next/navigation";

import { SellerSettlementsMockPanel } from "@/components/seller/seller-settlements-mock-panel";
import { SellerBusinessInfoRequired } from "@/components/seller-business-info-required";
import { SellerSettlementsContent } from "@/components/seller-settlements-content";
import { SellerShell } from "@/components/seller-shell";
import { getSellerAccessContext } from "@/lib/auth/seller-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getSellerSettlementRecords } from "@/lib/data/seller-settlement-records";
import { getSellerSetupStatus } from "@/lib/sellers/setup-status";
import { showSellerCenterMock } from "@/lib/sellers/show-seller-mock";

export const dynamic = "force-dynamic";

type SellerFinanceSettlementsPageProps = {
  searchParams: Promise<{ record?: string }>;
};

export default async function SellerFinanceSettlementsPage({
  searchParams,
}: SellerFinanceSettlementsPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/seller/finance/settlements");
  }

  const { seller, isApproved } = await getSellerAccessContext(user);
  if (!seller) {
    redirect("/seller/apply");
  }

  const setup = getSellerSetupStatus(seller);

  if (!isApproved || !setup.canManageSettlements) {
    return (
      <SellerShell title="정산 내역">
        <SellerBusinessInfoRequired />
      </SellerShell>
    );
  }

  const { record } = await searchParams;
  const records = await getSellerSettlementRecords(seller.id);

  return (
    <SellerShell title="정산 내역">
      {records.length === 0 && showSellerCenterMock() ?
        <SellerSettlementsMockPanel />
      : <SellerSettlementsContent records={records} selectedRecordId={record ?? null} />}
    </SellerShell>
  );
}
