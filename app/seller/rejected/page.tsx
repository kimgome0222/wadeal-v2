import { redirect } from "next/navigation";

import { SellerStatusScreen } from "@/components/seller-status-screen";
import { SellerShell } from "@/components/seller-shell";
import { getAccessContext } from "@/lib/auth/access";
import { isSellerApproved } from "@/lib/sellers/types";

export const dynamic = "force-dynamic";

export default async function SellerRejectedPage() {
  const context = await getAccessContext();
  if (!context) {
    redirect("/login?next=/seller/rejected");
  }

  if (context.isAdmin || (context.seller && isSellerApproved(context.seller.status))) {
    redirect("/seller/dashboard");
  }

  if (!context.seller) {
    redirect("/seller/apply");
  }

  if (context.seller.status === "suspended") {
    redirect("/seller/suspended");
  }

  if (context.seller.status !== "rejected") {
    redirect("/seller/pending");
  }

  return (
    <SellerShell title="입점 반려">
      <SellerStatusScreen
        rejectionReason={context.seller.rejectedReason}
        status={context.seller.status}
      />
    </SellerShell>
  );
}
