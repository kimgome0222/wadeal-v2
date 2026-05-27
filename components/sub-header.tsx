"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type SubHeaderProps = {
  title: string;
  backHref?: string;
};

export function SubHeader({ title, backHref }: SubHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-20 flex h-11 items-center gap-2 border-b border-wadeal-line bg-white/95 px-3 backdrop-blur">
      <button
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg font-black text-wadeal-ink active:bg-gray-100"
        onClick={() => {
          if (backHref) {
            router.push(backHref);
            return;
          }
          if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
            return;
          }
          router.push("/");
        }}
        type="button"
        aria-label="뒤로가기"
      >
        ←
      </button>
      <h1 className="min-w-0 flex-1 truncate text-[15px] font-black text-wadeal-ink">
        {title}
      </h1>
      <Link
        className="shrink-0 text-[13px] font-black text-wadeal-red"
        href="/"
      >
        홈
      </Link>
    </header>
  );
}
