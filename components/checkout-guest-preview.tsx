import Link from "next/link";

import { CheckoutGuestPaymentSection } from "@/components/checkout-guest-payment-section";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SubHeader } from "@/components/sub-header";
import type { Deal } from "@/lib/deals";
import { currency } from "@/lib/deals";
import { ui } from "@/lib/ui";

type CheckoutGuestPreviewProps = {
  deal: Deal;
  quantity: number;
  unitPrice: number;
  subtotalAmount: number;
  isNormal: boolean;
  backHref: string;
  loginHref: string;
};

export function CheckoutGuestPreview({
  deal,
  quantity,
  unitPrice,
  subtotalAmount,
  isNormal,
  backHref,
  loginHref,
}: CheckoutGuestPreviewProps) {
  return (
    <PageShell className="pb-12">
      <SubHeader backHref={backHref} title="주문·결제" />
      <div className={`${ui.pageBody} space-y-10 pb-32`}>
        <div className="rounded-[16px] border border-[#E8ECEA] bg-[#F5F7F6] px-4 py-3 text-[13px] leading-relaxed text-[#666666]">
          로그인 후 배송지와 결제수단을 선택하고 주문을 완료할 수 있어요.
        </div>

        <section className="space-y-4">
          <h2 className="text-[18px] font-bold text-[#111111]">주문상품</h2>
          <article className="rounded-[20px] border border-[#E8ECEA] bg-white p-4">
            <p className="text-[13px] font-medium text-[#666666]">
              {deal.brandName?.trim() || "celloh 셀러"}
            </p>
            <p className="mt-2 text-[15px] font-semibold text-[#111111]">{deal.title}</p>
            <dl className="mt-3 space-y-2 text-[13px] text-[#666666]">
              <div className="flex justify-between gap-3">
                <dt>수량</dt>
                <dd className="font-semibold text-[#111111]">{quantity}개</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>{isNormal ? "상품금액" : "예상 단가"}</dt>
                <dd className="font-bold text-[#111111]">{currency.format(unitPrice)}원</dd>
              </div>
            </dl>
          </article>
        </section>

        <section className="space-y-4">
          <h2 className="text-[18px] font-bold text-[#111111]">배송지</h2>
          <article className="rounded-[20px] border border-[#E8ECEA] bg-white p-4">
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[6px] border-[#2E5E4E]"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-[#111111]">배송지를 선택해 주세요</p>
                <p className="mt-2 text-[13px] leading-relaxed text-[#666666]">
                  받는 사람 · 연락처 · 주소는 로그인 후 등록하거나 선택할 수 있어요.
                </p>
              </div>
            </div>
            <Link
              className="mt-4 flex h-11 w-full items-center justify-center rounded-xl border border-[#E8ECEA] text-[14px] font-semibold text-[#2E5E4E] active:bg-[#FAFBFA]"
              href={loginHref}
            >
              로그인하고 배송지 선택
            </Link>
          </article>
        </section>

        <section className="space-y-4">
          <h2 className="text-[18px] font-bold text-[#111111]">쿠폰 · 포인트</h2>
          <article className="w-full min-w-0 overflow-hidden rounded-[20px] border border-[#E8ECEA] bg-white p-4 opacity-90">
            <div className="flex min-w-0 gap-2">
              <input
                className={`${ui.formInput} min-w-0 flex-1`}
                disabled
                placeholder="쿠폰 코드 입력"
              />
              <button className={ui.formBtnInline} disabled type="button">
                적용
              </button>
            </div>
            <div className="mt-3 flex min-w-0 gap-2">
              <input className={`${ui.formInput} min-w-0 flex-1`} disabled placeholder="0" />
              <button className={ui.formBtnInline} disabled type="button">
                전액
              </button>
            </div>
            <p className="mt-2 text-[12px] text-[#666666]">로그인 후 쿠폰·포인트를 사용할 수 있어요.</p>
          </article>
        </section>

        <section className="space-y-4">
          <h2 className="text-[18px] font-bold text-[#111111]">결제수단</h2>
          <CheckoutGuestPaymentSection />
        </section>

        <section className="space-y-4">
          <h2 className="text-[18px] font-bold text-[#111111]">최종 결제금액</h2>
          <article className="rounded-[20px] border border-[#E8ECEA] bg-white p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[14px] text-[#666666]">결제예정금액</span>
              <span className="text-[22px] font-bold tabular-nums text-[#111111]">
                {currency.format(subtotalAmount)}원
              </span>
            </div>
          </article>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[430px] border-t border-[#E8ECEA] bg-white px-6 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 shadow-[0_-2px_12px_rgba(17,17,17,0.04)]">
        <Link
          className={`${ui.btnPrimary} flex h-14 w-full items-center justify-center rounded-2xl text-[15px] font-semibold`}
          href={loginHref}
        >
          로그인하고 {isNormal ? "결제하기" : "구매하기"}
        </Link>
      </div>

      <SiteFooter className="mb-24" />
    </PageShell>
  );
}
