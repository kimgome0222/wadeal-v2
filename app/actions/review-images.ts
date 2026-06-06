"use server";

import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  buildReviewImageStoragePath,
  getReviewImagePublicUrl,
  REVIEW_IMAGES_BUCKET,
  REVIEW_IMAGE_MAX_COUNT,
  validateReviewImageFile,
} from "@/lib/supabase/review-images-storage";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type UploadReviewImageResult = {
  success: boolean;
  publicUrl?: string;
  error?:
    | "login_required"
    | "storage_unavailable"
    | "invalid_input"
    | "invalid_file_type"
    | "file_too_large"
    | "too_many_files"
    | "upload_failed";
};

export async function uploadReviewImageAction(
  formData: FormData,
): Promise<UploadReviewImageResult> {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, error: "storage_unavailable" };
  }

  const file = formData.get("file");
  const reviewId = String(formData.get("reviewId") ?? "draft").trim();

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "invalid_input" };
  }

  const validationError = validateReviewImageFile(file);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const storagePath = buildReviewImageStoragePath(user.id, reviewId, file.name, file.type);
  if (!storagePath) {
    return { success: false, error: "invalid_file_type" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "storage_unavailable" };
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from(REVIEW_IMAGES_BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("[review-images] upload failed:", uploadError.message);
    return { success: false, error: "upload_failed" };
  }

  const env = getSupabaseEnv();
  if (!env?.url) {
    return { success: false, error: "storage_unavailable" };
  }

  return {
    success: true,
    publicUrl: getReviewImagePublicUrl(env.url, storagePath),
  };
}

export { REVIEW_IMAGE_MAX_COUNT };
