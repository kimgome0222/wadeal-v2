import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { SupportTopicFaqPage } from "@/components/support/support-topic-faq-page";
import { SubHeader } from "@/components/sub-header";

export default function SupportRefundPage() {
  return (
    <AppBuyerLayout showCategoryBar={false} showSearch={false}>
      <SubHeader backHref="/support" title="취소/환불" />
      <SupportTopicFaqPage
        category="refund"
        description="주문 취소, 환불 소요 기간, 불량 상품 교환/반품 안내입니다."
      />
    </AppBuyerLayout>
  );
}
