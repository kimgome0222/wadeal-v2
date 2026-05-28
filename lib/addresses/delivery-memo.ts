export const DELIVERY_MEMO_PRESETS = [
  "문 앞에 놓아주세요",
  "경비실에 맡겨주세요",
  "택배함에 넣어주세요",
  "배송 전 연락주세요",
  "직접 입력",
] as const;

export type DeliveryMemoPreset = (typeof DELIVERY_MEMO_PRESETS)[number];

export const DELIVERY_MEMO_CUSTOM = "직접 입력" satisfies DeliveryMemoPreset;

export function resolveDeliveryMemo(preset: string, customText: string): string {
  const trimmedCustom = customText.trim();
  if (preset === DELIVERY_MEMO_CUSTOM) {
    return trimmedCustom;
  }
  return preset.trim() || trimmedCustom;
}
