import { redirect } from "next/navigation";

import { SellerBillingsContent } from "@/components/seller-billings-content";
import { SellerShell } from "@/components/seller-shell";
import { getSellerAccessContext } from "@/lib/auth/seller-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getSellerBillings } from "@/lib/data/seller-billings";

export const dynamic = "force-dynamic";

export default async function SellerFinanceBillingPage() {
  const user = await getServerAuthUser();
  const { seller, isApproved } = await getSellerAccessContext(user);

  if (!seller || !isApproved) {
    redirect("/seller/apply");
  }

  const billings = await getSellerBillings(seller.id);

  return (
    <SellerShell title="청구 / 광고비">
      <SellerBillingsContent billings={billings} />
    </SellerShell>
  );
}
