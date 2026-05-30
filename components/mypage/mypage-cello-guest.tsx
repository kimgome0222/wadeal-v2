import Link from "next/link";

import { MypageOrderStatusBar } from "@/components/mypage/mypage-order-status-bar";
import { MypageProductRailSection } from "@/components/mypage/mypage-product-rail-section";
import { MypageProfileCardGuest } from "@/components/mypage/mypage-profile-card-guest";
import { MypageQuickMenu } from "@/components/mypage/mypage-quick-menu";
import { MypageSupportLinks } from "@/components/mypage/mypage-support-links";
import type { Deal } from "@/lib/deals";
import { ui } from "@/lib/ui";

type MypageCelloGuestProps = {
  previewDeals: Deal[];
  loginHref?: string;
};

export function MypageCelloGuest({
  previewDeals,
  loginHref = "/login?next=%2Fmypage",
}: MypageCelloGuestProps) {
  const recommendedDeals = previewDeals.slice(0, 12);

  return (
    <div className="space-y-8 pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)] pt-2">
      <MypageProfileCardGuest loginHref={loginHref} />

      <MypageOrderStatusBar
        counts={{ paid: 0, preparing: 0, shipping: 0, delivered: 0 }}
        guestMode
        reviewCount={0}
      />

      <MypageQuickMenu guestMode loginHref={loginHref} />

      <MypageProductRailSection
        deals={[]}
        emptyMessage="로그인하면 최근 본 상품이 표시돼요"
        moreHref={loginHref}
        title="최근 본 상품"
      />

      <MypageProductRailSection
        deals={recommendedDeals}
        title="고객님을 위한 추천"
      />

      <MypageSupportLinks />

      <section className="px-6">
        <Link
          className={`${ui.btnOutline} flex min-h-[52px] w-full items-center justify-center rounded-2xl text-[14px] font-semibold`}
          href={loginHref}
        >
          로그인 / 회원가입
        </Link>
      </section>
    </div>
  );
}
