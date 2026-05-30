import Link from "next/link";

import type { MypageOrderStatusCounts } from "@/lib/mypage/hub-data";

const STATUS_ITEMS = [
  { key: "paid" as const, label: "결제완료", href: "/mypage/orders?status=paid", icon: "💳" },
  { key: "preparing" as const, label: "상품준비중", href: "/mypage/orders?status=preparing", icon: "📦" },
  { key: "shipping" as const, label: "배송중", href: "/mypage/orders?status=shipping", icon: "🚚" },
  { key: "delivered" as const, label: "배송완료", href: "/mypage/orders?status=delivered", icon: "✅" },
];

type MypageOrderStatusBarProps = {
  counts: MypageOrderStatusCounts;
};

export function MypageOrderStatusBar({ counts }: MypageOrderStatusBarProps) {
  return (
    <section aria-label="주문 상태" className="px-6">
      <div className="grid grid-cols-4 gap-1 rounded-[20px] border border-[#E8ECEA] bg-white p-3">
        {STATUS_ITEMS.map((item) => (
          <Link
            className="flex flex-col items-center gap-1.5 py-1 active:opacity-70"
            href={item.href}
            key={item.key}
          >
            <span aria-hidden className="text-[24px] leading-none">
              {item.icon}
            </span>
            <span className="text-[18px] font-bold tabular-nums text-[#111111]">
              {counts[item.key]}
            </span>
            <span className="text-center text-[11px] text-[#666666]">{item.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
