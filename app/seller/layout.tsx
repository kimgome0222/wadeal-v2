import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { enforceSellerRouteAccess } from "@/lib/auth/seller-route-guard";

export const dynamic = "force-dynamic";

type SellerLayoutProps = {
  children: ReactNode;
};

export default async function SellerLayout({ children }: SellerLayoutProps) {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") ?? "/seller";

  await enforceSellerRouteAccess(pathname);

  return children;
}
