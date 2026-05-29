"use client";

import Link from "next/link";

import { FollowSellerButton } from "@/components/follow-seller-button";
import type { SellerProfile } from "@/lib/sellers/types";
import { ui } from "@/lib/ui";

type SellerProfileStickyCtaProps = {
  seller: Pick<SellerProfile, "id" | "name" | "tagline">;
  isLoggedIn: boolean;
  inquiryHref?: string;
};

export function SellerProfileStickyCta({
  seller,
  isLoggedIn,
  inquiryHref = "/support",
}: SellerProfileStickyCtaProps) {
  return (
      <div className={`${ui.stickyFooter} grid min-h-[56px] grid-cols-3 gap-1.5`}>
      <FollowSellerButton
        className="!min-h-[44px] !h-11 !min-w-0 !px-2 !text-[11px]"
        compact
        isLoggedIn={isLoggedIn}
        seller={seller}
      />
      <button
        className={`${ui.btnOutline} min-h-[44px] h-11 min-w-0 px-2 text-[11px] font-medium`}
        onClick={() => {
          document.getElementById("seller-products")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }}
        type="button"
      >
        상품 보기
      </button>
      <Link
        className={`${ui.btnOutline} flex min-h-[44px] h-11 min-w-0 items-center justify-center px-2 text-[11px] font-medium`}
        href={inquiryHref}
      >
        문의하기
      </Link>
    </div>
  );
}
