import Link from "next/link";
import { redirect } from "next/navigation";

import { MypageMockCouponList } from "@/components/mypage/mypage-mock-coupon-list";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getMockUserCoupons } from "@/lib/promotions/mock-coupon-catalog";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

/** 마이페이지 쿠폰함 mock — DB 지급 없음 */
export default async function MypageCouponsPage() {
  const user = await getServerAuthUser();

  if (!user) {
    redirect("/login?next=/mypage/coupons");
  }

  const mockCoupons = getMockUserCoupons();
  const available = mockCoupons.filter((c) => c.status === "available");
  const usedOrExpired = mockCoupons.filter((c) => c.status !== "available");

  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="내 쿠폰" />
      <div className={`${ui.pageBody} space-y-4 pb-8`}>
        <div className="rounded-xl border border-[#E8ECEA] bg-[#F5F7F6] px-4 py-3 text-[12px] leading-relaxed text-[#666666]">
          보유 쿠폰함은 <strong>mock UI</strong>입니다. 실제 쿠폰 지급·적용은 운영 정책 및 DB
          연동 후 제공됩니다. 장바구니 tier 자동 할인은{" "}
          <Link className="font-semibold text-[#2E5E4E]" href="/join-cart">
            장바구니
          </Link>
          에서 확인하세요.
        </div>

        <section className="rounded-xl border border-[#E8ECEA] bg-white p-4">
          <h2 className="text-[15px] font-bold text-[#111111]">사용 가능 ({available.length})</h2>
          <MypageMockCouponList coupons={available} />
        </section>

        {usedOrExpired.length > 0 ?
          <section className="rounded-xl border border-[#E8ECEA] bg-white p-4">
            <h2 className="text-[15px] font-bold text-[#111111]">사용·만료</h2>
            <MypageMockCouponList coupons={usedOrExpired} />
          </section>
        : null}

        <div className="flex flex-col gap-2">
          <Link
            className="flex h-11 items-center justify-center rounded-xl border border-[#E8ECEA] text-[13px] font-semibold text-[#2E5E4E]"
            href="/join-cart"
          >
            장바구니 쿠폰 자동 적용 안내
          </Link>
          <Link
            className="flex h-11 items-center justify-center rounded-xl border border-[#E8ECEA] text-[13px] font-semibold text-[#666666]"
            href="/mypage/benefits"
          >
            쿠폰·포인트 통합 보기
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
