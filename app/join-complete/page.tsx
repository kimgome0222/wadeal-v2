import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function JoinCompletePage() {
  return (
    <PageShell>
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl text-wadeal-red">
          ✓
        </div>
        <h1 className="text-lg font-black text-wadeal-ink">
          공동구매 참여가 완료됐어요!
        </h1>
        <p className="mt-2 text-sm font-extrabold text-wadeal-red">
          최저가까지 2명 남았어요
        </p>
        <div className="mt-7 w-full space-y-2.5">
          <Link className="btn-kakao" href="/share/wd-vacuum-001">
            카카오톡으로 친구 초대
          </Link>
          <Link className="btn-outline h-12 text-[15px]" href="/">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
