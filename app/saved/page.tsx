import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { AuthLoginPrompt } from "@/components/auth-login-prompt";
import {
  SavedProductCard,
  SavedProductsEmptyState,
  type SavedProductCardItem,
} from "@/components/saved-product-card";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getSavedDeals } from "@/lib/data";
import { ui } from "@/lib/ui";
import { ds } from "@/lib/design-system";

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
    <AppBuyerLayout>
      <div className={ui.appPageBody}>
        <h1 className={`${ds.spacing.sectionHead} text-lg font-bold text-wadeal-ink`}>찜한 상품</h1>
        {!user ?
          <AuthLoginPrompt nextPath="/saved" />
        : items.length === 0 ?
          <SavedProductsEmptyState className="mt-4" />
        : <div className="space-y-3 pt-2">
            {items.map((item) => (
              <SavedProductCard item={item} key={item.id} />
            ))}
          </div>}
      </div>
    </AppBuyerLayout>
  );
}
