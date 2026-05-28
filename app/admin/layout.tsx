import type { ReactNode } from "react";

import { requireAdmin } from "@/lib/auth/access";

export const dynamic = "force-dynamic";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await requireAdmin();
  return children;
}
