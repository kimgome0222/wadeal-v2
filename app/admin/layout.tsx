import { headers } from "next/headers";
import type { ReactNode } from "react";

import { requireAdmin } from "@/lib/auth/access";

export const dynamic = "force-dynamic";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") ?? "/admin";

  if (pathname !== "/admin/login") {
    await requireAdmin();
  }

  return children;
}
