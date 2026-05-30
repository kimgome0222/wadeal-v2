import Link from "next/link";

import { FaqAccordionPanel } from "@/components/support/faq-accordion-panel";
import type { FaqCategoryId } from "@/lib/support/mock-customer-support-data";
import { ui } from "@/lib/ui";

type SupportTopicFaqPageProps = {
  category: FaqCategoryId;
  description: string;
};

export function SupportTopicFaqPage({ category, description }: SupportTopicFaqPageProps) {
  return (
    <div className={`${ui.pageBody} space-y-4`}>
      <p className="text-xs font-medium text-wadeal-muted">{description}</p>
      <FaqAccordionPanel initialCategory={category} />
      <div className="grid gap-2 sm:grid-cols-2">
        <Link className={`${ui.btnPrimary} flex h-11 items-center justify-center text-sm`} href="/support/contact">
          1:1 문의
        </Link>
        <Link className={`${ui.btnOutline} flex h-11 items-center justify-center text-sm`} href="/support/faq">
          FAQ 전체
        </Link>
      </div>
    </div>
  );
}
