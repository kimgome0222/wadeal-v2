import { WHY_SELLER_ITEMS } from "@/lib/product/detail-data";

export function ProductWhySellerSection() {
  return (
    <section aria-label="왜 이 판매자인가요" className="space-y-4 py-10">
      <div className="space-y-1">
        <h2 className="text-[20px] font-bold text-[#111111]">왜 이 판매자인가요?</h2>
        <p className="text-[14px] text-[#666666]">상품보다 먼저 판매자를 확인해보세요.</p>
      </div>
      <ul className="grid grid-cols-2 gap-3">
        {WHY_SELLER_ITEMS.map((item) => (
          <li
            className="flex items-center gap-2.5 rounded-2xl bg-[#F5F7F6] px-3 py-3.5 text-[13px] font-medium text-[#111111]"
            key={item.title}
          >
            <span aria-hidden className="text-lg">
              {item.icon}
            </span>
            <span className="min-w-0 leading-snug">{item.title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
