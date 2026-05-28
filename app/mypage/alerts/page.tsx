import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getPriceAlertsForUser } from "@/lib/data";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function MypageAlertsPage() {
  const user = await getServerAuthUser();
  const alerts = user ? await getPriceAlertsForUser(user.id) : [];

  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="가격 알림 설정" />
      {!user ?
        <div className={`${ui.pageBody}`}>
          <div className="rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold leading-relaxed text-wadeal-muted">
            저장된 가격 알림을 보려면 로그인이 필요해요.{" "}
            <Link
              className="font-black text-wadeal-red underline"
              href="/login?redirect=/mypage/alerts"
            >
              로그인하기
            </Link>
          </div>
        </div>
      : alerts.length === 0 ?
        <div className={`${ui.pageBody}`}>
          <p className="text-sm font-bold text-wadeal-muted">
            아직 저장된 가격 알림이 없어요.
          </p>
          <Link
            className="mt-3 inline-block text-[13px] font-bold text-wadeal-red"
            href="/"
          >
            상품 보러 가기
          </Link>
        </div>
      : <>
          <ul className={`${ui.listDivider} ${ui.pageBody}`}>
            {alerts.map((alert) => (
              <li className="py-3.5" key={alert.id}>
                <Link className="block active:opacity-80" href={alert.href}>
                  <p className="text-sm font-black text-wadeal-ink">
                    {alert.productName}
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-wadeal-muted">
                    {alert.condition}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-4 pb-4">
            <Link className="text-[13px] font-bold text-wadeal-red" href="/">
              + 새 알림 추가
            </Link>
          </div>
        </>
      }
    </PageShell>
  );
}
