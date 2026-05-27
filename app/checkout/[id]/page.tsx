import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { CheckoutPanels } from "@/components/checkout-panels";
import { PageShell } from "@/components/page-shell";
import { ProductSnippet } from "@/components/product-snippet";
import { SubHeader } from "@/components/sub-header";
import { TierPricing } from "@/components/tier-pricing";
import { currency, getDealById } from "@/lib/deals";
import { ui } from "@/lib/ui";

type CheckoutPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } = await params;
  const deal = getDealById(id);

  if (!deal) {
    notFound();
  }

  return (
    <PageShell>
      <SubHeader backHref={`/join/${deal.slug}`} title="공동구매 참여" />
      <div className={`${ui.pageBody} space-y-3`}>
        <div className="panel p-3">
          <ProductSnippet deal={deal} />
          <p className="mt-2 text-xs font-extrabold text-wadeal-red">
            최저가 {currency.format(deal.lowestPrice)}원
          </p>
        </div>

        <TierPricing deal={deal} />
        <CheckoutPanels dealSlug={deal.slug} />
        <CheckoutForm dealSlug={deal.slug} />
      </div>
    </PageShell>
  );
}
