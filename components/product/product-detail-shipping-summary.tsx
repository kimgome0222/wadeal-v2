import type { Deal } from "@/lib/deals";
import { buildShippingSummaryLines } from "@/lib/product/detail-data";

type ProductDetailShippingSummaryProps = {
  deal: Deal;
};

export function ProductDetailShippingSummary({ deal }: ProductDetailShippingSummaryProps) {
  const lines = buildShippingSummaryLines(deal);

  return (
    <section aria-label="배송 정보" className="space-y-3 py-6">
      {lines.map((line) => (
        <div className="flex gap-3 text-[14px] leading-snug" key={line.label}>
          <span className="w-12 shrink-0 text-[#666666]">{line.label}</span>
          <span className="min-w-0 flex-1 text-[#111111]">{line.value}</span>
        </div>
      ))}
    </section>
  );
}
