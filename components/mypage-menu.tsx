import Link from "next/link";

const menuItems = [
  {
    label: "참여 중 공동구매",
    href: "/mypage/participating",
    description: "진행 중 2건",
  },
  {
    label: "주문 내역",
    href: "/mypage/orders",
    description: "최근 3건",
  },
  {
    label: "가격 알림 설정",
    href: "/mypage/alerts",
    description: "알림 4개",
  },
  {
    label: "배송지 관리",
    href: "/mypage/address",
    description: "기본 배송지 1개",
  },
  {
    label: "결제수단 관리",
    href: "/mypage/payment",
    description: "카드 1개",
  },
];

export function MypageMenu() {
  return (
    <ul className="divide-y divide-wadeal-line rounded-lg border border-wadeal-line">
      {menuItems.map((item) => (
        <li key={item.href}>
          <Link
            className="flex items-center justify-between px-4 py-4 active:bg-gray-50"
            href={item.href}
          >
            <div>
              <p className="text-sm font-black text-wadeal-ink">{item.label}</p>
              <p className="mt-0.5 text-xs font-bold text-wadeal-muted">
                {item.description}
              </p>
            </div>
            <span className="text-gray-400">›</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
