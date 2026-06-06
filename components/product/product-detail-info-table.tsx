import type { Deal } from "@/lib/deals";
import { buildDetailInfoRows } from "@/lib/product/detail-data";
import { ProductDisclosureNotice } from "@/components/product/product-disclosure-notice";

type ProductDetailInfoTableProps = {
  deal: Deal;
};

export function ProductDetailInfoTable({ deal }: ProductDetailInfoTableProps) {
  const rows = buildDetailInfoRows(deal);

  return (
    <section
      className="scroll-mt-28 space-y-4 py-10"
      id="product-detail-info"
    >
      <h2 className="text-[20px] font-bold text-[#111111]">상세정보</h2>
      <ProductDisclosureNotice />
      <dl className="overflow-hidden rounded-2xl border border-[#E8ECEA]">
        {rows.map((row, index) => (
          <div
            className={`flex gap-3 px-4 py-3.5 text-[14px] ${
              index > 0 ? "border-t border-[#E8ECEA]" : ""
            }`}
            key={row.label}
          >
            <dt className="w-24 shrink-0 text-[#666666]">{row.label}</dt>
            <dd className="min-w-0 flex-1 leading-relaxed text-[#111111]">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
