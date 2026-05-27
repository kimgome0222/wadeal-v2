import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";

const alerts = [
  { product: "초경량 무선 청소기", condition: "39,000원 이하", href: "/alert/wd-vacuum-001" },
  { product: "한우 불고기 냉장팩", condition: "최저가 달성 시", href: "/alert/wd-beef-001" },
  { product: "제주 고당도 감귤 3kg", condition: "마감 1시간 전", href: "/alert/wd-citrus-001" },
];

export default function MypageAlertsPage() {
  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="가격 알림 설정" />
      <ul className="divide-y divide-wadeal-line px-4">
        {alerts.map((alert) => (
          <li className="py-3.5" key={alert.href}>
            <Link className="block active:opacity-80" href={alert.href}>
              <p className="text-sm font-black text-wadeal-ink">{alert.product}</p>
              <p className="mt-0.5 text-xs font-bold text-wadeal-muted">
                {alert.condition}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="px-4 pt-2">
        <Link
          className="text-[13px] font-bold text-wadeal-red"
          href="/alert/wd-vacuum-001"
        >
          + 새 알림 추가
        </Link>
      </div>
    </PageShell>
  );
}
