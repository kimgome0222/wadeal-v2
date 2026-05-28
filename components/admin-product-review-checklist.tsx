"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { saveProductReviewChecksAction } from "@/app/actions/admin-products";
import type { CategoryReviewRuleRecord } from "@/lib/data/category-review-rules";
import type { ProductReviewCheckRecord } from "@/lib/data/product-review-checklist";
import {
  PRODUCT_REVIEW_CHECKLIST,
  type ProductReviewCheckKey,
} from "@/lib/products/review-checklist";
import { ui } from "@/lib/ui";

type AdminProductReviewChecklistProps = {
  productId: string;
  productName: string;
  categorySlug: string | null;
  categoryRules: CategoryReviewRuleRecord[];
  initialChecks: ProductReviewCheckRecord[];
  prohibitedKeywords: string[];
  warningKeywords: string[];
  approvalStatus: string;
};

export function AdminProductReviewChecklist({
  productId,
  productName,
  categorySlug,
  categoryRules,
  initialChecks,
  prohibitedKeywords,
  warningKeywords,
  approvalStatus,
}: AdminProductReviewChecklistProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  const initialMap = useMemo(() => {
    const map: Partial<Record<ProductReviewCheckKey, boolean>> = {};
    for (const check of initialChecks) {
      map[check.checkKey] = check.checked;
    }
    return map;
  }, [initialChecks]);

  const [checks, setChecks] =
    useState<Partial<Record<ProductReviewCheckKey, boolean>>>(initialMap);

  const incompleteRequired = PRODUCT_REVIEW_CHECKLIST.filter(
    (item) => item.requiredForApproval && !checks[item.key],
  );

  function toggleCheck(key: ProductReviewCheckKey) {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function saveChecks() {
    setFeedback(null);
    startTransition(async () => {
      const result = await saveProductReviewChecksAction({ productId, checks });
      if (!result.success) {
        setFeedback(result.message ?? "체크리스트 저장에 실패했어요.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className={`${ui.panel} space-y-4`}>
      <div>
        <p className="text-sm font-black text-wadeal-ink">상품 검수 체크리스트</p>
        <p className="mt-0.5 text-xs font-bold text-wadeal-muted">
          {productName}
          {categorySlug ? ` · ${categorySlug}` : ""}
        </p>
      </div>

      {prohibitedKeywords.length > 0 ?
        <div className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-wadeal-red">
          금지 키워드 감지: {prohibitedKeywords.join(", ")}
        </div>
      : null}

      {warningKeywords.length > 0 ?
        <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
          경고 키워드: {warningKeywords.join(", ")}
        </div>
      : null}

      {categoryRules.length > 0 ?
        <div className="space-y-2 rounded-lg bg-gray-50 px-3 py-2">
          <p className="text-xs font-black text-wadeal-ink">카테고리별 검수 기준</p>
          {categoryRules.map((rule) => (
            <div key={rule.id} className="text-xs font-bold text-wadeal-muted">
              <p className="text-wadeal-ink">{rule.ruleTitle}</p>
              <p className="mt-0.5">{rule.ruleDescription}</p>
              {rule.requiredDocuments.length > 0 ?
                <p className="mt-1">필요 서류: {rule.requiredDocuments.join(", ")}</p>
              : null}
            </div>
          ))}
        </div>
      : null}

      <ul className="space-y-2">
        {PRODUCT_REVIEW_CHECKLIST.map((item) => (
          <li key={item.key}>
            <label className="flex cursor-pointer items-start gap-2">
              <input
                checked={Boolean(checks[item.key])}
                className="mt-0.5"
                disabled={isPending}
                onChange={() => toggleCheck(item.key)}
                type="checkbox"
              />
              <span className="text-xs font-bold text-wadeal-ink">{item.label}</span>
            </label>
          </li>
        ))}
      </ul>

      {incompleteRequired.length > 0 && approvalStatus === "pending_review" ?
        <p className="text-xs font-bold text-amber-700">
          미완료 필수 항목 {incompleteRequired.length}개
        </p>
      : null}

      {feedback ?
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-wadeal-red" role="alert">
          {feedback}
        </p>
      : null}

      <button
        className={`${ui.btnOutline} h-10 w-full cursor-pointer text-sm disabled:opacity-50`}
        disabled={isPending}
        onClick={saveChecks}
        type="button"
      >
        체크 저장
      </button>
    </div>
  );
}
