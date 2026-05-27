import { BottomNavigation } from "@/components/bottom-navigation";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";

const notifications = [
  {
    title: "목표가 달성 알림",
    body: "초경량 무선 청소기가 79,900원에 도달했어요.",
    time: "방금",
    type: "price",
  },
  {
    title: "공동구매 마감 임박",
    body: "제주 고당도 감귤 3kg 공동구매가 2시간 후 마감돼요.",
    time: "32분 전",
    type: "closing",
  },
  {
    title: "자동결제 예정",
    body: "한우 불고기 냉장팩 최저가 달성 시 카드 결제가 예정돼요.",
    time: "1시간 전",
    type: "payment",
  },
  {
    title: "배송 시작",
    body: "순면 호텔 타월 10장이 오늘 출고됐어요.",
    time: "어제",
    type: "delivery",
  },
];

export default function NotificationsPage() {
  return (
    <PageShell withBottomNav>
      <SubHeader backHref="/" title="알림" />
      <ul className="divide-y divide-wadeal-line px-4">
        {notifications.map((item) => (
          <li className="py-4" key={item.title}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-wadeal-ink">{item.title}</p>
                <p className="mt-1 text-sm font-bold text-wadeal-muted">{item.body}</p>
              </div>
              <span className="shrink-0 text-xs font-bold text-gray-400">
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
