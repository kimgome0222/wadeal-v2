import type { ReactNode } from "react";
import { ui } from "@/lib/ui";

type PageShellProps = {
  children: ReactNode;
  withBottomNav?: boolean;
  className?: string;
};

export function PageShell({
  children,
  withBottomNav = false,
  className = "",
}: PageShellProps) {
  return (
    <main
      className={`${ui.pageWrap} shadow-soft ${withBottomNav ? "pb-24" : "pb-6"} ${className}`}
    >
      {children}
    </main>
  );
}
