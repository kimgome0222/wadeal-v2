import Link from "next/link";

import { AppBottomNavigation } from "@/components/app-bottom-navigation";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getLiveEvents } from "@/lib/data/admin-commerce";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

const statusLabel = {
  scheduled: "오픈 예정",
  live: "진행중",
  ended: "종료",
} as const;

export default async function EventsPage() {
  const events = await getLiveEvents();

  return (
    <PageShell withBottomNav>
      <SubHeader backHref="/" title="기획전" />
      <div className={`${ui.pageBody} space-y-4`}>
        {events.length === 0 ?
          <p className="rounded-xl border border-wadeal-line bg-white p-6 text-center text-sm font-bold text-wadeal-muted">
            진행 중인 기획전이 없어요.
          </p>
        : events.map((event) => (
            <Link
              className="block rounded-xl border border-wadeal-line bg-white p-4 active:bg-gray-50"
              href={`/search?sort=popular&q=${encodeURIComponent(event.title)}`}
              key={event.id}
            >
              <span className="rounded-full bg-wadeal-red/10 px-2 py-0.5 text-[11px] font-black text-wadeal-red">
                {statusLabel[event.status]}
              </span>
              <h2 className="mt-2 text-base font-black text-wadeal-ink">{event.title}</h2>
              <p className="mt-1 text-xs font-bold leading-relaxed text-wadeal-muted">{event.description}</p>
              <p className="mt-2 text-[11px] font-bold text-wadeal-muted">
                {event.startsAt} – {event.endsAt}
              </p>
            </Link>
          ))
        }
      </div>
      <AppBottomNavigation />
    </PageShell>
  );
}
