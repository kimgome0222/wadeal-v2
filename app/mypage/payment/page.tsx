import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";

export default function PaymentPage() {
  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="결제수단 관리" />
      <div className="space-y-2.5 px-4 py-4">
        <section className="panel">
          <p className="text-sm font-black text-wadeal-ink">신한카드</p>
          <p className="mt-0.5 text-sm font-extrabold text-wadeal-muted">**** 4242</p>
          <p className="mt-2 text-[11px] font-bold text-wadeal-red">기본 결제수단</p>
        </section>
        <Link className="btn-outline w-full" href="/mypage/payment/new">
          카드 추가
        </Link>
      </div>
    </PageShell>
  );
}
