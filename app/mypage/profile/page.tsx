import { redirect } from "next/navigation";
import { AppBottomNavigation } from "@/components/app-bottom-navigation";
import { MypageProfileContent } from "@/components/mypage-profile-content";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getUserProfile } from "@/lib/data/profile";
import { getUnreadCountForUser } from "@/lib/data/notifications";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type MypageProfilePageProps = {
  searchParams: Promise<{ return?: string }>;
};

export default async function MypageProfilePage({ searchParams }: MypageProfilePageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/mypage/profile");
  }

  const { return: returnParam } = await searchParams;
  const returnPath = returnParam ? decodeURIComponent(returnParam) : null;
  const [profile, unreadNotificationCount] = await Promise.all([
    getUserProfile(user.id, user),
    getUnreadCountForUser(user.id),
  ]);

  return (
    <PageShell withBottomNav>
      <SubHeader backHref={returnPath ?? "/mypage"} title="개인정보" />
      <div className={ui.pageBody}>
        <MypageProfileContent initialProfile={profile} returnPath={returnPath} />
      </div>
      <SiteFooter />
      <AppBottomNavigation unreadCount={unreadNotificationCount} />
    </PageShell>
  );
}
