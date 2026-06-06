import { redirect } from "next/navigation";

import { AdminMembersContent } from "@/components/admin-members-content";
import { AdminNav } from "@/components/admin-nav";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { countAdminMembers, getAdminMembers } from "@/lib/data/admin-members";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type AdminMembersPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function AdminMembersPage({ searchParams }: AdminMembersPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/admin/login?next=/admin/members");
  }
  if (!(await isAdminUser(user))) {
    redirect("/unauthorized?next=/admin/members");
  }

  const { q } = await searchParams;
  const [members, totalCount] = await Promise.all([
    getAdminMembers({ query: q, limit: 100 }),
    countAdminMembers(),
  ]);

  return (
    <PageShell>
      <SubHeader backHref="/admin/dashboard" title="회원 관리" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/members" />
        <p className="text-xs font-bold text-wadeal-muted">
          전체 회원 {totalCount.toLocaleString("ko-KR")}명 · 최근 가입 순으로 표시됩니다.
        </p>
        <AdminMembersContent initialQuery={q ?? ""} members={members} />
      </div>
    </PageShell>
  );
}
