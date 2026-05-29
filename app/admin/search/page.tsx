import { redirect } from "next/navigation";

import {
  deleteFeaturedSearchTermAction,
  saveFeaturedSearchTermAction,
} from "@/app/actions/admin-search";
import { AdminNav } from "@/components/admin-nav";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  getPopularSearchTermsForAdmin,
  listFeaturedSearchTermsForAdmin,
} from "@/lib/data/admin-search";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminSearchPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/admin/login?next=/admin/search");
  }
  if (!(await isAdminUser(user))) {
    redirect("/unauthorized?next=/admin/search");
  }

  const [featuredTerms, popularTerms] = await Promise.all([
    listFeaturedSearchTermsForAdmin(),
    getPopularSearchTermsForAdmin(10),
  ]);

  return (
    <PageShell>
      <SubHeader backHref="/admin/dashboard" title="검색어 관리" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/search" />
        <p className="text-xs font-bold text-wadeal-muted">
          홈·검색 모달에 노출되는 추천 검색어를 관리합니다. migration 048 적용 전에는 fallback
          데이터를 사용합니다.
        </p>

        <form action={saveFeaturedSearchTermAction} className="space-y-3 rounded-xl border border-wadeal-line bg-white p-4">
          <h2 className="text-sm font-black text-wadeal-ink">추천 검색어 추가</h2>
          <input
            className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none"
            name="query"
            placeholder="검색어"
            required
          />
          <input
            className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none"
            defaultValue={featuredTerms.length + 1}
            name="displayOrder"
            placeholder="노출 순서"
            type="number"
          />
          <label className="flex items-center gap-2 text-xs font-bold text-wadeal-muted">
            <input defaultChecked name="isActive" type="checkbox" />
            노출
          </label>
          <button className={`${ui.btnPrimary} h-11 w-full`} type="submit">
            저장
          </button>
        </form>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-wadeal-ink">등록된 추천 검색어</h2>
          {featuredTerms.map((term) => (
            <article className="rounded-xl border border-wadeal-line bg-white p-4" key={term.id}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-black text-wadeal-ink">{term.query}</p>
                  <p className="mt-1 text-[11px] font-bold text-wadeal-muted">
                    순서 {term.displayOrder} · {term.isActive ? "노출" : "숨김"}
                  </p>
                </div>
                <form action={deleteFeaturedSearchTermAction}>
                  <input name="id" type="hidden" value={term.id} />
                  <button
                    className="cursor-pointer text-xs font-black text-wadeal-red underline underline-offset-2"
                    type="submit"
                  >
                    삭제
                  </button>
                </form>
              </div>
            </article>
          ))}
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-wadeal-ink">최근 30일 인기 검색어</h2>
          <div className="rounded-xl border border-wadeal-line bg-white p-4">
            {popularTerms.length === 0 ?
              <p className="text-xs font-bold text-wadeal-muted">검색 로그가 아직 없어요.</p>
            : <ul className="space-y-2">
                {popularTerms.map((term) => (
                  <li
                    className="flex items-center justify-between text-xs font-bold text-wadeal-muted"
                    key={term.query}
                  >
                    <span className="font-black text-wadeal-ink">{term.query}</span>
                    <span>{term.count}회</span>
                  </li>
                ))}
              </ul>
            }
          </div>
        </section>
      </div>
    </PageShell>
  );
}
