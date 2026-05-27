import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function JoinCompletePage() {
  return (
    <PageShell>
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl font-black text-wadeal-red">
          ✓
        </div>
        <h1 className="text-lg font-black text-wadeal-ink">
          공동구매 참여가 완료됐어요
        </h1>
        <p className="mt-2 text-sm font-extrabold text-wadeal-red">
          최저가까지 2명 남음
        </p>
        <div className="mt-6 w-full space-y-2">
          <Link className="btn-kakao" href="/share/wd-vacuum-001">
            카카오 공유
          </Link>
          <Link className="btn-outline h-12 text-[15px]" href="/">
            홈으로
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
