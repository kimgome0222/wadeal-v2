"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toggleSavedDealAction } from "@/app/actions/data";
import { HeartIcon } from "@/components/icons";
import type { Deal } from "@/lib/deals";
import {
  isDealSaved,
  LOCAL_DATA_EVENTS,
} from "@/lib/storage/local-user-data";

type SaveDealButtonProps = {
  deal: Deal;
  initialSaved?: boolean;
  className?: string;
  size?: "sm" | "md";
  /** overlay: 상품 상세 등 · inline: 카드 판매자 줄 · labeled: 구매 CTA 옆 */
  variant?: "overlay" | "inline" | "labeled";
  labeled?: boolean;
};

export function SaveDealButton({
  deal,
  initialSaved,
  className = "",
  size = "md",
  variant = "overlay",
  labeled = false,
}: SaveDealButtonProps) {
  const isLabeled = labeled || variant === "labeled";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(initialSaved ?? deal.saved ?? false);

  useEffect(() => {
    if (initialSaved != null || deal.saved != null) {
      setSaved(initialSaved ?? deal.saved ?? false);
      return;
    }

    setSaved(isDealSaved(deal.slug));
  }, [deal.slug, deal.saved, initialSaved]);

  useEffect(() => {
    function syncSavedState() {
      setSaved(isDealSaved(deal.slug));
    }

    window.addEventListener(LOCAL_DATA_EVENTS.saved, syncSavedState);
    return () => {
      window.removeEventListener(LOCAL_DATA_EVENTS.saved, syncSavedState);
    };
  }, [deal.slug]);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    startTransition(async () => {
      const result = await toggleSavedDealAction(deal.slug);

      if ("error" in result && result.error === "login_required") {
        const nextPath =
          typeof window !== "undefined" ?
            `${window.location.pathname}${window.location.search}`
          : `/product/${deal.slug}`;
        router.push(`/login?next=${encodeURIComponent(nextPath)}`);
        return;
      }

      if (result.success) {
        setSaved(result.saved);
        router.refresh();
      }
    });
  }

  const iconSize =
    isLabeled ?
      "h-3.5 w-3.5"
    : variant === "inline" ?
      size === "sm" ? "h-3.5 w-3.5"
      : "h-4 w-4"
    : size === "sm" ? "h-4 w-4"
    : "h-5 w-5";

  const buttonSize =
    isLabeled ?
      "h-10 min-w-[5.25rem] gap-1.5 px-3"
    : variant === "inline" ?
      "h-8 w-8"
    : size === "sm" ? "h-8 w-8"
    : "h-9 w-9";

  const variantClass =
    isLabeled ?
      saved ?
        "rounded-xl border border-[#2E5E4E] bg-[#F5F8F4] text-[#2E5E4E]"
      : "rounded-xl border border-wadeal-line/70 bg-white text-wadeal-ink hover:border-[#2E5E4E]"
    : variant === "inline" ?
      saved ?
        "rounded-full border-[#2E5E4E] bg-[#2E5E4E] text-white"
      : "rounded-full border-[#2E5E4E] bg-white text-[#2E5E4E] hover:bg-[#F5F8F4]"
    : saved ?
      "rounded-full border-[#2E5E4E] bg-[#2E5E4E] text-white shadow-sm"
    : "rounded-full border-[#2E5E4E] bg-white text-[#2E5E4E] shadow-sm";

  const iconClass =
    isLabeled ?
      saved ?
        "fill-[#2E5E4E] text-[#2E5E4E]"
      : "text-[#2E5E4E]"
    : variant === "inline" || variant === "overlay" ?
      saved ?
        "fill-white text-white"
      : "text-[#2E5E4E]"
    : saved ?
      "fill-white text-white"
    : "text-[#2E5E4E]";

  return (
    <button
      aria-label={saved ? "찜 해제" : "찜하기"}
      aria-pressed={saved}
      className={`celloh-transition flex ${buttonSize} shrink-0 cursor-pointer items-center justify-center border transition-all duration-200 ease-smooth hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 ${variantClass} ${className}`.trim()}
      disabled={isPending}
      onClick={handleClick}
      type="button"
    >
      <HeartIcon className={`${iconSize} ${iconClass}`} filled={saved} />
      {isLabeled ?
        <span className="text-[12px] font-medium">{saved ? "찜함" : "찜하기"}</span>
      : null}
    </button>
  );
}
