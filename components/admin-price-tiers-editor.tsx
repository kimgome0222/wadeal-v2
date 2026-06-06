"use client";

import type { PriceTierEntry } from "@/lib/pricing/tiers";
import { ui } from "@/lib/ui";

type AdminPriceTiersEditorProps = {
  tiers: PriceTierEntry[];
  onChange: (tiers: PriceTierEntry[]) => void;
  disabled?: boolean;
};

export function AdminPriceTiersEditor({
  tiers,
  onChange,
  disabled = false,
}: AdminPriceTiersEditorProps) {
  function updateTier(index: number, patch: Partial<PriceTierEntry>) {
    onChange(
      tiers.map((tier, i) =>
        i === index ?
          {
            minQty: patch.minQty ?? tier.minQty,
            price: patch.price ?? tier.price,
          }
        : tier,
      ),
    );
  }

  function removeTier(index: number) {
    if (tiers.length <= 1) {
      return;
    }
    onChange(tiers.filter((_, i) => i !== index));
  }

  function addTier() {
    const last = tiers[tiers.length - 1];
    onChange([
      ...tiers,
      {
        minQty: last ? last.minQty + 10 : 1,
        price: last ? Math.max(0, last.price - 1000) : 0,
      },
    ]);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-black text-wadeal-ink">가격 단계 (price_tiers)</p>
        <button
          className="text-xs font-black text-wadeal-red disabled:opacity-50"
          disabled={disabled}
          onClick={addTier}
          type="button"
        >
          단계 추가
        </button>
      </div>

      <div className="space-y-2">
        {tiers.map((tier, index) => (
          <div
            className="grid grid-cols-[1fr_1fr_auto] items-end gap-2 rounded-lg border border-wadeal-line bg-wadeal-surface/40 p-3"
            key={`tier-${index}`}
          >
            <div>
              <label className="text-[11px] font-bold text-wadeal-muted">최소 수량</label>
              <input
                className={ui.input}
                disabled={disabled}
                inputMode="numeric"
                min={1}
                onChange={(event) =>
                  updateTier(index, { minQty: Number(event.target.value) })
                }
                type="number"
                value={tier.minQty}
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-wadeal-muted">가격 (원)</label>
              <input
                className={ui.input}
                disabled={disabled}
                inputMode="numeric"
                min={0}
                onChange={(event) =>
                  updateTier(index, { price: Number(event.target.value) })
                }
                type="number"
                value={tier.price}
              />
            </div>
            <button
              className="h-11 rounded-lg border border-wadeal-line px-3 text-xs font-black text-wadeal-muted disabled:opacity-40"
              disabled={disabled || tiers.length <= 1}
              onClick={() => removeTier(index)}
              type="button"
            >
              삭제
            </button>
          </div>
        ))}
      </div>

      <p className="text-[11px] font-bold leading-relaxed text-wadeal-muted">
        예: 1개 이상 29,900원 · 10개 이상 24,900원 · 30개 이상 21,900원 · 50개 이상
        18,900원
      </p>
    </div>
  );
}
