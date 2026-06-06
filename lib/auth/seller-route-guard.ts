import { redirect } from "next/navigation";

import {
  getAccessContext,
  getSellerStatusRedirectPath,
  type AccessContext,
} from "@/lib/auth/access";
import {
  isSellerGateExemptPath,
  isSellerStatusPath,
} from "@/lib/sellers/route-gate";
import { isSellerApproved } from "@/lib/sellers/types";

export async function enforceSellerRouteAccess(pathname: string): Promise<AccessContext> {
  const context = await getAccessContext();
  if (!context) {
    redirect(
      `/seller/login?next=${encodeURIComponent(pathname || "/seller/dashboard")}`,
    );
  }

  if (isSellerGateExemptPath(pathname) || isSellerStatusPath(pathname)) {
    return context;
  }

  if (context.isAdmin) {
    return context;
  }

  if (!context.seller) {
    redirect("/seller/apply");
  }

  if (!isSellerApproved(context.seller.status)) {
    redirect(getSellerStatusRedirectPath(context.seller.status));
  }

  return context;
}
