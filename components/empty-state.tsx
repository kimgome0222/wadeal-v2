import Link from "next/link";
import { ds } from "@/lib/design-system";
import { ui } from "@/lib/ui";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
  /** shopping | orders | saved | search */
  variant?: "default" | "shopping" | "orders" | "saved" | "search";
};

const ICONS = {
  default: "○",
  shopping: "▢",
  orders: "☰",
  saved: "♡",
  search: "⌕",
} as const;

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  className = "",
  variant = "default",
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-xl border border-[#DDE8E2] bg-[#FAFBFA] px-6 py-12 text-center ${className}`}
    >
      <div
        aria-hidden
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-wadeal-line/60 bg-white text-lg text-[#2E5E4E]"
      >
        {ICONS[variant]}
      </div>
      <p className={`mt-4 ${ds.type.h3}`}>{title}</p>
      {description ?
        <p className={`mt-2 ${ds.type.bodySm}`}>{description}</p>
      : null}
      {actionLabel && actionHref ?
        <Link
          className={`${ui.btnPrimary} mx-auto mt-6 max-w-[240px] cursor-pointer`}
          href={actionHref}
        >
          {actionLabel}
        </Link>
      : null}
    </div>
  );
}
