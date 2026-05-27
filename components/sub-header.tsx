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
    <header className="sticky top-0 z-20 flex h-12 items-center gap-2 border-b border-wadeal-line bg-white px-3">
      <button
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-lg font-black text-wadeal-ink active:bg-gray-100"
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
      <h1 className="min-w-0 flex-1 truncate text-base font-black text-wadeal-ink">
        {title}
      </h1>
      <Link
        className="shrink-0 text-sm font-black text-wadeal-red"
        href="/"
      >
        Wadeal
      </Link>
    </header>
  );
}
