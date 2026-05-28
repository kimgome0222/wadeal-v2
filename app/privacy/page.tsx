import { PageShell } from "@/components/page-shell";
import { PolicyPageContent } from "@/components/policy-page-content";
import { SiteFooter } from "@/components/site-footer";
import { SubHeader } from "@/components/sub-header";
import { PRIVACY_POLICY } from "@/lib/policies/content";

export default function PrivacyPage() {
  return (
    <PageShell>
      <SubHeader backHref="/" title={PRIVACY_POLICY.title} />
      <PolicyPageContent document={PRIVACY_POLICY} />
      <SiteFooter />
    </PageShell>
  );
}
