import Link from "next/link";
import { AppBottomNavigation } from "@/components/app-bottom-navigation";
import {
  SavedProductCard,
  SavedProductsEmptyState,
  type SavedProductCardItem,
} from "@/components/saved-product-card";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getSavedDeals } from "@/lib/data";
import { ui } from "@/lib/ui";

export default async function SavedPage() {
  const user = await getServerAuthUser();
  const savedDeals = user ? await getSavedDeals(user.id) : [];

  const items: SavedProductCardItem[] = savedDeals.map((deal) => ({
    id: deal.slug,
    slug: deal.slug,
    productName: deal.title,
    currentPrice: deal.originalPrice,
    groupPrice: deal.groupPrice,
    status: deal.badge,
  }));

  return (
    <PageShell withBottomNav>
      <SubHeader backHref="/" title="찜한 상품" />
      <div className={`${ui.pageBody} space-y-3`}>
        {!user ?
          <div className="rounded-xl border border-wadeal-line bg-white p-4">
            <p className="text-sm font-black text-wadeal-ink">로그인이 필요해요</p>
            <p className="mt-1 text-xs font-bold text-wadeal-muted">
              로그인하면 찜한 상품을 저장하고 확인할 수 있어요.
            </p>
            <Link
              className={`${ui.btnPrimary} mt-4 cursor-pointer`}
              href="/login?next=/saved"
            >
              로그인하기
            </Link>
          </div>
        : items.length === 0 ?
          <SavedProductsEmptyState />
        : items.map((item) => <SavedProductCard item={item} key={item.id} />)}
      </div>
      <AppBottomNavigation />
    </PageShell>
  );
}
