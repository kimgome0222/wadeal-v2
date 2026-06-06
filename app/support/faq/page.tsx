import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { FaqAccordionPanel } from "@/components/support/faq-accordion-panel";
import { SubHeader } from "@/components/sub-header";
import type { FaqCategoryId } from "@/lib/support/mock-customer-support-data";
import { ui } from "@/lib/ui";

type SupportFaqPageProps = {
  searchParams: Promise<{ category?: string; q?: string }>;
};

const VALID_CATEGORIES = new Set<FaqCategoryId>([
  "order",
  "shipping",
  "refund",
  "coupon",
  "referral",
  "member",
  "seller",
]);

export default async function SupportFaqPage({ searchParams }: SupportFaqPageProps) {
  const params = await searchParams;
  const category =
    params.category && VALID_CATEGORIES.has(params.category as FaqCategoryId) ?
      (params.category as FaqCategoryId)
    : "all";
  const initialQuery = params.q ?? "";

  return (
    <AppBuyerLayout showCategoryBar={false} showSearch={false}>
      <SubHeader backHref="/support" title="자주 묻는 질문" />
      <div className={`${ui.pageBody} pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]`}>
        <FaqAccordionPanel initialCategory={category} initialQuery={initialQuery} />
      </div>
    </AppBuyerLayout>
  );
}
