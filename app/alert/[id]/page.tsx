import { notFound } from "next/navigation";
import { AlertForm } from "@/components/alert-form";
import { PageShell } from "@/components/page-shell";
import { ProductSnippet } from "@/components/product-snippet";
import { SubHeader } from "@/components/sub-header";
import { getProductDetailById } from "@/lib/data";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type AlertPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AlertPage({ params }: AlertPageProps) {
  const { id } = await params;
  const deal = await getProductDetailById(id);

  if (!deal) {
    notFound();
  }

  return (
    <PageShell>
      <SubHeader backHref={`/product/${deal.slug}`} title="관심 상품 알림" />
      <div className={`${ui.pageBody} space-y-4 pb-10`}>
        <div className="panel p-3">
          <ProductSnippet deal={deal} />
        </div>
        <AlertForm deal={deal} />
      </div>
    </PageShell>
  );
}
