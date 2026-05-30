import Link from "next/link";

const LINKS = [
  { label: "FAQ", href: "/support" },
  { label: "공지사항", href: "/support" },
  { label: "배송안내", href: "/refund-policy" },
  { label: "상품문의", href: "/mypage/support" },
  { label: "1:1 문의", href: "/support/new" },
  { label: "대량주문 문의", href: "/support/new", meta: "준비중" },
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
              {"meta" in link && link.meta ?
                <span className="text-[12px] text-[#999999]">{link.meta}</span>
              : <span aria-hidden className="text-[#999999]">›</span>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
