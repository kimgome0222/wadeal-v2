import { BottomNavigation } from "@/components/bottom-navigation";
import { CategoryGrid } from "@/components/category-grid";
import { DealCard, FeaturedDealCard } from "@/components/deal-card";
import { DealSection } from "@/components/deal-section";
import { Header } from "@/components/header";
import { HeroBanner } from "@/components/hero-banner";
import { getDealsBySection } from "@/lib/deals";
import { ui } from "@/lib/ui";

export default function Home() {
  const mainDeals = getDealsBySection("main");
  const [heroDeal, ...gridDeals] = mainDeals;
  const sections = [
    { title: "오늘 마감", deals: getDealsBySection("closing") },
    { title: "친구 초대 급상승", deals: getDealsBySection("rising") },
    { title: "식품 인기 공동구매", deals: getDealsBySection("food") },
    { title: "생활용품 공동구매", deals: getDealsBySection("daily") },
  ];

  return (
    <main className={`${ui.pageWrap} pb-24`}>
      <div className="sticky top-0 z-30 bg-white shadow-[0_1px_0_#e5e7eb]">
        <Header />
        <CategoryGrid sticky />
      </div>
      <div className="space-y-5 px-4 pt-3">
        <HeroBanner />
        <section className="space-y-2.5" aria-label="오늘의 메인 공동구매">
          <h2 className={ui.sectionTitle}>오늘의 메인 공동구매</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {heroDeal ?
              <FeaturedDealCard deal={heroDeal} />
            : null}
            {gridDeals.slice(0, 3).map((deal) => (
              <DealCard deal={deal} key={deal.slug} />
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
