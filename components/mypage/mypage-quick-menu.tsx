import Link from "next/link";

const QUICK_MENU = [
  { label: "주문내역", href: "/mypage/orders", icon: "📋" },
  { label: "찜 상품", href: "/saved", icon: "❤️" },
  { label: "찜 판매자", href: "/mypage/following-sellers", icon: "🏪" },
  { label: "최근 본 상품", href: "/mypage/recent", icon: "👀" },
  { label: "리뷰관리", href: "/mypage/reviews", icon: "⭐" },
  { label: "문의내역", href: "/mypage/support", icon: "💬" },
] as const;

export function MypageQuickMenu() {
  return (
    <section aria-label="빠른 메뉴" className="px-6">
      <div className="grid grid-cols-3 gap-y-4">
        {QUICK_MENU.map((item) => (
          <Link
            className="flex flex-col items-center gap-2 active:opacity-70"
            href={item.href}
            key={item.href}
          >
            <span aria-hidden className="text-[22px] leading-none">
              {item.icon}
            </span>
            <span className="text-[13px] font-medium text-[#111111]">{item.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
