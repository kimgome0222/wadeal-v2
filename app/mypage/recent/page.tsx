import { BottomNavigation } from "@/components/bottom-navigation";
import { RecentViewsContent } from "@/components/recent-views-content";
import type { SavedProductCardItem } from "@/components/saved-product-card";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getRecentViewsForUser } from "@/lib/data/recent-views";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function RecentViewsPage() {
  const user = await getServerAuthUser();
  const recentDeals = user ? await getRecentViewsForUser(user.id) : [];

  const serverItems: SavedProductCardItem[] = recentDeals.map((deal) => ({
    id: deal.slug,
    slug: deal.slug,
    productName: deal.title,
    currentPrice: deal.originalPrice,
    groupPrice: deal.groupPrice,
    status: deal.badge,
  }));

  return (
    <PageShell withBottomNav>
      <SubHeader backHref="/mypage" title="최근 본 상품" />
      <div className={`${ui.pageBody} space-y-3`}>
        <RecentViewsContent initialLoggedIn={!!user} serverItems={serverItems} />
      </div>
      <BottomNavigation />
    </PageShell>
  );
}
