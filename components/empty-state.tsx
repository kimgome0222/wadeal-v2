import Link from "next/link";
import { ds } from "@/lib/design-system";
import { ui } from "@/lib/ui";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
  compact?: boolean;
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
  compact = false,
  variant = "default",
}: EmptyStateProps) {
  return (
    <div
      className={`${compact ? "flex flex-col items-center px-4 py-8 text-center" : ds.empty.wrap} ${className}`}
    >
      <div
        aria-hidden
        className={
          compact ?
            "mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F7F6] text-[#2E5E4E]"
          : ds.empty.icon
        }
      >
        <span className={compact ? "text-base" : "text-xl"}>{ICONS[variant]}</span>
      </div>
      <p className={compact ? "text-[16px] font-bold text-[#111111]" : ds.empty.title}>{title}</p>
      {description ?
        <p
          className={
            compact ?
              "mt-2 max-w-[280px] text-[13px] leading-relaxed text-[#666666]"
            : ds.empty.description
          }
        >
          {description}
        </p>
      : null}
      {actionLabel && actionHref ?
        <Link className={`${ui.btnPrimary} mx-auto max-w-[280px] ${ds.empty.action}`} href={actionHref}>
          {actionLabel}
        </Link>
      : null}
    </div>
  );
}
