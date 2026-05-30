import { PageShell } from "@/components/page-shell";
import { SellerProfilePageContent } from "@/components/seller-profile-page-content";
import { SellerProfileUnavailable } from "@/components/seller-profile-unavailable";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAllActiveDeals } from "@/lib/data";
import { buildSellerDetailView } from "@/lib/sellers/build-seller-detail-view";
import {
  getDealsForSellerProfile,
  resolveSellerProfileByRouteId,
} from "@/lib/sellers/home-sellers";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type SellerProfilePageProps = {
  params: Promise<{ id: string }>;
};

export default async function SellerPublicProfilePage({ params }: SellerProfilePageProps) {
  const { id } = await params;
  const [allDeals, user] = await Promise.all([getAllActiveDeals(), getServerAuthUser()]);
  const profile = resolveSellerProfileByRouteId(id, allDeals);

  if (!profile) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="판매자 프로필" />
        <SellerProfileUnavailable routeId={id} />
      </PageShell>
    );
  }

  const sellerDeals = getDealsForSellerProfile(profile, allDeals);
  const anchorDeal = sellerDeals[0];

  if (!anchorDeal) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="판매자 프로필" />
        <SellerProfileUnavailable routeId={id} />
      </PageShell>
    );
  }

  const view = buildSellerDetailView(anchorDeal);

  return (
    <PageShell>
      <SubHeader backHref="/" title="판매자 프로필" />
      <div className={`${ui.pageBody} bg-white`}>
        <SellerProfilePageContent
          isLoggedIn={!!user}
          sellerDeals={sellerDeals}
          view={view}
        />
      </div>
    </PageShell>
  );
}
