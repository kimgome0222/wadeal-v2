"use client";

import { useState } from "react";

import { ui } from "@/lib/ui";

/** join-cart 쿠폰·포인트 mock 입력 — flex-1 input, overflow-x 없음 */
export function JoinCartPromoSection() {
  const [couponInput, setCouponInput] = useState("");
  const [pointInput, setPointInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [pointApplied, setPointApplied] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function handleApplyCoupon() {
    const code = couponInput.trim();
    if (!code) {
      setMessage("쿠폰 코드를 입력해 주세요.");
      return;
    }
    setCouponApplied(true);
    setMessage(`${code.toUpperCase()} 쿠폰이 적용됐어요. (mock)`);
  }

  function handleApplyPoints() {
    const points = Number(pointInput.replace(/[^\d]/g, "")) || 0;
    if (points <= 0) {
      setMessage("사용할 포인트를 입력해 주세요.");
      return;
    }
    setPointApplied(true);
    setMessage(`${points.toLocaleString("ko-KR")}P가 적용됐어요. (mock)`);
  }

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-[20px] border border-[#E8ECEA] bg-white p-4">
      <h2 className="text-[16px] font-bold text-[#111111]">쿠폰 · 포인트</h2>
      <p className="mt-1 text-[12px] text-[#666666]">
        금액 구간 쿠폰은 자동 적용돼요. 추가 쿠폰·포인트는 mock으로 미리보기할 수 있어요.
      </p>

      <div className="mt-4 space-y-4">
        <div className="space-y-2">
          <label className="text-[13px] font-medium text-[#666666]" htmlFor="join-cart-coupon">
            쿠폰 코드
          </label>
          <div className="flex min-w-0 gap-2">
            <input
              className={`${ui.formInput} min-w-0 flex-1`}
              disabled={couponApplied}
              id="join-cart-coupon"
              onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
              placeholder="쿠폰 코드 입력"
              value={couponInput}
            />
            {couponApplied ?
              <button
                className={ui.formBtnInline}
                onClick={() => {
                  setCouponApplied(false);
                  setCouponInput("");
                  setMessage(null);
                }}
                type="button"
              >
                해제
              </button>
            : <button className={ui.formBtnInline} onClick={handleApplyCoupon} type="button">
                적용
              </button>
            }
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-[#666666]" htmlFor="join-cart-points">
            포인트 사용
          </label>
          <div className="flex min-w-0 gap-2">
            <input
              className={`${ui.formInput} min-w-0 flex-1`}
              disabled={pointApplied}
              id="join-cart-points"
              inputMode="numeric"
              onChange={(event) => setPointInput(event.target.value.replace(/[^\d]/g, ""))}
              placeholder="0"
              value={pointInput}
            />
            <button
              className={ui.formBtnInline}
              disabled={pointApplied}
              onClick={() => setPointInput("5000")}
              type="button"
            >
              전액
            </button>
            {pointApplied ?
              <button
                className={ui.formBtnInline}
                onClick={() => {
                  setPointApplied(false);
                  setPointInput("");
                  setMessage(null);
                }}
                type="button"
              >
                해제
              </button>
            : <button className={ui.formBtnInline} onClick={handleApplyPoints} type="button">
                적용
              </button>
            }
          </div>
        </div>

        {message ?
          <p className="rounded-xl bg-[#FFF4E8] px-3 py-2 text-[12px] font-medium text-[#E28A3B]">
            {message}
          </p>
        : null}
      </div>
    </section>
  );
}
