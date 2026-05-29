"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";

import type { SellerProfile } from "@/lib/sellers/types";
import {
  isSellerFollowed,
  SELLER_FOLLOW_EVENTS,
  toggleSellerFollow,
} from "@/lib/sellers/follow-storage";
import { ui } from "@/lib/ui";

type FollowSellerButtonProps = {
  seller: Pick<SellerProfile, "id" | "name" | "tagline">;
  className?: string;
  compact?: boolean;
  /** 카드 내 인라인 팔로우 (아이콘형) */
  icon?: boolean;
  /** true: localStorage mock 저장 / false·undefined: 로그인 안내 */
  isLoggedIn?: boolean;
  loginNext?: string;
};

export function FollowSellerButton({
  seller,
  className = "",
  compact = false,
  icon = false,
  isLoggedIn,
  loginNext,
}: FollowSellerButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [following, setFollowing] = useState<boolean | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);

    if (!isLoggedIn) {
      setFollowing(false);
      return;
    }

    setFollowing(isSellerFollowed(seller.id));

    const sync = () => {
      setFollowing(isSellerFollowed(seller.id));
    };

    window.addEventListener(SELLER_FOLLOW_EVENTS.updated, sync);
    return () => {
      window.removeEventListener(SELLER_FOLLOW_EVENTS.updated, sync);
    };
  }, [isLoggedIn, seller.id]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isLoggedIn) {
      const next = loginNext ?? pathname;
      router.push(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    const next = toggleSellerFollow(seller);
    setFollowing(next);
  };

  if (icon) {
    const pressed = following === true;

    return (
      <button
        aria-busy={!hydrated}
        aria-label={pressed ? "팔로우 취소" : "판매자 팔로우"}
        aria-pressed={pressed}
        className={`celloh-transition flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full border text-[11px] font-semibold ${
          pressed ?
            "border-wadeal-red/30 bg-wadeal-surface text-wadeal-red"
          : "border-wadeal-line bg-white text-wadeal-red hover:border-wadeal-red/30 hover:shadow-sm"
        } ${className}`}
        onClick={handleClick}
        type="button"
      >
        {pressed ? "✓" : "+"}
      </button>
    );
  }

  const pressed = following === true;

  return (
    <button
      aria-busy={!hydrated}
      className={
        pressed ?
          `${ui.btnOutline} ${compact ? "h-9 text-[12px]" : "h-10 text-[13px]"} cursor-pointer ${className}`
        : `${ui.btnPrimary} ${compact ? "h-9 text-[12px]" : "h-10 text-[13px]"} cursor-pointer ${className}`
      }
      onClick={handleClick}
      type="button"
    >
      {pressed ? "팔로우 취소" : "판매자 팔로우"}
    </button>
  );
}
