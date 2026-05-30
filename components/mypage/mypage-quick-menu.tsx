import Link from "next/link";

const QUICK_MENU = [
  { label: "주문·배송내역", href: "/mypage/orders" },
  { label: "쿠폰", href: "/mypage/benefits" },
  { label: "포인트", href: "/mypage/points" },
  { label: "찜한 상품", href: "/saved" },
  { label: "최근 본 상품", href: "/mypage/recent" },
  { label: "상품 스크랩북", href: "/saved" },
  { label: "나의 리뷰", href: "/mypage/reviews" },
  { label: "문의 내역", href: "/mypage/support" },
  { label: "배송지 관리", href: "/mypage/addresses" },
  { label: "결제수단 관리", href: "/mypage/payment" },
] as const;

export function MypageQuickMenu() {
  return (
    <section aria-label="빠른 메뉴" className="px-6">
      <div className="grid grid-cols-2 gap-2">
        {QUICK_MENU.map((item) => (
          <Link
            className="flex min-h-[56px] items-center rounded-[16px] border border-[#E8ECEA] bg-white px-4 text-[14px] font-medium text-[#111111] active:bg-[#FAFBFA]"
            href={item.href}
            key={item.label}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
