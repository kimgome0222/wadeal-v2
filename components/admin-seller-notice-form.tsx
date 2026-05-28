"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  archiveAdminSellerNoticeAction,
  createAdminSellerNoticeAction,
  publishAdminSellerNoticeAction,
  updateAdminSellerNoticeAction,
} from "@/app/actions/admin-seller-notices";
import type { SellerNoticeRecord } from "@/lib/data/seller-notices";
import {
  SELLER_NOTICE_CATEGORIES,
  getSellerNoticeCategoryLabel,
  type SellerNoticeCategory,
} from "@/lib/sellers/notice-types";
import { ui } from "@/lib/ui";

type AdminSellerNoticeFormProps = {
  notice?: SellerNoticeRecord;
};

export function AdminSellerNoticeForm({ notice }: AdminSellerNoticeFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(notice?.title ?? "");
  const [content, setContent] = useState(notice?.content ?? "");
  const [category, setCategory] = useState<SellerNoticeCategory>(notice?.category ?? "general");
  const [isImportant, setIsImportant] = useState(notice?.isImportant ?? false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const result =
        notice ?
          await updateAdminSellerNoticeAction({
            noticeId: notice.id,
            title,
            content,
            category,
            isImportant,
          })
        : await createAdminSellerNoticeAction({
            title,
            content,
            category,
            isImportant,
          });

      setMessage(result.message);
      if (result.success && result.id && !notice) {
        router.push(`/admin/seller-notices/${result.id}/edit`);
      } else if (result.success) {
        router.refresh();
      }
    });
  }

  function handlePublish() {
    if (!notice) {
      return;
    }
    startTransition(async () => {
      const result = await publishAdminSellerNoticeAction(notice.id);
      setMessage(result.message);
      if (result.success) {
        router.refresh();
      }
    });
  }

  function handleArchive() {
    if (!notice) {
      return;
    }
    startTransition(async () => {
      const result = await archiveAdminSellerNoticeAction(notice.id);
      setMessage(result.message);
      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <div className={`${ui.panel} space-y-4`}>
      <label className="block space-y-1">
        <span className="text-xs font-black text-wadeal-muted">제목</span>
        <input
          className={ui.input}
          disabled={isPending}
          onChange={(event) => setTitle(event.target.value)}
          value={title}
        />
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-black text-wadeal-muted">카테고리</span>
        <select
          className={ui.input}
          disabled={isPending}
          onChange={(event) => setCategory(event.target.value as SellerNoticeCategory)}
          value={category}
        >
          {SELLER_NOTICE_CATEGORIES.map((value) => (
            <option key={value} value={value}>
              {getSellerNoticeCategoryLabel(value)}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-xs font-bold text-wadeal-ink">
        <input
          checked={isImportant}
          disabled={isPending}
          onChange={(event) => setIsImportant(event.target.checked)}
          type="checkbox"
        />
        중요 공지
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-black text-wadeal-muted">내용</span>
        <textarea
          className={`${ui.input} min-h-40 resize-y`}
          disabled={isPending}
          onChange={(event) => setContent(event.target.value)}
          value={content}
        />
      </label>
      {notice ?
        <p className="text-[11px] font-bold text-wadeal-muted">
          상태: {notice.statusLabel}
          {notice.publishedAt ?
            ` · 게시 ${new Date(notice.publishedAt).toLocaleString("ko-KR")}`
          : ""}
        </p>
      : null}
      {message ?
        <p className="text-xs font-bold text-wadeal-muted">{message}</p>
      : null}
      <div className="flex flex-wrap gap-2">
        <button
          className={`${ui.btnPrimary} h-10 px-4 text-xs`}
          disabled={isPending}
          onClick={handleSave}
          type="button"
        >
          {notice ? "저장" : "임시저장"}
        </button>
        {notice && notice.status !== "published" ?
          <button
            className={`${ui.btnOutline} h-10 px-4 text-xs`}
            disabled={isPending}
            onClick={handlePublish}
            type="button"
          >
            게시
          </button>
        : null}
        {notice && notice.status !== "archived" ?
          <button
            className={`${ui.btnOutline} h-10 px-4 text-xs`}
            disabled={isPending}
            onClick={handleArchive}
            type="button"
          >
            보관
          </button>
        : null}
      </div>
    </div>
  );
}
