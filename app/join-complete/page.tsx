import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function JoinCompletePage() {
  return (
    <PageShell>
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl">
          ✓
        </div>
        <h1 className="text-xl font-black text-wadeal-ink">
          공동구매 참여가 완료됐어요!
        </h1>
        <p className="mt-3 text-base font-extrabold text-wadeal-red">
          최저가까지 2명 남았어요
        </p>
        <div className="mt-8 w-full space-y-3">
          <Link
            className="flex h-12 w-full items-center justify-center rounded-md bg-wadeal-kakao text-base font-black text-[#3c1e1e]"
            href="/share/wd-vacuum-001"
          >
            카카오톡으로 친구 초대
          </Link>
          <Link
            className="flex h-12 w-full items-center justify-center rounded-md border border-wadeal-line text-base font-black text-wadeal-ink"
            href="/"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
