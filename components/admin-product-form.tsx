"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  createAdminProductAction,
  updateAdminProductAction,
} from "@/app/actions/admin-products";
import { ProductImageUploader } from "@/components/product-image-uploader";
import { AdminPriceTiersEditor } from "@/components/admin-price-tiers-editor";
import {
  computeDiscountRate,
  formatEndsAtForInput,
  type AdminProductDetail,
  type AdminProductStatus,
} from "@/lib/admin-products/shared";
import type { ProductSubmitIntent } from "@/lib/products/approval-status";
import { buildFallbackPriceTiers, type PriceTierEntry } from "@/lib/pricing/tiers";
import type { ShippingType } from "@/lib/shipping/types";
import { ui } from "@/lib/ui";

type AdminProductFormProps = {
  mode: "create" | "edit";
  product?: AdminProductDetail;
  cancelHref: string;
};

const statusOptions: { value: AdminProductStatus; label: string }[] = [
  { value: "draft", label: "임시저장 (draft)" },
  { value: "active", label: "진행중 (active)" },
  { value: "ended", label: "종료 (ended)" },
];

function defaultEndsAtValue() {
  const date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return formatEndsAtForInput(date.toISOString());
}

function errorMessage(error?: string) {
  switch (error) {
    case "invalid_input":
      return "입력값을 확인해 주세요.";
    case "slug_taken":
      return "이미 사용 중인 슬러그예요.";
    case "not_found":
      return "상품을 찾을 수 없어요.";
    case "forbidden":
      return "관리자만 저장할 수 있어요.";
    case "login_required":
      return "로그인이 필요해요.";
    default:
      return "저장에 실패했어요. 잠시 후 다시 시도해 주세요.";
  }
}

function defaultFormPriceTiers(product?: AdminProductDetail): PriceTierEntry[] {
  if (product?.priceTiers?.length) {
    return product.priceTiers;
  }

  return buildFallbackPriceTiers({
    originalPrice: product?.originalPrice ?? 22900,
    groupPrice: product?.groupPrice ?? 12900,
    lowestPrice: Math.max(
      0,
      (product?.groupPrice ?? 12900) -
        Math.round(((product?.originalPrice ?? 22900) - (product?.groupPrice ?? 12900)) * 0.2),
    ),
    targetParticipants: product?.targetParticipants ?? 120,
  });
}

export function AdminProductForm({ mode, product, cancelHref }: AdminProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [groupPrice, setGroupPrice] = useState(String(product?.groupPrice ?? ""));
  const [originalPrice, setOriginalPrice] = useState(String(product?.originalPrice ?? ""));
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [detailImageUrls, setDetailImageUrls] = useState<string[]>(
    product?.detailImageUrls ?? [],
  );
  const [targetParticipants, setTargetParticipants] = useState(
    String(product?.targetParticipants ?? ""),
  );
  const [currentParticipants, setCurrentParticipants] = useState(
    String(product?.currentParticipants ?? "0"),
  );
  const [endsAt, setEndsAt] = useState(
    product?.endsAt ? formatEndsAtForInput(product.endsAt) : defaultEndsAtValue(),
  );
  const [status, setStatus] = useState<AdminProductStatus>(product?.status ?? "draft");
  const [priceTiers, setPriceTiers] = useState<PriceTierEntry[]>(() =>
    defaultFormPriceTiers(product),
  );
  const [stockQuantity, setStockQuantity] = useState(
    product?.stockQuantity != null ? String(product.stockQuantity) : "",
  );
  const [minOrderQuantity, setMinOrderQuantity] = useState(
    String(product?.minOrderQuantity ?? 1),
  );
  const [maxOrderQuantity, setMaxOrderQuantity] = useState(
    String(product?.maxOrderQuantity ?? 99),
  );
  const [perUserLimit, setPerUserLimit] = useState(
    product?.perUserLimit != null ? String(product.perUserLimit) : "",
  );
  const [maxQuantity, setMaxQuantity] = useState(
    product?.maxQuantity != null ? String(product.maxQuantity) : "",
  );
  const [shippingFee, setShippingFee] = useState(String(product?.shippingFee ?? 3000));
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(
    product?.freeShippingThreshold != null ? String(product.freeShippingThreshold) : "",
  );
  const [shippingType, setShippingType] = useState<ShippingType>(
    product?.shippingType ?? "paid",
  );
  const [isFreeShipping, setIsFreeShipping] = useState(product?.isFreeShipping ?? false);
  const [remoteAreaExtraFee, setRemoteAreaExtraFee] = useState(
    String(product?.remoteAreaExtraFee ?? 3000),
  );

  const discountRate = useMemo(() => {
    const original = Number(originalPrice);
    const group = Number(groupPrice);

    if (!Number.isFinite(original) || !Number.isFinite(group)) {
      return 0;
    }

    return computeDiscountRate(original, group);
  }, [originalPrice, groupPrice]);

  function saveProduct(submitIntent: ProductSubmitIntent) {
    setFeedback(null);

    const payload = {
      name,
      slug,
      groupPrice,
      originalPrice,
      imageUrl,
      detailImageUrls: detailImageUrls.join("\n"),
      targetParticipants,
      currentParticipants,
      endsAt,
        status,
        priceTiers: JSON.stringify(priceTiers),
        submitIntent,
        stockQuantity,
        minOrderQuantity,
        maxOrderQuantity,
        perUserLimit,
        maxQuantity,
      };

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createAdminProductAction(payload)
          : await updateAdminProductAction(product!.productId, payload);

      if (result.success) {
        setFeedback({
          type: "success",
          message:
            submitIntent === "submit_review"
              ? "검수 요청이 접수됐어요."
              : "임시저장됐어요.",
        });
        router.push("/admin/products");
        router.refresh();
        return;
      }

      setFeedback({ type: "error", message: errorMessage(result.error) });
    });
  }

  return (
    <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
      {feedback ?
        <p
          className={`rounded-lg px-3 py-2 text-xs font-bold ${
            feedback.type === "success" ? "bg-green-50 text-green-700" : "bg-[#F5F8F4] text-wadeal-red"
          }`}
          role="status"
        >
          {feedback.message}
        </p>
      : null}

      <div>
        <label className={ui.label} htmlFor="name">
          상품명
        </label>
        <input
          className={ui.input}
          id="name"
          name="name"
          onChange={(event) => setName(event.target.value)}
          placeholder="제주 고당도 감귤 3kg"
          required
          value={name}
        />
      </div>

      <div>
        <label className={ui.label} htmlFor="slug">
          슬러그
        </label>
        <input
          className={ui.input}
          id="slug"
          name="slug"
          onChange={(event) => setSlug(event.target.value)}
          placeholder="wd-citrus-001"
          required
          value={slug}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={ui.label} htmlFor="groupPrice">
            가격 (판매가)
          </label>
          <input
            className={ui.input}
            id="groupPrice"
            inputMode="numeric"
            min={0}
            name="groupPrice"
            onChange={(event) => setGroupPrice(event.target.value)}
            placeholder="12900"
            required
            type="number"
            value={groupPrice}
          />
        </div>
        <div>
          <label className={ui.label} htmlFor="originalPrice">
            원가
          </label>
          <input
            className={ui.input}
            id="originalPrice"
            inputMode="numeric"
            min={1}
            name="originalPrice"
            onChange={(event) => setOriginalPrice(event.target.value)}
            placeholder="22900"
            required
            type="number"
            value={originalPrice}
          />
        </div>
      </div>

      <div>
        <label className={ui.label} htmlFor="discountRate">
          할인율
        </label>
        <input
          className={`${ui.input} bg-gray-50 text-wadeal-muted`}
          id="discountRate"
          readOnly
          value={`${discountRate}%`}
        />
        <p className="mt-1 text-[11px] font-bold text-wadeal-muted">
          원가와 판매가를 기준으로 자동 계산돼요.
        </p>
      </div>

      <div className="rounded-xl border border-wadeal-line bg-white p-4 space-y-3">
        <h3 className="text-sm font-black text-wadeal-ink">배송비 설정</h3>
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            checked={isFreeShipping}
            className="h-4 w-4 accent-wadeal-red"
            onChange={(event) => {
              setIsFreeShipping(event.target.checked);
              if (event.target.checked) {
                setShippingType("free");
              }
            }}
            type="checkbox"
          />
          <span className="text-sm font-extrabold text-wadeal-ink">무료배송</span>
        </label>
        {!isFreeShipping ?
          <>
            <div>
              <label className={ui.label} htmlFor="shippingType">
                배송비 유형
              </label>
              <select
                className={ui.input}
                id="shippingType"
                onChange={(event) =>
                  setShippingType(event.target.value as ShippingType)
                }
                value={shippingType}
              >
                <option value="paid">유료</option>
                <option value="conditional_free">조건부 무료</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={ui.label} htmlFor="shippingFee">
                  기본 배송비
                </label>
                <input
                  className={ui.input}
                  id="shippingFee"
                  inputMode="numeric"
                  min={0}
                  onChange={(event) => setShippingFee(event.target.value)}
                  type="number"
                  value={shippingFee}
                />
              </div>
              <div>
                <label className={ui.label} htmlFor="remoteAreaExtraFee">
                  제주·도서산간 추가
                </label>
                <input
                  className={ui.input}
                  id="remoteAreaExtraFee"
                  inputMode="numeric"
                  min={0}
                  onChange={(event) => setRemoteAreaExtraFee(event.target.value)}
                  type="number"
                  value={remoteAreaExtraFee}
                />
              </div>
            </div>
            {shippingType === "conditional_free" ?
              <div>
                <label className={ui.label} htmlFor="freeShippingThreshold">
                  무료배송 기준 금액
                </label>
                <input
                  className={ui.input}
                  id="freeShippingThreshold"
                  inputMode="numeric"
                  min={0}
                  onChange={(event) => setFreeShippingThreshold(event.target.value)}
                  placeholder="50000"
                  type="number"
                  value={freeShippingThreshold}
                />
              </div>
            : null}
          </>
        : null}
      </div>

      <AdminPriceTiersEditor
        disabled={isPending}
        onChange={setPriceTiers}
        tiers={priceTiers}
      />

      <ProductImageUploader
        detailImageUrls={detailImageUrls}
        disabled={isPending}
        mainImageUrl={imageUrl}
        onDetailImageUrlsChange={setDetailImageUrls}
        onMainImageChange={setImageUrl}
        pathPrefix={slug.trim() || product?.slug || product?.productId || "draft"}
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={ui.label} htmlFor="targetParticipants">
            목표 수량
          </label>
          <input
            className={ui.input}
            id="targetParticipants"
            inputMode="numeric"
            min={1}
            name="targetParticipants"
            onChange={(event) => setTargetParticipants(event.target.value)}
            placeholder="120"
            required
            type="number"
            value={targetParticipants}
          />
        </div>
        <div>
          <label className={ui.label} htmlFor="currentParticipants">
            관심 고객 (현재 구매 수량)
          </label>
          <input
            className={ui.input}
            id="currentParticipants"
            inputMode="numeric"
            min={0}
            name="currentParticipants"
            onChange={(event) => setCurrentParticipants(event.target.value)}
            placeholder="0"
            required
            type="number"
            value={currentParticipants}
          />
        </div>
      </div>

      <div className="rounded-xl border border-wadeal-line p-4 space-y-3">
        <p className="text-sm font-black text-wadeal-ink">재고 · 구매 제한</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={ui.label} htmlFor="stockQuantity">
              재고 수량
            </label>
            <input
              className={ui.input}
              id="stockQuantity"
              inputMode="numeric"
              min={0}
              name="stockQuantity"
              onChange={(event) => setStockQuantity(event.target.value)}
              placeholder="비우면 무제한"
              type="number"
              value={stockQuantity}
            />
          </div>
          <div>
            <label className={ui.label} htmlFor="maxQuantity">
              판매 최대 수량
            </label>
            <input
              className={ui.input}
              id="maxQuantity"
              inputMode="numeric"
              min={1}
              name="maxQuantity"
              onChange={(event) => setMaxQuantity(event.target.value)}
              placeholder="비우면 무제한"
              type="number"
              value={maxQuantity}
            />
          </div>
          <div>
            <label className={ui.label} htmlFor="minOrderQuantity">
              최소 주문
            </label>
            <input
              className={ui.input}
              id="minOrderQuantity"
              inputMode="numeric"
              min={1}
              name="minOrderQuantity"
              onChange={(event) => setMinOrderQuantity(event.target.value)}
              required
              type="number"
              value={minOrderQuantity}
            />
          </div>
          <div>
            <label className={ui.label} htmlFor="maxOrderQuantity">
              최대 주문
            </label>
            <input
              className={ui.input}
              id="maxOrderQuantity"
              inputMode="numeric"
              min={1}
              name="maxOrderQuantity"
              onChange={(event) => setMaxOrderQuantity(event.target.value)}
              required
              type="number"
              value={maxOrderQuantity}
            />
          </div>
          <div className="col-span-2">
            <label className={ui.label} htmlFor="perUserLimit">
              1인 구매 한도
            </label>
            <input
              className={ui.input}
              id="perUserLimit"
              inputMode="numeric"
              min={1}
              name="perUserLimit"
              onChange={(event) => setPerUserLimit(event.target.value)}
              placeholder="비우면 제한 없음"
              type="number"
              value={perUserLimit}
            />
          </div>
        </div>
      </div>

      <div>
        <label className={ui.label} htmlFor="endsAt">
          판매 종료일
        </label>
        <input
          className={ui.input}
          id="endsAt"
          name="endsAt"
          onChange={(event) => setEndsAt(event.target.value)}
          required
          type="datetime-local"
          value={endsAt}
        />
      </div>

      <div>
        <label className={ui.label} htmlFor="status">
          상태
        </label>
        <select
          className={ui.input}
          id="status"
          name="status"
          onChange={(event) => setStatus(event.target.value as AdminProductStatus)}
          value={status}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {product?.approvalStatus === "approved" ?
        <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
          승인된 상품을 수정 후 검수요청하면 다시 검수 대기 상태로 전환돼요.
        </p>
      : null}

      <div className="grid grid-cols-2 gap-2 pt-2">
        <Link className={`${ui.btnOutline} h-11 cursor-pointer`} href={cancelHref}>
          취소
        </Link>
        <button
          className={`${ui.btnOutline} h-11 cursor-pointer disabled:opacity-50`}
          disabled={isPending}
          onClick={() => saveProduct("save_draft")}
          type="button"
        >
          {isPending ? "저장 중..." : "임시저장"}
        </button>
      </div>
      <button
        className={`${ui.btnPrimary} h-11 w-full cursor-pointer disabled:opacity-50`}
        disabled={isPending}
        onClick={() => saveProduct("submit_review")}
        type="button"
      >
        {isPending ? "요청 중..." : "검수요청"}
      </button>
    </form>
  );
}
