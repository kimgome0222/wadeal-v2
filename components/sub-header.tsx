import Link from "next/link";

import { ds } from "@/lib/design-system";

type SubHeaderProps = {
  title: string;
  backHref?: string;
};

export function SubHeader({ title, backHref = "/" }: SubHeaderProps) {
  return (
    <header className={ds.chrome.subHeader}>
      <Link
        aria-label="뒤로가기"
        className="relative z-10 flex h-10 min-h-[44px] w-10 min-w-[44px] shrink-0 cursor-pointer items-center justify-center rounded-lg text-lg font-normal text-wadeal-ink active:bg-[#F8FAF8]"
        href={backHref}
      >
        ←
      </Link>
      <h1 className={`pointer-events-none relative z-0 min-w-0 flex-1 truncate px-1 ${ds.type.h2}`}>
        {title}
      </h1>
      <Link
        aria-label="홈으로"
        className="relative z-10 flex h-10 min-h-[44px] min-w-[44px] shrink-0 cursor-pointer items-center justify-center px-2 text-[12px] font-medium text-wadeal-muted active:text-wadeal-ink"
        href="/"
      >
        홈
      </Link>
    </header>
  );
}
