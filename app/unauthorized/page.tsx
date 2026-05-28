import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type UnauthorizedPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function UnauthorizedPage({ searchParams }: UnauthorizedPageProps) {
  const { next } = await searchParams;

  return (
    <PageShell>
      <SubHeader backHref="/" title="접근 권한 없음" />
      <div className={`${ui.pageBody} mx-auto max-w-lg`}>
        <div className={`${ui.panel} space-y-4 text-center`}>
          <p className="text-base font-black text-wadeal-ink">이 페이지에 접근할 권한이 없어요</p>
          <p className="text-xs font-bold leading-relaxed text-wadeal-muted">
            {next ?
              "로그인 계정의 권한을 확인하거나 다른 계정으로 로그인해 주세요."
            : "필요한 권한이 있는 계정으로 로그인해 주세요."}
          </p>
          <div className="grid gap-2">
            <Link className={`${ui.btnPrimary} h-11`} href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}>
              로그인
            </Link>
            <Link className={`${ui.btnOutline} h-11`} href="/">
              홈으로
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
