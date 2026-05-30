import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { SupportTopicFaqPage } from "@/components/support/support-topic-faq-page";
import { SubHeader } from "@/components/sub-header";

export default function SupportReferralPage() {
  return (
    <AppBuyerLayout showCategoryBar={false} showSearch={false}>
      <SubHeader backHref="/support" title="친구추천" />
      <SupportTopicFaqPage
        category="referral"
        description="지인초대 혜택 지급 시점과 중복 가입 정책을 안내합니다."
      />
    </AppBuyerLayout>
  );
}
