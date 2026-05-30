"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { homeCategoryIcons } from "@/lib/categories";
import { ds } from "@/lib/design-system";

export function HomeCategoryIcons() {
  const pathname = usePathname();

  return (
    <section aria-label="카테고리" className="pt-2">
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-0.5">
        {homeCategoryIcons.map(({ id, label, href }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              className={`${ds.chip.base} ${active ? ds.chip.active : ds.chip.idle}`}
              href={href}
              key={id}
            >
              {label}
            </Link>
          );
        })}
        <Link className={`${ds.chip.base} ${ds.chip.idle}`} href="/categories">
          더보기
        </Link>
      </div>
    </section>
  );
}
