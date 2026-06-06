import { redirect } from "next/navigation";

import {
  moveCategoryOrderAction,
  updateCategoryVisibilityAction,
} from "@/app/actions/admin-commerce";
import { AdminNav } from "@/components/admin-nav";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAdminCategories } from "@/lib/data/admin-commerce";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/admin/login?next=/admin/categories");
  }
  if (!(await isAdminUser(user))) {
    redirect("/unauthorized?next=/admin/categories");
  }

  const categories = await getAdminCategories();

  return (
    <PageShell>
      <SubHeader backHref="/admin/dashboard" title="카테고리 관리" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/categories" />
        <p className="text-xs font-bold text-wadeal-muted">
          정적 catalog와 연결된 카테고리입니다. migration 050 적용 시 DB에 순서·노출 설정이 저장됩니다.
        </p>
        {categories.map((category, index) => (
          <article className="rounded-xl border border-wadeal-line bg-white p-4" key={category.slug}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black text-wadeal-muted">#{category.displayOrder}</p>
                <h2 className="text-base font-black text-wadeal-ink">{category.name}</h2>
                <p className="mt-1 text-xs font-bold text-wadeal-muted">/{category.slug}</p>
              </div>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-[11px] font-black text-gray-600">
                {category.visible ? "노출" : "숨김"}
              </span>
            </div>
            <ul className="mt-3 space-y-1">
              {category.subcategories.map((sub) => (
                <li className="text-xs font-bold text-wadeal-muted" key={sub.slug}>
                  · {sub.name} ({sub.slug})
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] font-bold text-wadeal-muted">
              연결: {category.connectedRoutes.join(", ")}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <form action={moveCategoryOrderAction}>
                <input name="slug" type="hidden" value={category.slug} />
                <input name="direction" type="hidden" value="up" />
                <button
                  className="h-9 w-full rounded-xl border border-wadeal-line text-xs font-black disabled:opacity-40"
                  disabled={index === 0}
                  type="submit"
                >
                  ↑ 위로
                </button>
              </form>
              <form action={moveCategoryOrderAction}>
                <input name="slug" type="hidden" value={category.slug} />
                <input name="direction" type="hidden" value="down" />
                <button
                  className="h-9 w-full rounded-xl border border-wadeal-line text-xs font-black disabled:opacity-40"
                  disabled={index === categories.length - 1}
                  type="submit"
                >
                  ↓ 아래로
                </button>
              </form>
              <form action={updateCategoryVisibilityAction}>
                <input name="slug" type="hidden" value={category.slug} />
                <button className="h-9 w-full rounded-xl border border-wadeal-line text-xs font-black" type="submit">
                  {category.visible ? "숨김" : "노출"}
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
