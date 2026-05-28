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
};

export function SaveDealButton({
  deal,
  initialSaved,
  className = "",
  size = "md",
}: SaveDealButtonProps) {
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
        router.push(`/login?next=/product/${deal.slug}`);
        return;
      }

      if (result.success) {
        setSaved(result.saved);
        router.refresh();
        return;
      }
    });
  }

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const buttonSize = size === "sm" ? "h-8 w-8" : "h-9 w-9";

  return (
    <button
      aria-label={saved ? "찜 해제" : "찜하기"}
      aria-pressed={saved}
      className={`flex ${buttonSize} cursor-pointer items-center justify-center rounded-full bg-white/95 shadow-card backdrop-blur-sm active:scale-95 disabled:opacity-60 ${className}`}
      disabled={isPending}
      onClick={handleClick}
      type="button"
    >
      <HeartIcon
        className={`${iconSize} ${saved ? "fill-wadeal-red text-wadeal-red" : "text-gray-500"}`}
        filled={saved}
      />
    </button>
  );
}
