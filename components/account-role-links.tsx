import Link from "next/link";

import type { RoleNavLink } from "@/lib/auth/role-nav";

type AccountRoleLinksProps = {
  links: RoleNavLink[];
};

export function AccountRoleLinks({ links }: AccountRoleLinksProps) {
  if (links.length <= 1) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-2 text-xs font-bold text-wadeal-muted">센터 바로가기</h2>
      <ul className="overflow-hidden rounded-xl border border-wadeal-line bg-white divide-y divide-wadeal-line">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              className="flex w-full cursor-pointer items-center justify-between px-4 py-4 active:bg-gray-50"
              href={link.href}
            >
              <span className="text-sm font-black text-wadeal-ink">{link.label}</span>
              <span aria-hidden className="text-gray-400">
                ›
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
