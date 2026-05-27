import { BottomNavigation } from "@/components/bottom-navigation";
import { CategoryGrid } from "@/components/category-grid";
import { WideDealCard } from "@/components/deal-card";
import { DealSection } from "@/components/deal-section";
import { Header } from "@/components/header";
import { HeroBanner } from "@/components/hero-banner";
import { getDealsBySection } from "@/lib/deals";

export default function Home() {
  const mainDeals = getDealsBySection("main");
  const sections = [
    { title: "오늘 마감", deals: getDealsBySection("closing") },
    { title: "친구 초대 급상승", deals: getDealsBySection("rising") },
    { title: "식품 인기 공동구매", deals: getDealsBySection("food") },
    { title: "생활용품 공동구매", deals: getDealsBySection("daily") },
  ];

  return (
    <main className="mx-auto min-h-screen max-w-[480px] bg-white pb-24 shadow-soft">
      <Header />
      <div className="space-y-4 px-4 pt-2">
        <CategoryGrid />
        <HeroBanner />
        <section className="space-y-3" aria-label="오늘의 메인 공동구매">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black tracking-normal text-wadeal-ink">
              오늘의 메인 공동구매
            </h2>
            <span className="text-xs font-extrabold text-wadeal-red">
              지금 최저가 도전
            </span>
          </div>
          <div className="space-y-3">
            {mainDeals.slice(0, 3).map((deal) => (
              <WideDealCard deal={deal} key={deal.slug} />
            ))}
          </div>
        </section>
        {sections.map((section) => (
          <DealSection
            deals={section.deals}
            key={section.title}
            title={section.title}
          />
        ))}
      </div>
      <BottomNavigation />
    </main>
  );
}
