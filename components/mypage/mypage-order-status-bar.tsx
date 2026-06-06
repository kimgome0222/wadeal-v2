import Link from "next/link";

import type { MypageOrderStatusCounts } from "@/lib/mypage/hub-data";

const STATUS_ITEMS = [
  { key: "paid" as const, label: "결제완료", href: "/mypage/orders?status=paid", icon: "💳" },
  { key: "preparing" as const, label: "배송준비", href: "/mypage/orders?status=preparing", icon: "📦" },
  { key: "shipping" as const, label: "배송중", href: "/mypage/orders?status=shipping", icon: "🚚" },
  { key: "delivered" as const, label: "배송완료", href: "/mypage/orders?status=delivered", icon: "✅" },
  { key: "review" as const, label: "리뷰작성", href: "/mypage/reviews", icon: "✍️" },
] as const;

type MypageOrderStatusBarProps = {
  counts: MypageOrderStatusCounts;
  reviewCount?: number;
  guestMode?: boolean;
};

export function MypageOrderStatusBar({
  counts,
  reviewCount = 0,
  guestMode = false,
}: MypageOrderStatusBarProps) {
  function resolveHref(href: string) {
    if (!guestMode) {
      return href;
    }
    return `/login?next=${encodeURIComponent(href)}`;
  }

  return (
    <section aria-label="주문 진행 상태" className="px-6">
      <div className="grid grid-cols-5 gap-0.5 rounded-[20px] border border-[#E8ECEA] bg-white p-4">
        {STATUS_ITEMS.map((item) => {
          const count =
            item.key === "review" ? reviewCount
            : counts[item.key];

          return (
            <Link
              className="flex flex-col items-center gap-1.5 py-0.5 active:opacity-70"
              href={resolveHref(item.href)}
              key={item.key}
            >
              <span aria-hidden className="text-[24px] leading-none">
                {item.icon}
              </span>
              <span className="text-[20px] font-bold tabular-nums text-[#2E5E4E]">{count}</span>
              <span className="text-center text-[12px] leading-tight text-[#666666]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
