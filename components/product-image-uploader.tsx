"use client";

import { useId, useRef, useState } from "react";
import { uploadProductImageAction } from "@/app/actions/admin-product-images";
import {
  productImageValidationMessage,
  sanitizeProductImagePathSegment,
  validateProductImageFile,
} from "@/lib/supabase/product-images-storage";
import { ui } from "@/lib/ui";

type ProductImageUploaderProps = {
  pathPrefix: string;
  mainImageUrl: string;
  onMainImageChange: (url: string) => void;
  detailImageUrls: string[];
  onDetailImageUrlsChange: (urls: string[]) => void;
  disabled?: boolean;
};

function uploadErrorMessage(error?: string) {
  switch (error) {
    case "invalid_file_type":
      return "jpg, jpeg, png, webp 파일만 업로드할 수 있어요.";
    case "file_too_large":
      return "파일 크기는 5MB 이하여야 해요.";
    case "forbidden":
      return "관리자만 업로드할 수 있어요.";
    case "login_required":
      return "로그인이 필요해요.";
    case "storage_unavailable":
      return "Supabase Storage가 설정되지 않았어요.";
    case "invalid_input":
      return "업로드할 파일을 확인해 주세요.";
    default:
      return "이미지 업로드에 실패했어요. 잠시 후 다시 시도해 주세요.";
  }
}

async function uploadFile(pathPrefix: string, file: File) {
  const clientError = validateProductImageFile(file);
  if (clientError) {
    return { success: false as const, error: clientError };
  }

  const formData = new FormData();
  formData.set("file", file);
  formData.set("pathPrefix", sanitizeProductImagePathSegment(pathPrefix));

  return uploadProductImageAction(formData);
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (toIndex < 0 || toIndex >= items.length || fromIndex === toIndex) {
    return items;
  }

  const next = [...items];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

export function ProductImageUploader({
  pathPrefix,
  mainImageUrl,
  onMainImageChange,
  detailImageUrls,
  onDetailImageUrlsChange,
  disabled = false,
}: ProductImageUploaderProps) {
  const mainInputId = useId();
  const detailInputId = useId();
  const mainInputRef = useRef<HTMLInputElement>(null);
  const detailInputRef = useRef<HTMLInputElement>(null);

  const [mainUploading, setMainUploading] = useState(false);
  const [detailUploading, setDetailUploading] = useState(false);
  const [mainError, setMainError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  const uploadPrefix = pathPrefix.trim() || "draft";
  const controlsDisabled = disabled || mainUploading || detailUploading;

  async function handleMainUpload(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) {
      return;
    }

    const clientError = validateProductImageFile(file);
    if (clientError) {
      setMainError(productImageValidationMessage(clientError));
      return;
    }

    setMainError(null);
    setMainUploading(true);

    try {
      const result = await uploadFile(uploadPrefix, file);
      if (!result.success || !result.publicUrl) {
        setMainError(uploadErrorMessage(result.error));
        return;
      }

      onMainImageChange(result.publicUrl);
    } finally {
      setMainUploading(false);
      if (mainInputRef.current) {
        mainInputRef.current.value = "";
      }
    }
  }

  async function handleDetailUpload(fileList: FileList | null) {
    const files = fileList ? Array.from(fileList) : [];
    if (files.length === 0) {
      return;
    }

    for (const file of files) {
      const clientError = validateProductImageFile(file);
      if (clientError) {
        setDetailError(productImageValidationMessage(clientError));
        return;
      }
    }

    setDetailError(null);
    setDetailUploading(true);

    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const result = await uploadFile(uploadPrefix, file);
        if (!result.success || !result.publicUrl) {
          setDetailError(uploadErrorMessage(result.error));
          break;
        }

        uploadedUrls.push(result.publicUrl);
      }

      if (uploadedUrls.length > 0) {
        onDetailImageUrlsChange([...detailImageUrls, ...uploadedUrls]);
      }
    } finally {
      setDetailUploading(false);
      if (detailInputRef.current) {
        detailInputRef.current.value = "";
      }
    }
  }

  return (
    <div className="space-y-5">
      <section className={`${ui.panel} space-y-3`}>
        <div>
          <p className={ui.sectionTitle}>대표 이미지</p>
          <p className="mt-1 text-[11px] font-bold text-wadeal-muted">
            jpg, jpeg, png, webp · 최대 5MB
          </p>
        </div>

        {mainImageUrl ?
          <div className="overflow-hidden rounded-lg border border-wadeal-line bg-gray-50">
            <img
              alt="대표 이미지 미리보기"
              className="aspect-square w-full object-cover"
              src={mainImageUrl}
            />
          </div>
        : <div className="flex aspect-square w-full items-center justify-center rounded-lg border border-dashed border-wadeal-line bg-gray-50 text-xs font-bold text-wadeal-muted">
            등록된 대표 이미지가 없어요
          </div>
        }

        <input
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={controlsDisabled}
          id={mainInputId}
          onChange={(event) => {
            void handleMainUpload(event.target.files);
          }}
          ref={mainInputRef}
          type="file"
        />

        <div className="grid grid-cols-2 gap-2">
          <label
            className={`${ui.btnOutline} h-11 cursor-pointer ${controlsDisabled ? "pointer-events-none opacity-50" : ""}`}
            htmlFor={mainInputId}
          >
            {mainUploading ? "업로드 중..." : mainImageUrl ? "이미지 교체" : "이미지 업로드"}
          </label>
          {mainImageUrl ?
            <button
              className={`${ui.btnOutline} h-11 text-wadeal-red ${controlsDisabled ? "opacity-50" : ""}`}
              disabled={controlsDisabled}
              onClick={() => {
                setMainError(null);
                onMainImageChange("");
              }}
              type="button"
            >
              이미지 삭제
            </button>
          : <div />}
        </div>

        {mainUploading ?
          <p className="text-xs font-bold text-wadeal-muted">이미지를 업로드하고 있어요...</p>
        : null}
        {mainError ?
          <p className="text-xs font-bold text-wadeal-red" role="alert">
            {mainError}
          </p>
        : null}
      </section>

      <section className={`${ui.panel} space-y-3`}>
        <div>
          <p className={ui.sectionTitle}>상세 이미지</p>
          <p className="mt-1 text-[11px] font-bold text-wadeal-muted">
            여러 장 업로드 가능 · 순서 변경 및 삭제 지원
          </p>
        </div>

        {detailImageUrls.length > 0 ?
          <ul className="space-y-2">
            {detailImageUrls.map((url, index) => (
              <li
                className="flex items-center gap-2 rounded-lg border border-wadeal-line bg-white p-2"
                key={`${url}-${index}`}
              >
                <img
                  alt={`상세 이미지 ${index + 1}`}
                  className="h-16 w-16 shrink-0 rounded-md bg-gray-100 object-cover"
                  src={url}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-bold text-wadeal-muted">{url}</p>
                  <p className="mt-0.5 text-xs font-black text-wadeal-ink">{index + 1}번째</p>
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    aria-label={`${index + 1}번째 이미지 위로`}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-wadeal-line text-xs font-black text-wadeal-ink disabled:opacity-40"
                    disabled={controlsDisabled || index === 0}
                    onClick={() => {
                      onDetailImageUrlsChange(moveItem(detailImageUrls, index, index - 1));
                    }}
                    type="button"
                  >
                    ↑
                  </button>
                  <button
                    aria-label={`${index + 1}번째 이미지 아래로`}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-wadeal-line text-xs font-black text-wadeal-ink disabled:opacity-40"
                    disabled={controlsDisabled || index === detailImageUrls.length - 1}
                    onClick={() => {
                      onDetailImageUrlsChange(moveItem(detailImageUrls, index, index + 1));
                    }}
                    type="button"
                  >
                    ↓
                  </button>
                  <button
                    aria-label={`${index + 1}번째 이미지 삭제`}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-wadeal-line text-xs font-black text-wadeal-red disabled:opacity-40"
                    disabled={controlsDisabled}
                    onClick={() => {
                      onDetailImageUrlsChange(
                        detailImageUrls.filter((_, itemIndex) => itemIndex !== index),
                      );
                    }}
                    type="button"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        : <div className="rounded-lg border border-dashed border-wadeal-line bg-gray-50 px-4 py-8 text-center text-xs font-bold text-wadeal-muted">
            등록된 상세 이미지가 없어요
          </div>
        }

        <input
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={controlsDisabled}
          id={detailInputId}
          multiple
          onChange={(event) => {
            void handleDetailUpload(event.target.files);
          }}
          ref={detailInputRef}
          type="file"
        />

        <label
          className={`${ui.btnOutline} h-11 cursor-pointer ${controlsDisabled ? "pointer-events-none opacity-50" : ""}`}
          htmlFor={detailInputId}
        >
          {detailUploading ? "업로드 중..." : "상세 이미지 추가"}
        </label>

        {detailUploading ?
          <p className="text-xs font-bold text-wadeal-muted">이미지를 업로드하고 있어요...</p>
        : null}
        {detailError ?
          <p className="text-xs font-bold text-wadeal-red" role="alert">
            {detailError}
          </p>
        : null}
      </section>
    </div>
  );
}
