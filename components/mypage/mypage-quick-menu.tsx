import Link from "next/link";

import {
  BookOpenIcon,
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
  { label: "주문·배송내역", href: "/mypage/orders", icon: TruckIcon },
  { label: "쿠폰", href: "/mypage/benefits", icon: TicketIcon },
  { label: "포인트", href: "/mypage/points", icon: CoinsIcon },
  { label: "찜한 상품", href: "/saved", icon: HeartIcon },
  { label: "최근 본 상품", href: "/mypage/recent", icon: BookOpenIcon },
  { label: "상품 스크랩북", href: "/saved", icon: BookOpenIcon },
  { label: "나의 리뷰", href: "/mypage/reviews", icon: StarIcon },
  { label: "문의 내역", href: "/mypage/support", icon: MessageCircleIcon },
  { label: "배송지 관리", href: "/mypage/addresses", icon: MapPinIcon },
  { label: "결제수단 관리", href: "/mypage/payment", icon: CreditCardIcon },
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
  function resolveHref(href: string) {
    if (!guestMode || PUBLIC_HREFS.has(href)) {
      return href;
    }
    return `/login?next=${encodeURIComponent(href)}`;
  }

  return (
    <section aria-label="빠른 메뉴" className="px-6">
      <div className="grid grid-cols-2 gap-2">
        {QUICK_MENU.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              className="flex min-h-[56px] items-center gap-2.5 rounded-[16px] border border-[#E8ECEA] bg-white px-4 text-[14px] font-medium text-[#111111] active:bg-[#FAFBFA]"
              href={resolveHref(item.href)}
              key={item.label}
            >
              <Icon className="h-5 w-5 shrink-0 text-[#666666]" />
              <span className="min-w-0 truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
