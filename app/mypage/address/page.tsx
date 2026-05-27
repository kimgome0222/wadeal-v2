import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";

export default function AddressPage() {
  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="배송지 관리" />
      <div className="space-y-3 px-4 py-4">
        <section className="rounded-lg border-2 border-wadeal-red bg-red-50 p-4">
          <span className="text-xs font-black text-wadeal-red">기본</span>
          <p className="mt-2 text-sm font-extrabold text-wadeal-ink">김가나</p>
          <p className="mt-1 text-sm font-bold text-wadeal-muted">
            서울특별시 강남구 테헤란로 123, 1004호
          </p>
          <p className="mt-1 text-sm font-bold text-wadeal-muted">010-1234-5678</p>
        </section>
        <button
          className="h-11 w-full rounded-md border border-wadeal-line text-sm font-black text-wadeal-ink"
          type="button"
        >
          배송지 추가 (다음 단계)
        </button>
      </div>
    </PageShell>
  );
}
