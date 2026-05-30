import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { SubHeader } from "@/components/sub-header";
import {
  RANKING_CRITERIA,
  RANKING_POLICY_NOTICE,
  RECOMMENDATION_CRITERIA,
} from "@/lib/product/ranking-policy-content";
import { ui } from "@/lib/ui";

export default function RankingPolicyPage() {
  return (
    <AppBuyerLayout showCategoryBar={false} showSearch={false}>
      <SubHeader backHref="/collections/ranking" title="랭킹·추천 기준" />
      <div className={`${ui.pageBody} space-y-6 pb-24`}>
        <p className="rounded-xl bg-[#F5F7F6] px-3 py-2.5 text-[12px] leading-relaxed text-[#666666]">
          {RANKING_POLICY_NOTICE}
        </p>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#111111]">카테고리 랭킹 기준 (초안)</h2>
          <ul className="list-disc space-y-1 pl-5 text-[14px] text-[#666666]">
            {RANKING_CRITERIA.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#111111]">추천상품 기준 (초안)</h2>
          <ul className="list-disc space-y-1 pl-5 text-[14px] text-[#666666]">
            {RECOMMENDATION_CRITERIA.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </AppBuyerLayout>
  );
}
