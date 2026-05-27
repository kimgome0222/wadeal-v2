import { notFound } from "next/navigation";
import { AlertForm } from "@/components/alert-form";
import { PageShell } from "@/components/page-shell";
import { ProductSnippet } from "@/components/product-snippet";
import { SubHeader } from "@/components/sub-header";
import { getDealById } from "@/lib/deals";
import { ui } from "@/lib/ui";

type AlertPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AlertPage({ params }: AlertPageProps) {
  const { id } = await params;
  const deal = getDealById(id);

  if (!deal) {
    notFound();
  }

  return (
    <PageShell>
      <SubHeader backHref={`/product/${deal.slug}`} title="가격 알림 설정" />
      <div className={`${ui.pageBody} space-y-4`}>
        <div className="panel p-3">
          <ProductSnippet deal={deal} />
        </div>
        <AlertForm />
      </div>
    </PageShell>
  );
}
