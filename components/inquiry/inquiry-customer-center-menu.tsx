import Link from "next/link";

const LINKS = [
  { label: "고객센터", href: "/support" },
  { label: "FAQ", href: "/support/faq" },
  { label: "공지사항", href: "/support/notices" },
  { label: "배송안내", href: "/support/shipping" },
  { label: "환불/교환 안내", href: "/support/refund" },
  { label: "친구추천 안내", href: "/support/referral" },
  { label: "문의 내역", href: "/support/tickets" },
  { label: "1:1 문의", href: "/support/contact" },
  { label: "상품문의", href: "/mypage/support" },
] as const;

export function InquiryCustomerCenterMenu() {
  return (
    <section className="space-y-3">
      <h2 className="text-[18px] font-bold text-[#111111]">고객센터</h2>
      <ul className="overflow-hidden rounded-[20px] border border-[#E8ECEA] bg-white divide-y divide-[#E8ECEA]">
        {LINKS.map((link) => (
          <li key={link.label}>
            <Link
              className="flex items-center justify-between px-4 py-4 text-[15px] font-medium text-[#111111] active:bg-[#FAFBFA]"
              href={link.href}
            >
              <span>{link.label}</span>
              <span aria-hidden className="text-[#999999]">›</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
