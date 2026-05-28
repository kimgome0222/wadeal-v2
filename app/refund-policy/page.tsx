import { PageShell } from "@/components/page-shell";
import { PolicyPageContent } from "@/components/policy-page-content";
import { SiteFooter } from "@/components/site-footer";
import { SubHeader } from "@/components/sub-header";
import { REFUND_POLICY } from "@/lib/policies/content";

export default function RefundPolicyPage() {
  return (
    <PageShell>
      <SubHeader backHref="/" title={REFUND_POLICY.title} />
      <PolicyPageContent document={REFUND_POLICY} />
      <SiteFooter />
    </PageShell>
  );
}
