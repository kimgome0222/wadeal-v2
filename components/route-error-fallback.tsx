"use client";

import Link from "next/link";
import { ds } from "@/lib/design-system";
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
    <main className={`${ui.pageWrap} flex min-h-screen flex-col items-center justify-center px-6 pb-24 text-center bg-white shadow-soft`}>
      <p className={ds.type.h2}>{title}</p>
      <p className={`mt-2 ${ds.type.bodySm}`}>{description}</p>
      <div className="mt-6 flex w-full max-w-xs flex-col gap-2">
        <button
          className={`${ui.btnPrimary} min-h-[44px] cursor-pointer`}
          onClick={reset}
          type="button"
        >
          다시 시도
        </button>
        <Link className={`${ui.btnOutline} min-h-[44px] cursor-pointer`} href="/">
          홈으로 가기
        </Link>
        <button
          className={`${ds.btn.ghost} min-h-[44px] w-full`}
          onClick={() => window.history.back()}
          type="button"
        >
          이전 페이지
        </button>
      </div>
    </main>
  );
}
