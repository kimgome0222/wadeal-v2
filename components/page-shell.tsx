import type { ReactNode } from "react";

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
      className={`mx-auto min-h-screen max-w-[480px] bg-white shadow-soft ${withBottomNav ? "pb-24" : "pb-6"} ${className}`}
    >
      {children}
    </main>
  );
}
