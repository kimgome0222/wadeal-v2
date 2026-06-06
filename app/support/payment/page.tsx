import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { SupportTopicFaqPage } from "@/components/support/support-topic-faq-page";
import { SubHeader } from "@/components/sub-header";

export default function SupportPaymentPage() {
  return (
    <AppBuyerLayout showCategoryBar={false} showSearch={false}>
      <SubHeader backHref="/support" title="주문/결제" />
      <SupportTopicFaqPage
        category="order"
        description="주문 확인, 결제수단 변경, 결제 실패 대응 방법을 안내합니다."
      />
    </AppBuyerLayout>
  );
}
