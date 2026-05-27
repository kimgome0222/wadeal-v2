import { BottomNavigation } from "@/components/bottom-navigation";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { ui } from "@/lib/ui";

const notifications = [
  { title: "목표가 달성", body: "무선 청소기 79,900원", time: "방금" },
  { title: "마감 임박", body: "제주 감귤 3kg · 2시간 후", time: "32분" },
  { title: "자동결제 예정", body: "한우 불고기 최저가 달성 시", time: "1시간" },
  { title: "배송 시작", body: "호텔 타월 10장 출고", time: "어제" },
];

export default function NotificationsPage() {
  return (
    <PageShell withBottomNav>
      <SubHeader backHref="/" title="알림" />
      <ul className={`${ui.listDivider} ${ui.pageBody}`}>
        {notifications.map((item) => (
          <li className="py-3.5" key={item.title}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-wadeal-ink">{item.title}</p>
                <p className="mt-0.5 text-[13px] font-bold text-wadeal-muted">
                  {item.body}
                </p>
              </div>
              <span className="shrink-0 text-[11px] font-bold text-gray-400">
                {item.time}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <BottomNavigation />
    </PageShell>
  );
}
