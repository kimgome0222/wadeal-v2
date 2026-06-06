"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  BookOpenIcon,
  ChevronRightIcon,
  CoinsIcon,
  CreditCardIcon,
  HeartIcon,
  MapPinIcon,
  MessageCircleIcon,
  StarIcon,
  TicketIcon,
  TruckIcon,
} from "@/components/icons";

const QUICK_MENU = [
  { id: "orders", label: "주문·배송내역", href: "/mypage/orders", icon: TruckIcon },
  { id: "coupons", label: "쿠폰", href: "/mypage/benefits", icon: TicketIcon },
  { id: "points", label: "포인트", href: "/mypage/points", icon: CoinsIcon },
  { id: "saved", label: "찜한 상품", href: "/saved", icon: HeartIcon },
  { id: "recent", label: "최근 본 상품", href: "/mypage/recent", icon: BookOpenIcon },
  { id: "scrapbook", label: "상품 스크랩북", href: "/saved", icon: BookOpenIcon },
  { id: "reviews", label: "나의 리뷰", href: "/mypage/reviews", icon: StarIcon },
  { id: "support", label: "문의 내역", href: "/mypage/support", icon: MessageCircleIcon },
  { id: "addresses", label: "배송지 관리", href: "/mypage/addresses", icon: MapPinIcon },
  { id: "payment", label: "결제수단 관리", href: "/mypage/payment", icon: CreditCardIcon },
] as const;

const PUBLIC_HREFS = new Set(["/saved"]);

type MypageQuickMenuProps = {
  guestMode?: boolean;
  loginHref?: string;
};

export function MypageQuickMenu({
  guestMode = false,
  loginHref = "/login?next=%2Fmypage",
}: MypageQuickMenuProps) {
  const pathname = usePathname();
  const [pressedId, setPressedId] = useState<string | null>(null);

  function resolveHref(href: string) {
    if (!guestMode || PUBLIC_HREFS.has(href)) {
      return href;
    }
    return `/login?next=${encodeURIComponent(href)}`;
  }

  return (
    <section aria-label="빠른 메뉴" className="relative px-6">
      <div className="grid grid-cols-2 gap-2">
        {QUICK_MENU.map((item) => {
          const Icon = item.icon;
          const href = resolveHref(item.href);
          const isRouteActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const isPressed = pressedId === item.id;

          return (
            <Link
              className={`flex h-14 w-full items-center gap-2.5 rounded-[16px] border px-4 text-[14px] font-medium transition-colors duration-[80ms] ease-out active:bg-[#F5F7F6] ${
                isRouteActive || isPressed ?
                  "border-[#2E5E4E] bg-[#F5F7F6] text-[#2E5E4E]"
                : "border-[#E8ECEA] bg-white text-[#111111] hover:bg-[#F5F7F6]"
              }`}
              href={href}
              key={item.id}
              onClick={() => setPressedId(item.id)}
              onMouseLeave={() => setPressedId(null)}
              onTouchEnd={() => setPressedId(null)}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${
                  isRouteActive || isPressed ? "text-[#2E5E4E]" : "text-[#666666]"
                }`}
              />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              <ChevronRightIcon
                aria-hidden
                className={`h-4 w-4 shrink-0 ${
                  isRouteActive || isPressed ? "text-[#2E5E4E]" : "text-[#999999]"
                }`}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
