import Link from "next/link";

import { HomeRecommendedDealCard } from "@/components/home-recommended-deal-card";
import { getAllActiveDeals } from "@/lib/data";
import { ui } from "@/lib/ui";

export default async function ProductNotFound() {
  const catalog = await getAllActiveDeals();
  const recommended = catalog.slice(0, 4);

  return (
    <main className={`${ui.pageWrap} min-h-screen bg-white pb-24 shadow-soft`}>
      <div className={`${ui.pageBody} space-y-6 pt-10`}>
        <div className="space-y-2 text-center">
          <h1 className="text-[22px] font-bold text-[#111111]">상품을 찾을 수 없어요</h1>
          <p className="text-[14px] leading-relaxed text-[#666666]">
            판매가 종료되었거나 주소가 변경되었을 수 있어요. 아래 추천 상품을 확인해 보세요.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Link className={`${ui.btnPrimary} min-h-[44px] text-center`} href="/collections/recommended">
            추천상품 보기
          </Link>
          <Link className={`${ui.btnOutline} min-h-[44px] text-center`} href="/join-cart">
            장바구니
          </Link>
          <Link className={`${ui.btnOutline} min-h-[44px] text-center`} href="/">
            홈으로
          </Link>
        </div>

        {recommended.length > 0 ?
          <section className="space-y-3">
            <h2 className="text-[16px] font-bold text-[#111111]">이런 상품은 어떠세요?</h2>
            <ul className="grid grid-cols-2 gap-3">
              {recommended.map((deal) => (
                <li key={deal.slug}>
                  <HomeRecommendedDealCard deal={deal} imageAspect="square" />
                </li>
              ))}
            </ul>
          </section>
        : null}
      </div>
    </main>
  );
}
