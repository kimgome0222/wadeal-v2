"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { submitUserAlertAction } from "@/app/actions/data";
import {
  buildAlertOptions,
  getDropTargetPrice,
  parseCustomTargetPrice,
  resolveAlertTargetPrice,
  type AlertOptionKey,
} from "@/lib/data/alert-options";
import type { Deal } from "@/lib/deals";
import { currency } from "@/lib/deals";
import { recordActivity } from "@/lib/storage/local-user-data";
import { ui } from "@/lib/ui";

type AlertFormProps = {
  deal: Deal;
};

export function AlertForm({ deal }: AlertFormProps) {
  const router = useRouter();
  const alertOptions = useMemo(() => buildAlertOptions(deal), [deal]);
  const [selectedKey, setSelectedKey] = useState<AlertOptionKey>("drop_5");
  const [customTargetPrice, setCustomTargetPrice] = useState(
    String(getDropTargetPrice(deal, 5)),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const alertPath = `/alert/${deal.slug}`;
  const loginHref = `/login?next=${encodeURIComponent(alertPath)}`;
  const selected = alertOptions.find((option) => option.key === selectedKey) ?? alertOptions[0];

  async function handleAlertButtonClick() {
    setErrorMessage(null);

    const targetPrice = resolveAlertTargetPrice(selected, customTargetPrice);
    if (targetPrice == null) {
      setErrorMessage("목표 가격을 선택해 주세요");
      return;
    }

    setSaving(true);
    try {
      const result = await submitUserAlertAction({
        productSlug: deal.slug,
        productName: deal.title,
        currentPrice: deal.groupPrice,
        targetPrice,
      });

      if (result.error === "login_required") {
        router.push(loginHref);
        return;
      }

      if (!result.success) {
        if (result.error === "invalid_target_price") {
          setErrorMessage("목표 가격을 선택해 주세요");
          return;
        }

        if (result.error === "product_not_found") {
          setErrorMessage("상품 정보를 찾지 못했어요. 잠시 후 다시 시도해 주세요.");
          return;
        }

        console.error("[alert-form] submitUserAlertAction failed:", result.error);
        setErrorMessage("가격 알림 저장에 실패했어요. 잠시 후 다시 시도해 주세요.");
        return;
      }

      // TODO(kakao): alerts 저장 후 목표가 도달 시 카카오톡 메시지 API 연동
      recordActivity({
        type: "alert",
        title: "가격 알림 설정",
        description: `${deal.title} 목표가 ${currency.format(targetPrice)}원 알림을 설정했어요.`,
        href: "/mypage/alerts",
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error("[alert-form] submitUserAlertAction:", error);
      setErrorMessage("가격 알림 저장에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSaving(false);
    }
  }

  function handleConfirm() {
    setIsModalOpen(false);
    router.push("/mypage/alerts");
  }

  return (
    <>
      <div className="space-y-3">
        <p className="text-sm font-bold text-wadeal-muted">
          현재 공동구매가{" "}
          <span className="font-black text-wadeal-red">
            {currency.format(deal.groupPrice)}원
          </span>
        </p>

        <p className="text-xs font-bold text-wadeal-muted">목표 가격을 선택해 주세요</p>

        <div className="space-y-2">
          {alertOptions.map((option) => {
            const isSelected = selectedKey === option.key;

            return (
              <button
                aria-pressed={isSelected}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border-2 p-3.5 text-left transition active:scale-[0.98] active:opacity-90 ${
                  isSelected ?
                    "border-wadeal-red bg-red-50 ring-1 ring-wadeal-red"
                  : "border-wadeal-line bg-white hover:border-wadeal-red hover:bg-red-50"
                }`}
                disabled={saving}
                key={option.key}
                onClick={() => setSelectedKey(option.key)}
                type="button"
              >
                <span
                  aria-hidden
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    isSelected ?
                      "border-wadeal-red bg-wadeal-red text-[10px] font-black text-white"
                    : "border-wadeal-line bg-white"
                  }`}
                >
                  {isSelected ? "✓" : null}
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
              disabled={saving}
              id="custom-target-price"
              inputMode="numeric"
              onChange={(event) => setCustomTargetPrice(event.target.value)}
              placeholder="예: 39000"
              type="text"
              value={customTargetPrice}
            />
            {parseCustomTargetPrice(customTargetPrice) == null && customTargetPrice.trim() !== "" ?
              <p className="mt-1 text-xs font-bold text-wadeal-red">
                올바른 목표 가격을 입력해 주세요
              </p>
            : null}
          </div>
        : null}

        {errorMessage ?
          <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-xs font-bold text-wadeal-red">
            {errorMessage}
          </p>
        : null}

        <button
          className={`${ui.btnPrimary} cursor-pointer transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60`}
          data-testid="alert-save-button"
          disabled={saving}
          onClick={() => void handleAlertButtonClick()}
          type="button"
        >
          {saving ? "저장 중..." : "가격 알림 저장"}
        </button>
        <p className="text-center text-[11px] font-bold leading-relaxed text-wadeal-muted">
          카카오톡 알림 발송은 준비 중이에요. 저장된 알림은 마이페이지에서 확인할 수 있어요.
        </p>
      </div>

      {isModalOpen ?
        <div
          aria-labelledby="alert-complete-title"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-6"
          role="dialog"
        >
          <div className="w-full max-w-[320px] rounded-2xl bg-white px-6 py-7 text-center shadow-soft">
            <h2
              className="text-lg font-black text-wadeal-ink"
              id="alert-complete-title"
            >
              알림 설정 완료
            </h2>
            <p className="mt-3 text-sm font-bold leading-relaxed text-wadeal-muted">
              목표 가격 알림이 저장됐어요. 카카오톡 발송은 준비 중이며, 마이페이지에서 확인할 수
              있어요.
            </p>
            <button
              className={`${ui.btnPrimary} mt-6 cursor-pointer`}
              onClick={handleConfirm}
              type="button"
            >
              확인
            </button>
          </div>
        </div>
      : null}
    </>
  );
}
