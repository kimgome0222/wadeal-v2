"use client";

import Link from "next/link";
import { ui } from "@/lib/ui";

type RouteErrorFallbackProps = {
  title?: string;
  description?: string;
  reset: () => void;
};

export function RouteErrorFallback({
  title = "문제가 발생했어요",
  description = "잠시 후 다시 시도해 주세요.",
  reset,
}: RouteErrorFallbackProps) {
  return (
    <main className={`${ui.pageWrap} flex min-h-screen flex-col items-center justify-center px-6 pb-24 text-center shadow-soft`}>
      <p className="text-base font-black text-wadeal-ink">{title}</p>
      <p className="mt-2 text-sm font-bold leading-relaxed text-wadeal-muted">{description}</p>
      <div className="mt-6 flex w-full max-w-xs flex-col gap-2">
        <button
          className={`${ui.btnPrimary} cursor-pointer`}
          onClick={reset}
          type="button"
        >
          다시 시도
        </button>
        <Link className={`${ui.btnOutline} cursor-pointer`} href="/">
          홈으로 가기
        </Link>
      </div>
    </main>
  );
}
