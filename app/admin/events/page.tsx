import Link from "next/link";
import { redirect } from "next/navigation";

import { deleteEventAction, saveEventAction } from "@/app/actions/admin-commerce";
import { AdminNav } from "@/components/admin-nav";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAdminEvents } from "@/lib/data/admin-commerce";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

const statusLabel = {
  scheduled: "예정",
  live: "진행중",
  ended: "종료",
} as const;

export default async function AdminEventsPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/admin/login?next=/admin/events");
  }
  if (!(await isAdminUser(user))) {
    redirect("/unauthorized?next=/admin/events");
  }

  const events = await getAdminEvents();

  return (
    <PageShell>
      <SubHeader backHref="/admin/dashboard" title="기획전 관리" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/events" />
        <Link className="text-xs font-bold text-wadeal-red" href="/events">
          구매자 기획전 페이지 보기 →
        </Link>
        <form action={saveEventAction} className="space-y-3 rounded-xl border border-wadeal-line bg-white p-4">
          <h2 className="text-sm font-black text-wadeal-ink">기획전 추가</h2>
          <input
            className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none"
            name="title"
            placeholder="기획전명"
            required
          />
          <textarea
            className="min-h-20 w-full rounded-xl bg-gray-50 px-3 py-2 text-sm font-bold outline-none"
            name="description"
            placeholder="설명"
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none"
              defaultValue="2026-01-01 00:00"
              name="startsAt"
              placeholder="시작"
            />
            <input
              className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none"
              defaultValue="2099-12-31 23:59"
              name="endsAt"
              placeholder="종료"
            />
          </div>
          <input
            className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none"
            name="linkedCategorySlugs"
            placeholder="연결 카테고리 slug (쉼표 구분)"
          />
          <select className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none" name="status">
            <option value="scheduled">예정</option>
            <option value="live">진행중</option>
            <option value="ended">종료</option>
          </select>
          <button className={`${ui.btnPrimary} h-11 w-full`} type="submit">
            기획전 저장
          </button>
        </form>
        {events.map((event) => (
          <article className="rounded-xl border border-wadeal-line bg-white p-4" key={event.id}>
            <p className="text-[11px] font-black text-wadeal-muted">{event.id}</p>
            <h2 className="mt-1 text-base font-black text-wadeal-ink">{event.title}</h2>
            <p className="mt-1 text-xs font-bold text-wadeal-muted">{event.description}</p>
            <p className="mt-2 text-xs font-bold text-wadeal-muted">
              {event.startsAt} – {event.endsAt}
            </p>
            <span className="mt-2 inline-block rounded-full bg-gray-100 px-2 py-1 text-[11px] font-black">
              {statusLabel[event.status]}
            </span>
            <form action={deleteEventAction} className="mt-3">
              <input name="eventId" type="hidden" value={event.id} />
              <button
                className="h-10 w-full rounded-xl border border-wadeal-line text-xs font-black text-gray-500"
                type="submit"
              >
                삭제
              </button>
            </form>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
