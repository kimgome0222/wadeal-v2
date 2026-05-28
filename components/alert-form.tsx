"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { submitPriceAlertAction } from "@/app/actions/data";
import {
  buildAlertOptions,
  getDropTargetPrice,
  mapAlertOptionToInput,
  parseCustomTargetPrice,
  type AlertOption,
} from "@/lib/data/alert-options";
import type { Deal } from "@/lib/deals";
import { currency } from "@/lib/deals";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { ui } from "@/lib/ui";

type AlertFormProps = {
  deal: Deal;
  isLoggedIn: boolean;
};

export function AlertForm({ deal, isLoggedIn: isLoggedInFromServer }: AlertFormProps) {
  const router = useRouter();
  const alertOptions = useMemo(() => buildAlertOptions(deal), [deal]);
  const [selected, setSelected] = useState<AlertOption>(alertOptions[0]);
  const [customTargetPrice, setCustomTargetPrice] = useState(
    String(getDropTargetPrice(deal, 5)),
  );
  const [isLoggedIn, setIsLoggedIn] = useState(isLoggedInFromServer);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const alertPath = `/alert/${deal.slug}`;
  const loginHref = `/login?next=${encodeURIComponent(alertPath)}`;

  useEffect(() => {
    setIsLoggedIn(isLoggedInFromServer);
  }, [isLoggedInFromServer]);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      return;
    }

    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsLoggedIn(true);
      }
    });
  }, [isLoggedInFromServer]);

  async function handleSaveClick() {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (selected.key === "custom" && parseCustomTargetPrice(customTargetPrice) == null) {
      setErrorMessage("목표 가격을 선택해주세요");
      return;
    }

    if (!isLoggedIn) {
      router.push(loginHref);
      return;
    }

    setSuccessMessage("알림 설정되었습니다");

    const parsedCustomPrice =
      selected.key === "custom" ? parseCustomTargetPrice(customTargetPrice) : null;

    setSaving(true);
    try {
      const result = await submitPriceAlertAction(
        mapAlertOptionToInput(deal.slug, selected, parsedCustomPrice),
      );

      if (result.success) {
        router.push("/mypage/alerts");
        return;
      }

      setSuccessMessage(null);

      if (result.error === "login_required") {
        router.push(loginHref);
        return;
      }

      if (result.error === "invalid_target_price") {
        setErrorMessage("목표 가격을 선택해주세요");
        return;
      }

      setErrorMessage("가격 알림 저장에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } catch (error) {
      setSuccessMessage(null);
      if (process.env.NODE_ENV === "development") {
        console.error("[alert-form]", error);
      }
      setErrorMessage("가격 알림 저장에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative z-10 space-y-3">
      <p className="text-sm font-bold text-wadeal-muted">
        현재 공동구매가{" "}
        <span className="font-black text-wadeal-red">
          {currency.format(deal.groupPrice)}원
        </span>
      </p>

      <p className="text-xs font-bold text-wadeal-muted">목표 가격을 선택해 주세요</p>

      <div className="space-y-2">
        {alertOptions.map((option) => {
          const isSelected = selected.key === option.key;

          return (
            <button
              className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-left transition hover:border-wadeal-red hover:bg-red-50 active:opacity-90 ${
                isSelected ?
                  "border-wadeal-red bg-red-50"
                : "border-wadeal-line bg-white"
              }`}
              key={option.key}
              onClick={() => setSelected(option)}
              type="button"
            >
              <span
                aria-hidden
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  isSelected ?
                    "border-wadeal-red bg-wadeal-red"
                  : "border-wadeal-line bg-white"
                }`}
              >
                {isSelected ?
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                : null}
              </span>
              <span className="text-sm font-extrabold text-wadeal-ink">{option.label}</span>
            </button>
          );
        })}
      </div>

      {selected.key === "custom" ?
        <div>
          <label className={ui.label} htmlFor="custom-target-price">
            목표 가격 (원)
          </label>
          <input
            className={ui.input}
            id="custom-target-price"
            inputMode="numeric"
            onChange={(event) => setCustomTargetPrice(event.target.value)}
            placeholder="예: 39000"
            type="text"
            value={customTargetPrice}
          />
        </div>
      : null}

      {successMessage ?
        <p className={ui.successBanner} role="status">
          {successMessage}
        </p>
      : null}

      {errorMessage ?
        <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-xs font-bold text-wadeal-red">
          {errorMessage}
        </p>
      : null}

      <button
        className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-wadeal-line bg-white p-5 text-center transition hover:border-wadeal-red hover:bg-red-50 active:opacity-90"
        onClick={() => void handleSaveClick()}
        type="button"
      >
        <span className="text-[15px] font-black text-wadeal-ink">
          {saving ? "저장 중..." : "가격 알림 저장하기"}
        </span>
        <span className="mt-1 text-xs font-bold text-wadeal-muted">
          선택한 목표 가격으로 알림을 저장합니다
        </span>
      </button>
    </div>
  );
}
