import { BottomNavigation } from "@/components/bottom-navigation";
import { CategoryGrid } from "@/components/category-grid";
import { DealCard } from "@/components/deal-card";
import { DealSection } from "@/components/deal-section";
import { Header } from "@/components/header";
import { HeroBanner } from "@/components/hero-banner";
import { getDealsBySection, getFeaturedDeals } from "@/lib/data";
import { getWadealDataSource, logPageDataSource } from "@/lib/data/source";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function Home() {
  const mainDeals = await getFeaturedDeals();
  logPageDataSource("/", getWadealDataSource() ?? "mock");
  const sections = [
    { title: "오늘 마감", deals: await getDealsBySection("closing") },
    { title: "친구 초대 급상승", deals: await getDealsBySection("rising") },
    { title: "식품 인기 공동구매", deals: await getDealsBySection("food") },
    { title: "생활용품 공동구매", deals: await getDealsBySection("daily") },
  ];

  return (
    <main className={`${ui.pageWrap} pb-24 shadow-soft`}>
      <div className="sticky top-0 z-30 bg-white">
        <Header />
        <CategoryGrid sticky />
      </div>
      <div className="space-y-4 bg-wadeal-surface px-4 py-3">
        <HeroBanner />
        <section className="space-y-2" aria-label="오늘의 메인 공동구매">
          <h2 className={ui.sectionTitle}>오늘의 메인 공동구매</h2>
          <div className="grid grid-cols-2 gap-2">
            {mainDeals.map((deal) => (
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
