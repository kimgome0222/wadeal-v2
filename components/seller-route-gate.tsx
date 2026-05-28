"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { SellerPendingScreen } from "@/components/seller-shell";
import type { SellerRecord } from "@/lib/data/sellers";
import { isSellerGateExemptPath } from "@/lib/sellers/route-gate";
import { isSellerApproved } from "@/lib/sellers/types";

type SellerRouteGateProps = {
  seller: SellerRecord | null;
  children: ReactNode;
};

export function SellerRouteGate({ seller, children }: SellerRouteGateProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (
      !seller &&
      !isSellerGateExemptPath(pathname) &&
      !pathname.startsWith("/seller/apply") &&
      !pathname.startsWith("/seller/settings")
    ) {
      router.replace("/seller/apply");
    }
  }, [pathname, router, seller]);

  if (!isSellerGateExemptPath(pathname) && seller && !isSellerApproved(seller.status)) {
    return <SellerPendingScreen status={seller.status} />;
  }

  if (
    !isSellerGateExemptPath(pathname) &&
    !seller &&
    !pathname.startsWith("/seller/apply") &&
    !pathname.startsWith("/seller/settings")
  ) {
    return null;
  }

  return children;
}
