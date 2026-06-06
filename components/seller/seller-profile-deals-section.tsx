import { DealProductGrid } from "@/components/deal-product-grid";
import type { Deal } from "@/lib/deals";

type SellerProfileDealsSectionProps = {
  title: string;
  deals: Deal[];
  id?: string;
};

export function SellerProfileDealsSection({
  title,
  deals,
  id,
}: SellerProfileDealsSectionProps) {
  if (deals.length === 0) {
    return null;
  }

  return (
    <section className="scroll-mt-28 space-y-4 px-6 pt-10" id={id}>
      <h2 className="text-[20px] font-bold text-[#111111]">{title}</h2>
      <DealProductGrid deals={deals} />
    </section>
  );
}
