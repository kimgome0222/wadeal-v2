"use client";

import Link from "next/link";

import { FollowSellerButton } from "@/components/follow-seller-button";
import type { SellerProfile } from "@/lib/sellers/types";

type SellerProfileActionsProps = {
  seller: Pick<SellerProfile, "id" | "name" | "tagline">;
  isLoggedIn: boolean;
  inquiryHref: string;
};

export function SellerProfileActions({
  seller,
  isLoggedIn,
  inquiryHref,
}: SellerProfileActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 px-6">
      <FollowSellerButton
        className="!h-12 !min-h-[48px] !rounded-2xl !text-[14px] !font-semibold"
        isLoggedIn={isLoggedIn}
        seller={seller}
      />
      <Link
        className="flex h-12 min-h-[48px] items-center justify-center rounded-2xl border border-[#E8ECEA] bg-white text-[14px] font-semibold text-[#111111] active:bg-[#FAFBFA]"
        href={inquiryHref}
      >
        문의하기
      </Link>
    </div>
  );
}
