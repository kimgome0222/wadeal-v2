import type { User } from "@supabase/supabase-js";

import { getSellerByUserId, type SellerRecord } from "@/lib/data/sellers";
import { isSellerApproved } from "@/lib/sellers/types";

export type SellerAccessContext = {
  seller: SellerRecord | null;
  isApproved: boolean;
  hasApplication: boolean;
};

export async function getSellerAccessContext(user: User | null): Promise<SellerAccessContext> {
  if (!user) {
    return { seller: null, isApproved: false, hasApplication: false };
  }

  const seller = await getSellerByUserId(user.id);

  return {
    seller,
    isApproved: seller ? isSellerApproved(seller.status) : false,
    hasApplication: seller != null,
  };
}

export { isSellerGateExemptPath } from "@/lib/sellers/route-gate";
