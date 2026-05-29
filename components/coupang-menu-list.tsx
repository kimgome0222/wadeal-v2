import Link from "next/link";
import type { ReactNode } from "react";

import { ui } from "@/lib/ui";

export type CoupangMenuItem = {
  label: string;
  href: string;
  meta?: string;
  badge?: ReactNode;
};

type CoupangMenuListProps = {
  items: CoupangMenuItem[];
  className?: string;
};

export function CoupangMenuList({ items, className = "" }: CoupangMenuListProps) {
  return (
    <ul
      className={`overflow-hidden rounded-xl border border-wadeal-line bg-white ${ui.listDivider} ${className}`.trim()}
    >
      {items.map((item) => (
        <li key={`${item.href}-${item.label}`}>
          <Link
            className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3.5 transition-colors duration-150 active:bg-gray-50"
            href={item.href}
          >
            <span className="text-sm font-semibold text-wadeal-ink">{item.label}</span>
            <span className="flex shrink-0 items-center gap-2">
              {item.badge}
              {item.meta ?
                <span className="text-xs font-medium text-wadeal-muted">{item.meta}</span>
              : null}
              <span aria-hidden className="text-gray-400">
                ›
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

type CoupangMenuSectionProps = {
  title?: string;
  items: CoupangMenuItem[];
};

export function CoupangMenuSection({ title, items }: CoupangMenuSectionProps) {
  return (
    <section>
      {title ?
        <h2 className="mb-2 text-xs font-bold text-wadeal-muted">{title}</h2>
      : null}
      <CoupangMenuList items={items} />
    </section>
  );
}
