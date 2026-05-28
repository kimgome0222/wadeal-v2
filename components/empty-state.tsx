import Link from "next/link";
import { ui } from "@/lib/ui";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-xl border border-dashed border-wadeal-line bg-white px-6 py-12 text-center ${className}`}
    >
      <p className="text-sm font-black text-wadeal-ink">{title}</p>
      {description ?
        <p className="mt-1.5 text-xs font-bold leading-relaxed text-wadeal-muted">
          {description}
        </p>
      : null}
      {actionLabel && actionHref ?
        <Link
          className={`${ui.btnPrimary} mx-auto mt-5 max-w-[240px] cursor-pointer`}
          href={actionHref}
        >
          {actionLabel}
        </Link>
      : null}
    </div>
  );
}
