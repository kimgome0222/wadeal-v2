"use client";

import Link from "next/link";
import { ds } from "@/lib/design-system";
import { CELLOH_BUTTONS, CELLOH_ERRORS } from "@/lib/copy/ux-writing";
import { ui } from "@/lib/ui";

type RouteErrorFallbackProps = {
  title?: string;
  description?: string;
  reset: () => void;
  showSupportLink?: boolean;
};

export function RouteErrorFallback({
  title = CELLOH_ERRORS.genericTitle,
  description = CELLOH_ERRORS.genericDescription,
  reset,
  showSupportLink = true,
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
          {CELLOH_BUTTONS.retry}
        </button>
        <Link className={`${ui.btnOutline} min-h-[44px] cursor-pointer`} href="/">
          {CELLOH_BUTTONS.goHome}
        </Link>
        {showSupportLink ?
          <Link className={`${ui.btnOutline} min-h-[44px] cursor-pointer`} href="/support">
            {CELLOH_BUTTONS.support}
          </Link>
        : null}
        <button
          className={`${ds.btn.ghost} min-h-[44px] w-full`}
          onClick={() => window.history.back()}
          type="button"
        >
          {CELLOH_BUTTONS.back}
        </button>
      </div>
    </main>
  );
}
