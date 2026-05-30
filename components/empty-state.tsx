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
    <div className={`${ds.empty.wrap} ${className}`}>
      <div aria-hidden className={ds.empty.icon}>
        <span className="text-xl">{ICONS[variant]}</span>
      </div>
      <p className={ds.empty.title}>{title}</p>
      {description ?
        <p className={ds.empty.description}>{description}</p>
      : null}
      {actionLabel && actionHref ?
        <Link className={`${ui.btnPrimary} mx-auto max-w-[280px] ${ds.empty.action}`} href={actionHref}>
          {actionLabel}
        </Link>
      : null}
    </div>
  );
}
