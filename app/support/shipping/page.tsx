import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { SupportTopicFaqPage } from "@/components/support/support-topic-faq-page";
import { SubHeader } from "@/components/sub-header";

export default function SupportShippingPage() {
  return (
    <AppBuyerLayout showCategoryBar={false} showSearch={false}>
      <SubHeader backHref="/support" title="배송" />
      <SupportTopicFaqPage
        category="shipping"
        description="배송지 변경, 무료배송 기준, 배송 조회 방법을 안내합니다."
      />
    </AppBuyerLayout>
  );
}
