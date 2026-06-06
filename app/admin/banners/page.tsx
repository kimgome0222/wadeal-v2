import Link from "next/link";
import { redirect } from "next/navigation";

import {
  deleteBannerAction,
  saveBannerAction,
  toggleBannerVisibilityAction,
} from "@/app/actions/admin-commerce";
import { AdminNav } from "@/components/admin-nav";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAdminBanners } from "@/lib/data/admin-commerce";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/admin/login?next=/admin/banners");
  }
  if (!(await isAdminUser(user))) {
    redirect("/unauthorized?next=/admin/banners");
  }

  const banners = await getAdminBanners();

  return (
    <PageShell>
      <SubHeader backHref="/admin/dashboard" title="배너 관리" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/banners" />
        <p className="text-xs font-bold text-wadeal-muted">
          홈·카테고리 배너를 관리합니다. migration 050 적용 시 Supabase DB에 저장됩니다.
        </p>
        <form action={saveBannerAction} className="space-y-3 rounded-xl border border-wadeal-line bg-white p-4">
          <h2 className="text-sm font-black text-wadeal-ink">배너 추가</h2>
          <input
            className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none"
            name="title"
            placeholder="배너명"
            required
          />
          <input
            className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none"
            name="imageUrl"
            placeholder="이미지 URL"
          />
          <input
            className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none"
            name="linkUrl"
            placeholder="링크 URL"
            required
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none"
              defaultValue="2026-01-01 00:00"
              name="startsAt"
              placeholder="노출 시작"
            />
            <input
              className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none"
              defaultValue="2099-12-31 23:59"
              name="endsAt"
              placeholder="노출 종료"
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <select className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none" name="device">
              <option value="all">모바일+PC</option>
              <option value="mobile">모바일</option>
              <option value="pc">PC</option>
            </select>
            <select className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none" name="position">
              <option value="home-main">홈 메인</option>
              <option value="home-mid">홈 중간</option>
              <option value="category">카테고리</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-xs font-bold text-wadeal-muted">
            <input defaultChecked name="visible" type="checkbox" value="on" />
            노출
          </label>
          <button className={`${ui.btnPrimary} h-11 w-full`} type="submit">
            배너 저장
          </button>
        </form>
        {banners.map((banner) => (
          <article className="rounded-xl border border-wadeal-line bg-white p-4" key={banner.id}>
            <p className="text-[11px] font-black text-wadeal-muted">
              {banner.id} · {banner.position} · {banner.device} · {banner.visible ? "노출" : "숨김"}
            </p>
            <h2 className="mt-1 text-base font-black text-wadeal-ink">{banner.title}</h2>
            <p className="mt-1 text-xs font-bold text-wadeal-muted">
              {banner.startsAt} – {banner.endsAt}
            </p>
            <Link className="mt-1 block text-xs font-bold text-wadeal-red" href={banner.linkUrl}>
              {banner.linkUrl}
            </Link>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <form action={toggleBannerVisibilityAction}>
                <input name="bannerId" type="hidden" value={banner.id} />
                <input name="visible" type="hidden" value={banner.visible ? "false" : "true"} />
                <button className="h-10 w-full rounded-xl border border-wadeal-line text-xs font-black" type="submit">
                  {banner.visible ? "숨기기" : "노출하기"}
                </button>
              </form>
              <form action={deleteBannerAction}>
                <input name="bannerId" type="hidden" value={banner.id} />
                <button
                  className="h-10 w-full rounded-xl border border-wadeal-line text-xs font-black text-gray-500"
                  type="submit"
                >
                  삭제
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
