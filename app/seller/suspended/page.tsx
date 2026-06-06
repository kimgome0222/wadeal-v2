import { redirect } from "next/navigation";

import { SellerStatusScreen } from "@/components/seller-status-screen";
import { SellerShell } from "@/components/seller-shell";
import { getAccessContext } from "@/lib/auth/access";
import { isSellerApproved } from "@/lib/sellers/types";

export const dynamic = "force-dynamic";

export default async function SellerSuspendedPage() {
  const context = await getAccessContext();
  if (!context) {
    redirect("/login?next=/seller/suspended");
  }

  if (context.isAdmin || (context.seller && isSellerApproved(context.seller.status))) {
    redirect("/seller/dashboard");
  }

  if (!context.seller) {
    redirect("/seller/apply");
  }

  if (context.seller.status !== "suspended") {
    if (context.seller.status === "rejected") {
      redirect("/seller/rejected");
    }
    redirect("/seller/pending");
  }

  return (
    <SellerShell title="이용 제한">
      <SellerStatusScreen status={context.seller.status} />
    </SellerShell>
  );
}
