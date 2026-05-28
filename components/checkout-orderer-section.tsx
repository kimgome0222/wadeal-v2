import Link from "next/link";
import type { UserProfile } from "@/lib/profile/types";
import {
  getVerificationStatusBadgeClass,
  getVerificationStatusLabel,
} from "@/lib/identity/verification-status";
import { ui } from "@/lib/ui";

type CheckoutOrdererSectionProps = {
  profile: UserProfile | null;
  profileHref: string;
  missingOrdererInfo: boolean;
};

export function CheckoutOrdererSection({
  profile,
  profileHref,
  missingOrdererInfo,
}: CheckoutOrdererSectionProps) {
  const statusLabel = getVerificationStatusLabel(
    profile?.verificationStatus ?? "unverified",
  );
  const statusClass = getVerificationStatusBadgeClass(
    profile?.verificationStatus ?? "unverified",
  );

  return (
    <article className="rounded-xl border border-wadeal-line bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className={ui.sectionTitle}>주문자 정보</h2>
        <Link
          className="cursor-pointer text-xs font-black text-wadeal-red active:opacity-80"
          href={profileHref}
        >
          {missingOrdererInfo ? "정보 입력" : "정보 변경"}
        </Link>
      </div>

      {missingOrdererInfo ?
        <p className="mt-3 text-xs font-bold text-wadeal-red">
          주문자 이름과 휴대폰 번호를 입력해 주세요.
        </p>
      : <dl className="mt-3 space-y-1.5 text-xs font-bold text-wadeal-muted">
          <div className="flex justify-between gap-3">
            <dt>이름</dt>
            <dd className="font-black text-wadeal-ink">{profile?.realName}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>휴대폰</dt>
            <dd className="font-black text-wadeal-ink">{profile?.phone}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt>인증 상태</dt>
            <dd>
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-black ${statusClass}`}
              >
                {statusLabel}
              </span>
            </dd>
          </div>
        </dl>
      }

      {!missingOrdererInfo && profile?.verificationStatus === "unverified" ?
        <p className="mt-3 rounded-lg bg-wadeal-surface px-3 py-2.5 text-[11px] font-bold leading-relaxed text-wadeal-muted">
          휴대폰 인증을 완료하면 환불·고객센터 처리가 더 빨라져요.{" "}
          <Link className="font-black text-wadeal-red" href={profileHref}>
            마이페이지에서 인증하기
          </Link>
        </p>
      : null}
    </article>
  );
}
