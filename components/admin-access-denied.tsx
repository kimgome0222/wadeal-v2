import Link from "next/link";
import { ui } from "@/lib/ui";

export function AdminAccessDenied() {
  return (
    <div className="rounded-xl border border-dashed border-wadeal-line bg-white px-6 py-12 text-center">
      <p className="text-sm font-black text-wadeal-ink">접근 권한이 없어요.</p>
      <p className="mt-1 text-xs font-bold text-wadeal-muted">
        관리자만 이 페이지에 접근할 수 있어요.
      </p>
      <Link className={`${ui.btnPrimary} mx-auto mt-5 max-w-[240px] cursor-pointer`} href="/">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
