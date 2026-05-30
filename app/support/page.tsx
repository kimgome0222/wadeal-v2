import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { CustomerSupportHome } from "@/components/support/customer-support-home";
import { SubHeader } from "@/components/sub-header";
import { getBusinessSettings } from "@/lib/data/business-settings";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

const KAKAO_CHANNEL_URL = process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL ?? null;

export default async function SupportHomePage() {
  const business = await getBusinessSettings();

  return (
    <AppBuyerLayout showCategoryBar={false} showSearch={false}>
      <SubHeader backHref="/mypage" title="고객센터" />
      <div className={`${ui.pageBody} space-y-5 pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]`}>
        <CustomerSupportHome
          customerServiceEmail={business.customerServiceEmail}
          customerServicePhone={business.customerServicePhone}
          kakaoChannelUrl={KAKAO_CHANNEL_URL}
        />
      </div>
    </AppBuyerLayout>
  );
}
