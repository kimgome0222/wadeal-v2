import type { Metadata } from "next";
import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { CartSheetCatalogSync } from "@/components/cart/cart-sheet-catalog-sync";
import { CollectionPageContent } from "@/components/collections/collection-page-content";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAllActiveDeals } from "@/lib/data";
import { getUnreadCountForUser } from "@/lib/data/notifications";
import { getCollectionDefinition } from "@/lib/home/collection-data";
import { buildCollectionMetadata } from "@/lib/seo/site";

export const dynamic = "force-dynamic";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const definition = getCollectionDefinition(slug);
  return buildCollectionMetadata(definition);
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const definition = getCollectionDefinition(slug);
  const [catalog, user] = await Promise.all([getAllActiveDeals(), getServerAuthUser()]);
  const unreadNotificationCount = user ? await getUnreadCountForUser(user.id) : 0;

  return (
    <AppBuyerLayout showSearch={false} unreadNotificationCount={unreadNotificationCount}>
      <CartSheetCatalogSync catalog={catalog} />
      <CollectionPageContent catalog={catalog} definition={definition} />
    </AppBuyerLayout>
  );
}
