import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { getServerAuthUser } from "@/lib/auth/server-session";
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

export type SellerCenterPageContext = {
  user: User;
  seller: SellerRecord | null;
  isApproved: boolean;
};

/** 주문·문의 등 UI 페이지용 — seller 없을 때 throw/redirect 대신 빈 상태 처리 */
export async function getSellerCenterPageContext(
  nextPath: string,
): Promise<SellerCenterPageContext> {
  const user = await getServerAuthUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  const access = await getSellerAccessContext(user);

  return {
    user,
    seller: access.seller,
    isApproved: access.isApproved,
  };
}
