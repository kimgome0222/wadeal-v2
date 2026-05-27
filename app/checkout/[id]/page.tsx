import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { CheckoutPanels } from "@/components/checkout-panels";
import { CheckoutPriceSummary } from "@/components/checkout-price-summary";
import { PageShell } from "@/components/page-shell";
import { ProductSnippet } from "@/components/product-snippet";
import { SubHeader } from "@/components/sub-header";
import { getProductDetailById } from "@/lib/data";
import { ui } from "@/lib/ui";

type CheckoutPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } = await params;
  const deal = await getProductDetailById(id);

  if (!deal) {
    notFound();
  }

  return (
    <PageShell>
      <SubHeader backHref={`/join/${deal.slug}`} title="공동구매 참여" />
      <div className={`${ui.pageBody} space-y-3`}>
        <div className="panel p-3">
          <ProductSnippet deal={deal} />
        </div>
        <CheckoutPriceSummary deal={deal} />
        <CheckoutPanels dealSlug={deal.slug} />
        <CheckoutForm dealSlug={deal.slug} />
      </div>
    </PageShell>
  );
}
