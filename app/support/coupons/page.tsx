import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { SupportTopicFaqPage } from "@/components/support/support-topic-faq-page";
import { SubHeader } from "@/components/sub-header";

export default function SupportCouponsPage() {
  return (
    <AppBuyerLayout showCategoryBar={false} showSearch={false}>
      <SubHeader backHref="/support" title="쿠폰/포인트" />
      <SupportTopicFaqPage
        category="coupon"
        description="쿠폰 적용, 환불 시 쿠폰 처리, 포인트 적립 시점을 안내합니다."
      />
    </AppBuyerLayout>
  );
}
