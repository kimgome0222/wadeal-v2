import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";

const orders = [
  { title: "순면 호텔 타월 10장", status: "배송중", date: "2026.05.24" },
  { title: "제주 고당도 감귤 3kg", status: "결제완료", date: "2026.05.20" },
  { title: "노이즈캔슬링 무선 이어폰", status: "참여중", date: "2026.05.18" },
];

export default function OrdersPage() {
  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="주문 내역" />
      <ul className="divide-y divide-wadeal-line px-4">
        {orders.map((order) => (
          <li className="py-4" key={order.title}>
            <p className="text-sm font-black text-wadeal-ink">{order.title}</p>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs font-extrabold text-wadeal-red">
                {order.status}
              </span>
              <span className="text-xs font-bold text-gray-400">{order.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
