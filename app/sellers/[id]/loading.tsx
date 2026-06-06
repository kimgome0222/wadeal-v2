import { PageShell } from "@/components/page-shell";
import { SellerProfileSkeleton } from "@/components/ui-skeleton-card";
import { SubHeader } from "@/components/sub-header";
import { ui } from "@/lib/ui";

export default function SellerProfileLoading() {
  return (
    <PageShell>
      <SubHeader backHref="/" title="판매자 프로필" />
      <div className={`${ui.pageBody} bg-white`}>
        <SellerProfileSkeleton />
      </div>
    </PageShell>
  );
}
