import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";

export default function AddressPage() {
  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="배송지 관리" />
      <div className="space-y-2.5 px-4 py-4">
        <section className="rounded-xl border-2 border-wadeal-red bg-red-50 p-4">
          <span className="text-[11px] font-black text-wadeal-red">기본</span>
          <p className="mt-1.5 text-sm font-extrabold text-wadeal-ink">김가나</p>
          <p className="mt-0.5 text-sm font-bold text-wadeal-muted">
            서울특별시 강남구 테헤란로 123, 1004호
          </p>
          <p className="mt-0.5 text-sm font-bold text-wadeal-muted">010-1234-5678</p>
        </section>
        <Link className="btn-outline w-full" href="/mypage/address/new">
          배송지 추가
        </Link>
      </div>
    </PageShell>
  );
}
