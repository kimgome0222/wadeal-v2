import Link from "next/link";

import { CELLOH_AUTH_COPY } from "@/lib/copy/empty-states";
import { ui } from "@/lib/ui";

type AuthLoginPromptInlineProps = {
  loginNext: string;
  className?: string;
  compact?: boolean;
};

export function AuthLoginPromptInline({
  loginNext,
  className = "",
  compact = false,
}: AuthLoginPromptInlineProps) {
  const loginHref = `/login?next=${encodeURIComponent(loginNext)}`;

  if (compact) {
    return (
      <p className={`text-[11px] font-semibold text-wadeal-muted ${className}`}>
        {CELLOH_AUTH_COPY.loginRequiredTitle}{" "}
        <Link className="font-bold text-wadeal-red underline underline-offset-2" href={loginHref}>
          로그인
        </Link>
      </p>
    );
  }

  return (
    <div
      className={`rounded-xl border border-wadeal-line bg-wadeal-surface/80 px-4 py-3 ${className}`}
    >
      <p className="text-sm font-bold text-wadeal-ink">{CELLOH_AUTH_COPY.loginRequiredTitle}</p>
      <p className="mt-1 text-xs font-medium text-wadeal-muted">
        {CELLOH_AUTH_COPY.loginRequiredDescription}
      </p>
      <Link
        className={`${ui.btnPrimary} mt-3 inline-flex h-10 px-5 text-[13px]`}
        href={loginHref}
      >
        로그인하기
      </Link>
    </div>
  );
}
