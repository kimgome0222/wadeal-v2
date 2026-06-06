import { redirect } from "next/navigation";

import { MypageInviteContent } from "@/components/mypage-invite-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getOrCreateReferralCode } from "@/lib/share/referral-code";
import { getShareStatsForUser } from "@/lib/share/stats";
import { buildInviteUrl } from "@/lib/share/urls";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function MypageInvitePage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/mypage/invite");
  }

  const [referralCode, stats] = await Promise.all([
    getOrCreateReferralCode(user.id),
    getShareStatsForUser(user.id),
  ]);

  const inviteUrl = referralCode ? buildInviteUrl(referralCode) : "";

  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="친구에게 celloh 소개하기" />
      <div className={`${ui.pageBody} space-y-3`}>
        <MypageInviteContent inviteUrl={inviteUrl} referralCode={referralCode} stats={stats} />
      </div>
    </PageShell>
  );
}
