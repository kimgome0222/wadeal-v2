import {
  RECOMMENDATION_BASIS_DETAIL,
  RECOMMENDATION_BASIS_SHORT,
} from "@/lib/personalization/recommendation-copy";

type RecommendationBasisHintProps = {
  className?: string;
  /** true면 상세 tooltip title 제공 */
  detailed?: boolean;
};

/** 추천 기준 안내 — 작은 보조 텍스트 */
export function RecommendationBasisHint({
  className = "",
  detailed = true,
}: RecommendationBasisHintProps) {
  return (
    <p
      className={`text-[11px] leading-snug text-[#999999] ${className}`.trim()}
      title={detailed ? RECOMMENDATION_BASIS_DETAIL : undefined}
    >
      추천 기준 · {RECOMMENDATION_BASIS_SHORT}
    </p>
  );
}
