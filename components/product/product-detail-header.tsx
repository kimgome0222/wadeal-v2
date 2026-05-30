"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeftIcon, CartIcon, SearchIcon } from "@/components/icons";
import { HeaderCartButton } from "@/components/cart/header-cart-button";

type ProductDetailHeaderProps = {
  backHref?: string;
  cartCount?: number;
};

export function ProductDetailHeader({ backHref = "/", cartCount = 0 }: ProductDetailHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-[80] flex h-14 min-h-[56px] items-center justify-between gap-2 border-b border-[#E8ECEA] bg-white px-6">
      <button
        aria-label="뒤로가기"
        className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-[#111111] transition-colors active:bg-[#F5F7F6]"
        onClick={() => {
          if (backHref && backHref !== "back") {
            router.push(backHref);
            return;
          }
          if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
          } else {
            router.push("/");
          }
        }}
        type="button"
      >
        <ArrowLeftIcon className="h-6 w-6" />
      </button>

      <div className="flex shrink-0 items-center gap-0.5">
        <Link
          aria-label="검색"
          className="flex h-11 w-11 items-center justify-center rounded-xl text-[#111111] transition-colors hover:bg-[#F5F7F6] active:scale-[0.97]"
          href="/search"
        >
          <SearchIcon className="h-6 w-6" />
        </Link>
        <HeaderCartButton badge={cartCount} className="h-11 w-11 rounded-xl">
          <CartIcon className="h-6 w-6" />
        </HeaderCartButton>
      </div>
    </header>
  );
}
