import type { CategorySlug } from "@/lib/categories";
import type { Deal } from "@/lib/deals";
import type { DetailInfoRow } from "@/lib/product/detail-data";
import {
  resolveCategoryLabel,
  resolveSellerName,
} from "@/lib/product/display-fallbacks";

export const PRODUCT_DISCLOSURE_NOTICE =
  "본 정보는 판매자가 입력한 내용을 기준으로 제공되며, 법정 상품고시 확정본이 아닙니다. 상세는 판매자·고객센터로 문의해 주세요.";

type DisclosureHints = Record<string, string>;

const CATEGORY_DISCLOSURE: Partial<Record<CategorySlug, DisclosureHints>> = {
  food: {
    원산지: "국내산·수입산 (상품별 상이)",
    "제조연월/소비기한": "제품별 상이 (포장 표기일 참고)",
    "용량/수량": "상품 상세 참고",
    보관방법: "직사광선을 피하고 서늘한 곳 보관",
    "인증/허가사항": "식품위생법에 따른 표시 (판매자 입력)",
    주의사항: "알레르기 유발 성분·개봉 후 섭취 기한 확인",
  },
  living: {
    원산지: "상품 상세 참고",
    "제조연월/소비기한": "해당 없음 또는 상품별 상이",
    "용량/수량": "상품별 상이",
    보관방법: "건조하고 통풍이 잘 되는 곳",
    "인증/허가사항": "KC 인증 등 (해당 시 판매자 입력)",
    주의사항: "사용 전 설명서 확인",
  },
  beauty: {
    원산지: "상품 상세 참고",
    "제조연월/소비기한": "개봉 전/후 사용기한 별도 표기",
    "용량/수량": "ml/g 단위 (상품별 상이)",
    보관방법: "직사광선·고온 다습 피하기",
    "인증/허가사항": "화장품 책임판매업 등 (판매자 입력)",
    주의사항: "사용 중 이상 시 사용 중단·상담",
  },
  fashion: {
    "제조연월/소비기한": "해당 없음",
    "용량/수량": "사이즈·색상 (상품별 상이)",
    보관방법: "세탁·관리 방법은 라벨 참고",
    "인증/허가사항": "KC 어린이제품 등 (해당 시)",
    주의사항: "염색·세탁 시 이염 주의",
  },
  digital: {
    "제조연월/소비기한": "제조일 또는 출시일 (상품별)",
    "용량/수량": "모델명·규격 (상품별)",
    보관방법: "습기·충격 주의",
    "인증/허가사항": "KC 전기용품·전파인증 (해당 시)",
    주의사항: "정품 보증·A/S 기간 확인",
  },
  pet: {
    "제조연월/소비기한": "유통기한 포장 표기",
    "용량/수량": "중량·입수 (상품별)",
    보관방법: "직사광선 피하고 서늘한 곳",
    "인증/허가사항": "사료·간식 등 해당 시 표시",
    주의사항: "반려동물 알레르기·급여량 확인",
  },
  baby: {
    "제조연월/소비기한": "제조일·유통기한 표기",
    "용량/수량": "상품별 상이",
    보관방법: "위생적 보관·개봉 후 기한 준수",
    "인증/허가사항": "KC 어린이제품 (해당 시)",
    주의사항: "연령·체중에 맞는 사용",
  },
};

function resolvePrimaryCategory(deal: Deal): CategorySlug {
  for (const slug of deal.categoryTags) {
    if (CATEGORY_DISCLOSURE[slug]) {
      return slug;
    }
  }
  return "living";
}

export function buildProductDisclosureRows(deal: Deal): DetailInfoRow[] {
  const category = resolvePrimaryCategory(deal);
  const hints = CATEGORY_DISCLOSURE[category] ?? CATEGORY_DISCLOSURE.living ?? {};
  const sellerName = resolveSellerName(deal);
  const categoryLabel = resolveCategoryLabel(deal);

  return [
    { label: "상품명", value: deal.title },
    { label: "제조사/판매자", value: deal.brandName?.trim() || sellerName },
    { label: "원산지", value: hints.원산지 ?? "상품 상세 참고" },
    { label: "제조연월/소비기한", value: hints["제조연월/소비기한"] ?? "상품별 상이 (placeholder)" },
    { label: "용량/수량", value: hints["용량/수량"] ?? "상품별 상이" },
    { label: "보관방법", value: hints.보관방법 ?? "상품 설명 참고" },
    { label: "배송방법", value: "택배 배송 (판매자·상품별 상이)" },
    { label: "A/S 또는 고객센터", value: "celloh 고객센터 /support · 판매자 문의" },
    { label: "인증/허가사항", value: hints["인증/허가사항"] ?? "해당 시 판매자 입력 (placeholder)" },
    { label: "주의사항", value: hints.주의사항 ?? "사용 전 상품 설명 확인" },
    { label: "카테고리", value: categoryLabel },
  ];
}

export function getCategoryDisclosureSummary(): { category: string; notes: string }[] {
  return [
    { category: "식품", notes: "원산지·유통기한·알레르기 표시 placeholder" },
    { category: "생활용품", notes: "KC·용량·사용법 placeholder" },
    { category: "뷰티", notes: "전성분·사용기한·책임판매 placeholder" },
    { category: "패션", notes: "소재·사이즈·세탁법 placeholder" },
    { category: "디지털", notes: "KC·모델명·A/S placeholder" },
    { category: "반려동물", notes: "급여량·유통기한 placeholder" },
  ];
}
