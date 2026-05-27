"use client";

import Link from "next/link";

type SubHeaderProps = {
  title: string;
  /** When set, back control is a Link (reliable tap). Defaults to `/` if omitted. */
  backHref?: string;
};

export function SubHeader({ title, backHref = "/" }: SubHeaderProps) {
  return (
    <header className="relative z-30 flex h-11 items-center gap-2 border-b border-wadeal-line bg-white px-2">
      <Link
        aria-label="뒤로가기"
        className="relative z-10 flex h-11 min-h-[44px] w-11 min-w-[44px] shrink-0 items-center justify-center rounded-lg text-lg font-black text-wadeal-ink active:bg-gray-100"
        href={backHref}
      >
        ←
      </Link>
      <h1 className="pointer-events-none relative z-0 min-w-0 flex-1 truncate px-1 text-[15px] font-black text-wadeal-ink">
        {title}
      </h1>
      <Link
        aria-label="홈으로"
        className="relative z-10 flex h-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center px-2 text-[13px] font-black text-wadeal-red active:opacity-80"
        href="/"
      >
        홈
      </Link>
    </header>
  );
}
