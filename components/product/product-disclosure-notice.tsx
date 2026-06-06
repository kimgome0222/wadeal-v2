import Link from "next/link";

type ProductDisclosureNoticeProps = {
  className?: string;
};

export function ProductDisclosureNotice({ className = "" }: ProductDisclosureNoticeProps) {
  return (
    <p
      className={`rounded-xl bg-[#F5F7F6] px-3 py-2.5 text-[11px] font-medium leading-relaxed text-[#666666] ${className}`.trim()}
    >
      판매자가 입력한 정보를 기준으로 제공됩니다. 법정 상품고시 확정본이 아니며, 상세는 판매자·
      <Link className="font-semibold text-[#2E5E4E] underline underline-offset-2" href="/support">
        고객센터
      </Link>
      로 문의해 주세요.
    </p>
  );
}
