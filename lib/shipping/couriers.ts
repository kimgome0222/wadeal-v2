export type Courier = {
  code: string;
  name: string;
};

export const COURIERS: readonly Courier[] = [
  { code: "cj", name: "CJ대한통운" },
  { code: "lotte", name: "롯데택배" },
  { code: "hanjin", name: "한진택배" },
  { code: "logen", name: "로젠택배" },
  { code: "epost", name: "우체국택배" },
] as const;

export function getCourierByCode(code: string): Courier | undefined {
  return COURIERS.find((item) => item.code === code);
}

export function getCourierName(code: string): string | null {
  return getCourierByCode(code)?.name ?? null;
}
