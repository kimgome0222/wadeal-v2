import Link from "next/link";

import { ds } from "@/lib/design-system";
import { ui } from "@/lib/ui";

type AuthLoginPromptProps = {
  nextPath: string;
  title?: string;
  description?: string;
  /** cart: 비로그인 장바구니 */
  variant?: "default" | "cart";
  loginLabel?: string;
};

export function AuthLoginPrompt({
  nextPath,
  title = "로그인이 필요해요",
  description = "로그인 후 주문, 찜, 혜택을 한 번에 확인해보세요.",
  variant = "default",
  loginLabel = "로그인하기",
}: AuthLoginPromptProps) {
  const loginHref = `/login?next=${encodeURIComponent(nextPath)}`;

  if (variant === "cart") {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-[22px] font-bold text-[#111111]">로그인이 필요해요</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-[#666666]">
          로그인 후 장바구니 상품을 확인해보세요.
        </p>
        <Link
          className={`${ui.btnPrimary} mt-10 flex h-14 w-full max-w-[320px] items-center justify-center rounded-2xl text-[15px] font-semibold`}
          href={loginHref}
        >
          {loginLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className={ds.empty.wrap}>
      <div aria-hidden className={ds.empty.icon}>
        <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20 21a8 8 0 1 0-16 0" strokeLinecap="round" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
      <h1 className={ds.empty.title}>{title}</h1>
      <p className={ds.empty.description}>{description}</p>
      <Link className={`${ui.btnPrimary} max-w-[280px] ${ds.empty.action}`} href={loginHref}>
        {loginLabel}
      </Link>
    </div>
  );
}
