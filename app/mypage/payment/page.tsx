import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";

export default function PaymentPage() {
  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="결제수단 관리" />
      <div className="space-y-3 px-4 py-4">
        <section className="rounded-lg border border-wadeal-line p-4">
          <p className="text-sm font-black text-wadeal-ink">신한카드</p>
          <p className="mt-1 text-sm font-extrabold text-wadeal-muted">**** 4242</p>
          <p className="mt-2 text-xs font-bold text-wadeal-red">기본 결제수단</p>
        </section>
        <button
          className="h-11 w-full rounded-md border border-wadeal-line text-sm font-black text-wadeal-ink"
          type="button"
        >
          카드 추가 (다음 단계)
        </button>
      </div>
    </PageShell>
  );
}
